/* eslint-disable complexity -- We support > 10 types, so we are guaranteed to
exceed a complexity of 10. I don't see any reason to separate this function
further. */

import { Tag } from '../../utils/constants.js';
import { cloneFile, createFileList } from '../../utils/helpers.js';
import { forAllOwnProperties, hasAccessor } from '../../utils/metadata.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {string} spec.tag
 * @param {import('../../types').QueueItem[]} spec.queue
 * @param {[any, any][]} spec.isExtensibleSealFrozen
 * @param {(string|symbol)[]} spec.propsToIgnore
 * @param {(clone: any) => any} spec.saveClone
 * @returns {{
 *     cloned: any,
 *     webTypeDetected: boolean
 * }}
 */
export const handleSyncWebTypes = ({
    value,
    tag,
    queue,
    isExtensibleSealFrozen,
    propsToIgnore,
    saveClone
}) => {

    /** @type {any} */
    let cloned;

    let webTypeDetected = true;

    if (Tag.BLOB === tag) {
        /** @type {Blob} */
        const blob = value;

        cloned = saveClone(blob.slice());

    } else if (Tag.FILE === tag) {
        /** @type {File} */
        const file = value;

        cloned = saveClone(cloneFile(file));

    } else if (Tag.FILELIST === tag) {
        /** @type {FileList} */
        const fileList = value;

        /** @type {File[]} */
        const files = [];
        for (let index = 0; index < fileList.length; index++) {
            const file = fileList.item(index);
            if (file !== null) {
                files.push(cloneFile(file));
            }
        }

        cloned = saveClone(createFileList(...files));

    } else if (Tag.DOMEXCEPTION === tag) {
        /** @type {DOMException} */
        const exception = value;

        const clonedException = new DOMException(exception.message,
                                                 exception.name);
        const descriptor = Object.getOwnPropertyDescriptor(exception, 'stack');

        queue.push({
            value: exception.stack,

            /** @param {any} clonedValue */
            parentOrAssigner(clonedValue) {
                isExtensibleSealFrozen.push([
                    exception.stack,
                    clonedValue
                ]);
                Object.defineProperty(clonedException, 'stack', {
                    enumerable: descriptor?.enumerable || false,
                    get: () => {
                        return clonedValue;
                    }
                });
            }
        });

        cloned = saveClone(clonedException);

        propsToIgnore.push('stack');

    } else if (Tag.DOMMATRIX === tag) {
        /** @type {DOMMatrix} */
        const matrix = value;

        cloned = saveClone(matrix.scale(1));

    } else if (Tag.DOMMATRIXREADONLY === tag) {
        /** @type {DOMMatrixReadOnly} */
        const matrix = value;

        cloned = matrix.is2D
            ? new DOMMatrixReadOnly([
                matrix.a, matrix.b, matrix.c, matrix.d,
                matrix.e, matrix.f])
            : new DOMMatrixReadOnly([
                matrix.m11, matrix.m12, matrix.m13, matrix.m14,
                matrix.m21, matrix.m22, matrix.m23, matrix.m24,
                matrix.m31, matrix.m32, matrix.m33, matrix.m34,
                matrix.m41, matrix.m42, matrix.m43, matrix.m44
            ]);
        saveClone(cloned);

    } else if ([Tag.DOMPOINT, Tag.DOMPOINTREADONLY].includes(tag)) {
        /** @type {DOMPoint} */
        const domPoint = value;

        const Class = tag === Tag.DOMPOINT
            ? DOMPoint
            : DOMPointReadOnly;

        cloned = saveClone(Class.fromPoint(domPoint));

    } else if (Tag.DOMQUAD === tag) {
        /** @type {import('../../utils/types').DOMQuadExtended} */
        const quad = value;

        /** @type {import('../../utils/types').DOMQuadExtended} */
        cloned = new DOMQuad(quad.p1, quad.p2, quad.p3, quad.p4);

        ['p1', 'p2', 'p3', 'p4'].forEach((pointProperty) => {
            /** @type {import('../../utils/types').DOMPointExtended} */
            const point = quad[pointProperty];

            forAllOwnProperties(point, (key) => {
                const meta = Object.getOwnPropertyDescriptor(point, key);

                queue.push({
                    value: !hasAccessor(meta) ? point[key] : null,
                    parentOrAssigner: cloned[pointProperty],
                    prop: key,
                    metadata: meta
                });
            });
        });

        saveClone(cloned);

    } else if ([Tag.DOMRECT, Tag.DOMRECTREADONLY].includes(tag)) {
        /** @type {DOMRect|DOMRectReadOnly} */
        const domRect = value;

        const Class = tag === Tag.DOMRECT ? DOMRect : DOMRectReadOnly;

        cloned = saveClone(Class.fromRect(domRect));

    } else {
        webTypeDetected = false;
    }

    return {
        cloned,
        webTypeDetected
    };
};