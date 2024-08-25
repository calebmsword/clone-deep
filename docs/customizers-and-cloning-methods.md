# Customizers

## Customizer Syntax

```javascript
const supportMyClass = (value) => {
  if (value instanceof MyClass) {
    return {
      clone: value.clone();
    };
  }
};

const clone = cloneDeep({
  myClass: new MyClass()
}, {
  customizer: supportMyClass
});

console.log(clone.myClass);
```

## Customizer Parameters

<dl>
  <dt>value</dt>
  <dd>Every value that is cloned by the algorithm will be passed to this customizer.</dd>

  <dt>logger</dt>
  <dd>The logger object used the algorithm is provided to this customizer. It can be used at your discretion.</dd>
</dl>

## Customizer Return Value

<dl>
  <dt>customizerResult</dt>
  <dd>Optional. Either an object, or undefined if you want the algorithm to proceed with default behavior. If the customizerResult is an object, properties available are:
    <dl>
      <dt>customizerResult.useCustomizerClone</dt>
      <dd>Optional. A boolean. If false, the algorithm will still determine the clone as normal even if this object is provided.</dd>
      <dt>customizerResult.clone</dt>
      <dd>Optional. Any type. This will be used as the clone for the given object as long as useCustomizer clone is not false, even if this property is not present on the object (in which case the value will be cloned into undefined).</dd>
      <dt>customizerResult.propsToIgnore</dt>
      <dd>Optional. An array of strings and/or symbols. Any property present in this array, if present on the clone, will NOT be recursed by the algorithm. Use this property if you want the customizer to have the responsibility of cloning particular properties of the value.
      </dd>
      <dt>customizerResult.ignoreProps</dt>
      <dd>Optional. A boolean. If true, the algorithm will not recurse on any properties of the given value. Use this if you want the customizer to have full responsibility of cloning the provided value.</dd>
      <dt>customizerResult.ignoreProto</dt>
      <dd>Optional. A boolean. If true, the algorithm will not ensure that the provided value and the clone share prototypes. Use this if you want the customizer to have full responsibility of determining the prototype of the provided value.</dd>
      <dt>customizerResult.async</dt>
      <dd>Optional. A boolean. If true, customizerResult.clone will be passed to Promise.resolve(), and the resolved value will be used as the clone for the provided value.</dd>
      <dt>customizerResult.throwWith</dt>
      <dd>Optional. An Error. If provided, the algorithm will immediately throw customizerResult.throwWith.</dd>
      <dt>customizerResult.additionalValues</dt>
      <dd>Optional. An array of "AdditionalValue" objects. Any object in the array represents an additional value that will be recursed by the algorithm. Use this to clone data associated with the provided value that this not accessible via property access. The following properties are available on "AdditionalValue" objects in the array:
        <dt>additionalValue.value</dt>
        <dd>Required. Any type. This is a new value that will be recursed later by the algorithm. The customizer will throw an error if this property is not present on the AdditionalValue object.</dd>
        <dt>additionalValue.assigner</dt>
        <dd>Required. A function. This function will receive a clone of the additionalValue.value and has the responsibility of storing that clone in a persistent place. The customizer will throw an error if this property is not present on the AdditionalValue object.</dd>
        <dt>additionalValue.async</dt>
        <dd>Optional. A boolean. If true, additionalValue.value will be passed to Promise.resolve(), and the resolved value will be used as the clone that is passed to additionalValue.assigner.</dd>
      </dd>
    </dl>
  </dd>
</dl>

## Customizer Description

# Cloning Methods

## Cloning Method Syntax

## Cloning Method Parameters

## Cloning Method Return Value

## Cloning Method Description
