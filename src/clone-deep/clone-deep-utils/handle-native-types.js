/* eslint-disable complexity -- We support > 10 types, so we are guaranteed to
exceed a complexity of 10. I don't see any reason to separate this function
further. */

import { TOP_LEVEL } from './assign.js';
import { getWarning, Warning } from '../../utils/clone-deep-warning.js';
import { Tag } from '../../utils/constants.js';
import {
    getAtomicErrorConstructor,
    getTypedArrayConstructor
} from '../../utils/helpers.js';
import { getPrototype } from '../../utils/metadata.js';
import { isIterable, isTypedArray } from '../../utils/type-checking.js';

/** @typedef {import('../../utils/types.js').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {symbol|object|Assigner|undefined} spec.parentOrAssigner
 * @param {string|symbol|undefined} spec.prop
 * @param {string} spec.tag
 * @param {boolean} spec.prioritizePerformance
 * @param {import('../../types.js').QueueItem[]} spec.queue
 * @param {[any, any][]} spec.isExtensibleSealFrozen
 * @param {any[]} spec.supportedPrototypes
 * @param {boolean} spec.ignoreCloningMethods
 * @param {boolean} spec.ignoreCloningMethodsThisLoop
 * @param {(string|symbol)[]} spec.propsToIgnore
 * @param {import('../../types.js').Log} spec.log
 * @param {(clone: any) => any} spec.saveClone
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     nativeTypeDetected: boolean
 * }}
 */
export const handleNativeTypes = ({
    value,
    parentOrAssigner,
    prop,
    tag,
    prioritizePerformance,
    queue,
    isExtensibleSealFrozen,
    supportedPrototypes,
    propsToIgnore,
    log,
    saveClone
}) => {

    /** @type {any} */
    let cloned;

    let ignoreProps = false;

    let ignoreProto = false;

    let nativeTypeDetected = true;

    // We won't clone weakmaps or weaksets (or their prototypes).
    if ([Tag.WEAKMAP, Tag.WEAKSET].includes(tag)) {
        throw tag === Tag.WEAKMAP ? Warning.WEAKMAP : Warning.WEAKSET;

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
            /** @type {import('../../utils/types.js').AtomicErrorConstructor} */
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

        queue.push({
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

        /** @type {import('../../utils/types.js').TypedArrayConstructor} */
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
            queue.push({
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
            queue.push({
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

    } else {
        nativeTypeDetected = false;
    }

    return {
        cloned,
        ignoreProps,
        ignoreProto,
        nativeTypeDetected
    };
};
