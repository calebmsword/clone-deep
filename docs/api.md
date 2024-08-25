# cloneDeep

## cloneDeep Syntax
```javascript
import cloneDeep from 'cms-clone-deep';

cloneDeep(value);
cloneDeep(value, options);
```

### cloneDeep Parameters

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

### cloneDeep Return Value

The clone of the provided value.

## cloneDeep Description
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

## cloneDeep Type Support

<details>
  <summary>Type Support Table</summary>

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

# cloneDeepAsync

## cloneDeepAsync Syntax
```javascript
import { cloneDeepAsync } from 'cms-clone-deep';

// async-await
try {
  const result = await cloneDeepAsync(value, options);
  const clone = result.clone;
} catch (reason) {
  console.log(reason);
}

// promises
cloneDeepAsync(value, options)
.then((result) => {
  const clone = result.clone;
})
.catch((reason) => {
  console.log(reason);
});
```

### cloneDeepAsync Parameters

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

### cloneDeepAsync Return Value

A promise which resolves to an object which contains the clone of the provided value, or rejects if an uncaught error in the algorithm occurs. If the promise fulfills, it will fulfill with an object containing exactly one property: `clone`. This property contains the clone of the provided value. 

## cloneDeepAsync Description
Creates a deep copy of the provided value asynchronously. This extends the support of cloneDeep for ImageBitmap and any customizer or cloning method that determines clones asynchronously. Otherwise, `cloneDeepAsync` has the same functionality as `cloneDeep`. 

# cloneDeepFully

## cloneDeepFully Syntax
```javascript
import { cloneDeepFully } from 'cms-clone-deep';

cloneDeepFully(value);
cloneDeepFully(value, options);
```

### cloneDeepFully Parameters

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
      <dt>options.force</dt>
      <dd>Optional. A boolean. If true, prototypes which contain methods will be cloned. By default, cloneDeepFullyAsync stops cloning the prototype chain if it reaches any prototype with methods. Since it is impossible to clone functions in general, use this option at your own discretion.</dd>
    </dl>
  </dd>
</dl>

### cloneDeepFully Return Value

The clone of the provided value.

## cloneDeepFully Description
Creates a deep copy of the provided value while also cloning the prototype chain of the given value.

It is extremely important to understand that `cloneDeepFully`, _by default, stops cloning the prototype chain once it reaches a prototype with methods_. This is because it is not possible, in general, to clone functions. If you want prototypes with methods to be cloned, make sure that you pass the `options` object with the `force` parameter set to `true`.

# cloneDeepFullyAsync

## cloneDeepFullyAsync Syntax
```javascript
import { cloneDeepFullyAsync } from 'cms-clone-deep';

// async-await
try {
  const result = await cloneDeepFullyAsync(value);
  const clone = result.clone;
} catch (reason) {
  console.log(reason);
}

// promises
cloneDeepFullyAsync(value, options)
.then((result) => {
  const clone = result.clone;
})
.catch((reason) => {
  console.log(reason);
});
```

### cloneDeepFullyAsync Parameters

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
      <dt>options.force</dt>
      <dd>Optional. A boolean. If true, prototypes which contain methods will be cloned. By default, cloneDeepFullyAsync stops cloning the prototype chain if it reaches any prototype with methods. Since it is impossible to clone functions in general, use this option at your own discretion.</dd>
    </dl>
  </dd>
</dl>

### cloneDeepFullyAsync Return Value

A promise which resolves to an object which contains the clone of the provided value, or rejects if an uncaught error in the algorithm occurs. If the promise fulfills, it will fulfill with an object containing exactly one property: `clone`. This property contains the clone of the provided value. 

## cloneDeepFullyAsync Description
Creates a deep copy of the provided value asynchronously, while also cloning the prototype chain of the given value. This extends the support of cloneDeep for ImageBitmap and any customizer or cloning method that determines clones asynchronously. Otherwise, `cloneDeepFullyAsync` has the same functionality as `cloneDeepFully`.
