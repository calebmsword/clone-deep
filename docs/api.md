# cloneDeep

## Syntax
```javascript
import cloneDeep from 'cms-clone-deep';

cloneDeep(value);
cloneDeep(value, options);
```

### Parameters

<dl>
  <dt>value</dt>
  <dd>Any arbitrary value. cloneDeep will return a clone of this value.</dd>
</dl>

<dl>
  <dt>options</dt>
  <dd>Optional. An object. Available options are:
    <dl>
      <dt>options.customizer</dt>
      <dd>Optional. A customizer function.</dd>
      <dt>options.log</dt>
      <dd>Optional. A logger object.</dd>
      <dt>options.performanceConfig</dt>
      <dd>Optional. A configuration object to tailor the performance of the algorithm. Available options are:
        <dl>
          <dt>performanceConfig.ignoreMetadata</dt>
          <dd>Optional. A boolean. If true, ignore the check for extensibility/sealedness/frozenness. This has marginal improvement to the performance of the algorithm, and can be useful if you have confidence that every object has the default extensibility/sealedness/frozenness.</dd>
          <dt>performanceConfig.robustTypeChecking</dt>
          <dd>Optional. A boolean. If true, the algorithm will take extra measures while performing runtime type-checking. When robustTypeChecking is active, values that were constructed with a native constructor will usually be correctly detected even if they have their prototypes changed. Use at your own discretion as this considerably slows the algorithm.</dd>
        </dl>
      </dd>
      <dt>options.ignoreCloningMethods</dt>
      <dd>Optional. A boolean. If true, cloning methods will not be used to clone objects.</dd>
      <dt>options.logMode</dt>
      <dd>Optional. A string. If the value "silent" (case-insensitive), then no warnings or errors will be printed to the console even if a custom logger object is provided. Use at your own discretion.</dd>
      <dt>options.letCustomizerThrow</dt>
      <dd>Optional. A boolean. If true, customizers and cloning methods that throw errors will cause the algorithm to throw. By default, these errors are logged and the algorithm continues with default behavior.</dd>
    </dl>
  </dd>
</dl>

### Return value

The clone of the provided value.

## Description
Creates a deep copy of the provided value. `cloneDeep` behaves like `structuredClone`, but there are differences:
 - The function is not recursive, so the call stack does not blow up for deeply nested objects. (As of August 2024, V8 implements `structuredClone` with a recursive algorithm.)
 - Methods are copied over to the clone. The functions are not clones, they point to the same function as the original.
 - The property descriptor of properties are preserved. `structuredClone` ignores them.
 - The frozenness, sealedness, and extensibility of objects are preserved. `structuredClone` ignores these characteristics.
 - There are many differences in which JavaScript types can be cloned by `structuredClone` and `cloneDeep`. Please see the compatibility table for specifics.
 - `cloneDeep` does not throw errors when unsupported types are encountered. Instead, unsupported types are simply "cloned" into an empty object and a noisy warning is logged to the console (or sent to the custom logger provided).

An optional `customizer` can be provided to extend or modify the functionality of `cloneDeep`. The customizer has extremely high priority over the default behavior of the algorithm. The only logic the algorithm prioritizes over the customizer is the check for circular references; see the section on customizers for more information.

The cloned object returned by `cloneDeep` will point to the *same prototype* as the original. If you need to clone the prototype chain for an object, use `cloneDeepFully`.

If you wish to clone an `ImageBitmap`, or if a customizer or cloning method provides any clones asynchronously, you should use `cloneDeepAsync` instead.

## Type Support
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
