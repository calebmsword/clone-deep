import { TOP_LEVEL } from './assign.js';
import { getWarning, Warning } from '../../utils/clone-deep-warning.js';
import { Tag } from '../../utils/constants.js';
import {
    getAtomicErrorConstructor,
    getTypedArrayConstructor
} from '../../utils/helpers.js';
import { getPrototype } from '../../utils/metadata.js';
import { isIterable, isTypedArray } from '../../utils/type-checking.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag of the provided value.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     nativeTypeDetected: boolean
 * }}
 */
export const handleNativeTypes = ({
    globalState,
    queueItem,
    tag,
    propsToIgnore,
    saveClone
}) => {

    const {
        prioritizePerformance,
        log,
        queue,
        isExtensibleSealFrozen,
        supportedPrototypes
    } = globalState;

    const { value, parentOrAssigner, prop } = queueItem;

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
                log(Warning.IMPROPER_AGGREGATE_ERRORS);
            }

            const { cause } = aggregateError;
            const { message } = aggregateError;
            clonedError = cause === undefined
                ? new AggregateError(errors, message)
                : new AggregateError(errors, message, { cause });

        } else {
            /** @type {import('../../utils/types').AtomicErrorConstructor} */
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

        /** @type {import('../../utils/types').TypedArrayConstructor} */
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
