# cms-clone-deep
A dependency-free utility for deeply cloning JavaScript objects.

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

This module is compatible with TypeScript. See [this section](#cms-clone-deep-and-typescript) for more information.

## installation

First, install [node.js](https://nodejs.org/en) on your machine. At the time of this writing, the current stable version is **20.10.0**.

After that, using the terminal in any [package](https://nodejs.org/api/packages.html#modules-packages), execute `npm install cms-clone-deep`. In any ES6 module in that package, functions can be imported like so:

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

    // By default, this algorithm allows classes to define custom methods 
    // which determine how the class will be cloned. But if this is `true`, then 
    // the algorithm will ignore these methods.
    ignoreCloningMethods: false,

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
 - It is almost always impossible to clone functions which manipulate data in their closures.
 - The techniques which properly clone some functions use `eval` or the `Function` constructor which are highly insecure.
 
`WeakMap` and `WeakSet` instances also cannot be cloned.

Most objects have `Object.prototype` or some other native JavaScript prototype in their prototype chain, but native functions cannot be cloned. This means that it is usually impossible to clone the prototype chain. Instead, it makes more sense to have the cloned object share the prototype of the original object.

Please see [these notes](https://github.com/calebmsword/javascript-notes/blob/main/deep-clone.md#deep-clone-and-functions) for an in-depth discussion on the challenge of cloning functions.

## cloning custom classes

When designing a deep clone algorithm, it is not possible to create a catch-all approach which clones all possible classes. One of the many reasons for this is that an algorithm cannot know which arguments should be passed to the constructor for the class, if any at all. Therefore, it is the responsibility of the class itself to determine how it can be cloned.

`cms-clone-deep` provides a symbol `CLONE`. If an object has a method associated with this symbol, then the return value of that method will be used as the clone. We will refer to this method as the "cloning method" for a class.


Suppose we had a class named `Wrapper` which encapsulates a single private variable:

```javascript
class Wrapper {
    #value;

    constructor(value) {
        this.#value = value;
    }
    
    get() {
        return this.#value;
    }
    
    set(value) {
        this.#value = value;
    }
}
```

Here is how we could add a cloning method to `Wrapper` so that it can be cloned properly by `cms-clone-deep`.

```javascript
import cloneDeep, { CLONE } from "cms-clone-deep";

class Wrapper {
    #value;

    constructor(value) {
        this.#value = value;
    }
    
    get() {
        return this.#value;
    }
    
    set(value) {
        this.#value = value;
    }

    [CLONE]() {
        return {
            clone: new Wrapper(this.get());
        };
    }
}

// create an object containing a wrapper instance and clone it
const wrapper = new Wrapper({ spam: "eggs" });
const obj = { foo: wrapper };
const clonedObj = cloneDeep(obj);

// check that it works
console.log(clonedObj === obj);  // false
console.log(clonedObj.foo.get());  // {spam: 'eggs'}
console.log(clonedObj.foo.get() === obj.foo.get());  // false
```

The object returned by the clone method can have up to three properties.

 - `clone` - Whatever is assigned here will be used as the clone for the given object. If this property is not present or returns undefined, then the cloning method will be ignored and the algorithm will proceed with default behavior.
 - `propsToIgnore` - This should be an array where each element is a string or symbol. Normally, the algorithm will observe each property in an object to ensure that it is cloned. However, if an instance of a class with aclone method provides any properties in the `propsToIgnore` array, they will be cloned by the algorithm, giving you the opportunity to clone some properties with a cloning method instead.
  - `ignoreProps` - This should be a boolean. If this is a boolean and is true, then the cloning method will have the full responsibility of cloning all properties on the instance. 

## customizers

`cloneDeep` can take a customizer which allows the user to support custom types. This gives the user considerable power to extend or change `cloneDeep`'s functionality.

For the sake of example, let us mend `Wrapper` so that it can be cloned with  a customizer instead of a custom method.

```javascript
class Wrapper {
    #value;

    static #registry = new WeakSet();

    constructor(value) {
        Wrapper.#registry.add(this);
        this.#value = value;
    }
    
    get() {
        return this.#value;
    }
    
    set(value) {
        this.#value = value;
    }
    
    static isWrapper(value) {
        return Wrapper.#registry.has(value);
    }
}
```

Here is how we could create and use a customizer to properly clone `Wrapper` instances.

```javascript
import cloneDeep from "./clone-deep.js";

// The customizer gets one argument: the value to clone
function wrapperCustomizer(value) {

    // If the customizer does not return an object, cloneDeep performs default behavior
    if (!Wrapper.isWrapper(value)) {
        return;
    }

    const clonedWrapper = new Wrapper();

    return {
        // the `clone` property stores the clone of `value`
        clone: clonedWrapper,

        // Let's clone the private property as well
        additionalValues: [{
            value: value.get(),

            // `assigner` decides where the clone of `value.get` will be stored
            assigner(cloned) {
                clonedWrapper.set(cloned);
            }
        }]
    };
}

// create an object containing a wrapper instance and clone it
const wrapper = new Wrapper({ spam: "eggs" });
const obj = { foo: wrapper };
const clonedObj = cloneDeep(obj, wrapperCustomizer);

// check that it works
console.log(clonedObj === obj);  // false
console.log(Wrapper.isWrapper(clonedObj.foo));  // true
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

## cms-clone-deep and TypeScript

Type information is provided for every function which can be imported from this package. In addition, the following types can be imported from `"cms-clone-deep"`:

 - `CloneDeepOptions` : The type of the object which can be passed as the second argument to `cloneDeep`.
 - `CloneDeepFullyOptions` : The type of the object which can be passed as the second argument to `cloneDeepFully`.
 - `Customizer`: The type of the functions which can be used as customizers.
 - `Log`: The type of the optional logging function.
 - `ValueTransform`: `Customizer`s can return this type or `void`.
 - `AdditionalValues`: The type of the `additionalValues` property in `ValueTransform`.

## `cloneDeep` vs `structuredClone`

JavaScript has a native function `structuredClone` which deeply clones objects. Differences between `structuredClone` and `cloneDeep` include:
 - `structuredClone` cannot clone objects which have symbols or properties that are symbols. `cloneDeep` can.
 - `structuredClone` does not clone non-enumerable properties. `cloneDeep` does.
 - `structuredClone` does not preserve the extensible, sealed, or frozen property of an object or any of its nested objects. `cloneDeep` does.
 - `structuredClone` does not clone the property descriptor associated with any value in an object. `cloneDeep` does.
 - `structuredClone` supports all of the types listed [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types). `cloneDeep` only supports the types listed under "JavaScript types" (and `Symbol`).
 - `structuredClone` is implemented with recursion in some runtimes meaning deeply nested objects blow up the call stack. `cloneDeep` uses no recursion.
 - `structuredClone` throws an error if the user attempts to clone an object with methods. `cloneDeep` will copy the methods *by value* and noisily log a warning.
 - `structuredClone` throws an error when provided an object of an unsupported type. On the other hand, `cloneDeep` will copy the type as an empty object and noisily log a warning.
 - `structuredClone` will identify if an object was created by a native JavaScript constructor function even if the object's prototype is changed or if the `Symbol.toStringTag` property is changed; furthermore, the cloned object will have the prototype from the native constructor function from even if the original object changed its prototype. On the other hand, `deepClone` uses `Object.prototype.toString.call` to identify the type of an object and the cloned object will share the original object's prototype no matter the result of `Object.prototype.toString.call`.
 - If the prototype of the original object is the prototype of any [supported type](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types) for the structured clone algorithm, then object returned by `structuredClone` will share the original object's prototype; otherwise, the prototype of the object will be `Object.prototype`. Meanwhile, the object cloned by `cloneDeep` will always share the prototype of the original object. 

## cloning this repository

There are some features which are only accessible by cloning the repository. This is done by installing [git](https://git-scm.com/downloads). Once you have `git`, execute `git clone https://github.com/calebmsword/clone-deep.git` and a directory *clone-deep/* will be made containing the source code. Then execute `npm install`.

## TypeScript & JSDoc

This repository uses type annotations in [JSDoc](https://jsdoc.app/) to add type-checking to JavaScript. While this requires the `typescript` module, there is no compilation step. The codebase is entirely JavaScript, but VSCode will still highlight errors like it would for TypeScript files. If you are using an IDE which cannot conveniently highlight TypeScript errors, then you can use the TypeScript compiler to check typing (`npm i -g typescript`, then run `npx tsc` in the repository).

## testing

The file `clone-deep.test.js` contains all unit tests. Execute `npm test` to run them. If you are using node v20.1.0 or higher, execute `node run test-coverage` to see coverage results.

## benchmarking

Some rudimentary benchmarking can be done within the repository. In the directory containing the source code, execute `node serve.js <PORT>`, where the `PORT` command line option is optional and defaults to `8787`, and visit `http://localhost:<PORT>` to see the benchmarking UI. `benchmark.js` and `benchmark.css` contain the JavaScript and styling, respectively, for the hosted web page. You can use your favorite browser's dev tools to profile the result.

## contribution guidelines

  - If you notice a bug or have a feature request, please raise an issue. Follow the default template provided for bug reports or feature requests, respectively.
  - If you would like to implement a bug fix or feature request from an issue, please create a branch from the `dev` branch with a descriptive name relevant to the issue title. Once you are finished with the implementation, create a pull request to the `dev` branch.

## acknowledgements

 - This algorithm is a heavily modified version of the the [cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep) utility from Lodash. Infinite thanks goes out to following GitHub users I could find who contributed to that algorithm:
   - [jdalton](https://github.com/jdalton)
   - [falsyvalues](https://github.com/falsyvalues)
   - [greenberga](https://github.com/greenberga)
   - [rssteffey](https://github.com/rssteffey)
   - [drabinowitz](https://github.com/drabinowitz)
   - [twolfson](https://github.com/twolfson)
   - [blikblum](https://github.com/blikblum)
 - Thanks to Tiago Bertolo, the author of [this article](https://medium.com/@tiagobertolo/which-is-the-best-method-for-deep-cloning-in-javascript-are-they-all-bad-101f32d620c5). It reminded me to clone the metadata of objects.
 - Thanks to MDN and its documentation on the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
 - Thanks to StackExchange user Jonathan Tran for his `http.createServer` example.
 - Thanks to [clone](https://www.npmjs.com/package/clone) for its implementation of cloning Promises.
