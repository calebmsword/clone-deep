import { handleError } from './misc.js';
import { handleNativeTypes } from './handle-native-types.js';
import { handleSyncWebTypes } from './handle-sync-web-types.js';
import { Warning } from '../../utils/clone-deep-warning.js';
import { handleAsyncWebTypes } from './handle-async-web-types.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * The value to clone.
 * @param {Assigner|symbol|object} [spec.parentOrAssigner]
 * Either the parent object that the cloned value will be assigned to, or a
 * function which assigns the value itself. If equal to `TOP_LEVEL`, then it
 * is the value that will be returned by the algorithm.
 * @param {string|symbol} [spec.prop]
 * If `parentOrAssigner` is a parent object, then `parentOrAssigner[prop]`
 * will be assigned `cloned`.
 * @param {PropertyDescriptor} [spec.metadata]
 * The property descriptor for the object. If not an object, then this is
 * ignored.
 * @param {string} spec.tag
 * The tag for the value.
 * @param {boolean} spec.prioritizePerformance
 * Whether or not type-checking will be more performant.
 * @param {import('../../types').Log} spec.log
 * The logger.
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue storing all values to clone.
 * @param {[any, any][]} spec.isExtensibleSealFrozen
 * Tuples of values and their clones are added to this list. This is to ensure
 * that each clone value will have the correct
 * extensibility/sealedness/frozenness.
 * @param {any[]} spec.supportedPrototypes
 * A list of prototypes of the supported types available in this runtime.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods should even be considered.
 * @param {boolean} spec.ignoreCloningMethodsThisLoop
 * Whether cloning methods should be considered for this particular value.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * The list of all clones that can only be acquired asynchronously.
 * @param {boolean} [spec.async]
 * Whether or not the algorithm will return the clone asynchronously.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean|undefined,
 *     ignoreProto: boolean|undefined
 * }}
 */
export const handleTag = ({
    value,
    parentOrAssigner,
    prop,
    metadata,
    tag,
    prioritizePerformance,
    log,
    queue,
    pendingResults,
    isExtensibleSealFrozen,
    supportedPrototypes,
    ignoreCloningMethods,
    ignoreCloningMethodsThisLoop,
    propsToIgnore,
    saveClone,
    async
}) => {

    let cloned;
    let ignoreProps;
    let ignoreProto;

    try {
        /** @type {boolean|undefined} */
        let nativeTypeDetected;

        /** @type {boolean|undefined} */
        let webTypeDetected;

        /** @type {boolean|undefined} */
        let asyncWebTypeDetected;

        ({
            cloned,
            ignoreProps,
            ignoreProto,
            nativeTypeDetected
        } = handleNativeTypes({
            value,
            parentOrAssigner,
            prop,
            tag,
            prioritizePerformance,
            queue,
            isExtensibleSealFrozen,
            supportedPrototypes,
            ignoreCloningMethods,
            ignoreCloningMethodsThisLoop,
            propsToIgnore,
            log,
            saveClone
        }));

        if (!nativeTypeDetected) {
            ({
                cloned,
                webTypeDetected
            } = handleSyncWebTypes({
                value,
                queue,
                tag,
                isExtensibleSealFrozen,
                propsToIgnore,
                saveClone
            }));
        }

        /**
         * Pushes the given promise into the list of pending results.
         * @param {Promise<any>} promise
         */
        const pushPendingResult = (promise) => {
            pendingResults?.push({
                value,
                parentOrAssigner,
                prop,
                metadata,
                promise,
                propsToIgnore
            });
        };

        if (async && !nativeTypeDetected && !webTypeDetected) {
            asyncWebTypeDetected = handleAsyncWebTypes({
                value,
                tag,
                pushPendingResult
            });
        }

        if (!nativeTypeDetected && !webTypeDetected && !asyncWebTypeDetected) {
            throw Warning.UNSUPPORTED_TYPE;
        }
    } catch (error) {
        ({ cloned, ignoreProto } = handleError(error, log, saveClone));
    }

    return {
        cloned,
        ignoreProps,
        ignoreProto
    };
};
