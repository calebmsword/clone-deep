import { handleError } from './misc.js';
import { handleSupportedSyncTypes } from './handle-supported-sync-types.js';
import { getWarning } from '../../utils/clone-deep-warning.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {symbol|object|Assigner|undefined} spec.parentOrAssigner
 * @param {string|symbol|undefined} spec.prop
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
    tag,
    prioritizePerformance,
    log,
    queue,
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
        let syncTypeDetected;

        ({
            cloned,
            ignoreProps,
            ignoreProto,
            syncTypeDetected
        } = handleSupportedSyncTypes({
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
