/**
 * Gets the prototype of the provided object.
 * @param {any} value
 * @returns {any}
 */
export const getPrototype = (value) => {
    return Object.getPrototypeOf(value);
};

/**
 * Retrieves the property descriptors of the provided object.
 * The result is a hash which maps properties to their property descriptor.
 * @param {any} value
 * @returns {{ [property: string|symbol]: PropertyDescriptor }}
 */
export const getDescriptors = (value) => {
    return Object.getOwnPropertyDescriptors(value);
};

/**
 * Whether the provided property descriptor is the default value.
 * @param {PropertyDescriptor} [descriptor]
 * @returns {boolean}
 */
export const isDefaultDescriptor = (descriptor) => {
    return typeof descriptor === 'object'
           && descriptor.configurable === true
           && descriptor.enumerable === true
           && descriptor.writable === true;
};

/**
 * Whether the property descriptor is for a property with getter and/or setter.
 * @param {PropertyDescriptor} [metadata]
 * @returns {boolean}
 */
export const hasAccessor = (metadata) => {
    return typeof metadata === 'object'
           && (typeof metadata.get === 'function'
               || typeof metadata.set === 'function');
};

/**
 * Returns an array of all properties in the object.
 * This includes symbols and non-enumerable properties. `undefined` or `null`
 * returns an empty array.
 * @param {Object} object An object.
 * @returns {(string|symbol)[]} An array of property names.
 */
export const getAllPropertiesOf = (object) => {
    return [
        Object.getOwnPropertyNames(object),
        Object.getOwnPropertySymbols(object)
    ].flat();
};

/**
 * Is true if the provided object has methods. Is false otherwise.
 * @param {any} object An object
 * @returns {Boolean}
 */
export const hasMethods = (object) => {
    // We cannot access some properties of Function.prototype in strict mode
    if (object === Function.prototype) {
        return true;
    }
    return getAllPropertiesOf(object).some((key) => {
        return typeof object[key] === 'function';
    });
};

/**
 * Iterate the provided callback on every owned property of the given object.
 * This includes symbols and non-enumerable properties but not properties from
 * the prototype chain.
 * This is more performant than using {@link getAllPropertiesOf}.
 * @param {any} object
 * @param {(key: string|symbol) => void} propertyCallback
 */
export const forAllOwnProperties = (object, propertyCallback) => {
    [Object.getOwnPropertyNames(object), Object.getOwnPropertySymbols(object)]
        .forEach((array) => {
            array.forEach(propertyCallback);
        });
};
