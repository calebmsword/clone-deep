## Throw on WeakMaps and WeakSets

By default, `cloneDeep` will clone WeakMap and WeakSets into empty objects. If you would prefer that the algorithm throw when this occurs, then you can do so with the following customizer.

<details>
  <summary>js</summary>

```javascript
// A customizer factory, to enable code reuse
const getUnsupportedType = (constructor) => {
  return (value) => {
    if (value instanceof constructor) {
      return {
        throwWith: new TypeError(`${constructor.name} unsupported`)
      };
    }
  };  
}

const throwOnWeakTypes = useCustomizers([
  getUnsupportedType(WeakMap),
  getUnsupportedType(WeakSet)
]);

cloneDeep({ foo: new WeakMap() }, {
  customizer: throwOnWeakTypes
});
// throws TypeError
```

</details>

<details>
  <summary>ts</summary>

```typescript
// A customizer factory, to enable code reuse
const getUnsupportedType = (constructor: new (...args: any[]) => any): Customizer => {
  
  const unsupportedTypeCustomizer: Customizer = (value) => {
    if (value instanceof constructor) {
      return {
        throwWith: new TypeError(`${constructor.name} unsupported`)
      };
    }
    return;
  }
  return unsupportedTypeCustomizer;  
}

const throwOnWeakTypes = useCustomizers([
  getUnsupportedType(WeakMap),
  getUnsupportedType(WeakSet)
]);

cloneDeep({ foo: new WeakMap() }, {
  customizer: throwOnWeakTypes
});
// throws TypeError
```

</details>

