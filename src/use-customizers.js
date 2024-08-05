/**
 * Creates a customizer which composes other customizers.
 * The customizers are executed in order. The first to return an object is used 
 * as the result. If no customizer returns an object, undefined is returned.
 * @param {import("../public-types").Customizer[]} customizers 
 * An array of customizer functions.
 * @returns {import("../public-types").Customizer} 
 * A new customizer which composes the provided customizers.
 */
export default function useCustomizers(customizers) {
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
