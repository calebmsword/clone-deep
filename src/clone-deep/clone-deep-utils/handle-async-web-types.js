import { Tag } from '../../utils/constants.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {string} spec.tag
 * @param {(promise: Promise<any>, options?: {
 *     ignoreProps?: boolean,
 *     ignoreProto?: boolean
 * }) => void} spec.pushPendingResult
 * @returns {boolean}
 */
export const handleAsyncWebTypes = ({
    value,
    tag,
    pushPendingResult
}) => {

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
