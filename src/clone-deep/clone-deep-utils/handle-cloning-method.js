import { getWarning } from '../../utils/clone-deep-warning.js';
import { CLONE } from '../../utils/constants.js';

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {any} spec.value
 * @param {boolean} spec.ignoreCloningMethods
 * @param {boolean} spec.ignoreCloningMethodsThisLoop
 * @param {(string|symbol)[]} spec.propsToIgnore
 * @param {import('../../types').Log} spec.log
 * @param {(clone: any) => any} spec.saveClone
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     useCloningMethod: boolean
 * }}
 */
export const handleCloningMethods = ({
    value,
    ignoreCloningMethods,
    ignoreCloningMethodsThisLoop,
    propsToIgnore,
    log,
    saveClone
}) => {

    /** @type {any} */
    let cloned;

    let ignoreProps = false;

    let ignoreProto = false;

    let useCloningMethod = true;

    if (typeof value[CLONE] === 'function'
        && ignoreCloningMethods !== true
        && ignoreCloningMethodsThisLoop === false) {

        /** @type {import('../../utils/types').CloneMethodResult<any>} */
        const result = value[CLONE]();

        if (result.propsToIgnore !== undefined) {
            if (Array.isArray(result.propsToIgnore)
                && result
                    .propsToIgnore
                    .every(
                        /** @param {any} string */
                        (string) => {
                            return ['string', 'symbol']
                                .includes(typeof string);
                        })) {
                propsToIgnore.push(...result.propsToIgnore);
            } else {
                log(getWarning(
                    'return value of CLONE method is an object whose ' +
                    'propsToIgnore property, if not undefined, is ' +
                    'expected to be an array of strings or symbols. The ' +
                    'given result is not this type of array so it will ' +
                    'have no effect.'));
            }
        }
        if (typeof result.ignoreProps === 'boolean') {
            ({ ignoreProps } = result);
        }

        if (typeof result.ignoreProto === 'boolean') {
            ({ ignoreProto } = result);
        }

        cloned = saveClone(result.clone);

    } else {
        useCloningMethod = false;
    }

    return {
        cloned,
        ignoreProps,
        ignoreProto,
        useCloningMethod
    };
};
