import { assign } from './assign.js';
import { finalizeClone } from './misc.js';
import { getWarning } from '../../utils/clone-deep-warning.js';

/**
 * Processes pending results.
 * @template [U = any]
 * @param {Object} spec
 * @param {{ clone: U }} spec.container
 * Contains the cloned top-level object returned by the algorithm.
 * @param {import('../../types').Log} spec.log
 * The logger.
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue storing all values to clone.
 * @param {Map<any, any>} spec.cloneStore
 * A store of previously cloned values, used to resolve circular references.
 * @param {import('../../types').PendingResultItem[]} spec.pendingResults
 * The list of all clones that can only be acquired asynchronously.
 */
export const processPendingResults = async ({
    container,
    log,
    queue,
    cloneStore,
    pendingResults
}) => {
    const clones = await Promise
        .allSettled(pendingResults.map((result) => {
            return result.promise;
        }));

    clones.forEach((clone, i) => {
        /** @type {any} */
        let cloned;
        const result = pendingResults[i];

        if (clone.status === 'rejected') {
            log(getWarning(
                'Promise rejected' + (result.prop !== undefined
                    ? ' for value assigned to property ' +
                      `"${String(result.prop)}". `
                    : '. ') +
                'This value will be cloned into an empty object.',
                { cause: clone.reason }));
            cloned = {};
        } else {
            cloned = clone.value;
        }

        assign({
            container,
            log,
            cloned,
            parentOrAssigner: result.parentOrAssigner,
            prop: result.prop,
            metadata: result.metadata
        });

        finalizeClone({
            value: result.value,
            cloned,
            cloneIsCached: false,
            ignoreProto: result.ignoreProto,
            ignoreProps: result.ignoreProps,
            ignoreThisLoop: false,
            useCloningMethod: false,
            propsToIgnore: result.propsToIgnore,
            cloneStore,
            queue
        });
    });

    pendingResults.length = 0;
};
