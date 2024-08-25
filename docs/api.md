# cloneDeep

## Syntax
```javascript
import cloneDeep from 'cms-clone-deep';

cloneDeep(value);
cloneDeep(value, options);
```

### Parameters

`value`

Any arbitrary value. `cloneDeep` will return a clone of this value.

### Return value


## Description
Creates a deep copy of the provided value. `cloneDeep` behaves like `structuredClone`, but there are differences:
 - The function is not recursive, so the call stack does not blow up for deeply nested objects. (As of August 2024, V8 implements `structuredClone` with a recursive algorithm.)
 - Methods are copied over to the clone. The functions are not clones, they point to the same function as the original.
 - The property descriptor of properties are preserved. `structuredClone` ignores them.
 - The frozenness, sealedness, and extensibility of objects are preserved. `structuredClone` ignores these characteristics.
 - There are many differences in which JavaScript types can be cloned by `structuredClone` and `cloneDeep`. Please see the compatibility table for specifics.
 - `cloneDeep` does not throw errors when unsupported types are encountered. Instead, unsupported types are simply "cloned" into an empty object and a noisy warning is logged to the console (or sent to the custom logger provided).

An optional `customizer` can be provided to extend or modify the functionality of `cloneDeep`. The customizer has extremely high priority over the default behavior of the algorithm. The only logic the algorithm prioritizes over the customizer is the check for circular references. See the section on customizers for more information.

The cloned object returned by `cloneDeep` will point to the *same prototype* as the original. If you need to clone the prototype chain for an object, use `cloneDeepFully`. 



## Type Compatibility

<details>
<summary>Compatibility Table</summary>

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
