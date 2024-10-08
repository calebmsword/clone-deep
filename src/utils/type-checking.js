import { Tag, WebApis } from './constants.js';
import { castAsInstanceOf, getConstructorFromString } from './helpers.js';
import { getDescriptors, getPrototype } from './metadata.js';

const { toString } = Object.prototype;

/**
 * Gets the tag using `Object.prototype.toString`.
 * Since we cache the lookup for `Object.prototype.toString` in the
 * implementation of this function, this is slightly more performant than
 * calling `Object.prototype.toString.call` explicitly.
 * @param {any} value
 * @returns {string}
 */
export const toStringTag = (value) => {
    return toString.call(value);
};

/**
 * Determines whether a particular property is read-only.
 * @param {any} value
 * Any object.
 * @param {string|symbol} property
 * The property on the object whose mutability will be checked.
 * A function which modifies the value assigned to that property.
 */
export const isReadOnly = (value, property) => {
    try {
        const original = value[property];
        value[property] = value[property] + 1;
        const final = value[property];

        value[property] = original;
        return final !== original + 1;
    } catch {
        // The web specification does not determine whether an implementation
        // should throw if reassignment of a readonly property of a web api
        // is performed; hence we use a try-catch to catch runtimes which will
        // throw.
        return true;
    }
};

/**
 * Whether the provided value can be called as a function.
 * @param {any} value
 * @returns {boolean}
 */
export const isCallable = (value) => {
    return typeof value === 'function';
};

/**
 * A factory which creates type checkers for readonly geometry (sub)classes.
 * @param {string} webApiString
 * The name of an immutable geometry subclass.
 * @param {string|symbol|{ name: string|symbol }} methodOrProp
 * If a primitive, then the name of a method on the immutable geometry subclass.
 * If an object, it should be a hash with a single property `"name"` that
 * refers to a non-method property on the instance.
 * @param {string|symbol} property
 * An instance property.
 * @returns {{ [method: string]: (value: any) => boolean }}
 */
export const getGeometryCheckers = (webApiString, methodOrProp, property) => {

    /** @type {Map<any, boolean>} */
    const registry = new Map();

    /**
     * @param {any} value
     * @returns {boolean}
     */
    const isSubclass = (value) => {
        const PotentialWebApi = getConstructorFromString(webApiString);
        if (typeof PotentialWebApi !== 'function') {
            return false;
        }

        if (registry.has(value)) {
            const result = registry.get(value);
            if (typeof result === 'boolean') {
                return result;
            }
        }

        const descriptors = getDescriptors(getPrototype(new PotentialWebApi()));

        /** @type {boolean} */
        let result;

        try {
            if (typeof methodOrProp === 'object') {
                descriptors[methodOrProp.name].get?.call(value);
            } else {
                PotentialWebApi?.prototype[methodOrProp].call(value);
            }
            result = true;
        } catch {
            result = false;
        }

        registry.set(value, result);
        return result;
    };

    /** @type {(value?: any) => boolean} */
    const isMutable = typeof methodOrProp === 'object'
        ? (value) => {
            return !isReadOnly(value, methodOrProp.name);
        }
        : (value) => {
            return !isReadOnly(value, property);
        };


    /** @type {(value: any) => boolean} */
    const isImmutableType = (value) => {
        return isSubclass(value) && !isMutable(value);
    };

    /** @type {(value: any) => boolean} */
    const isMutableType = (value) => {
        return isSubclass(value) && isMutable(value);
    };

    const immutableClassName = webApiString;
    const mutableClassName = webApiString.substring(0, webApiString.length - 8);

    return {
        [`is${immutableClassName}`]: isImmutableType,
        [`is${mutableClassName}`]: isMutableType
    };
};

export const {
    isDOMMatrixReadOnly,
    isDOMMatrix
} = getGeometryCheckers(WebApis.DOMMatrixReadOnly, 'scale', 'm11');

export const {
    isDOMPointReadOnly,
    isDOMPoint
} = getGeometryCheckers(WebApis.DOMPointReadOnly, 'toJSON', 'x');

export const {
    isDOMRectReadOnly,
    isDOMRect
} = getGeometryCheckers(WebApis.DOMRectReadOnly, { name: 'x' }, 'x');

/**
 * Returns `true` if the given value is a File instance, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
export const isFile = (value) => {
    try {
        getDescriptors(File.prototype).lastModified.get?.call(value);
        return true;
    } catch {
        return false;
    }
};

/**
 * Returns `true` if the given value is an ImageBitmap, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
export const isImageBitmap = (value) => {
    try {
        getDescriptors(ImageBitmap.prototype).height.get?.call(value);
        return true;
    } catch {
        return false;
    }
};

/**
 * Returns `true` if the given value is an ImageBitmap, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
export const isImageData = (value) => {
    try {
        getDescriptors(ImageData.prototype).width.get?.call(value);
        return true;
    } catch {
        return false;
    }
};

/**
 * Returns `true` if the given value is a DOMException, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
export const isDOMException = (value) => {
    try {
        const domException = castAsInstanceOf(value, DOMException);
        if (!domException) {
            return false;
        }
        getDescriptors(DOMException.prototype).code.get?.call(domException);
        return true;
    } catch {
        return false;
    }
};

/**
 * Whether the provided value is iterable.
 * See https://stackoverflow.com/a/32538867/22334683.
 * @param {any} value
 * The value whose iterability will be checked.
 * @returns {boolean}
 */
export const isIterable = (value) => {
    if (value === null || value === undefined) {
        return false;
    }
    return typeof value[Symbol.iterator] === 'function';
};

const typedArrayTags = Object.freeze([
    Tag.FLOAT32,
    Tag.FLOAT64,
    Tag.INT8,
    Tag.INT16,
    Tag.INT32,
    Tag.UINT8,
    Tag.UINT8CLAMPED,
    Tag.UINT16,
    Tag.UINT32,
    Tag.BIGINT64,
    Tag.BIGUINT64
]);

/**
 * Returns `true` if given value is a TypedArray instance, `false` otherwise.
 * @param {string} value
 * Any arbitrary value
 * @param {string} tag
 * The tag for the value.
 * @param {import('../clone-deep/clone-deep-utils/types').PerformanceConfig} [performanceConfig]
 * Whether type-checking should be done performantly.
 * @returns {boolean}
 */
export const isTypedArray = (value, tag, performanceConfig) => {
    if (performanceConfig?.robustTypeChecking !== true) {
        return typedArrayTags.includes(tag);
    }

    try {
        getPrototype(getPrototype(
            new Float32Array(new ArrayBuffer(0))))?.lastIndexOf.call(value);
        return true;
    } catch {
        return false;
    }
};

/**
 * Returns `true` if given value is a Buffer instance, `false` otherwise.
 * @param {any} value
 * @param {{ [key: string]: (new (...args: any[]) => any)|undefined}} supportedConstructors
 * @returns {boolean}
 */
export const isBuffer = (value, supportedConstructors) => {
    const NodeBuffer = supportedConstructors['Buffer'];
    return NodeBuffer !== undefined && value instanceof NodeBuffer;
};

/**
 * Returns true if the provided value is an object, false otherwise.
 * @param {any} value
 * @returns {boolean}
 */
export const isObject = (value) => {
    return value !== null && ['object', 'function'].includes(typeof value);
};

/**
 * @param {any} value
 * @returns {boolean}
 */
const isStringOrSymbol = (value) => {
    return ['string', 'symbol'].includes(typeof value);
};

/**
 * Returns true if the provided value is an array of strings or symbols.
 * @param {any} value
 * @returns {boolean}
 */
export const isPropertyKeyArray = (value) => {
    if (!Array.isArray(value)) {
        return false;
    }
    return value.every(isStringOrSymbol);
};
