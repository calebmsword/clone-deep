import cloneDeep from "./clone-deep.js";

/**
 * Deeply clones the provided object and its prototype chain.
 * @param {any} value The object to clone.
 * @param {Object|Function} options Configures the clone. If a function, it is 
 * used as the customizer for the clone. See the documentation for `cloneDeep`.
 * @param {Boolean} options.force If `true`, prototypes with methods will be 
 * cloned. Normally, this function stops if it reaches any prototype with 
 * methods.
 * @param {Function} options.customizer See the documentation for `cloneDeep`.
 * @param {Function} options.log See the documentation for `cloneDeep`.
 * @param {String} options.logMode See the documentation for `cloneDeep`.
 * @param {Boolean} options.letCustomizerThrow See the documentation for 
 * `cloneDeep`.
 * @returns {any} The deep copy.
 */
export function cloneDeepFully(value, options) {
    if (typeof options !== "object") options = {};
    if (typeof options.force !== "boolean") options.force = false;
    
    /**
     * Returns an array of all properties in the object.
     * This includes symbols and non-enumerable properties. `undefined` or 
     * `null` returns an empty array.
     * @param {Object} o An object.
     * @returns {Array[String|Symbol]} An array of property names.
     */
    function getAllPropertiesOf(o) {
        return [Object.getOwnPropertyNames(o), Object.getOwnPropertySymbols(o)]
            .flat();
    }
    
    /**
     * Is true if the provided object has methods. Is false otherwise.
     * @param {Object} o An object
     * @returns {Boolean}
     */
    function hasMethods(o) {
        return getAllPropertiesOf(o).some(key => typeof o[key] === "function");
    }

    const clone = cloneDeep(value, options);

    // `cloneDeep` "clones" functions into empty objects. If you use 
    // `cloneDeepFully` on a function without force, make the prototype 
    // Function.prototype.
    if (typeof value === "function" 
        && value !== Function.prototype 
        && !options.force) {
        Object.setPrototypeOf(clone, Function.prototype);
        return clone;
    }
    
    let tempClone = clone;
    let tempOrig = value;
    
    while (tempOrig !== null && ["object", "function"].includes(typeof tempOrig)
           && Object.getPrototypeOf(tempOrig) !== null 
           && (Object.getPrototypeOf(tempOrig) === Function.prototype
               || !hasMethods(Object.getPrototypeOf(tempOrig)) 
               || options.force)) {
        
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
 * as the result. Non-callable customizers will be skipped.
 * @param {Function[]} customizers An array of customizer functions.
 * @returns {Function} A new customizer which composes the provided customizers.
 */
export function useCustomizers(customizers) {
    return function combinedCustomizer(value) {
        for (const customizer of customizers) {
            if (typeof customizer !== "function") continue;

            const result = customizer(value);
            if (typeof result === "object") return result;
        }
    }
}
