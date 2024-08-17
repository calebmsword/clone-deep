import { Tag } from '../../utils/constants.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {string} spec.tag
 * @param {(string|symbol)[]} spec.propsToIgnore
 * @param {(promise: Promise<any>, options?: {
 *     ignoreProps?: boolean,
 *     ignoreProto?: boolean
 * }) => void} spec.pushPendingResult
 * @returns {boolean}
 */
export const handleAsyncWebTypes = ({
    value,
    tag,
    propsToIgnore,
    pushPendingResult
    // queue,
    // pendingResults
}) => {

    let asyncWebTypeDetected = true;

    if ([Tag.AUDIODATA, Tag.VIDEODATA].includes(tag)) {
        /** @type {import('./types').AudioData | import('./types').VideoData} */
        const data = value;

        pushPendingResult(Promise.resolve(data.clone()));

    } else if (Tag.IMAGEBITMAP === tag) {
        /** @type {ImageBitmap} */
        const imageBitmap = value;

        pushPendingResult(createImageBitmap(imageBitmap,
                                            0,
                                            0,
                                            imageBitmap.width,
                                            imageBitmap.height));

    } else if (Tag.IMAGEDATA === tag) {
        /** @type {ImageData} */
        const imageData = value;

        // ImageData::data is read-only so clone it now instead of later
        propsToIgnore.push('data');
        const dataArray = Uint8ClampedArray.from(imageData.data);

        pushPendingResult(Promise.resolve(new ImageData(
            dataArray, imageData.width, imageData.height, {
                colorSpace: imageData.colorSpace
            })));

    } else {
        asyncWebTypeDetected = false;
    }

    return asyncWebTypeDetected;
};
