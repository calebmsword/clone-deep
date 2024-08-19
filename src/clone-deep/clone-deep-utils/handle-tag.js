import { handleError } from './misc.js';
import { handleNativeTypes } from './handle-native-types.js';
import { handleSyncWebTypes } from './handle-sync-web-types.js';
import { Warning } from '../../utils/clone-deep-warning.js';
import { handleAsyncWebTypes } from './handle-async-web-types.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * @param {import('../../types').QueueItem} spec.queueItem
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
            globalState,
            queueItem,
            tag,
            propsToIgnore,
            saveClone
        }));

        if (!nativeTypeDetected) {
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

        if (async && !nativeTypeDetected && !webTypeDetected) {
            asyncWebTypeDetected = handleAsyncWebTypes({
                queueItem,
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
