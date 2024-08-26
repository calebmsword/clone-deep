import { Tag } from '../../utils/constants.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles Node types.
 * @param {Object} spec
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag for the value.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     nodeTypeDetected: boolean
 * }}
 */
export const handleNodeTypes = ({
    queueItem,
    tag,
    saveClone
}) => {

    const { value } = queueItem;

    let nodeTypeDetected = true;

    let cloned;

    if (Tag.BUFFER === tag) {
        /** @type {import('./types').Buffer} */
        const buffer = value;

        cloned = saveClone(buffer.slice());

    } else {
        nodeTypeDetected = false;
    }

    return {
        cloned,
        nodeTypeDetected
    };
};
