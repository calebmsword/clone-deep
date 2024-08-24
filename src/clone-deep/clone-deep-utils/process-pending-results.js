import { assign } from './assign.js';
import { finalizeClone } from './misc.js';
import { getError } from '../../utils/clone-deep-error.js';

/**
 * Processes pending results.
 * @param {import('./global-state.js').GlobalState} globalState
 */
export const processPendingResults = async (globalState) => {
    const {
        log,
        queue,
        cloneStore,
        pendingResults
    } = globalState;

    const clones = await Promise
        .allSettled(pendingResults.map((result) => {
            return result.promise;
        }));

    clones.forEach((clone, i) => {
        /** @type {any} */
        let cloned;
        const result = pendingResults[i];

        if (clone.status === 'rejected') {
            log(getError(
                'Promise rejected' + (result.queueItem.prop !== undefined
                    ? ' for value assigned to property ' +
                      `"${String(result.queueItem.prop)}". `
                    : '. ') +
                'This value will be cloned into an empty object.',
                { cause: clone.reason }));
            cloned = {};
        } else {
            cloned = clone.value;
        }

        assign({
            globalState,
            queueItem: result.queueItem,
            cloned
        });

        finalizeClone({
            value: result.queueItem.value,
            cloned,
            cloneIsCached: false,
            ignoreProto: result.ignoreProto,
            ignoreProps: result.ignoreProps,
            useCloningMethod: false,
            propsToIgnore: result.propsToIgnore,
            cloneStore,
            queue
        });
    });

    pendingResults.length = 0;
};
