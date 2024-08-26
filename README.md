# cms-clone-deep
A dependency-free utility for deeply cloning JavaScript objects.

```javascript
import cloneDeep from 'cms-clone-deep';

const object = [{ foo: 'bar' }, { baz: { spam: 'eggs' } }];
const cloned = cloneDeep(object);

cloned.forEach(console.log);
// {foo: 'bar'}
// {baz: {spam: 'eggs'}}

console.log(cloned === object);  // false
console.log(cloned[0] === object[0]);  // false
console.log(cloned[1] === object[1]);  // false
```

This module is compatible with TypeScript. See [this section](#cms-clone-deep-and-typescript) for more information.

## Links

 - [API docs](https://github.com/calebmsword/clone-deep/blob/main/docs/api.md)
 - [Customizer and cloning method docs](https://github.com/calebmsword/clone-deep/blob/mainr/docs/customizers-and-cloning-methods.md)

## Installation

First, install [node.js](https://nodejs.org/en) on your machine. At the time of this writing, the current stable version is **20.10.0**.

After that, using the terminal in any [package](https://nodejs.org/api/packages.html#modules-packages), execute `npm install cms-clone-deep`. In any ES6 module in that package, functions can be imported like so:

```javascript
import cloneDeep, { cloneDeepFully, useCustomizers } from "cms-clone-deep";
```

If you would prefer an package which interops with commonjs modules, you can use the `cms-clone-deep-es5` package which has the exact same api. Bundled and minified versions of both packages can be found at [https://cdn.jsdelivr.net/npm/cms-clone-deep/+esm](https://cdn.jsdelivr.net/npm/cms-clone-deep/+esm) (`cms-clone-deep`) and [https://cdn.jsdelivr.net/npm/cms-clone-deep-es5](https://cdn.jsdelivr.net/npm/cms-clone-deep-es5) (`cms-clone-deep-es5`). See the [jsdeliver documentation](https://www.jsdelivr.com/documentation) for more information.

## cloneDeep

The first argument to `cloneDeep` is the object to clone. The second optional argument is an object that can be used for configuration.

```javascript
// Many ways to call `cloneDeep`:
import cloneDeep from 'cms-clone-deep';

let cloned;
let originalObject = {};

// 1: Default behavior
cloned = cloneDeep(originalObject);

// 2: Provide a configuration object
cloned = cloneDeep(originalObject, {

    // Provide a function which extends the functionality of cloneDeep.
    customizer: myCustomizer,

    // An object can be provided which configures the performance of the
    // algorithm.
    performanceConfig: {
        robustTypeChecking: true,
        ignoreMetadata: false
    },

    // Warnings and Errors are typically logged to the console, but if a
    // logging object can be provided, that will be used instead.
    log: myLogger
});
```

To see the full list of options, please consult the [API documentation](https://github.com/calebmsword/clone-deep/blob/main/docs/api.md).

## Why should I use cloneDeep? JavaScript has structuredClone now!

`structuredClone` has many limitations. It cannot clone objects with symbols. It does not clone non-enumerable properties. It does not preserve the extensible, sealed, or frozen status of the object or its nested objects. It does not clone the property descriptor associated with any values in the object.

`cloneDeep` has none of these limitations. See [this section](https://github.com/calebmsword/clone-deep/blob/main/docs/api.md#differences-between-clonedeep-and-structuredclone) for more about the differences between `cloneDeep` and `structuredClone`.

## what cannot be cloned

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

For more details on cloning methods, please see the [relevant documentation](https://github.com/calebmsword/clone-deep/blob/main/docs/customizers-and-cloning-methods.md).

## customizers

`cloneDeep` can take a customizer which allows the user to support custom types. This gives the user considerable power to extend or change `cloneDeep`'s functionality.

For the sake of example, let us mend `Wrapper` so that it can be cloned with  a customizer instead of a custom method.

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

Here is how we could create and use a customizer to properly clone `Wrapper` instances.

```javascript
import cloneDeep from "./clone-deep.js";

// The customizer gets one argument: the value to clone
function wrapperCustomizer(value) {

    // If the customizer does not return an object, cloneDeep performs default behavior
    if (!(value instanceof Wrapper)) {
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

There are many properties that will be observed in the object returned by the customizer. Please see the [customizer documentation](https://github.com/calebmsword/clone-deep/blob/main/docs/customizers-and-cloning-methods.md#customizers) for more information.

## Additional package features

`cloneDeep` is the primary function that will be used from package, but `cms-clone-deep` provides some additional functions:

 1) `cloneDeepFully` This function will clone an object as well as each object in its prototype chain.
 2) `cloneDeepAsync` This function will return the clone in a promise.
 3) `cloneDeepFullyAsync` Like `cloneDeepAsync`, this function performs the behavior of `cloneDeepFully` but wraps the result in a promise.
 4) `useCustomizers` This function takes an array of customizer functions and returns a new customizer. The new customizer calls each customizer one at a time, in order, and returns an object if once any of the customizers returns an object. Use this to avoid code reuse when creating multiple useful customizers.

## cms-clone-deep and TypeScript

Type information is provided for every function which can be imported from this package. In addition, the following types can be imported from ``cms-clone-deep``:

 - `CloneDeepOptions` : The type of the object which can be passed as the second argument to `cloneDeep` and `cloneDeepAsync`.
 - `CloneDeepFullyOptions` : The type of the object which can be passed as the second argument to `cloneDeepFully` and `cloneDeepFullyAsync`.
 - `Customizer`: The type of the functions which can be used as customizers.
 - `Log`: The type of the optional logging object.
 - `CloneMethodResult`: Cloning methods can return this type of `void`.
 - `CustomizerResult`: `Customizer`s can return this type or `void`.
 - `AdditionalValue`: The type of the objects which can be passed to the `additionalValues` property in a `CustomizerResult`.

## cloning this repository

There are some features which are only accessible by cloning the repository. This is done by installing [git](https://git-scm.com/downloads). Once you have `git`, execute `git clone https://github.com/calebmsword/clone-deep.git` and a directory *clone-deep/* will be made containing the source code. Then execute `npm install`.

## TypeScript & JSDoc

This repository uses type annotations in [JSDoc](https://jsdoc.app/) to add type-checking to JavaScript. While this requires the `typescript` module, there is no compilation step. The codebase is entirely JavaScript, but VSCode will still highlight errors like it would for TypeScript files. If you are using an IDE which cannot conveniently highlight TypeScript errors, then you can use the TypeScript compiler to check typing (`npm i -g typescript`, then execute `npm run tsc`).

## testing

The file `clone-deep.test.js` contains all unit tests. Execute `npm test` to run them. If you are using node v20.1.0 or higher, execute `npm run test-coverage` to see coverage results.

## linting 

We use eslint to lint this project. All merge requests to the dev and main branches must be made with code that throws no errors when linted. To run the linter, execute `npm run lint`. To auto-format as much code as possible and then run the linter, execute `npm run fix`. Note that the formatter is not guaranteed to force the code to pass the linter.

## benchmarking

Some rudimentary benchmarking can be done within the repository. In the directory containing the source code, execute `node serve.js <PORT>`, where the `PORT` command line option is optional and defaults to `8787`, and visit `http://localhost:<PORT>` to see the benchmarking UI. `benchmark.js` and `benchmark.css` contain the JavaScript and styling, respectively, for the hosted web page. You can use your favorite browser's dev tools to profile the result.

## contribution guidelines

  - If you notice a bug or have a feature request, please raise an issue. Follow the default template provided for bug reports or feature requests, respectively.
  - If you would like to implement a bug fix or feature request from an issue, please create a branch from the `dev` branch with a descriptive name relevant to the issue title. Once you are finished with the implementation, create a pull request to the `dev` branch.
  - All merge requests undergo a build pipeline that runs the full test suite, runs the linter, and runs the typescript compiler. Code cannot be merged into the dev or main branches without passing this pipeline. For convenience, run `npm run verify-project` to check if the codebase will pass these three requirements. 

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
 - Thanks to [this](https://stackoverflow.com/a/62491100/22334683) stackoverflow answer for its suggestion for cloning Files.
 - Thanks to [fisker](https://github.com/fisker) and their [package](https://github.com/fisker/create-file-list) for its implementation of creating FileList instances.
 - Thanks to [this](https://stackoverflow.com/a/52526549/22334683) stackexchange post, which helped me implement the `run-verify` npm script.
