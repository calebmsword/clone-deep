import { Tag } from "./constants.js";
import { getDescriptors, getPrototype } from "./misc.js";

/**
 * Determines whether a particular property is read-only.
 * @param {any} value 
 * Any object.
 * @param {string|symbol} property 
 * The property on the object whose mutability will be checked.
 * A function which modifies the value assigned to that property.
 */
export function isReadOnly(value, property) {
    try {
        const original = value[property];
        value[property] = value[property] + 1;
        const final = value[property];

        value[property] = original;
        return final !== original + 1;
    }
    catch {
        // The web specification does not determine whether an implementation 
        // should throw if reassignment of a readonly property of a web api 
        // is performed; hence we use a try-catch to catch runtimes which will 
        // throw.
        return true;
    }
}

/**
 * A factory which creates type checkers for readonly geometry (sub)classes.
 * @param {any} Class 
 * An immutable geometry subclass (DOMMatrixReadOnly, DOMRectReadOnly, etc).
 * @param {string|symbol|{ name: string|symbol }} methodOrProp 
 * If a primitive, then the name of a method on the immutable geometry subclass.
 * If an object, it should be a hash with a single property `"name"` that 
 * refers to a non-method property on the instance. 
 * @param {string|symbol} property
 * An instance property.
 * @returns {{ [method: string]: (value: any) => boolean }}
 */
function getGeometryCheckers(Class, methodOrProp, property) {

    /** @type {Map<any, boolean>} */
    const registry = new Map;
    
    const descriptors = getDescriptors(getPrototype(new Class));

    /**
     * @param {any} value 
     * @returns {boolean}
     */
    function isSubclass(value) {
        if (registry.has(value)) {
            const result = registry.get(value);
            if (typeof result === "boolean") return result;
        }

        /** @type {boolean} */
        let result;

        try {
            if (typeof methodOrProp === "object") {
                descriptors[methodOrProp.name].get?.call(value);
            }
            else {
                Class.prototype[methodOrProp].call(value);
            }
            result = true;
        }
        catch {
            result = false;
        }

        registry.set(value, result);
        return result;
    }

    /** @type {(value?: any) => boolean} */
    const isMutable = typeof methodOrProp === "object"
        ? value => !isReadOnly(value, methodOrProp.name)
        : value => !isReadOnly(value, property);


    /** @type {(value: any) => boolean} */
    function isImmutableType(value) {
        return isSubclass(value) && !isMutable(value);
    }

    /** @type {(value: any) => boolean} */
    function isMutableType(value) {
        return isSubclass(value) && isMutable(value);
    }

    const immutableClassName = Class.name;
    const mutableClassName = immutableClassName.substring(
        0, immutableClassName.length - 8);

    return {
        [`is${immutableClassName}`]: isImmutableType,
        [`is${mutableClassName}`]: isMutableType
    };
}

export const {
    isDOMMatrixReadOnly,
    isDOMMatrix
} = getGeometryCheckers(DOMMatrixReadOnly, "scale", "m11");

export const {
    isDOMPointReadOnly,
    isDOMPoint
} = getGeometryCheckers(DOMPointReadOnly, "toJSON", "x");

export const {
    isDOMRectReadOnly,
    isDOMRect
} = getGeometryCheckers(DOMRectReadOnly, { name: "x" }, "x");

const lastModifiedGetter = 
    Object.getOwnPropertyDescriptors(File.prototype).lastModified.get;

/**
 * Returns `true` if the given value is a File instance, `false` otherwise.
 * @param {any} value 
 * @returns {boolean}
 */
export function isFile(value) {
    if (!(value instanceof File)) return false;
    try {
        lastModifiedGetter?.call(value);
        return true;
    }
    catch {
        return false;
    }
}

/** 
 * Convenience array used for `getTag`.
 * @type {Array<[any, string, string, ...any]>} 
 */
const classesToTypeCheck = [
    // "standard" classes
    [ArrayBuffer, "slice", Tag.ARRAYBUFFER],
    [BigInt, "valueOf", Tag.BIGINT],
    [Boolean, "valueOf", Tag.BOOLEAN],
    [Date, "getUTCMilliseconds", Tag.DATE],
    [Function, "bind", Tag.FUNCTION],
    [Map, "has", Tag.MAP],
    [Number, "valueOf", Tag.NUMBER],
    [Promise, "then", Tag.PROMISE],
    [RegExp, "exec", Tag.REGEXP],
    [Set, "has", Tag.SET],
    [String, "valueOf", Tag.STRING],
    [Symbol, "valueOf", Tag.SYMBOL],
    [WeakMap, "has", Tag.WEAKMAP],
    [WeakSet, "has", Tag.WEAKSET],

    // ArrayBuffer, DataView and TypedArrays
    [DataView, "getInt8", Tag.DATAVIEW],

    // Web APIs
    [Blob, "clone", Tag.BLOB],
    [DOMQuad, "toJSON", Tag.DOMQUAD],
    [FileList, "item", Tag.FILELIST, 0]
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
 * console.log(array instanceof Array);  // true
 * console.log(Object.prototype.toString.call(array));  // "[object Array]"
 * 
 * const arraySubclass = Object.create(Array.prototype);
 * console.log(arraySubclass instance Array);  // true;
 * console.log(Object.prototype.toString.call(arraySubclass));  // "[object Object]"
 * 
 * // Note this is not a perfect type check because we can do:
 * arraySubclass[Symbol.toStringTag] = "Array"
 * console.log(Object.prototype.toString.call(arraySubclass));  // "[object Array]"
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
 * console.log(isMap(new Map()));   // true
 * console.log(isMap(Object.create(Map.prototype)));  // false
 * console.log(isMap({ [Symbol.toStringTag]: "Map" }));  // false
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
export function getTag(value, prioritizePerformance) {

    if (prioritizePerformance) return Object.prototype.toString.call(value);

    /** @type {undefined|string} */
    let result;

    classesToTypeCheck.some(([Class, method, tag, ...args]) => {
        if (!(value instanceof Class)) return;
        try {
            Class.prototype[method].call(value, ...args);
            result = tag;
            return true; // stop iterating
        }
        catch {/*carry on*/}
    });

    if (result === undefined) {
        typeCheckers.some(([typeChecker, tag]) => {
            if (typeChecker(value)) {
                result = tag;
                return true; // stop iterating
            }
        });
    }

    return result || Object.prototype.toString.call(value);
}

/**
 * Whether the provided value is iterable.
 * See https://stackoverflow.com/a/32538867/22334683.
 * @param {any} value 
 * The value whose iterability will be checked.
 * @returns {boolean}
 */
export function isIterable(value) {
    if (value === null || value === undefined ) return false;
    return typeof value[Symbol.iterator] === "function";
}

const TypedArrayProto = getPrototype(getPrototype((
    new Float32Array(new ArrayBuffer(0)))));

const typedArrayTags = Object.freeze([
    "[object Float32Array]",
    "[object Float64Array]",
    "[object Int8Array]",
    "[object Int16Array]",
    "[object Int32Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Uint16Array]",
    "[object Uint32Array]",
    "[object BigInt64Array]",
    "[object BigUint64Array]",
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
export function isTypedArray(value, prioritizePerformance, tag) {
    if (prioritizePerformance) return typedArrayTags.includes(tag);

    try {
        TypedArrayProto.lastIndexOf.call(value);
        return true;
    }
    catch(_) {
        return false;
    }
}