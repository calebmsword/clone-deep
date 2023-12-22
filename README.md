# clone-deep
A utility for deeply cloning JavaScript objects.

```javascript
import cloneDeep from "./clone-deep.js";

const object = [{ foo: "bar" }, { baz: { spam: "eggs" } }];
const cloned = cloneDeep(object);

cloned.forEach(console.log);
// {foo: 'bar'}
// {baz: {spam: 'eggs'}}

console.log(cloned === object);  // false
console.log(cloned[0] === object[0]);  // false
console.log(cloned[1] === object[1]);  // false
```

### What can and cannot be cloned

Functions cannot be reliably cloned in JavaScript. Functions which do not access data in their closures can be cloned, but there is no way for an algorithm to know if a function accesses its closure. It is also not possible to clone methods on native JavaScript prototypes. `WeakMap` and `WeakSet` instances also cannot be cloned.

Most objects have `Object.prototype` in their prototype chain, but `Object.prototype` has functions so it cannot be cloned. In the vast majority of use cases, it is not possible to clone the prototype chain. Instead, it makes more sense to have the cloned object share the prototype of the original function.

### clone-deep vs structuredClone

JavaScript has a native function `structuredClone` which deeply clones object, but there are use cases where my algorithm is preferable. Here are the differences between `structuredClone` and `cloneDeep`:
 - `structuredClone` cannot clone objects which have symbols or properties that are symbols. `cloneDeep` can.
 - 
