# cms-clone-deep
A robust utility for deeply cloning JavaScript objects.

```javascript
import cloneDeep from "cms-clone-deep";

const object = [{ foo: "bar" }, { baz: { spam: "eggs" } }];
const cloned = cloneDeep(object);

cloned.forEach(console.log);
// {foo: 'bar'}
// {baz: {spam: 'eggs'}}

console.log(cloned === object);  // false
console.log(cloned[0] === object[0]);  // false
console.log(cloned[1] === object[1]);  // false
```

## installation

First, install [node.js](https://nodejs.org/en) on your machine. At the time of this writing, the current stable version is **20.10.0**.
 - I would recommend version **20.1.0** or higher which is when the test runner received the `--experimental-test-coverage` option.
 - I wouldn't go any lower than version **16.13.2** which was the first version of node to support ES2022.

After that, using the terminal in any [package](https://nodejs.org/api/packages.html#modules-packages), execute `npm install cms-clone-deep`. In any JavaScript file in that package, functions can be imported like so:

```javascript
import cloneDeep, { cloneDeepFully, useCustomizers } from "cms-clone-deep";
```

## cloneDeep

The first argument to `cloneDeep` is the object to clone. The second argument can either be a function which will be used as a "customizer" for the behavior of the function, or it can be an object that can be used for configuration.

```javascript
// Many ways to call `cloneDeep`:
import cloneDeep from "cms-clone-deep";

let cloned;
let originalObject = {};

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

## why should I use cloneDeep? JavaScript has structuredClone now!

`structuredClone` has many limitations. It cannot clone objects with symbols. It does not clone non-enumerable properties. It does not preserve the extensible, sealed, or frozen status of the object or its nested objects. It does not clone the property descriptor associated with any values in the object.

`cloneDeep` has none of these limitations. See [this section](#cloneDeep-vs-structuredClone) for more about the differences between `cloneDeep` and `structuredClone`.

## What cannot be cloned

Functions cannot be reliably cloned in JavaScript. 
 - It is impossible to clone native JavaScript functions.
 - It is impossible to clone functions which manipulate data in their closures.
 - The techniques which properly clone some functions use `eval` or the `Function` constructor which are highly insecure.
 
`WeakMap` and `WeakSet` instances also cannot be cloned.

Most objects have `Object.prototype` or some other native JavaScript prototype in their prototype chain, but native functions cannot be cloned. This means that it is usually impossible to clone the prototype chain. Instead, it makes more sense to have the cloned object share the prototype of the original object.

Please see [these notes](https://github.com/calebmsword/javascript-notes/blob/main/deep-clone.md#deep-clone-and-functions) for an in-depth discussion on the challenge of cloning functions.

## customizers

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

// The customizer gets one argument: the value to clone
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

            // `assigner` decides where the clone of `value.get` will be stored
            assigner(cloned) {
                clonedWrapper.set(cloned);
            }
        }]
    };
}

const clonedObj = cloneDeep(obj, myCustomizer);


console.log(clonedObj === obj);  // false
console.log(clonedObj.foo.get());  // {spam: 'eggs'}
console.log(clonedObj.foo.get() === obj.foo.get());  // false
```

If the customizer returns an object, the default behavior of `cloneDeep` will be overridden, even if the object does not have a `clone` property (in that case, the value will be cloned into the value `undefined`).

There are many properties that will be observed in the object returned by the customizer:
  - `clone`: What the value will be cloned into.
  - `additionalValues`: This must be an array of objects. Use this to clone additional values that are not accessible as properties on `clone`.  The objects in the array should have two properties:
    - `value`: another value to clone
    - `assigner`: A function of an argument. It receives the clone of `value` and assigns it to some permanent place. 
  - `ignoreProps`: By default, all properties in `clone` will be cloned. If this property is `true`, then those properties will **not** be cloned.
  - `ignoreProto`: If `true`, then the algorithm will not force `clone` to share the prototype of `value`. 
  - `ignore`: If `true`, value will not be cloned at all.

## `cloneDeepFully` and `useCustomizers`

`cloneDeep` is the heart and soul of this package. But `cms-clone-deep` comes with two additional functions:

 1) `cloneDeepFully` This function will clone an object as well as each object in its prototype chain. The API is exactly the same as `cloneDeep` except that the options object can take the additional property `force`. If `force` is `true`, `cloneDeepFully` will clone prototypes with methods. Otherwise, it stops once it reaches any prototype with methods.
 2) `useCustomizers` This function takes an array of customizer functions and returns a new customizer. The new customizer calls each customizer one at a time, in order, and returns an object if once any of the customizers returns an object. Use this to avoid code reuse when creating multiple useful customizers.

## cloneDeep vs structuredClone

JavaScript has a native function `structuredClone` which deeply clones objects. Differences between `structuredClone` and `cloneDeep` include:
 - `structuredClone` cannot clone objects which have symbols or properties that are symbols. `cloneDeep` can.
 - `structuredClone` does not clone non-enumerable properties. `cloneDeep` does.
 - `structuredClone` does not preserve the extensible, sealed, or frozen property of an object or any of its nested objects. `cloneDeep` does.
 - `structuredClone` does not clone the property descriptor associated with any value in an object. `cloneDeep` does.
 - `structuredClone` supports all of the types listed [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types). `cloneDeep` only supports the types listed under "JavaScript types" (and `Symbol`).
 - `structuredClone` is implemented with recursion is some runtimes meaning deeply nested objects blow up the call stack. `cloneDeep` uses no recursion.
 - `structuredClone` throws an error if the user attempts to clone an object with methods. `cloneDeep` will copy the methods *by value* and noisily log a warning.
 - `structuredClone` throws an error when provided an object of an unsupported type. On the other hand, `cloneDeep` will copy the type as an empty object and noisily log a warning.
 - `structuredClone` will identify if an object was created by a native JavaScript constructor function even if the object's prototype is changed or if the `Symbol.toStringTag` property is changed; furthermore, the cloned object will have the prototype from the native constructor function from even if the original object changed its prototype. On the other hand, `deepClone` uses `Object.prototype.toString.call` to identify the type of an object and the cloned object will share the original object's prototype no matter the result of `Object.prototype.toString.call`.
 - If the prototype of the original object is the prototype of any [supported type](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types) for the structured clone algorithm, then object returned by `structuredClone` will share the original object's prototype; otherwise, the prototype of the object will be `Object.prototype`. Meanwhile, the object cloned by `cloneDeep` will always share the prototype of the original object. 

## testing

The file `clone-deep.test.js` contains all unit tests. Execute `node --test` to run them. Execute `node --test --experimental-test-coverage` to see coverage results.

## benchmarking

Benchmarking can only be done within the repository. Clone this repository if you would like to see the benchmarking UI.

Some rudimentary benchmarking can be performed by running `node serve.js <PORT>` (where the `PORT` command line option is optional and defaults to `8787`) and visiting `http://localhost:<PORT>`. This **must** be done in the directory containing `index.html`.

`benchmark.js` and `benchmark.css` contain the JavaScript and styling, respectively, for the hosted web page. You can use your favorite browser's dev tools to profile the result.

## acknowledgements

 - This algorithm is a heavily modified version of the the [cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep) utility from Lodash. If anyone knows who specifically implemented the algorithm, I will thank them directly.
 - Thanks to Tiago Bertolo, the author of [this article](https://medium.com/@tiagobertolo/which-is-the-best-method-for-deep-cloning-in-javascript-are-they-all-bad-101f32d620c5). It reminded me to clone the metadata of objects.
 - Thanks to MDN and its documentation on the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
 - Thanks to StackExchange user Jonathan Tran for his `http.createServer` example.
