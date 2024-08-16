import { assign } from './assign.js';
import { finalizeClone } from './misc.js';
import { getWarning } from '../../utils/clone-deep-warning.js';

/**
 * Processes pending results.
 * @template [U = any]
 * @param {Object} spec
 * @param {{ clone: U }} spec.container
 * @param {import('../../types').Log} spec.log
 * @param {import('../../types').QueueItem[]} spec.queue
 * @param {Map<any, any>} spec.cloneStore
 * @param {import('../../types').AsyncResultItem[]} spec.pendingResults
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
            useCustomizerClone: false,
            useCloningMethod: false,
            propsToIgnore: result.propsToIgnore,
            cloneStore,
            queue
        });
    });

    pendingResults.length = 0;
};
