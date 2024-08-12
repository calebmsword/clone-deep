import { handleError } from './misc.js';
import { handleSupportedSyncTypes } from './handle-supported-sync-types.js';
import { getWarning } from '../../utils/clone-deep-warning.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {any} value
 * @param {symbol|object|Assigner|undefined} parentOrAssigner
 * @param {string|symbol|undefined} prop
 * @param {string} tag
 * @param {boolean} prioritizePerformance
 * @param {import('../../types').Log} log
 * @param {import('../../types').SyncQueueItem[]} syncQueue
 * @param {[any, any][]} isExtensibleSealFrozen
 * @param {any[]} supportedPrototypes
 * @param {boolean} ignoreCloningMethods
 * @param {boolean} ignoreCloningMethodsThisLoop
 * @param {(string|symbol)[]} propsToIgnore
 * @param {(clone: any) => any} saveClone
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean|undefined,
 *     ignoreProto: boolean|undefined
 * }}
 */
export const handleTag = (value,
                          parentOrAssigner,
                          prop,
                          tag,
                          prioritizePerformance,
                          log,
                          syncQueue,
                          isExtensibleSealFrozen,
                          supportedPrototypes,
                          ignoreCloningMethods,
                          ignoreCloningMethodsThisLoop,
                          propsToIgnore,
                          saveClone) => {
    let cloned;
    let ignoreProps;
    let ignoreProto;

    try {
        /** @type {boolean|undefined} */
        let syncTypeDetected;

        ({
            cloned,
            ignoreProps,
            ignoreProto,
            syncTypeDetected
        } = handleSupportedSyncTypes(value,
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
                                     saveClone));

        if (!syncTypeDetected) {
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
