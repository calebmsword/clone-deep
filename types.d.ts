export interface QueueElement {
    value: any,
    parentOrAssigner?: Symbol|Object|Function,
    prop?: string | symbol,
    metadata?: PropertyDescriptor
}

export type Empty = {};

export type Customizer = (value: any) => any|void;

export type Log = (error: Error) => any;

export interface CloneDeepOptions {
    customizer?: Customizer
    log?: Log,
    logMode?: string,
    letCustomizerThrow?: boolean
}

export type CloneDeepOptionsOrCustomizer = CloneDeepOptions | Customizer;

export interface CloneDeepFullyOptions extends CloneDeepOptions {
    force?: boolean
}

export type CloneDeepFullyOptionsOrCustomizer = 
    CloneDeepFullyOptions | Customizer;

declare module "cms-clone-deep" {

/**
 * Create a deep copy of the provided value.
 * The cloned object will point to the *same prototype* as the original.
 * 
 * This behaves like `structuredClone`, but there are differences:
 *  - The function is not recursive, so the call stack does not blow up for 
 * deeply nested objects. (Unfortunately, as of December 2023, V8 implements 
 * structuredClone with a recursive algorithm. Hopefully this will change in the 
 * future.)
 *  - Methods are copied over to the clone. The functions are not clones, they 
 * point to the same function as the original.
 *  - This algorithm works with all of the listed JavaScript types in 
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#javascript_types,
 * as well as Symbols.
 *  - This algorithm does NOT work for the Web API types in
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#webapi_types).
 *  - The property descriptor of properties are preserved. structuredClone 
 * ignores them.
 *  - Unsupported types do not cause errors to be thrown. Instead, unsupported 
 * types are simply "cloned" into an empty object and a noisy warning is logged 
 * to the console (or sent to the custom logger provided).
 * 
 * `WeakMaps` and `WeakSets` are not supported types. It is actually impossible 
 * to properly clone a `WeakMap` or `WeakSet`.
 * 
 * Functions also cannot be properly cloned. If you provide a function to this 
 * method, an empty object will be returned. However, if you provide an object 
 * with methods, they will be copied by value (no new function object will be 
 * created). A warning is logged if this occurs.
 * 
 * This method will clone many of JavaScripts native classes. These include 
 * `Date`, `RegExp`, `ArrayBuffer`, all the `TypedArray` subclasses, `Map`, `
 * Set`, `Number`, `Boolean`, `String`, and `Symbol`. The algorithm type-checks 
 * for these classes using `Object.prototype.toString.call`, so if you utilize 
 * `Symbol.toStringTag` irresponsibly, the algorithm may not correctly identify 
 * types.
 * 
 * An optional `customizer` can be provided to inject additional logic. The 
 * customizer has the responsibility of determining what object a value should 
 * be cloned into. If it returns an object, then the value of the `clone` 
 * property on that object is used as the clone for the given value. If the 
 * object doesn't have a `clone` property, then the value is cloned into 
 * `undefined`. If the customizer returns anything that is not an object, then 
 * the algorithm will perform its default behavior.
 * 
 * @example
 * ```
 * // Don't clone methods
 * const myObject = { 
 *     a: 1, 
 *     func: () => "I am a function" 
 * };
 * const cloned = cloneDeep(myObject, {
 *     customizer(value) {
 *         if (typeof value === "function") {
 *             return { clone: {} };
 *         }
 *     }
 * });
 * console.log(cloned);  // { a: 1, func: {} }
 * ```
 * 
 * The object returned by the customizer can also have an `additionalValues` 
 * property. If it is an array, then it is an array of objects which represent 
 * additional values that will be cloned. The objects in the array must have the 
 * following properties:
 * 
 *  - `value`: It is the value to clone.
 *  - `assigner`: It must be a function. It has the responsiblity of assigning 
 * the clone of `value` to something. It is passed the clone of `value` as an 
 * argument.
 * 
 * The `additionalValues` property should only be used to clone data an object 
 * can only access through its methods. See the following example. 
 * 
 * @example
 * ```
 * class Wrapper {
 *     #value;
 *     get() {
 *         return this.#value;
 *     }
 *     set(value) {
 *         this.#value = value;
 *     }
 * }
 * 
 * const wrapper = new Wrapper();;
 * wrapper.set({ foo: "bar" });
 * 
 * const cloned = cloneDeep(wrapper, {
 *     customizer(value) {
 *         if (!(value instanceof Wrapper)) return;
 * 
 *         const clonedWrapper = new Wrapper();
 *         
 *         return {
 *             clone: clonedWrapper,
 * 
 *             additionalValues: [{
 *                 // the cloning algorithm will clone 
 *                 // value.get()
 *                 value: value.get(),
 * 
 *                 // and the assigner will make sure it is 
 *                 // stored in clone
 *                 assigner(cloned) {
 *                     clonedWrapper.set(cloned)
 *                 }
 *             }]
 *         };
 *     }
 * });
 * 
 * console.log(wrapper.get());  // { foo: "bar" }
 * console.log(cloned.get());   // { foo: "bar" }
 * console.log(cloned.get() === wrapper.get());  // false
 * ```
 * 
 * The customizer object can have some additional effects by having any of the 
 * following properties:
 * 
 *  - `ignoreProps` -  If `true`, the properties of the cloned value will NOT be 
 * cloned.
 *  - `ignoreProto` - If `true`, the prototype of the value will not be copied 
 * to the clone. 
 *  - `ignore` - If `true`, the value will not be cloned at all.
 * 
 * The customizer has extremely high priority over the default behavior of the 
 * algorithm. The only logic the algorithm prioritizes over the customizer is 
 * the check for circular references. 
 * 
 * The best use of the customizer to support user-made types. You can also use 
 * it to override some of the design decisions made in the algorithm (you could, 
 * for example, use it to throw if the user tries to clone functions, 
 * `WeakMaps`, or `WeakSets`).
 * 
 * @param {any} value The value to deeply copy.
 * @param {import("./types").CloneDeepOptionsOrCustomizer} [optionsOrCustomizer] 
 * If a function, this argument is used as the customizer.
 * @param {object} [optionsOrCustomizer] If an object, this argument is used as 
 * a configuration object.
 * @param {import("./types").Customizer} optionsOrCustomizer.customizer Allows 
 * the user to inject custom logic. The function is given the value to copy. If 
 * the function returns an object, the value of the `clone` property on that object will be used as the clone. 
 * See the documentation for `cloneDeep` for more information.
 * @param {import("./types").Log} optionsOrCustomizer.log Any errors which occur 
 * during the algorithm can optionally be passed to a log function. `log` should 
 * take one argument which will be the error encountered. Use this to the log 
 * the error to a custom logger.
 * @param {string} optionsOrCustomizer.logMode Case-insensitive. If "silent", no 
 * warnings will be logged. Use with caution, as failures to perform true clones 
 * are logged as warnings. If "quiet", the stack trace of the warning is 
 * ignored.
 * @param {boolean} optionsOrCustomizer.letCustomizerThrow If `true`, errors 
 * thrown by the customizer will be thrown by `cloneDeep`. By default, the error 
 * is logged and the algorithm proceeds with default behavior.
 * @returns {Object} The deep copy.
 */
export default function cloneDeep(
    value: any, 
    customizerOrOptions: CloneDeepOptionsOrCustomizer
) : any;
    
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
export function cloneDeepFully(
    value: any,
    customizerOrOptions: CloneDeepFullyOptionsOrCustomizer
) : any;

/**
 * Creates a customizer which composes other customizers.
 * The customizers are executed in order. The first to return an object is used 
 * as the result. If no customizer returns an object, undefined is returned.
 * @param {Function[]} customizers An array of customizer functions.
 * @returns {Function} A new customizer which composes the provided customizers.
 */
export function useCustomizer(customizers: Customizer[]) : Customizer;
}
