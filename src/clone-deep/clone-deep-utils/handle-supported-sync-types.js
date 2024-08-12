/* eslint-disable complexity -- We support > 10 types, so we are guaranteed to
exceed a complexity of 10. I don't see any reason to separate this function
further. */

import { TOP_LEVEL } from './assign.js';
import { getWarning, Warning } from '../../utils/clone-deep-warning.js';
import { CLONE, Tag } from '../../utils/constants.js';
import {
    cloneFile,
    createFileList,
    getAtomicErrorConstructor,
    getTypedArrayConstructor
} from '../../utils/helpers.js';
import {
    forAllOwnProperties,
    getPrototype,
    hasAccessor
} from '../../utils/metadata.js';
import { isIterable, isTypedArray } from '../../utils/type-checking.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {any} value
 * @param {symbol|object|Assigner|undefined} parentOrAssigner
 * @param {string|symbol|undefined} prop
 * @param {string} tag
 * @param {boolean} prioritizePerformance
 * @param {import('../../types').SyncQueueItem[]} syncQueue
 * @param {[any, any][]} isExtensibleSealFrozen
 * @param {any[]} supportedPrototypes
 * @param {boolean} ignoreCloningMethods
 * @param {boolean} ignoreCloningMethodsThisLoop
 * @param {(string|symbol)[]} propsToIgnore
 * @param {import('../../types').Log} log
 * @param {(clone: any) => any} saveClone
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     syncTypeDetected: boolean
 * }}
 */
export const handleSupportedSyncTypes = (value,
                                         parentOrAssigner,
                                         prop,
                                         tag,
                                         prioritizePerformance,
                                         syncQueue,
                                         isExtensibleSealFrozen,
                                         supportedPrototypes,
                                         ignoreCloningMethods,
                                         ignoreCloningMethodsThisLoop,
                                         propsToIgnore,
                                         log,
                                         saveClone) => {

    /** @type {any} */
    let cloned;

    let ignoreProps = false;

    let ignoreProto = false;

    let syncTypeDetected = true;

    // If value is primitive, just assign it directly.
    if (value === null || !['object', 'function'].includes(typeof value)) {
        saveClone(value);

    // We won't clone weakmaps or weaksets (or their prototypes).
    } else if ([Tag.WEAKMAP, Tag.WEAKSET].includes(tag)) {
        throw tag === Tag.WEAKMAP ? Warning.WEAKMAP : Warning.WEAKSET;

    // If object defines its own means of getting cloned, use it
    } else if (typeof value[CLONE] === 'function'
            && ignoreCloningMethods !== true
            && ignoreCloningMethodsThisLoop === false) {

        /** @type {import("../../utils/types.js").CloneMethodResult<any>} */
        const result = value[CLONE]();

        if (result.propsToIgnore !== undefined) {
            if (Array.isArray(result.propsToIgnore)
                && result
                    .propsToIgnore
                    .every(
                        /** @param {any} string */
                        (string) => {
                            return ['string', 'symbol']
                                .includes(typeof string);
                        })) {
                propsToIgnore.push(...result.propsToIgnore);
            } else {
                log(getWarning(
                    'return value of CLONE method is an object whose ' +
                'propsToIgnore property, if not undefined, is ' +
                'expected to be an array of strings or symbols. The ' +
                'given result is not this type of array so it will ' +
                'have no effect.'));
            }
        }
        if (typeof result.ignoreProps === 'boolean') {
            ({ ignoreProps } = result);
        }

        if (typeof result.ignoreProto === 'boolean') {
            ({ ignoreProto } = result);
        }

        cloned = saveClone(result.clone);

    // Ordinary objects, or the rare `arguments` clone.
    // Also, treat prototypes like ordinary objects. The tag wrongly
    // indicates that prototypes are instances of themselves.
    } else if ([Tag.OBJECT, Tag.ARGUMENTS].includes(tag)
            || supportedPrototypes.includes(value)) {
        cloned = saveClone(Object.create(getPrototype(value)));

    // We only copy functions if they are methods.
    } else if (typeof value === 'function') {
        cloned = saveClone(parentOrAssigner !== TOP_LEVEL
            ? value
            : Object.create(Function.prototype));
        log(getWarning(
            `Attempted to clone function` +
            `${typeof prop === 'string'
                ? ` with name ${prop}`
                : ''}. JavaScript functions cannot be reliably ` +
            'cloned. If this function is a method, it will be copied ' +
            'directly. If this is the top-level object being cloned, ' +
            'then an empty object will be returned.'));
        [ignoreProps, ignoreProto] = [true, true];

    } else if (Array.isArray(value)) {
        cloned = saveClone(new Array(value.length));

    } else if ([Tag.BOOLEAN, Tag.DATE].includes(tag)) {
        /** @type {BooleanConstructor|DateConstructor} */
        const BooleanOrDateConstructor = tag === Tag.DATE
            ? Date
            : Boolean;

        cloned = saveClone(new BooleanOrDateConstructor(Number(value)));

    } else if ([Tag.NUMBER, Tag.STRING].includes(tag)) {
        /** @type {NumberConstructor|StringConstructor} */
        const NumberOrStringConstructor = tag === Tag.NUMBER
            ? Number
            : String;

        cloned = saveClone(new NumberOrStringConstructor(value));

    // `typeof Object(Symbol("foo"))` is `"object"
    } else if (Tag.SYMBOL === tag) {
        /** @type {Symbol} */
        const symbol = value;

        cloned = saveClone(
            Object(Symbol.prototype.valueOf.call(symbol)));

    // `typeof Object(BigInt(3))` is `"object"
    } else if (Tag.BIGINT === tag) {
        /** @type {BigInt} */
        const bigint = value;

        cloned = saveClone(
            Object(BigInt.prototype.valueOf.call(bigint)));

    } else if (Tag.REGEXP === tag) {
        /** @type {RegExp} */
        const regExp = value;

        cloned = saveClone(new RegExp(regExp.source, regExp.flags));

    } else if (Tag.ERROR === tag) {
        /** @type {Error} */
        const error = value;

        /** @type {Error} */
        let clonedError;

        if (error.name === 'AggregateError') {
            /** @type {AggregateError} */
            const aggregateError = value;

            const errors = isIterable(aggregateError.errors)
                ? aggregateError.errors
                : [];

            if (!isIterable(aggregateError.errors)) {
                log(getWarning('Cloning AggregateError with ' +
                            'non-iterable errors property. It ' +
                            'will be cloned into an ' +
                            'AggregateError instance with an ' +
                            'empty aggregation.'));
            }

            const { cause } = aggregateError;
            const { message } = aggregateError;
            clonedError = cause === undefined
                ? new AggregateError(errors, message)
                : new AggregateError(errors, message, { cause });

        } else {
            /** @type {import("../../utils/types.js").AtomicErrorConstructor} */
            const ErrorConstructor = getAtomicErrorConstructor(error, log);

            const { cause } = error;
            clonedError = cause === undefined
                ? new ErrorConstructor(error.message)
                : new ErrorConstructor(error.message, { cause });
        }

        const defaultDescriptor = Object.getOwnPropertyDescriptor(
            new Error(), 'stack');
        const set = typeof defaultDescriptor === 'object'
            ? defaultDescriptor.set
            : undefined;

        syncQueue.push({
            value: error.stack,

            /** @param {any} clonedValue */
            parentOrAssigner(clonedValue) {
                isExtensibleSealFrozen.push([error.stack, clonedValue]);
                Object.defineProperty(clonedError, 'stack', {
                    enumerable: defaultDescriptor?.enumerable || false,
                    get: () => {
                        return clonedValue;
                    },
                    set
                });
            }
        });

        cloned = saveClone(clonedError);

        propsToIgnore.push('stack');

    } else if (Tag.ARRAYBUFFER === tag) {
        const arrayBuffer = new ArrayBuffer(value.byteLength);
        new Uint8Array(arrayBuffer).set(new Uint8Array(value));

        cloned = saveClone(arrayBuffer);

    } else if (isTypedArray(value, prioritizePerformance, tag)
            || Tag.DATAVIEW === tag) {

        /** @type {import("../../utils/types.js").TypedArrayConstructor} */
        const TypedArray = getTypedArrayConstructor(tag, log);

        // copy data over to clone
        const buffer = new ArrayBuffer(
            value.buffer.byteLength);
        new Uint8Array(buffer).set(new Uint8Array(value.buffer));

        cloned = saveClone(new TypedArray(buffer,
                                          value.byteOffset,
                                          value.length));

        for (let index = 0; index < cloned.length; index++) {
            propsToIgnore.push(String(index));
        }

    } else if (Tag.MAP === tag) {
        /** @type {Map<any, any>} */
        const originalMap = value;

        const cloneMap = new Map();
        cloned = saveClone(cloneMap);

        originalMap.forEach((subValue, key) => {
            syncQueue.push({
                value: subValue,

                /** @param {any} clonedValue */
                parentOrAssigner(clonedValue) {
                    isExtensibleSealFrozen.push([
                        subValue,
                        clonedValue]);
                    cloneMap.set(key, clonedValue);
                }
            });
        });

    } else if (Tag.SET === tag) {
        /** @type {Set<any>} */
        const originalSet = value;

        const cloneSet = new Set();
        cloned = saveClone(cloneSet);

        originalSet.forEach((subValue) => {
            syncQueue.push({
                value: subValue,

                /** @param {any} clonedValue */
                parentOrAssigner(clonedValue) {
                    isExtensibleSealFrozen.push([
                        subValue,
                        clonedValue]);
                    cloneSet.add(clonedValue);
                }
            });
        });

    } else if (Tag.PROMISE === tag) {
        /** @type {Promise<any>} */
        const promise = value;

        cloned = new Promise((resolve, reject) => {
            promise.then(resolve)['catch'](reject);
        });

        saveClone(cloned);

        log(Warning.PROMISE);

    } else if (Tag.BLOB === tag) {
        /** @type {Blob} */
        const blob = value;

        cloned = saveClone(blob.slice());

    } else if (Tag.FILE === tag) {
        /** @type {File} */
        const file = value;

        cloned = saveClone(cloneFile(file));

    } else if (Tag.FILELIST === tag) {
        /** @type {FileList} */
        const fileList = value;

        /** @type {File[]} */
        const files = [];
        for (let index = 0; index < fileList.length; index++) {
            const file = fileList.item(index);
            if (file !== null) {
                files.push(cloneFile(file));
            }
        }

        cloned = saveClone(createFileList(...files));

    } else if (Tag.DOMEXCEPTION === tag) {
        /** @type {DOMException} */
        const exception = value;

        const clonedException = new DOMException(exception.message,
                                                 exception.name);
        const descriptor = Object.getOwnPropertyDescriptor(exception, 'stack');

        syncQueue.push({
            value: exception.stack,

            /** @param {any} clonedValue */
            parentOrAssigner(clonedValue) {
                isExtensibleSealFrozen.push([
                    exception.stack,
                    clonedValue
                ]);
                Object.defineProperty(clonedException, 'stack', {
                    enumerable: descriptor?.enumerable || false,
                    get: () => {
                        return clonedValue;
                    }
                });
            }
        });

        cloned = saveClone(clonedException);

        propsToIgnore.push('stack');

    } else if (Tag.DOMMATRIX === tag) {
        /** @type {DOMMatrix} */
        const matrix = value;

        cloned = saveClone(matrix.scale(1));

    } else if (Tag.DOMMATRIXREADONLY === tag) {
        /** @type {DOMMatrixReadOnly} */
        const matrix = value;

        cloned = matrix.is2D
            ? new DOMMatrixReadOnly([
                matrix.a, matrix.b, matrix.c, matrix.d,
                matrix.e, matrix.f])
            : new DOMMatrixReadOnly([
                matrix.m11, matrix.m12, matrix.m13, matrix.m14,
                matrix.m21, matrix.m22, matrix.m23, matrix.m24,
                matrix.m31, matrix.m32, matrix.m33, matrix.m34,
                matrix.m41, matrix.m42, matrix.m43, matrix.m44
            ]);
        saveClone(cloned);

    } else if ([Tag.DOMPOINT, Tag.DOMPOINTREADONLY].includes(tag)) {
        /** @type {DOMPoint} */
        const domPoint = value;

        const Class = tag === Tag.DOMPOINT
            ? DOMPoint
            : DOMPointReadOnly;

        cloned = saveClone(Class.fromPoint(domPoint));

    } else if (Tag.DOMQUAD === tag) {
        /** @type {import("../../utils/types.js").DOMQuadExtended} */
        const quad = value;

        /** @type {import("../../utils/types.js").DOMQuadExtended} */
        cloned = new DOMQuad(quad.p1, quad.p2, quad.p3, quad.p4);

        ['p1', 'p2', 'p3', 'p4'].forEach((pointProperty) => {
            /** @type {import("../../utils/types.js").DOMPointExtended} */
            const point = quad[pointProperty];

            forAllOwnProperties(point, (key) => {
                const meta = Object.getOwnPropertyDescriptor(point, key);

                syncQueue.push({
                    value: !hasAccessor(meta) ? point[key] : null,
                    parentOrAssigner: cloned[pointProperty],
                    prop: key,
                    metadata: meta
                });
            });
        });

        saveClone(cloned);

    } else if ([Tag.DOMRECT, Tag.DOMRECTREADONLY].includes(tag)) {
        /** @type {DOMRect|DOMRectReadOnly} */
        const domRect = value;

        const Class = tag === Tag.DOMRECT ? DOMRect : DOMRectReadOnly;

        cloned = saveClone(Class.fromRect(domRect));

    } else {
        syncTypeDetected = false;
    }

    return {
        cloned,
        ignoreProps,
        ignoreProto,
        syncTypeDetected
    };
};
