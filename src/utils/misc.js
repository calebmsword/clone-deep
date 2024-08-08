import { Tag } from "./constants.js";
import { getWarning } from "./clone-deep-warning.js";

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
 * Gets the appropriate TypedArray constructor for the given object tag.
 * @param {string} tag
 * The tag for the object.
 * @param {import("../../public-types").Log} log
 * A logging function.
 * @returns {import("../../private-types").TypedArrayConstructor}
 */
export function getTypedArrayConstructor(tag, log) {
    switch (tag) {
        case Tag.DATAVIEW:
            return DataView;
        case Tag.FLOAT32:
            return Float32Array;
        case Tag.FLOAT64:
            return Float64Array;
        case Tag.INT8:
            return Int8Array;
        case Tag.INT16:
            return Int16Array;
        case Tag.INT32:
            return Int32Array;
        case Tag.UINT8:
            return Uint8Array;
        case Tag.UINT8CLAMPED:
            return Uint8ClampedArray;
        case Tag.UINT16:
            return Uint16Array;
        case Tag.UINT32:
            return Uint32Array;
        case Tag.BIGINT64:
            return BigInt64Array;
        case Tag.BIGUINT64:
            return BigUint64Array;
        default:
            log(getWarning("Unrecognized TypedArray subclass. This object " + 
                           "will be cloned into a DataView instance."));
            return DataView;
    }
}

/**
 * Gets the appropriate error constructor for the error name.
 * @param {Error} value
 * The object itself. This is necessary to correctly find constructors for 
 * various Error subclasses.
 * @param {(error: Error) => any} [log]
 * An optional logging function.
 * @returns {import("../../private-types").AtomicErrorConstructor}
 */
export function getAtomicErrorConstructor(value, log) {
    const name = value.name;
    switch (name) {
        case "Error":
            return Error;
        case "EvalError":
            return EvalError;
        case "RangeError":
            return RangeError;
        case "ReferenceError":
            return ReferenceError;
        case "SyntaxError":
            return SyntaxError;
        case "TypeError":
            return TypeError;
        case "URIError":
            return URIError;
        default:
            if (log !== undefined)
                log(getWarning("Cloning error with unrecognized name " + 
                                `${name}! It will be cloned into an ` + 
                                "ordinary Error object."))
            return Error;
    }
}

/**
 * Creates a FileList.
 * See https://github.com/fisker/create-file-list.
 * @param  {...File} files 
 * @returns {FileList}
 */
export function createFileList(...files) {
    const dataTransfer = new DataTransfer;

    for (const file of files) dataTransfer.items.add(file);

    return dataTransfer.files;
}

/**
 * Returns a deep clone of the given File.
 * @param {File} file 
 * @returns {File}
 */
export function cloneFile(file) {
    return new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
    });
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
