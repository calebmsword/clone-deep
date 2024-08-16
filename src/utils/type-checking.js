import { Tag, WebApi } from './constants.js';
import { getConstructorFromString } from './helpers.js';
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
        if (!isCallable(PotentialWebApi)) {
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
                PotentialWebApi.prototype[methodOrProp].call(value);
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
} = getGeometryCheckers(WebApi.DOMMatrixReadOnly, 'scale', 'm11');

export const {
    isDOMPointReadOnly,
    isDOMPoint
} = getGeometryCheckers(WebApi.DOMPointReadOnly, 'toJSON', 'x');

export const {
    isDOMRectReadOnly,
    isDOMRect
} = getGeometryCheckers(WebApi.DOMRectReadOnly, { name: 'x' }, 'x');

const lastModifiedGetter = getDescriptors(File.prototype).lastModified.get;

/**
 * Returns `true` if the given value is a File instance, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
export const isFile = (value) => {
    if (!(value instanceof File)) {
        return false;
    }
    try {
        lastModifiedGetter?.call(value);
        return true;
    } catch {
        return false;
    }
};

/** @typedef {new (...args: any[]) => any} Constructor */

/** @typedef {BigIntConstructor|SymbolConstructor|Constructor} ClassesToTypeCheckConstructor */

/**
 * Convenience array used for `getTag`.
 * @type {Array<[ClassesToTypeCheckConstructor|string, string, string, ...any]>}
 */
const classesToTypeCheck = [
    // "standard" classes
    ['ArrayBuffer', 'slice', Tag.ARRAYBUFFER],
    ['BigInt', 'valueOf', Tag.BIGINT],
    [Boolean, 'valueOf', Tag.BOOLEAN],
    [Date, 'getUTCMilliseconds', Tag.DATE],
    [Function, 'bind', Tag.FUNCTION],
    [Map, 'has', Tag.MAP],
    [Number, 'valueOf', Tag.NUMBER],
    ['Promise', 'then', Tag.PROMISE],
    [RegExp, 'exec', Tag.REGEXP],
    ['Set', 'has', Tag.SET],
    [String, 'valueOf', Tag.STRING],
    ['Symbol', 'valueOf', Tag.SYMBOL],
    ['WeakMap', 'has', Tag.WEAKMAP],
    ['WeakSet', 'has', Tag.WEAKSET],

    // ArrayBuffer, DataView and TypedArrays
    ['DataView', 'getInt8', Tag.DATAVIEW],

    // Web APIs
    ['Blob', 'clone', Tag.BLOB],
    ['DOMQuad', 'toJSON', Tag.DOMQUAD],
    ['FileList', 'item', Tag.FILELIST, 0]
];

/**
 * Convenience array used for `getTag`.
 * Certain classes that require special handling to type check are handled here.
 * @type {Array<[(value: any) => boolean, string]>}
 */
const typeCheckers = [
    [isDOMMatrix, Tag.DOMMATRIX],
    [isDOMMatrixReadOnly, Tag.DOMMATRIXREADONLY],
    [isDOMPoint, Tag.DOMPOINT],
    [isDOMPointReadOnly, Tag.DOMPOINTREADONLY],
    [isDOMRect, Tag.DOMRECT],
    [isDOMRectReadOnly, Tag.DOMRECTREADONLY],
    [isFile, Tag.FILE]
];

/**
 * Gets a "tag", which is an string which identifies the type of a value.
 *
 * `Object.prototype.toString` returns a string like `"[object <Type>]"`,  where
 * `"<Type>"` is the type of the object. We refer this return value as the
 * **tag**. Normally, the tag is determined by what `this[Symbol.toStringTag]`
 * is, but the JavaScript specification for `Object.prototype.toString` requires
 * that many native JavaScript objects return a specific tag if the object does
 * not have the `Symbol.toStringTag` property. Also, classes introduced after
 * ES6 typically have their own non-writable `Symbol.toStringTag` property. This
 * makes `Object.prototype.toString.call` a stronger type-check that
 * `instanceof`.
 *
 * @example
 * ```
 * const array = new Array();
 *
 * console.log(array instanceof Array);
 * // true
 *
 * console.log(Object.prototype.toString.call(array));
 * // "[object Array]"
 *
 *
 * const arraySubclass = Object.create(Array.prototype);
 *
 * console.log(arraySubclass instance Array);
 * // true;
 *
 * console.log(Object.prototype.toString.call(arraySubclass));
 * // "[object Object]"
 *
 *
 * // Note this is not a perfect type check because we can do:
 * arraySubclass[Symbol.toStringTag] = "Array"
 * console.log(Object.prototype.toString.call(arraySubclass));
 * // "[object Array]"
 * ```
 *
 * However, most native classes will throw if their prototype methods are called
 * on an object that wasn't called with the appropriate constructor function.
 * This can be used as a stronger type check than
 * `Object.prototype.toString.call` on classes where this is applicable.
 *
 * @example
 * ```
 * const isMap = value => {
 *     try {
 *         Map.prototype.has.call(value);
 *         return true;
 *     }
 *     catch {
 *         return false;
 *     }
 * }
 *
 * console.log(isMap(new Map()));
 * // true
 *
 * console.log(isMap(Object.create(Map.prototype)));
 * // false
 *
 * console.log(isMap({ [Symbol.toStringTag]: "Map" }));
 * // false
 * ```
 *
 * Some classes don't have any native instances, but instead have properties
 * with get/set accessors. These accessors typically throw if bound to incorrect
 * instances so we can use a nearly equivalent technique for them.
 *
 * Currently, only Array, CryptoKey, Error subclasses, DOMException, and
 * TypedArray subclasses are having their tag retrieved from
 * `Object.prototype.toString.call`. (This is not an issue for Arrays since
 * Array.isArray is the best check for arrays anyway.) All other classes are
 * checked by binding the given value to the appropriate prototype method or
 * accessor function. No matter which method is used, we return the tag
 * associated with the detected class.
 *
 * Since calling prototype methods can be expensive, it is possible to call this
 * function is such a way that `Object.prototype.toString.call` is solely used
 * to determine tags using the `prioritizePerformance` parameter.
 *
 * @param {any} value
 * The value to get the tag of.
 * @param {boolean} prioritizePerformance
 * Whether type-checking should be done performantly.
 * @returns {string} tag
 * A string indicating the value's type.
 */
export const getTag = (value, prioritizePerformance) => {

    if (prioritizePerformance) {
        return toStringTag(value);
    }

    /** @type {undefined|string} */
    let result;

    classesToTypeCheck.some(([constructor, method, tag, ...args]) => {
        if (typeof constructor === 'string') {
            constructor = getConstructorFromString(constructor);
        }

        if (constructor === undefined || !(value instanceof constructor)) {
            return false; // continue iterating
        }

        try {
            constructor.prototype[method].call(value, ...args);
            result = tag;
            return true; // stop iterating
        } catch {
            return false; // continue iterating
        }
    });

    if (result === undefined) {
        typeCheckers.some(([typeChecker, tag]) => {
            if (typeChecker(value)) {
                result = tag;
                return true; // stop iterating
            }
            return false; // continue iterating
        });
    }

    return result || toStringTag(value);
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

const TypedArrayProto = getPrototype(getPrototype(
    new Float32Array(new ArrayBuffer(0))));

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
 * @param {boolean} prioritizePerformance
 * Whether type-checking should be done performantly.
 * @param {string} tag
 * The tag for the value.
 * @returns {boolean}
 */
export const isTypedArray = (value, prioritizePerformance, tag) => {
    if (prioritizePerformance) {
        return typedArrayTags.includes(tag);
    }

    try {
        TypedArrayProto.lastIndexOf.call(value);
        return true;
    } catch {
        return false;
    }
};

/**
 * Returns true if the provided value is an object, false otherwise.
 * @param {any} value
 * @returns {boolean}
 */
export const isObject = (value) => {
    return value !== null && ['object', 'function'].includes(typeof value);
};
