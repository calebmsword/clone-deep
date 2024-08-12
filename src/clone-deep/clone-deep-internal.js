import { assign, TOP_LEVEL } from './assign.js';
import {
    CLONE,
    Tag
} from '../utils/constants.js';
import {
    getWarning,
    Warning
} from '../utils/clone-deep-warning.js';
import {
    cloneFile,
    createFileList,
    getAtomicErrorConstructor,
    getSupportedPrototypes,
    getTypedArrayConstructor
} from '../utils/helpers.js';
import {
    forAllOwnProperties,
    getPrototype,
    hasAccessor
} from '../utils/metadata.js';
import {
    getTag,
    isIterable,
    isTypedArray
} from '../utils/type-checking.js';

/**
 * Clones the provided value.
 * @template T
 * See CloneDeep.
 * @template [U = T]
 * See CloneDeep.
 * @param {T} _value
 * The value to clone.
 * @param {import("../types").Customizer|undefined} customizer
 * A customizer function.
 * @param {import("../types").Log} log
 * Receives an error object for logging.
 * @param {boolean} prioritizePerformance
 * Whether or not type-checking will be more performant.
 * @param {boolean} ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} doThrow
 * Whether errors in the customizer should cause the function to throw.
 * @param {Set<any>} [parentObjectRegistry]
 * This is used by cloneDeepFully to check if an object with a cloning method is
 * in the prototype of an object that was cloned earlier in the chain.
 * @returns {U}
 */
export const cloneDeepInternal = (_value,
                                  customizer,
                                  log,
                                  prioritizePerformance,
                                  ignoreCloningMethods,
                                  doThrow,
                                  parentObjectRegistry) => {

    /**
     * Contains the cloned value.
     * @type {{ result: any }}
     */
    const container = { result: undefined };

    /**
     * Will be used to store cloned values so that we don't loop infinitely on
     * circular references.
     */
    const cloneStore = new Map();

    /**
     * A queue so we can avoid recursion.
     * @type {import("../utils/types").QueueElement[]}
     */
    const queue = [{ value: _value, parentOrAssigner: TOP_LEVEL }];

    /**
     * We will do a second pass through everything to check Object.isExtensible,
     * Object.isSealed and Object.isFrozen. We do it last so we don't run into
     * issues where we append properties on a frozen object, etc.
     * @type {Array<[any, any]>}
     */
    const isExtensibleSealFrozen = [];

    /** An array of all prototypes of supported types in this runtime. */
    const supportedPrototypes = getSupportedPrototypes();

    for (let obj = queue.shift(); obj !== undefined; obj = queue.shift()) {
        const {
            value,
            parentOrAssigner,
            prop,
            metadata
        } = obj;

        /**
         * Will contain the cloned object.
         * @type {any}
         */
        let cloned;

        /**
         * Whether the clone for this value has been cached in the clone store.
         * @type {boolean}
         */
        let cloneIsCached = false;

        // See if we have a circular reference
        if (cloneStore.has(value)) {
            const oldClone = cloneStore.get(value);
            assign(container, log, oldClone, parentOrAssigner, prop, metadata);
            cloneIsCached = true;
        }

        /**
         * Whether the current value should be ignored entirely.
         * @type {boolean}
         */
        let ignoreThisLoop = false;

        /**
         * If true, do not not clone the properties of value.
         * @type {boolean|undefined}
         */
        let ignoreProps = false;

        /**
         * If true, do not have `cloned` share the prototype of `value`.
         * @type {boolean|undefined}
         */
        let ignoreProto = false;

        /**
         * Is true if the customizer determines the value of `cloned`.
         * @type {boolean}
         */
        let useCustomizerClone = false;

        /**
         * Any properties in `value` added here will not be cloned.
         * @type {(string|symbol)[]}
         */
        const propsToIgnore = [];

        /**
         * Whether the cloning methods should be observed this loop.
         * @type {boolean}
         */
        let ignoreCloningMethodsThisLoop = false;

        // Perform user-injected logic if applicable.
        if (typeof customizer === 'function') {

            /** @type {any} */
            let clone;

            /** @type {import("../utils/types").AdditionalValue[]|undefined} */
            let additionalValues;

            /** @type {boolean|undefined} */
            let ignore;

            try {
                const customResult = customizer(value);

                if (typeof customResult === 'object') {
                    useCustomizerClone = true;

                    // Must wrap destructure in () if not variable declaration
                    ({ clone,
                        additionalValues,
                        ignore,
                        ignoreProps,
                        ignoreProto
                    } = customResult);

                    if (ignore === true) {
                        ignoreThisLoop = true;
                    } else {
                        cloned = assign(container,
                                        log,
                                        clone,
                                        parentOrAssigner,
                                        prop,
                                        metadata);

                        if (Array.isArray(additionalValues)) {
                            additionalValues.forEach((object) => {
                                if (typeof object === 'object'
                                    && typeof object.assigner === 'function') {
                                    queue.push({
                                        value: object.value,
                                        parentOrAssigner: object.assigner
                                    });
                                } else {
                                    throw Warning.IMPROPER_ADDITIONAL_VALUES;
                                }
                            });
                        } else if (additionalValues !== undefined) {
                            throw Warning.IMPROPER_ADDITIONAL_VALUES;
                        }
                    }
                }
            } catch (error) {
                if (doThrow === true) {
                    throw error;
                }

                clone = undefined;
                useCustomizerClone = false;

                const msg = 'customizer encountered error. Its results will ' +
                            'be ignored for the current value and the ' +
                            'algorithm will proceed with default behavior. ';

                if (error instanceof Error) {
                    error.message = `${msg}Error encountered: ${error.message}`;

                    const cause = error.cause
                        ? { cause: error.cause }
                        : undefined;

                    const stack = error.stack ? error.stack : undefined;
                    log(getWarning(error.message, cause, stack));
                } else {
                    log(getWarning(msg, { cause: error }));
                }
            }
        }

        /**
         * Identifies the type of the value.
         * @type {string}
         */
        const tag = getTag(value, prioritizePerformance);

        // Check if we should observe cloning methods on this loop
        if (parentObjectRegistry !== undefined) {
            [...parentObjectRegistry].some((object) => {
                if (value === object?.constructor?.prototype) {
                    ignoreCloningMethodsThisLoop = true;
                    return true;
                }
                return false;
            });
        }

        try {
            if (useCustomizerClone || cloneIsCached || ignoreThisLoop) {
                /* skip following branches */

            // If value is primitive, just assign it directly.
            } else if (value === null || !['object', 'function']
                .includes(typeof value)) {
                assign(container, log, value, parentOrAssigner, prop, metadata);

            // We won't clone weakmaps or weaksets (or their prototypes).
            } else if ([Tag.WEAKMAP, Tag.WEAKSET].includes(tag)) {
                throw tag === Tag.WEAKMAP ? Warning.WEAKMAP : Warning.WEAKSET;

            // If object defines its own means of getting cloned, use it
            } else if (typeof value[CLONE] === 'function'
                     && ignoreCloningMethods !== true
                     && ignoreCloningMethodsThisLoop === false) {

                /** @type {import("../utils/types").CloneMethodResult<any>} */
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

                cloned = assign(container,
                                log,
                                result.clone,
                                parentOrAssigner,
                                prop,
                                metadata);

            // Ordinary objects, or the rare `arguments` clone.
            // Also, treat prototypes like ordinary objects. The tag wrongly
            // indicates that prototypes are instances of themselves.
            } else if ([Tag.OBJECT, Tag.ARGUMENTS].includes(tag)
                       || supportedPrototypes.includes(value)) {
                cloned = assign(container,
                                log,
                                Object.create(getPrototype(value)),
                                parentOrAssigner,
                                prop,
                                metadata);

            // We only copy functions if they are methods.
            } else if (typeof value === 'function') {
                cloned = assign(container,
                                log,
                                parentOrAssigner !== TOP_LEVEL
                                    ? value
                                    : Object.create(Function.prototype),
                                parentOrAssigner,
                                prop,
                                metadata);
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
                cloned = assign(container,
                                log,
                                new Array(value.length),
                                parentOrAssigner,
                                prop,
                                metadata);

            } else if ([Tag.BOOLEAN, Tag.DATE].includes(tag)) {
                /** @type {BooleanConstructor|DateConstructor} */
                const BooleanOrDateConstructor = tag === Tag.DATE
                    ? Date
                    : Boolean;

                cloned = assign(container,
                                log,
                                new BooleanOrDateConstructor(Number(value)),
                                parentOrAssigner,
                                prop,
                                metadata);

            } else if ([Tag.NUMBER, Tag.STRING].includes(tag)) {
                /** @type {NumberConstructor|StringConstructor} */
                const NumberOrStringConstructor = tag === Tag.NUMBER
                    ? Number
                    : String;

                cloned = assign(container,
                                log,
                                new NumberOrStringConstructor(value),
                                parentOrAssigner,
                                prop,
                                metadata);

            // `typeof Object(Symbol("foo"))` is `"object"
            } else if (Tag.SYMBOL === tag) {
                /** @type {Symbol} */
                const symbol = value;

                cloned = assign(
                    container,
                    log,
                    Object(Symbol.prototype.valueOf.call(symbol)),
                    parentOrAssigner,
                    prop,
                    metadata);

            // `typeof Object(BigInt(3))` is `"object"
            } else if (Tag.BIGINT === tag) {
                /** @type {BigInt} */
                const bigint = value;

                cloned = assign(container,
                                log,
                                Object(BigInt.prototype.valueOf.call(bigint)),
                                parentOrAssigner,
                                prop,
                                metadata);

            } else if (Tag.REGEXP === tag) {
                /** @type {RegExp} */
                const regExp = value;

                cloned = new RegExp(regExp.source, regExp.flags);
                assign(container, log, cloned, parentOrAssigner, prop, metadata);

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
                    /** @type {import("../utils/types").AtomicErrorConstructor} */
                    const ErrorConstructor = getAtomicErrorConstructor(error,
                                                                       log);

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

                cloned = assign(container,
                                log,
                                clonedError,
                                parentOrAssigner,
                                prop,
                                metadata);

                propsToIgnore.push('stack');

            } else if (Tag.ARRAYBUFFER === tag) {
                const arrayBuffer = new ArrayBuffer(value.byteLength);
                new Uint8Array(arrayBuffer).set(new Uint8Array(value));

                cloned = assign(container,
                                log,
                                arrayBuffer,
                                parentOrAssigner,
                                prop,
                                metadata);

            } else if (isTypedArray(value, prioritizePerformance, tag)
                     || Tag.DATAVIEW === tag) {

                /** @type {import("../utils/types").TypedArrayConstructor} */
                const TypedArray = getTypedArrayConstructor(tag, log);

                // copy data over to clone
                const buffer = new ArrayBuffer(
                    value.buffer.byteLength);
                new Uint8Array(buffer).set(new Uint8Array(value.buffer));

                cloned = assign(container,
                                log,
                                new TypedArray(buffer,
                                               value.byteOffset,
                                               value.length),
                                parentOrAssigner,
                                prop,
                                metadata);

                for (let index = 0; index < cloned.length; index++) {
                    propsToIgnore.push(String(index));
                }

            } else if (Tag.MAP === tag) {
                /** @type {Map<any, any>} */
                const originalMap = value;

                const cloneMap = new Map();
                cloned = assign(container,
                                log,
                                cloneMap,
                                parentOrAssigner,
                                prop,
                                metadata);

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
                cloned = assign(container,
                                log,
                                cloneSet,
                                parentOrAssigner,
                                prop,
                                metadata);

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

                assign(container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata);

                log(Warning.PROMISE);

            } else if (Tag.BLOB === tag) {
                /** @type {Blob} */
                const blob = value;

                cloned = assign(container,
                                log,
                                blob.slice(),
                                parentOrAssigner,
                                prop,
                                metadata);

            } else if (Tag.FILE === tag) {
                /** @type {File} */
                const file = value;

                cloned = cloneFile(file);
                assign(container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata);

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

                cloned = createFileList(...files);
                assign(container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata);

            } else if (Tag.DOMEXCEPTION === tag) {
                /** @type {DOMException} */
                const exception = value;

                const clonedException = new DOMException(exception.message,
                                                         exception.name);
                const descriptor = Object.getOwnPropertyDescriptor(exception,
                                                                   'stack');

                queue.push({
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

                cloned = assign(container,
                                log,
                                clonedException,
                                parentOrAssigner,
                                prop,
                                metadata);

                propsToIgnore.push('stack');

            } else if (Tag.DOMMATRIX === tag) {
                /** @type {DOMMatrix} */
                const matrix = value;

                assign(container,
                       log,
                       matrix.scale(1),
                       parentOrAssigner,
                       prop,
                       metadata);

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
                assign(container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata);

            } else if ([Tag.DOMPOINT, Tag.DOMPOINTREADONLY].includes(tag)) {
                /** @type {DOMPoint} */
                const domPoint = value;

                const Class = tag === Tag.DOMPOINT
                    ? DOMPoint
                    : DOMPointReadOnly;

                cloned = Class.fromPoint(domPoint);
                assign(container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata);

            } else if (Tag.DOMQUAD === tag) {
                /** @type {import("../utils/types").DOMQuadExtended} */
                const quad = value;

                /** @type {import("../utils/types").DOMQuadExtended} */
                cloned = new DOMQuad(quad.p1, quad.p2, quad.p3, quad.p4);

                ['p1', 'p2', 'p3', 'p4'].forEach((pointProperty) => {
                    /** @type {import("../utils/types").DOMPointExtended} */
                    const point = quad[pointProperty];

                    forAllOwnProperties(point, (key) => {
                        const meta = Object.getOwnPropertyDescriptor(point,
                                                                     key);

                        queue.push({
                            value: !hasAccessor(meta) ? point[key] : null,
                            parentOrAssigner: cloned[pointProperty],
                            prop: key,
                            metadata: meta
                        });
                    });
                });

                assign(container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata);

            } else if ([Tag.DOMRECT, Tag.DOMRECTREADONLY].includes(tag)) {
                /** @type {DOMRect|DOMRectReadOnly} */
                const domRect = value;

                const Class = tag === Tag.DOMRECT ? DOMRect : DOMRectReadOnly;

                cloned = Class.fromRect(domRect);
                assign(container,
                       log,
                       cloned,
                       parentOrAssigner,
                       prop,
                       metadata);

            } else {
                throw getWarning('Attempted to clone unsupported type.');
            }
        } catch (error) {
            const msg = 'Encountered error while attempting to clone ' +
                        'specific value. The value will be "cloned" into ' +
                        'an empty object.';

            if (error instanceof Error) {
                error.message = `${msg} Error encountered: ${error.message}`;
                const cause = error.cause ? { cause: error.cause } : undefined;
                const stack = error.stack ? error.stack : undefined;
                log(getWarning(error.message, cause, stack));
            } else {
                log(getWarning(msg, { cause: error }));
            }

            cloned = assign(container,
                            log,
                            {},
                            parentOrAssigner,
                            prop,
                            metadata);

            // We don't want the prototype if we failed and set the value to an
            // empty object.
            ignoreProto = true;
        }

        isExtensibleSealFrozen.push([value, cloned]);

        // Only iterate over props + update store if value is not function or
        // primitive, or if we did not used a cached clone
        if (cloned !== null
            && typeof cloned === 'object'
            && !cloneIsCached
            && !ignoreThisLoop) {
            cloneStore.set(value, cloned);

            // Ensure clone has prototype of value
            if (ignoreProto !== true
                && getPrototype(cloned) !== getPrototype(value)) {
                Object.setPrototypeOf(cloned, getPrototype(value));
            }

            // Now copy all enumerable and non-enumerable properties.
            if (!ignoreProps) {
                forAllOwnProperties(value, (key) => {
                    if (propsToIgnore.includes(key)) {
                        return;
                    }

                    const meta = Object.getOwnPropertyDescriptor(value, key);

                    queue.push({
                        value: !hasAccessor(meta) ? value[key] : undefined,
                        parentOrAssigner: cloned,
                        prop: key,
                        metadata: meta
                    });
                });
            }
        }
    }

    // Check extensible, seal, and frozen statuses.
    isExtensibleSealFrozen.forEach(([value, cloned]) => {
        if (!Object.isExtensible(value)) {
            Object.preventExtensions(cloned);
        }
        if (Object.isSealed(value)) {
            Object.seal(cloned);
        }
        if (Object.isFrozen(value)) {
            Object.freeze(cloned);
        }
    });

    return container.result;
};
