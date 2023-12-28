/**
 * Contains the tag for all supported types.
 */
export const Tag = Object.freeze({
    ARGUMENTS: '[object Arguments]',
    ARRAY: '[object Array]',
    BOOLEAN: '[object Boolean]',
    DATE: '[object Date]',
    ERROR: '[object Error]',
    MAP: '[object Map]',
    NUMBER: '[object Number]',
    OBJECT: '[object Object]',
    REGEXP: '[object RegExp]',
    SET: '[object Set]',
    STRING: '[object String]',
    SYMBOL: '[object Symbol]',
    WEAKMAP: '[object WeakMap]',
    WEAKSET: "[object WeakSet]",
    ARRAYBUFFER: '[object ArrayBuffer]',
    DATAVIEW: '[object DataView]',
    FLOAT32: '[object Float32Array]',
    FLOAT64: '[object Float64Array]',
    INT8: '[object Int8Array]',
    INT16: '[object Int16Array]',
    INT32: '[object Int32Array]',
    UINT8: '[object Uint8Array]',
    UINT8CLAMPED: '[object Uint8ClampedArray]',
    UINT16: '[object Uint16Array]',
    UINT32: '[object Uint32Array]',
    BIGINT64: "[object BigInt64Array]",
    BIGUINT64: "[object BigUint64Array]"
});

/**
 * Used to log warnings.
 */
class CloneDeepWarning extends Error {
    constructor(message, cause) {
        super(message, cause);
        this.name = CloneDeepWarning.name;
    }
}

/**
 * Common CloneDeepWarning instances.
 */
const Warning = {
    ACCESSOR: getWarning("Cloning value whose property descriptor is a " + 
                            "get or set accessor."),
    WEAKMAP: getWarning("Attempted to clone unsupported type WeakMap."),
    WEAKSET: getWarning("Attempted to clone unsupported type WeakSet."),
    FUNCTION_DOT_PROTOTYPE: getWarning(
        "Attempted to clone Function.prototype. strict mode does not allow " + 
        "the `caller`, `callee` or `arguments` properties to be accessed. " + 
        "Native methods also cannot be cloned, so they will copied directly. ")
}

/**
 * Creates a CloneDeepWarning instance, a subclass of Error.
 * @param {String} message The error message.
 * @param {Object} cause If an object with a `cause` property, it will add a 
 * cause to the error when logged.
 * @returns {Error} A CloneDeepWarning, which is an Error subclass.
 */
function getWarning(message, cause) {
    return new CloneDeepWarning(message, cause);
}

/** 
 * This symbol is used to indicate that the cloned value is the top-level object 
 * that will be returned by `cloneDeep`.
 * @type {Symbol}
 */ 
const TOP_LEVEL = Symbol("TOP_LEVEL");

/**
 * Gets a "tag", which is an string which identifies the type of a value.
 * `Object.prototype.toString` returns a string like `"[object <Type>]"`,  where 
 * type is the type of the object. We refer this return value as the **tag**. 
 * Normally, the tag is determined by what `this[Symbol.toStringTag]` is, but 
 * the JavaScript specification for `Object.prototype.toString` requires that 
 * many native JavaScript objects return a specific tag if the object does not 
 * have the `Symbol.toStringTag` property. Also, classes introduced after ES6 
 * typically have their own non-writable `Symbol.toStringTag` property. This 
 * makes `Object.prototype.toString.call` a stronger type-check that 
 * `instanceof`.
 * 
 * @example
 * ```
 * const date = new Date();
 * console.log(date instanceof Date);  // true
 * console.log(tagOf(date));  // "[object Date]"
 * 
 * const dateSubclass = Object.create(Date.prototype);
 * console.log(dateSubclass instance Date);  // true;
 * console.log(tagOf(dateSubClass));  // "[object Object]"
 * 
 * // This is not a perfect type check because we can do:
 * dateSubclass[Symbol.toStringTag] = "Date"
 * console.log(tagOf(dateSubClass));  // "[object Date]"
 * ```
 * 
 * @param {any} value The value to get the tag of.
 * @returns {String} tag A string indicating the value's type.
 */
function tagOf(value) {
    return Object.prototype.toString.call(value);
}

/**
 * Returns `true` if tag is that of a TypedArray subclass, `false` otherwise.
 * @param {String} tag A tag. See `tagOf`.
 * @returns {Boolean}
 */
function isTypedArray(tag) {
    return [   
        Tag.DATAVIEW, 
        Tag.FLOAT32,
        Tag.FLOAT64,
        Tag.INT8,
        Tag.INT16,
        Tag.INT32,
        Tag.UINT8,
        Tag.UINT8CLAMPED,
        Tag.UINT16,
        Tag.UINT32,
        Tag.BIGINT64,
        Tag.BIGUINT64
    ].includes(tag);
}

/**
 * Clones the provided value.
 * @param {any} _value The value to clone.
 * @param {Function} customizer A customizer function.
 * @param {Function} log Receives an error object for logging.
 * @param {Boolean} doThrow Whether errors in the customizer should cause the 
 * function to throw.
 * @returns {Object}
 */
function cloneInternalNoRecursion(_value, customizer, log, doThrow) {
    
    /**
     * Handles the assignment of the cloned value to some persistent place.
     * @param {any} cloned The cloned value.
     * @param {Object|Function|Symbol} parentOrAssigner Either the parent object 
     * that the cloned value will be assigned to, or a function which assigns 
     * the value itself. If equal to TOP_LEVEL, then it is the value that will 
     * be returned by the algorithm. 
     * @param {String|Symbol} prop If `parentOrAssigner` is a parent object, 
     * then `parentOrAssigner[prop]` will be assigned `cloned`.
     * @param {Object} metadata The property descriptor for the object. If not 
     * an object, then this is ignored.
     * @returns The cloned value.
     */
    function assign(cloned, parentOrAssigner, prop, metadata) {
        if (parentOrAssigner === TOP_LEVEL) 
            result = cloned;
        else if (typeof parentOrAssigner === "function") 
            parentOrAssigner(cloned, prop, metadata);
        else if (typeof metadata === "object") {
            const clonedMetadata = { 
                configurable: metadata.configurable,
                enumerable: metadata.enumerable
            };

            const hasAccessor = ["get", "set"].some(key => 
                typeof metadata[key] === "function");
            
            if (!hasAccessor) {
                // `cloned` or getAccessor will determine the value
                clonedMetadata.value = cloned;

                // defineProperty throws if property with accessors is writeable
                clonedMetadata.writable = metadata.writeable;
            }

            if (typeof metadata.get === "function")
                clonedMetadata.get = metadata.get;
            if (typeof metadata.set === "function")
                clonedMetadata.set = metadata.set;

            if (hasAccessor) log(Warning.ACCESSOR);

            Object.defineProperty(parentOrAssigner, prop, clonedMetadata);
        }
        return cloned;
    }

    if (typeof log !== "function") log = console.warn;

    /** 
     * Contains the return value of this function.
     * @type {Symbol}
     */
    let result;

    /** 
     * Will be used to store cloned values so that we don't loop infinitely on 
     * circular references.
     * @type {Symbol}
     */ 
    const cloneStore = new Map();

    /** 
     * A queue so we can avoid recursion.
     * @type {Object[]}
     */ 
    const queue = [{ value: _value, parentOrAssigner: TOP_LEVEL }];
    
    /** 
     * We will do a second pass through everything to check Object.isExtensible,
     * Object.isSealed and Object.isFrozen. We do it last so we don't run into 
     * issues where we append properties on a frozen object, etc.
     * @type {Object[]}
     */ 
    const isExtensibleSealFrozen = [];

    for (let obj = queue.shift(); obj !== undefined; obj = queue.shift()) {
        /**
         * The value to deeply clone.
         * @type {any}
         */ 
        const value = obj.value;

        /** 
         * `parentOrAssigner` is either
         *  - `TOP_LEVEL`: this value is the top-level object that will be 
         * returned by the function
         *  - object: a parent object `value` is nested under
         *  - function: an "assigner" that has the responsibility of assigning 
         * the cloned value to something
         * @type {Symbol|Object|Function|undefined}
         */ 
        const parentOrAssigner = obj.parentOrAssigner;

        /**
         * `prop` is used with `parentOrAssigner` if it is an object so that the 
         * cloned object will be assigned to `parentOrAssigner[prop]`.
         * @type {String|undefined}
         */
        const prop = obj.prop;

        /**
         * Contains the property descriptor for this value, or undefined.
         * @type {Object|undefined}
         */
        const metadata = obj.metadata;

        /**
         * Will contain the cloned object.
         * @type {any}
         */
        let cloned;

        // See if we have a circular reference.
        const seen = cloneStore.get(value);
        if (seen !== undefined) {
            assign(seen, parentOrAssigner, prop, metadata);
            continue;
        }

        /**
         * If true, do not not clone the properties of value.
         * @type {Boolean}
         */
        let ignoreProps = false;

        /**
         * If true, do not have `cloned` share the prototype of `value`.
         * @type {Boolean}
         */
        let ignoreProto = false;
        
        /**
         * Is true if the customizer determines the value of `cloned`.
         * @type {Boolean}
         */
        let useCustomizerClone;

        // Perform user-injected logic if applicable.
        if (typeof customizer === "function") {

            let clone, additionalValues, ignore;

            try {
                const customResult = customizer(value);
                
                if (typeof customResult === "object") {
                    useCustomizerClone = true;

                    // Must wrap destructure in () if not variable declaration
                    ({ clone, 
                       additionalValues,
                       ignore,
                       ignoreProps,
                       ignoreProto
                    } = customResult);

                    if (ignore === true) continue;

                    cloned = assign(clone, 
                                    parentOrAssigner, 
                                    prop, 
                                    metadata);

                    if (Array.isArray(additionalValues))
                        additionalValues.forEach(object => {
                            if (typeof object === "object") {
                                queue.push({
                                    value: object.value,
                                    parentOrAssigner: object.assigner
                                });
                            }
                        });
                }
            }
            catch(error) {
                if (doThrow === true) throw error;

                clone = undefined;
                useCustomizerClone = false;
                
                error.message = "customizer encountered error. Its results " + 
                                "will be ignored for the current value, and " + 
                                "the algorithm will proceed with default " + 
                                "behavior. Error encountered: " + error.message;
                log(getWarning(error.message, error.cause));
            }
        }

        /**
         * Identifies the type of the value.
         * @type {String}
         */
        const tag = tagOf(value);

        try {
            // skip the following "else if" branches
            if (useCustomizerClone === true) {}

            // If value is primitive, just assign it directly.
            else if (value === null || !["object", "function"]
                        .includes(typeof value)) {
                assign(value, parentOrAssigner, prop, metadata);
                continue;
            }

            // We won't clone weakmaps or weaksets.
            else if ([Tag.WEAKMAP, Tag.WEAKSET].includes(tag))
                throw tag === Tag.WEAKMAP ? Warning.WEAKMAP : Warning.WEAKSET;
            
            else if (value === Function.prototype) {
                // Brute-force copy Function.prototype.
                // The values are methods or primitives so no nesting/circular 
                // references. It is easiest to just copy everything by hand.
                // Warning: the caller, callee, and arguments properties cannot 
                // be accessed in strict mode. So don't copy those.
                const clone = {};  // inherit from Object.prototype
                [
                    Object.getOwnPropertyNames(Function.prototype),
                    Object.getOwnPropertySymbols(Function.prototype)
                ]
                    .forEach(array => {
                        array.forEach(key => {
                            if (["caller", "callee", "arguments"].includes(key))
                                return;
                            Object.defineProperty(
                                clone, 
                                key, 
                                Object.getOwnPropertyDescriptor(
                                    Function.prototype, key));
                        });
                    });
                cloned = assign(clone, parentOrAssigner, prop, metadata);
                log(Warning.FUNCTION_DOT_PROTOTYPE);
                continue;
            }
            
            // We only copy functions if they are methods.
            else if (typeof value === "function") {
                cloned = assign(parentOrAssigner !== TOP_LEVEL 
                        ? value 
                        : {}, 
                    parentOrAssigner, 
                    prop, 
                    metadata);
                    log(getWarning(`Attempted to clone function` + 
                                   `${typeof prop === "string"
                                        ? ` with name ${prop}`
                                        : ""  }. ` + 
                                   "JavaScript functions cannot be cloned. " + 
                                   "If this function is a method, then it " + 
                                   "will be copied directly."));
                if (parentOrAssigner === TOP_LEVEL) continue;
            }
            
            else if (Array.isArray(value))
                cloned = assign(new Array(value.length), 
                                parentOrAssigner, 
                                prop, 
                                metadata);

            // Ordinary objects, or the rare `arguments` clone
            else if ([Tag.OBJECT, Tag.ARGUMENTS].includes(tag))
                cloned = assign(Object.create(Object.getPrototypeOf(value)), 
                                parentOrAssigner, 
                                prop,
                                metadata);
            
            // values that will be called using contructor
            else {
                const Value = value.constructor;

                // Booleans, Number, String or Symbols which used `new` syntax 
                // so JavaScript thinks they are objects
                // We also handle Date here because it is convenient
                if ([Tag.BOOLEAN, Tag.DATE].includes(tag))
                    cloned = assign(new Value(Number(value)), 
                                    parentOrAssigner, 
                                    prop,
                                    metadata);
                else if ([Tag.NUMBER, Tag.STRING].includes(tag))
                    cloned = assign(new Value(value), 
                                    parentOrAssigner, 
                                    prop, 
                                    metadata);
                else if (Tag.SYMBOL === tag) {
                    cloned = assign(
                        Object(Symbol.prototype.valueOf.call(value)), 
                        parentOrAssigner, 
                        prop,
                        metadata);
                }

                else if (Tag.REGEXP === tag) {
                    const regExp = new Value(value.source, /\w*$/.exec(value));
                    regExp.lastIndex = value.lastIndex;
                    cloned = assign(regExp, parentOrAssigner, prop, metadata);
                }

                else if (Tag.ERROR === tag) {
                    const cause = value.cause;
                    cloned = assign(cause === undefined
                                        ? new Value(value.message)
                                        : new Value(value.message, { cause }),
                                    parentOrAssigner,
                                    prop,
                                    metadata);
                }

                else if (Tag.ARRAYBUFFER === tag) {
                    // copy data over to clone
                    const arrayBuffer = new Value(value.byteLength);
                    new Uint8Array(arrayBuffer).set(new Uint8Array(value));
                    
                    cloned = assign(arrayBuffer, 
                                    parentOrAssigner, 
                                    prop, 
                                    metadata);
                }
                
                else if (isTypedArray(tag)) {
                    // copy data over to clone
                    const buffer = new value.buffer.constructor(
                        value.buffer.byteLength);
                    new Uint8Array(buffer).set(new Uint8Array(value.buffer));
                    
                    cloned = assign(
                        new Value(buffer, value.byteOffset, value.length),
                        parentOrAssigner,
                        prop,
                        metadata);
                }

                else if (Tag.MAP === tag) {
                    const map = new Value;
                    cloned = assign(map, parentOrAssigner, prop, metadata);
                    value.forEach((subValue, key) => {
                        queue.push({ 
                            value: subValue, 
                            parentOrAssigner: cloned => {
                                isExtensibleSealFrozen.push([subValue, cloned]);
                                map.set(key, cloned)
                            }
                        });
                    });
                }

                else if (Tag.SET === tag) {
                    const set = new Value;
                    cloned = assign(set, parentOrAssigner, prop, metadata);
                    value.forEach(subValue => {
                        queue.push({ 
                            value: subValue, 
                            parentOrAssigner: cloned => {
                                isExtensibleSealFrozen.push([subValue, cloned]);
                                set.add(cloned)
                            }
                        });
                    });
                }

                else
                    throw getWarning("Attempted to clone unsupported type.");
            }
        }
        catch(error) {
            error.message = "Encountered error while attempting to clone " + 
                            "specific value. The value will be \"cloned\" " + 
                            "into an empty object. Error encountered: " + 
                            error.message
            log(getWarning(error.message, error.cause));
            cloned = assign({}, parentOrAssigner, prop, metadata);

            // We don't want the prototype if we failed and set the value to an 
            // empty object.
            ignoreProto = true;
        }

        // If the customizer returned a primitive, skip the following.
        if (useCustomizerClone && cloned === null || typeof cloned !== "object")
            continue;

        cloneStore.set(value, cloned);

        isExtensibleSealFrozen.push([value, cloned]);

        // Ensure clone has prototype of value
        if (ignoreProto !== true
            && Object.getPrototypeOf(cloned) !== Object.getPrototypeOf(value))
            Object.setPrototypeOf(cloned, Object.getPrototypeOf(value));
        
        if (ignoreProps === true) continue;

        // Now copy all enumerable and non-enumerable properties.
        [Object.getOwnPropertyNames(value), Object.getOwnPropertySymbols(value)]
            .forEach(array => {
                array.forEach(key => {
                    
                    // We already assigned TypedArray elements. Only add prop if 
                    // it isn't already assigned.
                    if (isTypedArray(tag) 
                        && Number.isInteger(Number(key))
                        && Number(key) >= 0
                        && Number(key) < value.byteLength)
                        return;

                    queue.push({ 
                        value: value[key], 
                        parentOrAssigner: cloned,
                        prop: key,
                        metadata: Object.getOwnPropertyDescriptor(value, key)
                    });
                });
            });
    }

    // Check extensible, seal, and frozen statuses.
    isExtensibleSealFrozen.forEach(([value, cloned]) => {
        if (!Object.isExtensible(value)) Object.preventExtensions(cloned);
        if (Object.isSealed(value)) Object.seal(cloned);
        if (Object.isFrozen(value)) Object.freeze(cloned);
    });

    return result;
}

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
 * as well as Symbols and Node Buffer objects.
 *  - This algorithm does NOT work for the Web API types in
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#webapi_types).
 *  - The property descriptor of properties are preserved. structuredClone 
 * ignores them.
 *  - Unsupported types do not cause errors to be thrown. Instead, unsupported 
 * types are simply "cloned" into an empty object and a noisy warning is logged 
 * to the console (or sent to the custom logger provided).
 * 
 * WeakMaps and WeakSets are not supported types. It is actually impossible to 
 * properly clone a WeakMap or WeakSet.
 * 
 * Functions also cannot be properly cloned. If you provide a function to this 
 * method, an empty object will be returned. However, if you provide an object 
 * with methods, they will be copied by value (no new function object will be 
 * created). A warning is logged if this occurs. Note that 
 * `typeof Function.prototype === "function"` so Function.prototype is handled 
 * just like functions.
 * 
 * This method will clone many of JavaScripts native classes. These include 
 * Date, RegExp, ArrayBuffer, all the TypedArray subclasses, Map, Set, Number, 
 * Boolean, String, and Symbol. The algorithm type-checks for these classes 
 * using `Object.prototype.toString.call`, so if you override the 
 * `Symbol.toStringTag` irresponsibly, the algorithm may incorrectly try to 
 * clone a value into a native type.
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
 * for example, use it to throw if the user tries to clone functions, WeakMaps, 
 * or WeakSets). 
 * 
 * @param {any} value The value to deeply copy.
 * @param {Object|Function} options If a function, then this argument is used as 
 * the customizer. If an object, it is used as a configuration object.
 * @param {Function} options.customizer Allows the user to inject custom logic. 
 * The function is given the value to copy. If the function returns an object, 
 * the value of the `clone` property on that object will be used as the clone. 
 * See the documentation for `cloneDeep` for more information.
 * @param {Function} options.log Any errors which occur during the algorithm can 
 * optionally be passed to a log function. `log` should take one argument, which 
 * will be the error encountered. Use this to the log the error to a custom 
 * logger.
 * @param {String} options.logMode Case-insensitive. If "silent", no warnings 
 * will be logged. Use with caution, as failures to perform true clones are
 * logged as warnings. If "quiet", the stack trace of the warning is ignored.
 * @param {Boolean} options.letCustomizerThrow If `true`, errors thrown by the 
 * customizer will be thrown by `cloneDeep`. By default, the error is logged and 
 * the algorithm proceeds with default behavior.
 * @returns {Object} The deep copy.
 */
function cloneDeep(value, options) {
    if (typeof options === "function") options = { customizer: options };
    else if (typeof options !== "object") options = {};

    let { customizer, log, logMode, letCustomizerThrow } = options;

    if (typeof logMode !== "string" || typeof log === "function");
    else if (logMode.toLowerCase() === "silent")
        log = () => { /* no-op */ };
    else if (logMode.toLowerCase() === "quiet")
        log = error => console.warn(error.message);

    return cloneInternalNoRecursion(value, customizer, log, letCustomizerThrow);
}
 
export default cloneDeep;
