import cloneDeep from "./clone-deep.js";

/**
 * Deeply clones the provided object and its prototype chain.
 * @param {any} value The object to clone.
 * @param {import("./types").CloneDeepFullyOptionsOrCustomizer} [options] 
 * Configures the clone. If a function, it is used as the customizer for the 
 * clone. 
 * @param {object} [options] If an object, it is used as a configuration object.
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.force If `true`, prototypes with methods will be 
 * cloned. Normally, this function stops if it reaches any prototype with 
 * methods.
 * @param {import("./types").Customizer} options.customizer See the 
 * documentation for `cloneDeep`.
 * @param {import("./types").Log} options.log See the documentation for 
 * `cloneDeep`.
 * @param {string} options.logMode See the documentation for `cloneDeep`.
 * @param {boolean} options.letCustomizerThrow See the documentation for 
 * `cloneDeep`.
 * @returns {any} The deep copy.
 */
export function cloneDeepFully(value, options) {
    if (!["object", "function"].includes(typeof options)) 
        options = {};
    if (typeof options === "object" 
        && typeof options.force !== "boolean") 
        options.force = false;
    
    /**
     * Returns an array of all properties in the object.
     * This includes symbols and non-enumerable properties. `undefined` or 
     * `null` returns an empty array.
     * @param {Object} o An object.
     * @returns {(String|Symbol)[]} An array of property names.
     */
    function getAllPropertiesOf(o) {
        /** @readonly */
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
        // TypeScript doesn't allow Symbols to be the index of an object. This 
        // is actually intended behavior. See 
        // https://github.com/Microsoft/TypeScript/issues/24587.
        // @ts-ignore
        return getAllPropertiesOf(o).some(key => typeof o[key] === "function");
    }

    const clone = cloneDeep(value, options);
    
    let tempClone = clone;
    let tempOrig = value;
    
    while (tempOrig !== null && ["object", "function"].includes(typeof tempOrig)
           && Object.getPrototypeOf(tempOrig) !== null 
           && (!hasMethods(Object.getPrototypeOf(tempOrig)) 
               || (typeof options === "object" && options.force))) {
        
        const newProto = cloneDeep(Object.getPrototypeOf(tempOrig), options);

        Object.setPrototypeOf(tempClone, newProto);
        
        tempClone = Object.getPrototypeOf(tempClone);
        tempOrig = Object.getPrototypeOf(tempOrig);
    }

    return clone;
}

/**
 * Creates a customizer which composes other customizers.
 * The customizers are executed in order. The first to return an object is used 
 * as the result. If no customizer returns an object, undefined is returned.
 * @param {Function[]} customizers An array of customizer functions.
 * @returns {Function} A new customizer which composes the provided customizers.
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
