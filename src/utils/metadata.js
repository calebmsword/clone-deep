/**
 * Gets the prototype of the provided object.
 * @param {any} value
 * @returns {any}
 */
export function getPrototype(value) {
    return Object.getPrototypeOf(value);
}

/**
 * Retrieves the property descriptors of the provided object.
 * The result is a hash which maps properties to their property descriptor.
 * @param {any} value 
 * @returns {{ [property: string|symbol]: PropertyDescriptor }}
 */
export function getDescriptors(value) {
    return Object.getOwnPropertyDescriptors(value);
}

/**
 * Whether the provided property descriptor is the default value.
 * @param {PropertyDescriptor} [descriptor] 
 * @returns {boolean}
 */
export function isDefaultDescriptor(descriptor) {
    return typeof descriptor === "object"
           &&descriptor.configurable === true
           && descriptor.enumerable === true
           && descriptor.writable === true;
}

/**
 * Whether the property descriptor is for a property with getter and/or setter.
 * @param {PropertyDescriptor} [metadata]
 * @returns {boolean}
 */
export function hasAccessor(metadata) {
    return typeof metadata === "object" 
           && (typeof metadata.get === "function"
               || typeof metadata.set === "function");
}

/**
 * Returns an array of all properties in the object.
 * This includes symbols and non-enumerable properties. `undefined` or `null` 
 * returns an empty array.
 * @param {Object} o An object.
 * @returns {(string|symbol)[]} An array of property names.
 */
 function getAllPropertiesOf(o) {
    return [Object.getOwnPropertyNames(o), Object.getOwnPropertySymbols(o)]
        .flat();
}

/**
 * Is true if the provided object has methods. Is false otherwise.
 * @param {any} o An object
 * @returns {Boolean}
 */
export function hasMethods(o) {
    // We cannot access some properties of Function.prototype in strict mode
    if (o === Function.prototype) return true;
    return getAllPropertiesOf(o).some(key => typeof o[key] === "function");
}

/**
 * Iterate the provided callback on every property of the given object.
 * This includes symbols and non-enumerable properties. This does not include 
 * properties in the prototype chain.
 * This is more performant than using {@link getAllPropertiesOf}.
 * @param {any} object
 * @param {(key: string|symbol) => void} propertyCallback 
 */
export function forAllOwnProperties(object, propertyCallback) {
    [Object.getOwnPropertyNames(object), Object.getOwnPropertySymbols(object)]
        .forEach(array => {
            array.forEach(propertyCallback);
        });
}
