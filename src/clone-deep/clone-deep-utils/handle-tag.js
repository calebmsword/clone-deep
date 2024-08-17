import { handleError } from './misc.js';
import { handleNativeTypes } from './handle-native-types.js';
import { handleSyncWebTypes } from './handle-sync-web-types.js';
import { getWarning } from '../../utils/clone-deep-warning.js';
import { handleAsyncWebTypes } from './handle-async-web-types.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {symbol|object|Assigner} [spec.parentOrAssigner]
 * @param {string|symbol} [spec.prop]
 * @param {PropertyDescriptor} [spec.metadata]
 * @param {string} spec.tag
 * @param {boolean} spec.prioritizePerformance
 * @param {import('../../types').Log} spec.log
 * @param {import('../../types').QueueItem[]} spec.queue
 * @param {[any, any][]} spec.isExtensibleSealFrozen
 * @param {any[]} spec.supportedPrototypes
 * @param {boolean} spec.ignoreCloningMethods
 * @param {boolean} spec.ignoreCloningMethodsThisLoop
 * @param {(string|symbol)[]} spec.propsToIgnore
 * @param {(clone: any) => any} spec.saveClone
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * @param {boolean} [spec.async]
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
    saveClone
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
         * @param {Object} [options]
         * @param {boolean} [options.ignoreProps]
         * @param {boolean} [options.ignoreProto]
         */
        const pushPendingResult = (promise, options) => {
            pendingResults?.push({
                value,
                parentOrAssigner,
                prop,
                metadata,
                promise,
                ignoreProps: options?.ignoreProps,
                ignoreProto: options?.ignoreProto,
                propsToIgnore
            });
        };

        if (!nativeTypeDetected && !webTypeDetected) {
            asyncWebTypeDetected = handleAsyncWebTypes({
                value,
                tag,
                propsToIgnore,
                pushPendingResult
            });
        }

        if (!(nativeTypeDetected || webTypeDetected || asyncWebTypeDetected)) {
            throw getWarning('Attempted to clone unsupported type.');
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
