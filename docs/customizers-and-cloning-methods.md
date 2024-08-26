# Cloning Methods

## Cloning Method Syntax

```javascript
import { CLONE } from 'cms-clone-deep';

class Wrapper {
  #value;

  get value() {
    return this.#value;
  }

  constructor(value) {
    this.#value = value;
  }

  [CLONE](value) {
    return {
        clone: new Wrapper(this.value);
    };
  } 
}
```

## Cloning Method Parameters

<dl>
  <dt>logger</dt>
  <dd>The logger object used the algorithm is provided to this customizer. It can be used at your discretion.</dd>
</dl>

## Cloning Method Return Value

<dl>
  <dt>cloneMethodResult</dt>
  <dd>Optional. Either an object, or undefined if you want the algorithm to proceed with default behavior. If the customizerResult is an object, properties available are:
    <dl>
      <dt>cloneMethodResult.useCustomizerClone</dt>
      <dd>Optional. A boolean. If false, the algorithm will still determine the clone as normal even if this object is provided.</dd>
      <dt>cloneMethodResult.clone</dt>
      <dd>Optional. Any type. This will be used as the clone for the given object as long as useCustomizer clone is not false, even if this property is not present on the object (in which case the value will be cloned into undefined).</dd>
      <dt>cloneMethodResult.propsToIgnore</dt>
      <dd>Optional. An array of strings and/or symbols. Any property present in this array, if present on the clone, will NOT be recursed by the algorithm. Use this property if you want the customizer to have the responsibility of cloning particular properties of the value.
      </dd>
      <dt>cloneMethodResult.ignoreProps</dt>
      <dd>Optional. A boolean. If true, the algorithm will not recurse on any properties of the given value. Use this if you want the customizer to have full responsibility of cloning the provided value.</dd>
      <dt>cloneMethodResult.ignoreProto</dt>
      <dd>Optional. A boolean. If true, the algorithm will not ensure that the provided value and the clone share prototypes. Use this if you want the customizer to have full responsibility of determining the prototype of the provided value.</dd>
      <dt>cloneMethodResult.async</dt>
      <dd>Optional. A boolean. If true, customizerResult.clone will be passed to Promise.resolve(), and the resolved value will be used as the clone for the provided value.</dd>
      <dt>cloneMethodResult.throwWith</dt>
      <dd>Optional. An Error. If provided, the algorithm will immediately throw customizerResult.throwWith.</dd>
    </dl>
  </dd>
</dl>

## Cloning Method Description

Cloning methods allow objects to be responsible for determining their own clones. They are the recommended mechanism for integrating custom classes with `cloneDeep`.

Cloning methods can be used with ordinary objects instead of classes, if desired. Note that cloning methods will have an effect on an object if it is present anywhere in that object's prototype chain, or if it is on the object itself.

When using `cloneDeepFully` on an object with a cloning method, a cloning method stored in the prototype chain of an object 
_might_ not be used to clone the object it is owned by. `cloneDeepFully` clones the chain "top-down" in the sense that objects are cloned before their prototypes. During this process, it checks every prototype to see if a previously cloned object is an "instance" of the prototype, where `object` is an "instance" of `proto` if `object.constructor.prototype === proto`. If this is the case, then the `proto` will not use its cloning method to determine its own clone, if it has one. This behavior insures that cloning methods defined as class methods are only used to clone instances of the class and have no effect on the prototype when the instance is cloned with `cloneDeepFully`.

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
        <dl>
          <dt>additionalValue.value</dt>
          <dd>Required. Any type. This is a new value that will be recursed later by the algorithm. The customizer will throw an error if this property is not present on the AdditionalValue object.</dd>
          <dt>additionalValue.assigner</dt>
          <dd>Required. A function. This function will receive a clone of the additionalValue.value and has the responsibility of storing that clone in a persistent place. The customizer will throw an error if this property is not present on the AdditionalValue object.</dd>
          <dt>additionalValue.async</dt>
          <dd>Optional. A boolean. If true, additionalValue.value will be passed to Promise.resolve(), and the resolved value will be used as the clone that is passed to additionalValue.assigner.</dd>
        </dl>
      </dd>
    </dl>
  </dd>
</dl>

## Customizer Description

Customizers are a powerful tool that allow you to extend the functionality of `cloneDeep`, `cloneDeepAsync`, `cloneDeepFully`, and `cloneDeepFullyAsync`. While cloning methods are the recommended tool for supporting custom types, there are still two use cases for customizers:

  1. You wish to modify the behavior of `cloneDeep` (or any similar function) in some way.
  2. You wish to provide support for a class or object provided by a third-party library on which it is not possible to attach cloning methods.

For the first point, for example, you could have the algorithm throw an error if a WeakMap or WeakSet is encountered instead of cloning them into empty objects and logging a warning. For example:

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



The API for customizers is similar to cloning methods, with the exception being the `additionalValue` property which can be provided in the result object returned by a customizer. _This property should only be used to clone data associated with a value that is not associated on a property for the value_.

A common use case for the additionalValues property is to clone private variables on a class:

<details>
<summary>js</summary>

```javascript
class Wrapper {
  #value;

  getWrapped() {
    return this.#value;
  }

  setWrapped(value) {
    this.#value = value;
  }
}

const supportWrapper = (value) => {
  if (!(value instanceof Wrapper)) {
    return;
  }

  const clone = new Wrapper();

  const assigner = (wrappedValue) => {
    clone.setWrapped(wrappedValue);
  };

  return {
    clone,
    additionalValues: [{
      value: value.getWrapped(),
      assigner
    }]
  };
};

const wrapper = new Wrapper();
wrapper.setWrapped({ foo: 'bar' });

const clone = cloneDeep({ baz: wrapper }, {
  customizer: supportWrapper
});
console.log(clone.baz.getWrapped())
//  {foo: 'bar'}
```
</details>




<details>
<summary>ts</summary>

```typescript
import cloneDeep, { CustomizerResult } from 'cms-clone-deep';

class Wrapper<T> {
  #value: T|undefined;

  getWrapped() {
    return this.#value;
  }

  setWrapped(value: T) {
    this.#value = value;
  }
}

const supportWrapper: Customizer = (value) => {
  if (!(value instanceof Wrapper)) {
    return;
  }

  type Wrapped = ReturnType<typeof value['getWrapped']>;

  const clone = new Wrapper<Wrapped>();

  const assigner = (wrappedValue: Wrapped) => {
    clone.setWrapped(wrappedValue);
  };

  return {
    clone,
    additionalValues: [{
      value: value.getWrapped(),
      assigner
    }]
  };
};

const wrapper = new Wrapper<{ foo: string }>();
wrapper.setWrapped({ foo: 'bar' });

const clone = cloneDeep({ baz: wrapper }, {
  customizer: supportWrapper
});
console.log(clone.baz.getWrapped())
//  {foo: 'bar'}
```

</details>

A use case you might need is to clone functions. While it is possible to truly clone a function, the following customizer comes extremely close:

<details>
<summary>js</summary>

```javascript
const supportFunctions = (value) => {
  if (typeof value !== 'function') {
    return;
  }

  const clonedFunction = function(...args) {
    return value.apply(this, args);
  }

  return {
    clone: clonedFunction
  };
};

const func = cloneDeep(() => 'hi', {
  customizer: supportFunctions
});
console.log(func); // 'hi'
```
  
</details>



<details>
<summary>ts</summary>

```typescript
const supportFunctions: Customizer = (value) => {
  if (typeof value !== 'function') {
    return;
  }

  const clonedFunction = function(this: any, ...args: any[]) {
    return (value as Function).apply(this, args);
  }

  return {
    clone: clonedFunction
  };
};

const func = cloneDeep(() => 'hi', {
  customizer: supportFunctions
});
console.log(func); // 'hi'
```

</details>

There are some limitations of this approach to cloning functions:

  1. The cloned function adds an additional layer to the call stack.
  2. The name associated with the original function will not be given to the clone.
  3. Cloning a cloned function adds an additional redundant layer to the call stack. 

The first point is impossible to avoid, but the latter two points can be resolved; it is good exercise to experiment for yourself to see how you can do so.
