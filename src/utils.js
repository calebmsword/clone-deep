import cloneDeep, { cloneInternalNoRecursion } from "./clone-deep.js";

/**
 * Creates a customizer which composes other customizers.
 * The customizers are executed in order. The first to return an object is used 
 * as the result. If no customizer returns an object, undefined is returned.
 * @param {import("../public-types").Customizer[]} customizers 
 * An array of customizer functions.
 * @returns {import("../public-types").Customizer} 
 * A new customizer which composes the provided customizers.
 */
export function useCustomizers(customizers) {
    if (!Array.isArray(customizers)
        || customizers.some(element => typeof element !== "function"))
        throw new Error("useCustomizers must receive an array of functions");
    
    /**
     * @param {any} value
     * @returns {object|void}
     */
    return function combinedCustomizer(value) {
        for (const customizer of customizers) {
            const result = customizer(value);
            if (typeof result === "object") return result;
        }
    }
}

/**
 * Deeply clones the provided object and its prototype chain.
 * @template T
 * See the documentation for `cloneDeep`.
 * @template [U = T]
 * See the documentation for `cloneDeep`.
 * @param {T} value The object to clone.
 * @param {import("../public-types.js").CloneDeepFullyOptions|import("../public-types.js").Customizer} [options] 
 * If a function, it is used as the customizer for the clone. 
 * @param {object} [options] 
 * If an object, it is used as a configuration object. See the documentation for 
 * `cloneDeep`.
 * @param {boolean} options.force 
 * If `true`, prototypes with methods will be cloned. Normally, this function 
 * stops if it reaches any prototype with methods.
 * @param {import("../public-types.js").Customizer} options.customizer 
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.ignoreCloningMethods
 * See the documentation for `cloneDeep`.
 * @param {import("../public-types.js").Log} options.log 
 * See the documentation for `cloneDeep`.
 * @param {string} options.logMode 
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.letCustomizerThrow 
 * See the documentation for `cloneDeep`.
 * @returns {U} The deep copy.
 */
export function cloneDeepFully(value, options) {
    if (typeof options !== "object" && typeof options !== "function") 
        options = {};
    if (typeof options === "object" 
        && typeof options.force !== "boolean") 
        options.force = false;
    
    /** @type {import("../public-types").Customizer|undefined} */
    let customizer;
    let log;
    let ignoreCloningMethods;
    let letCustomizerThrow;

    if (typeof options === "function") customizer = options;
    else ({
        customizer,
        log,
        ignoreCloningMethods,
        letCustomizerThrow
    } = options);
    
    /**
     * Returns an array of all properties in the object.
     * This includes symbols and non-enumerable properties. `undefined` or 
     * `null` returns an empty array.
     * @param {Object} o An object.
     * @returns {(string|symbol)[]} An array of property names.
     */
    function getAllPropertiesOf(o) {
        return [Object.getOwnPropertyNames(o), Object.getOwnPropertySymbols(o)]
            .flat();
    }
    
    /**
     * Is true if the provided object has methods. Is false otherwise.
     * @param {any} o An object
     * @returns {Boolean}
     */
    function hasMethods(o) {
        // We cannot access some properties of Function.prototype in strict mode
        if (o === Function.prototype) return true;
        return getAllPropertiesOf(o).some(key => typeof o[key] === "function");
    }

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

        const newProto = cloneInternalNoRecursion(
            Object.getPrototypeOf(tempOrig), 
            customizer, 
            log || defaultLog, 
            ignoreCloningMethods || false, 
            letCustomizerThrow || false,
            parentObjectRegistry);

        Object.setPrototypeOf(tempClone, newProto);
        
        tempClone = Object.getPrototypeOf(tempClone);
        tempOrig = Object.getPrototypeOf(tempOrig);
    }

    return clone;
}
