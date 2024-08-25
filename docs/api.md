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
Creates a deep copy of the provided value.

An optional `customizer` can be provided to extend or modify the functionality of `cloneDeep`. The customizer has extremely high priority over the default behavior of the algorithm. The only logic the algorithm prioritizes over the customizer is the check for circular references; see the section on customizers for more information.

The cloned object returned by `cloneDeep` will point to the *same prototype* as the original. If you need to clone the prototype chain for an object, use `cloneDeepFully`.

If you wish to clone an `ImageBitmap`, or if a customizer or cloning method provides any clones asynchronously, you should use `cloneDeepAsync` instead.

### Differences Between cloneDeep and structuredClone 
`cloneDeep` behaves like `structuredClone`, but there are differences:
 - `structuredClone` cannot clone objects which have symbols or properties that are symbols. `cloneDeep` can.
 - `structuredClone` does not clone non-enumerable properties. `cloneDeep` does.
 - `structuredClone` does not preserve the extensible, sealed, or frozen property of an object or any of its nested objects. `cloneDeep` does.
 - `structuredClone` does not clone the property descriptor associated with any value in an object. `cloneDeep` does.
 - `structuredClone` supports all of the types listed [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types). `cloneDeep` only supports some of these types. For a full comparison of which native JavaScript types each algorithm can support, please consult the Type Compatibility table.
 - `structuredClone` is implemented with recursion in some runtimes meaning deeply nested objects blow up the call stack. `cloneDeep` uses no recursion.
 - `structuredClone` throws an error if the user attempts to clone an object with methods. `cloneDeep` will copy the methods *by value* and noisily log a warning.
 - `structuredClone` throws an error when provided an object of an unsupported type. On the other hand, `cloneDeep` will copy the type as an empty object and log a warning.
 - `structuredClone` will identify if an object was created by a native JavaScript constructor function even if the object's prototype is changed or if the `Symbol.toStringTag` property is changed; furthermore, the cloned object will have the prototype from the native constructor function from even if the original object changed its prototype. On the other hand, `deepClone` uses `Object.prototype.toString.call` to identify the type of an object and the cloned object will share the original object's prototype no matter the result of `Object.prototype.toString.call`.
 - If the prototype of the original object is the prototype of any [supported type](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types) for the structured clone algorithm, then object returned by `structuredClone` will share the original object's prototype; otherwise, the prototype of the object will be `Object.prototype`. Meanwhile, the object cloned by `cloneDeep` will always share the prototype of the original object. 

### cloneDeep Type Support

<details open>
  <summary>Type Support Table</summary>

|                                                               | structuredClone | cloneDeep | cloneDeepAsync |
| ------------------------------------------------------------- | :-------------: | :-------: | :------------: |
| `bigint`\|`boolean`\|`null`\|`number`\|`string`\|`undefined`  |       ✅       |    ✅     |       ✅      |
| `symbol`                                                      |       ❌       |    ✅     |       ✅      |
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

# useCustomizers

## useCustomizers Syntax
```javascript
import cloneDeep, { useCustomizers } from 'cms-clone-deep';

const combined = useCustomizers([
  customizer01,
  customizer02,
  customizer03
]);

cloneDeep(value, {
  customizer: combined
});
```

### useCustomizers Parameters

<dl>
  <dt>customizers</dt>
  <dd>Required. An array of customizer functions.</dd>
</dl>

### useCustomizers Return Value

A customizer which combines the functionality of the given customizers. The returned customizer will execute each customizer one at a time, in order, and will stop and return the return value of the first customizer to return an object. If none of the provided customizers return an object, the combined customizer will return `undefined`.

## useCustomizers Description
In a large project which intergrates with `cloneDeep`, it is possible that you will create multiple customizers that extend `cloneDeep` for your project. `useCustomizers` can be used to enable code reuse in projects that use multiple customizers.
