import { Tag } from '../../utils/constants.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles Web API types that can only be cloned asynchronously.
 * @param {Object} spec
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag for the value.
 * @param {(promise: Promise<any>, options?: {
 *     ignoreProps?: boolean,
 *     ignoreProto?: boolean
 * }) => void} spec.pushPendingResult
 * A callback which adds the given promise to the list of pendingResults.
 * @returns {boolean}
 */
export const handleAsyncWebTypes = ({
    queueItem,
    tag,
    pushPendingResult
}) => {

    const { value } = queueItem;

    let asyncWebTypeDetected = true;

    if (Tag.IMAGEBITMAP === tag) {
        /** @type {ImageBitmap} */
        const imageBitmap = value;

        pushPendingResult(createImageBitmap(imageBitmap,
                                            0,
                                            0,
                                            imageBitmap.width,
                                            imageBitmap.height));

    } else {
        asyncWebTypeDetected = false;
    }

    return asyncWebTypeDetected;
};
