import cloneDeep from "./clone-deep.js";
import { cloneDeepInternal } from "./utils/clone-deep-internal.js";
import { hasMethods } from "./utils/metadata.js";

/**
 * Deeply clones the provided object and its prototype chain.
 * @template T
 * See the documentation for `cloneDeep`.
 * @template [U = T]
 * See the documentation for `cloneDeep`.
 * @param {T} value The object to clone.
 * @param {import("../public-types").CloneDeepFullyOptions|import("../public-types").Customizer} [options] 
 * If a function, it is used as the customizer for the clone. 
 * @param {object} [options] 
 * If an object, it is used as a configuration object. See the documentation for 
 * `cloneDeep`.
 * @param {boolean} options.force 
 * If `true`, prototypes with methods will be cloned. Normally, this function 
 * stops if it reaches any prototype with methods.
 * @param {import("../public-types").Customizer} options.customizer 
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.ignoreCloningMethods
 * See the documentation for `cloneDeep`.
 * @param {import("../public-types").Log} options.log 
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.prioritizePerformance
 * See the documentation for `cloneDeep`.
 * @param {string} options.logMode 
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.letCustomizerThrow 
 * See the documentation for `cloneDeep`.
 * @returns {U} The deep copy.
 */
export default function cloneDeepFully(value, options) {
    if (typeof options !== "object" && typeof options !== "function") 
        options = {};
    if (typeof options === "object" 
        && typeof options.force !== "boolean") 
        options.force = false;
    
    /** @type {import("../public-types").Customizer|undefined} */
    let customizer;
    let log;
    let prioritizePerformance;
    let ignoreCloningMethods;
    let letCustomizerThrow;

    if (typeof options === "function") customizer = options;
    else ({
        customizer, 
        log, 
        prioritizePerformance, 
        ignoreCloningMethods, 
        letCustomizerThrow
    } = options);

    /** @type {U} */
    const clone = cloneDeep(value, options);
    
    /** @type {any} */
    let tempClone = clone;

    /** @type {any} */
    let tempOrig = value;
    
    let parentObjectRegistry = ignoreCloningMethods !== true 
        ? new Set() 
        : undefined;

    while (tempOrig !== null && ["object", "function"].includes(typeof tempOrig)
           && Object.getPrototypeOf(tempOrig) !== null 
           && (!hasMethods(Object.getPrototypeOf(tempOrig)) 
               || (typeof options === "object" && options.force))) {
        
        const defaultLog = console.warn;

        if (ignoreCloningMethods !== true) 
            parentObjectRegistry?.add(tempOrig);

        const newProto = cloneDeepInternal(
            Object.getPrototypeOf(tempOrig), 
            customizer, 
            log || defaultLog, 
            prioritizePerformance || false,
            ignoreCloningMethods || false, 
            letCustomizerThrow || false,
            parentObjectRegistry);

        Object.setPrototypeOf(tempClone, newProto);
        
        tempClone = Object.getPrototypeOf(tempClone);
        tempOrig = Object.getPrototypeOf(tempOrig);
    }

    return clone;
}
