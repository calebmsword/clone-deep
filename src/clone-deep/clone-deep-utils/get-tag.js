import { Tag } from '../../utils/constants.js';
import { getConstructorFromString } from '../../utils/helpers.js';
import {
    isDOMMatrix,
    isDOMMatrixReadOnly,
    isDOMPoint,
    isDOMPointReadOnly,
    isDOMRect,
    isDOMRectReadOnly,
    isFile,
    isImageBitmap,
    isImageData,
    toStringTag
} from '../../utils/type-checking.js';

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
    ['AudioData', 'allocationSize', Tag.AUDIODATA],
    ['Blob', 'clone', Tag.BLOB],
    ['DOMQuad', 'toJSON', Tag.DOMQUAD],
    ['FileList', 'item', Tag.FILELIST, 0],
    ['VideoData', 'allocationSize', Tag.VIDEODATA, 0]
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
    [isFile, Tag.FILE],
    [isImageBitmap, Tag.IMAGEBITMAP],
    [isImageData, Tag.IMAGEDATA]
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
