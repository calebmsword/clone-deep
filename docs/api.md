# cloneDeep

<details>
<summary>example</summary>
  
```javascript
import cloneDeep from 'cms-clone-deep';

const deepObject = {
  prop: 'prop',
  nestedObject: {
    hello: 'world',
  date: Date.now()
}
const clone = cloneDeep(deepObject);
```

</details>



<details>
<summary>Compatibility</summary>

|                                                               | structuredClone | cloneDeep | cloneDeepAsync |
| ------------------------------------------------------------- | --------------- | --------- | -------------- |
| `bigint`\|`boolean`\|`null`\|`number`\|`string`\|`undefined`  |       ✅       |    ❌     |       ❌      |
| symbol                                                        |       ❌       |    ✅     |       ✅      |
| Array                                                         |       ✅       |    ✅     |       ✅      |
| BigInt                                                        |       ✅       |    ✅     |       ✅      |
| Boolean                                                       |       ✅       |    ✅     |       ✅      |
| Date                                                          |       ✅       |    ✅     |       ✅      |
| Function                                                      |       ❌       |    ❌     |       ❌      |
| Map                                                           |       ✅       |    ✅     |       ✅      |
| Number                                                        |       ✅       |    ✅     |       ✅      |
| Object                                                        |       ✅       |    ✅     |       ✅      |
| Promise                                                       |       ❌       |    ✅     |       ✅      |
| RegExp                                                        |       ✅       |    ✅     |       ✅      |
| Set                                                           |       ✅       |    ✅     |       ✅      |
| String                                                        |       ✅       |    ✅     |       ✅      |
| Error                                                         |       ✅       |    ✅     |       ✅      |
| AggregateError                                                |       ❌       |    ✅     |       ✅      |
| EvalError                                                     |       ✅       |    ✅     |       ✅      |
| RangeError                                                    |       ✅       |    ✅     |       ✅      |
| ReferenceError                                                |       ✅       |    ✅     |       ✅      |
| SyntaxError                                                   |       ✅       |    ✅     |       ✅      |
| TypeError                                                     |       ✅       |    ✅     |       ✅      |
| URIError                                                      |       ✅       |    ✅     |       ✅      |
| ArrayBuffer                                                   |       ✅       |    ✅     |       ✅      |
| DataView                                                      |       ✅       |    ✅     |       ✅      |
| TypedArray                                                    |       ✅       |    ✅     |       ✅      |
| Buffer (node.js type)                                         |       ❌       |    ✅     |       ✅      |
| AudioData                                                     |       ✅       |    ✅     |       ✅      |
| Blob                                                          |       ✅       |    ✅     |       ✅      |
| CropTarget                                                    |       ✅       |    ❌     |       ❌      |
| CryptoKey                                                     |       ✅       |    ❌     |       ❌      |
| DOMException                                                  |       ✅       |    ✅     |       ✅      |
| DOMMatrix                                                     |       ✅       |    ✅     |       ✅      |
| DOMMatrixReadOnly                                             |       ✅       |    ✅     |       ✅      |
| DOMPoint                                                      |       ✅       |    ✅     |       ✅      |
| DOMPointReadOnly                                              |       ✅       |    ✅     |       ✅      |
| DOMQuad                                                       |       ✅       |    ✅     |       ✅      |
| DOMRect                                                       |       ✅       |    ✅     |       ✅      |
| DOMRectReadOnly                                               |       ✅       |    ✅     |       ✅      |
| File                                                          |       ✅       |    ❌     |       ❌      |
| FileList                                                      |       ✅       |    ❌     |       ❌      |
| FileSystemDirectoryHandle                                     |       ✅       |    ❌     |       ❌      |
| FileSystemFileHandle                                          |       ✅       |    ❌     |       ❌      |
| FileSystemHandle                                              |       ✅       |    ❌     |       ❌      |
| GPUCompilationInfo                                            |       ✅       |    ❌     |       ❌      |
| GPUCompilationMessage                                         |       ✅       |    ❌     |       ❌      |
| ImageBitmap                                                   |       ✅       |    ❌     |       ✅      |
| ImageData                                                     |       ✅       |    ✅     |       ✅      |
| RTCCertificate                                                |       ✅       |    ✅     |       ✅      |
| VideoFrame                                                    |       ✅       |    ✅     |       ✅      |


</details>




Create a deep copy of the provided value. The cloned object will point to the *same prototype* as the original.

If you need to clone the prototype chain for an object, use `cloneDeepFully`. 

This behaves like `structuredClone`, but there are differences:
 - The function is not recursive, so the call stack does not blow up for deeply nested objects. (As of August 2024, V8 implements `structuredClone` with a recursive algorithm.)
 - Methods are copied over to the clone. The functions are not clones, they point to the same function as the original.
 - `cloneDeep` can clone symbol values or properties.
 - `cloneDeep` does NOT support 
 - The property descriptor of properties are preserved. structuredClone 
ignores them.
 - Unsupported types do not cause errors to be thrown. Instead, unsupported 
types are simply "cloned" into an empty object and a noisy warning is logged 
to the console (or sent to the custom logger provided).

`WeakMaps` and `WeakSets` are not supported types. It is actually impossible 
to properly clone a `WeakMap` or `WeakSet`.

Functions also cannot be properly cloned. If you provide a function to this 
method, an empty object will be returned. However, if you provide an object 
with methods, they will be copied by value (no new function object will be 
created). A warning is logged if this occurs.

This method will clone many of JavaScripts native classes. These include 
`Date`, `RegExp`, `ArrayBuffer`, all `TypedArray` subclasses, `Map`, `Set`, 
`Number`, `Boolean`, `String`, `BigInt`, and `Symbol`. The algorithm 
type-checks for these classes using `Object.prototype.toString.call`, so if 
you use `Symbol.toStringTag` irresponsibly, the algorithm may not correctly 
identify types.

`Promise`s are supported. The returned object will settle when the original 
promise settles, and it will resolve or reject with the same value as the 
original `Promise`.

An optional `customizer` can be provided to inject additional logic. The 
customizer has the responsibility of determining what object a value should 
be cloned into. If it returns an object, then the value of the `clone` 
property on that object is used as the clone for the given value. If the 
object doesn't have a `clone` property, then the value is cloned into 
`undefined`. If the customizer returns anything that is not an object, then 
the algorithm will perform its default behavior.

@example
```
// Don't clone methods
const myObject = { 
    a: 1, 
    func: () => "I am a function" 
};
const cloned = cloneDeep(myObject, {
    customizer(value) {
        if (typeof value === "function") {
            return { clone: {} };
        }
    }
});
console.log(cloned);  // { a: 1, func: {} }
```

The object returned by the customizer can also have an `additionalValues` 
property. If it is an array, then it is an array of objects which represent 
additional values that will be cloned. The objects in the array must have the 
following properties:

 - `value`: It is the value to clone.
 - `assigner`: It must be a function. It has the responsiblity of assigning 
the clone of `value` to something. It is passed the clone of `value` as an 
argument.

The `additionalValues` property should only be used to clone data an object 
can only access through its methods. See the following example. 

@example
```
class Wrapper {
    #value;
    get() {
        return this.#value;
    }
    set(value) {
        this.#value = value;
    }
}

const wrapper = new Wrapper();;
wrapper.set({ foo: "bar" });

const cloned = cloneDeep(wrapper, {
    customizer(value) {
        if (!(value instanceof Wrapper)) return;

        const clonedWrapper = new Wrapper();
        
        return {
            clone: clonedWrapper,

            additionalValues: [{
                // the cloning algorithm will clone 
                // value.get()
                value: value.get(),

                // and the assigner will make sure it is 
                // stored in clone
                assigner(cloned) {
                    clonedWrapper.set(cloned)
                }
            }]
        };
    }
});

console.log(wrapper.get());  // { foo: "bar" }
console.log(cloned.get());   // { foo: "bar" }
console.log(cloned.get() === wrapper.get());  // false
```

The customizer object can have some additional effects by having any of the 
following properties:

 - `ignoreProps` -  If `true`, the properties of the cloned value will NOT be 
cloned.
 - `ignoreProto` - If `true`, the prototype of the value will not be copied 
to the clone. 
 - `ignore` - If `true`, the value will not be cloned at all.

The customizer has extremely high priority over the default behavior of the 
algorithm. The only logic the algorithm prioritizes over the customizer is 
the check for circular references. 

The best use of the customizer to support user-made types. You can also use 
it to override some of the design decisions made in the algorithm (say, 
ignore all non-enumerable properties of an object).
