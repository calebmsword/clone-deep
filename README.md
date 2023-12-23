# cloneDeep
A robust utility for deeply cloning JavaScript objects.

```javascript
import cloneDeep from "./clone-deep.js";

const object = [{ foo: "bar" }, { baz: { spam: "eggs" } }];
const cloned = cloneDeep(object);

cloned.forEach(console.log);
// {foo: 'bar'}
// {baz: {spam: 'eggs'}}

console.log(cloned === object);  // false
console.log(cloned[0] === object[0]);  // false
console.log(cloned[1] === object[1]);  // false
```

The first argument to `cloneDeep` is the object to clone. The second argument can either be a function which will be used as a "customizer" for the behavior of the function, or it can be an object that can be used for configuration.

```javascript
// Many ways to call `cloneDeep`:
let cloned;

// 1: Default behavior
cloned = cloneDeep(originalObject);

// 2: Provide a customizer function
cloned = cloneDeep(originalObject, myCustomizer)

// 3: Provide a configuration object
cloned = cloneDeep(originalObject, {

    // This is another way to provide a customizer.
    customizer: myCustomizer,

    // If `true`, any errors thrown by the customizer will be thrown by 
    // `cloneDeep`. Normally, they are logged as warnings and the algorithm will 
    // proceed with default behavior.
    letCustomizerThrow: true,

    // Not every JavaScript object can be cloned. Warnings are, by default, 
    // logged to the console when failures to perform true clones occur. You can 
    // provide a custom logger which receives the error object containing the 
    // warning.
    log: myLogFunction,

    // If the user does not provide a custom log function, then you can change 
    // the behavior when warnings occur. The two supported modes are "quiet" 
    // (warnings are less verbose) and "silent" (no warnings are logged to the 
    // console--use with caution!).
    logMode: "quiet"
});
```

### why should I use cloneDeep? JavaScript has structuredClone now!

`structuredClone` has many limitations. It cannot clone objects with symbols. It does not clone non-enumerable properties. It does preserve the extensible, sealed, or frozen status of the object or its nested objects. It does not clone the property descriptor associated with any values in the object.

`cloneDeep` has none of these limitations. See [this section](#cloneDeep-vs-structuredClone) for more specifics on the differrences between `cloneDeep` and `structuredClone`.


### What cannot be cloned

Functions cannot be reliably cloned in JavaScript. 
 - It is impossible to clone native JavaScript functions.
 - It is impossible to clone functions which manipulate data in their closures.
 - The techniques which properly clone some functions use `eval` or the `Function` constructor which are highly insecure.
 
`WeakMap` and `WeakSet` instances also cannot be cloned.

Most objects have `Object.prototype` or some other native JavaScript prototype in their prototype chain, but native functions cannot be cloned. This means that it is usually impossible to clone the prototype chain. Instead, it makes more sense to have the cloned object share the prototype of the original object.

Please see [these notes](https://github.com/calebmsword/javascript-notes/blob/main/deep-clone.md#deep-clone-and-functions) for an in-depth discussion on the challenge of cloning functions.

### customizer

`cloneDeep` can take a customizer which allows the user to support custom types. This gives the user considerable power to extend or change `cloneDeep`'s functionality.

Here is how we can use `cloneDeep` to clone objects containing custom classes with a [private property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties). 

```javascript
import cloneDeep from "./clone-deep.js";

class Wrapper {
    let #value;
    get() {
        return value;
    }
    set(value) {
        this.#value = value;
    }
}

const wrapper = new Wrapper();
wrapper.set({ spam: "eggs" });

const obj = { foo: wrapper };

function myCustomizer(value) {
    // If the customizer does not return an object, cloneDeep performs default behavior
    if (Object.getPrototypeOf(value) !== Wrapper.prototype) {
        return;
    }

    const clonedWrapper = new Wrapper();

    return {
        // the `clone` property on the returned object will be used as the cloned value
        clone: clonedWrapper,

        // Let's clone the private property as well
        additionalValues: [{
            value: value.get();

            // The assigner will decide where the clone of `value.get` will be stored
            assigner(cloned) {
                clonedWrapper.set(cloned);
            }
        }]
    }
}

const clonedObj = cloneDeep(obj, myCustomizer);


console.log(clonedObj === obj);  // false
console.log(clonedObj.foo.get());  // {spam: 'eggs'}
console.log(clonedObj.foo.get() === obj.foo.get());  // false
```

If the customizer returns an object, the default behavior of `cloneDeep` will be overridden, even if the object does not return a `clone` property (in that case, the value will be cloned into the value `undefined`).

There are many properties that will be observed in the object returned by the customizer:
  - `clone`: What the value will be cloned into.
  - `additionalValues`: This must be an array of objects. Use this to clone additional values that are not accessible as properties on `clone`.  The objects in the array should have two properties:
    - `value`: another value to clone
    - `assigner`: A function of an argument. It receives the clone of `value` and assigns it to some permanent place. 
  - `ignoreProps`: By default, all properties in `clone` will be cloned. If this property is `true`, then those properties will **not** be cloned.
  - `ignoreProto`: If `true`, then the algorithm will not force `clone` to share the prototype of `value`. 
  - `ignore`: If `true`, value will not be cloned at all.

### clone-deep-utils

clone-deep-utils.js contains two utilities.

 1) `cloneDeepFully` This method will clone an object as well as each object in its prototype chain. The API is exactly the same as `cloneDeep` except that the options object can take the additional property `force`. If `force` is `true`, `cloneDeepFully` will clone prototypes with methods. Otherwise, it stops once it reaches any prototype with methods.
 2) `useCustomizers` This function takes an array of customizer functions and returns a new customizer. The new customizer calls each customizer one at a time, in order, and returns an object if once any of the customizers returns an object. Use this to avoid code reuse when creating multiple useful customizers.

### cloneDeep vs structuredClone

JavaScript has a native function `structuredClone` which deeply clones objects. Differences between `structuredClone` and `cloneDeep` include:
 - `structuredClone` cannot clone objects which have symbols or properties that are symbols. `cloneDeep` can.
 - `structuredClone` does not clone non-enumerable properties. `cloneDeep` does.
 - `structuredClone` does not preserve the extensible, sealed, or frozen property of an object or any of its nested objects. `cloneDeep` does.
 - `structuredClone` does not clone the property descriptor associated with any value in an object. `cloneDeep` does.
 - `structuredClone` supports all of the types listed [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types). `cloneDeep` only supports the types listed under "JavaScript types" (and `Symbol`).
 - - Some runtimes implement `structuredClone` with recursion meaning that deeply nested objects can blow up the call stack. `cloneDeep` uses no recursion.
 - `structuredClone` throws an error if the user attempts to clone an object with methods. `cloneDeep` will copy the methods *by value* and noisily log a warning.
 - `structuredClone` throws an error when provided an object of an unsupported type. On the other hand, `cloneDeep` will copy the type as an empty object and noisily log a warning.
 - `structuredClone` will correctly identify if an object was created by the constructor for a native JavaScript class even if the object's prototype is changed or if the `Symbol.toStringTag` property is changed; furthermore, the cloned object will have the prototype of the native class it was constructed from even if the original object dynamically changes its prototype. On the other hand, `deepClone` uses `Object.prototype.toString.call` to identify the type of an object and the cloned object will share the original object's prototype no matter the result of `Object.prototype.toString.call`.
 - If the prototype of the original object is the prototype of any [supported type](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types) for the structured clone algorithm, then object returned by `structuredClone` will share the original object's prototype; otherwise, the prototype of the object will be `Object.prototype`. Meanwhile, the object cloned by `cloneDeep` will always share the prototype of the original object. 

### acknowledgements

 - This algorithm is a heavily modified version of the the [cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep) utility from Lodash. If anyone knows who specifically implemented the algorithm, I will thank them directly.
 - Thanks to Tiago Bertolo, the author of [this article](https://medium.com/@tiagobertolo). It reminded to clone the metadata of objects.
 - 
