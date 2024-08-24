import { handleError } from './misc.js';
import { handleAsyncWebTypes } from './handle-async-web-types.js';
import { handleEcmaTypes } from './handle-ecma-types.js';
import { handleNodeTypes } from './handle-node-types.js';
import { handleSyncWebTypes } from './handle-sync-web-types.js';
import { CloneError } from '../../utils/clone-deep-error.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag for the value.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean|undefined,
 *     ignoreProto: boolean|undefined
 * }}
 */
export const handleTag = ({
    globalState,
    queueItem,
    tag,
    propsToIgnore,
    saveClone
}) => {

    const {
        log,
        pendingResults,
        async
    } = globalState;

    let cloned;
    let ignoreProps;
    let ignoreProto;

    try {
        /** @type {boolean|undefined} */
        let nodeTypeDetected;

        /** @type {boolean|undefined} */
        let nativeTypeDetected;

        /** @type {boolean|undefined} */
        let webTypeDetected;

        /** @type {boolean|undefined} */
        let asyncWebTypeDetected;

        ({
            cloned,
            nodeTypeDetected
        } = handleNodeTypes({
            queueItem,
            tag,
            saveClone
        }));

        if (!nodeTypeDetected) {
            ({
                cloned,
                ignoreProps,
                ignoreProto,
                nativeTypeDetected
            } = handleEcmaTypes({
                globalState,
                queueItem,
                tag,
                propsToIgnore,
                saveClone
            }));
        }

        if (!nodeTypeDetected && !nativeTypeDetected) {
            ({
                cloned,
                webTypeDetected
            } = handleSyncWebTypes({
                globalState,
                queueItem,
                tag,
                propsToIgnore,
                saveClone
            }));
        }

        if (async && !nodeTypeDetected && !nativeTypeDetected
            && !webTypeDetected) {
            /**
             * Pushes the given promise into the list of pending results.
             * @param {Promise<any>} promise
             */
            const pushPendingResult = (promise) => {
                pendingResults?.push({
                    queueItem,
                    promise,
                    propsToIgnore
                });
            };
            asyncWebTypeDetected = handleAsyncWebTypes({
                queueItem,
                tag,
                pushPendingResult
            });
        }

        if (!nodeTypeDetected && !nativeTypeDetected && !webTypeDetected
            && !asyncWebTypeDetected) {
            throw CloneError.UNSUPPORTED_TYPE;
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
