import { cloneDeepInternal } from "./utils/clone-deep-internal.js"

/**
 * @template T
 * The type of the input value.
 * @template [U = T]
 * The type of the return value. By default, it is the same as the input value. 
 * Nefarious customizer usage could require them be distinct, however. Please do 
 * not do this.
 * @param {T} value The value to deeply copy.
 * @param {import("../public-types").CloneDeepOptions|import("../public-types").Customizer} [optionsOrCustomizer] 
 * If a function, this argument is used as the customizer.
 * @param {object} [optionsOrCustomizer] 
 * If an object, this argument is used as a configuration object.
 * @param {import("../public-types").Customizer} optionsOrCustomizer.customizer 
 * Allows the user to inject custom logic. The function is given the value to 
 * copy. If the function returns an object, the value of the `clone` property on 
 * that object will be used as the clone.
 * @param {import("../public-types").Log} optionsOrCustomizer.log 
 * Any errors which occur during the algorithm can optionally be passed to a log 
 * function. `log` should take one argument which will be the error encountered. 
 * Use this to log the error to a custom logger.
 * @param {boolean} optionsOrCustomizer.prioritizePerformance
 * Whether type-checking will be done performantly or robustly.
 * @param {boolean} optionsOrCustomizer.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {string} optionsOrCustomizer.logMode 
 * Case-insensitive. If "silent", no warnings will be logged. Use with caution, 
 * as failures to perform true clones are logged as warnings. If "quiet", the 
 * stack trace of the warning is ignored.
 * @param {boolean} optionsOrCustomizer.letCustomizerThrow 
 * If `true`, errors thrown by the customizer will be thrown by `cloneDeep`. By 
 * default, the error is logged and the algorithm proceeds with default 
 * behavior.
 * @returns {U} The deep copy.
 */
function cloneDeep(value, optionsOrCustomizer) {
    /** @type {import("../public-types").Customizer|undefined} */
    let customizer;

    /** @type {import("../public-types").Log|undefined} */
    let log;

    /** @type {boolean|undefined} */
    let prioritizePerformance;

    /** @type {string|undefined} */
    let logMode;

    /** @type {boolean|undefined} */
    let letCustomizerThrow = false;

    /** @type {boolean|undefined} */
    let ignoreCloningMethods = false;

    if (typeof optionsOrCustomizer === "function")
        customizer = optionsOrCustomizer;
    else if (typeof optionsOrCustomizer === "object") {
        ({ 
            log, 
            prioritizePerformance, 
            logMode,
            ignoreCloningMethods,
            letCustomizerThrow 
        } = optionsOrCustomizer);
        
        customizer = optionsOrCustomizer.customizer;
    }

    if (typeof log !== "function") log = console.warn;

    if (typeof logMode === "string")
        if (logMode.toLowerCase() === "silent")
            log = () => {};
        else if (logMode.toLowerCase() === "quiet")
            /** @type {(error: Error) => void} */
            log = error => console.warn(error.message);
    
    return cloneDeepInternal(value, 
                             customizer, 
                             log, 
                             prioritizePerformance || false, 
                             ignoreCloningMethods || false, 
                             letCustomizerThrow || false);
}
 
export default cloneDeep;
