import { 
    getTag, 
    getAtomicErrorConstructor, 
    getTypedArrayConstructor,
    Tag, 
    supportedPrototypes, 
    forbiddenProps,
    getWarning,
    Warning,
    isTypedArray,
    CLONE,
    isIterable,
    cloneFile,
    createFileList
} from "./internals.js";

/** 
 * This symbol is used to indicate that the cloned value is the top-level object 
 * that will be returned by {@link cloneDeep}.
 * @type {symbol}
 */ 
const TOP_LEVEL = Symbol("TOP_LEVEL");

/**
 * Clones the provided value.
 * @template T
 * See CloneDeep.
 * @template [U = T]
 * See CloneDeep.
 * @param {T} _value 
 * The value to clone.
 * @param {import("../public-types.js").Customizer|undefined} customizer 
 * A customizer function.
 * @param {import("../public-types.js").Log} log 
 * Receives an error object for logging.
 * @param {boolean} ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} doThrow 
 * Whether errors in the customizer should cause the function to throw.
 * @param {Set<any>} [parentObjectRegistry]
 * This is used by cloneDeepFully to check if an object with a cloning method is 
 * in the prototype of an object that was cloned earlier in the chain.
 * @returns {U}
 */
export function cloneInternalNoRecursion(_value, 
                                         customizer, 
                                         log,
                                         ignoreCloningMethods, 
                                         doThrow,
                                         parentObjectRegistry) {

    /**
     * Handles the assignment of the cloned value to some persistent place.
     * @param {any} cloned The cloned value.
     * @param {Object|import("../private-types.js").assigner|Symbol|Object} 
     * [parentOrAssigner] Either the parent object that the cloned value will 
     * be assigned to, or a function which assigns the value itself. If equal to 
     * `TOP_LEVEL`, then it is the value that will be returned by the algorithm. 
     * @param {PropertyKey} [prop] If `parentOrAssigner` is a parent 
     * object, then `parentOrAssigner[prop]` will be assigned `cloned`.
     * @param {PropertyDescriptor} [metadata] The property descriptor 
     * for the object. If not an object, then this is ignored.
     * @returns {any} The cloned value.
     */
    function assign(cloned, parentOrAssigner, prop, metadata) {
        if (parentOrAssigner === TOP_LEVEL) 
            result = cloned;
        else if (typeof parentOrAssigner === "function") 
            parentOrAssigner(cloned, prop, metadata);
        else if (typeof prop !== "undefined" && typeof metadata === "object") {
            /** @type {PropertyDescriptor} */
            const clonedMetadata = { 
                configurable: metadata.configurable,
                enumerable: metadata.enumerable
            };

            const hasAccessor = typeof metadata.get === "function"
                                || typeof metadata.set === "function";
            
            if (!hasAccessor) {
                // `cloned` or getAccessor will determine the value
                clonedMetadata.value = cloned;

                // defineProperty throws if property with accessors is writable
                clonedMetadata.writable = metadata.writable;
            }

            if (typeof metadata.get === "function")
                clonedMetadata.get = metadata.get;
            if (typeof metadata.set === "function")
                clonedMetadata.set = metadata.set;

            if (hasAccessor) 
                log(getWarning(
                    `Cloning value with name ${String(prop)} whose property ` +
                    "descriptor contains a get or set accessor."));

            Object.defineProperty(parentOrAssigner, prop, clonedMetadata);
        }
        return cloned;
    }

    /** 
     * Contains the return value of this function.
     * @type {any}
     */
    let result;

    /** 
     * Will be used to store cloned values so that we don't loop infinitely on 
     * circular references.
     */ 
    const cloneStore = new Map();

    /** 
     * A queue so we can avoid recursion.
     * @type {import("../private-types.js").QueueElement[]}
     */ 
    const queue = [{ value: _value, parentOrAssigner: TOP_LEVEL }];
    
    /** 
     * We will do a second pass through everything to check Object.isExtensible,
     * Object.isSealed and Object.isFrozen. We do it last so we don't run into 
     * issues where we append properties on a frozen object, etc.
     * @type {Array<[any, any]>}
     */ 
    const isExtensibleSealFrozen = [];

    for (let obj = queue.shift(); obj !== undefined; obj = queue.shift()) {

        /**
         * The value to deeply clone.
         */ 
        const value = obj.value;

        /** 
         * `parentOrAssigner` is either
         *  - `TOP_LEVEL`: this value is the top-level object that will be 
         * returned by the function
         *  - object: a parent object `value` is nested under
         *  - function: an "assigner" that has the responsibility of assigning 
         * the cloned value to something
         */ 
        const parentOrAssigner = obj.parentOrAssigner;

        /**
         * `prop` is used with `parentOrAssigner` if it is an object so that the 
         * cloned object will be assigned to `parentOrAssigner[prop]`.
         */
        const prop = obj.prop;

        /**
         * Contains the property descriptor for this value, or undefined.
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
         * @type {boolean|undefined}
         */
        let ignoreProps = false;

        /**
         * If true, do not have `cloned` share the prototype of `value`.
         * @type {boolean|undefined}
         */
        let ignoreProto = false;
        
        /**
         * Is true if the customizer determines the value of `cloned`.
         * @type {boolean}
         */
        let useCustomizerClone = false;

        /**
         * Any properties in `value` added here will not be cloned.
         * @type {(string|symbol)[]}
         */
        let propsToIgnore = [];

        /**
         * Whether the cloning methods should be observed this loop.
         * @type {boolean}
         */
        let ignoreCloningMethodsThisLoop = false;

        // Perform user-injected logic if applicable.
        if (typeof customizer === "function") {

            /** @type {any} */
            let clone;

            /** @type {import("../public-types.js").AdditionalValue[]|undefined} */
            let additionalValues; 

            /** @type {boolean|undefined} */
            let ignore;

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

                    cloned = assign(clone, parentOrAssigner, prop, metadata);

                    if (Array.isArray(additionalValues))
                        additionalValues.forEach(object => {
                            if (typeof object === "object" 
                                && typeof object.assigner === "function")
                                queue.push({
                                    value: object.value,
                                    parentOrAssigner: object.assigner
                                });
                            else throw Warning.IMPROPER_ADDITIONAL_VALUES;
                        });
                    else if (additionalValues !== undefined)
                        throw Warning.IMPROPER_ADDITIONAL_VALUES;
                }
            }
            catch(error) {
                if (doThrow === true) throw error;

                clone = undefined;
                useCustomizerClone = false;
                
                const msg = "customizer encountered error. Its results will " + 
                            "be ignored for the current value and the " + 
                            "algorithm will proceed with default behavior. "

                if (error instanceof Error) {
                    error.message = `${msg}Error encountered: ${error.message}`;
                    
                    const cause = error.cause 
                        ? { cause: error.cause } 
                        : undefined;
                    
                    const stack = error.stack ? error.stack : undefined;
                    log(getWarning(error.message, cause, stack));
                }
                else 
                    log(getWarning(msg, { cause: error }));
            }
        }

        /**
         * Identifies the type of the value.
         * @type {String}
         */
        const tag = getTag(value);

        // Check if we should observe cloning methods on this loop
        if (parentObjectRegistry !== undefined) [...parentObjectRegistry].some(
            object => ignoreCloningMethodsThisLoop = value === object
                ?.constructor
                ?.prototype);

        if (forbiddenProps[tag] !== undefined
            && forbiddenProps[tag].prototype === value)
            log(getWarning(
                `Attempted to clone ${tag.substring(8, tag.length - 1)}` + 
                ".prototype. This object cannot have the following properties" + 
                `accessed: ${forbiddenProps[tag].properties.join(", ")}. The ` + 
                "cloned object will not have any inaccessible properties."
            ));
        
        try {
            // skip the following "else if" branches
            if (useCustomizerClone === true) {}

            // If value is primitive, just assign it directly.
            else if (value === null || !["object", "function"]
                        .includes(typeof value)) {
                assign(value, parentOrAssigner, prop, metadata);
                continue;
            }

            // We won't clone weakmaps or weaksets (or their prototypes).
            else if ([Tag.WEAKMAP, Tag.WEAKSET].includes(tag))
                throw tag === Tag.WEAKMAP ? Warning.WEAKMAP : Warning.WEAKSET;
            
            // If object defines its own means of getting cloned, use it
            else if (typeof value[CLONE] === "function" 
                     && ignoreCloningMethods !== true
                     && ignoreCloningMethodsThisLoop === false) {
                
                /** @type {import("../public-types.js").CloneMethodResult<any>} */
                const result = value[CLONE]();
                
                if (result.propsToIgnore !== undefined)
                    if (Array.isArray(result.propsToIgnore) &&
                        result
                            .propsToIgnore
                            .every(
                                /** @param {any} s */
                                s => ["string", "symbol"].includes(typeof s))) 
                        propsToIgnore.push(...result.propsToIgnore);
                    else log(getWarning("return value of CLONE method is an " + 
                                    "object whose propsToIgnore property, " + 
                                    "if not undefined, is expected to be an " + 
                                    "array of strings or symbols. The given " + 
                                    "result is not this type of array so it " + 
                                    "will have no effect."));

                if (typeof result.ignoreProps === "boolean")
                    ignoreProps = result.ignoreProps;

                if (typeof result.ignoreProto === "boolean")
                    ignoreProto = result.ignoreProto;

                cloned = assign(result.clone, 
                                parentOrAssigner, 
                                prop, 
                                metadata);
            }
            
            // Ordinary objects, or the rare `arguments` clone.
            // Also, treat prototypes like ordinary objects. The tag wrongly 
            // indicates that prototypes are instances of themselves.
            else if ([Tag.OBJECT, Tag.ARGUMENTS].includes(tag)
                     || supportedPrototypes.includes(value))
                cloned = assign(Object.create(Object.getPrototypeOf(value)), 
                                parentOrAssigner, 
                                prop,
                                metadata);

            // We only copy functions if they are methods.
            else if (typeof value === "function") {
                cloned = assign(parentOrAssigner !== TOP_LEVEL 
                        ? value 
                        : Object.create(Function.prototype), 
                    parentOrAssigner, 
                    prop, 
                    metadata);
                    log(getWarning(`Attempted to clone function` + 
                                   `${typeof prop === "string"
                                        ? ` with name ${prop}`
                                        : ""  }. ` + 
                                   "JavaScript functions cannot be reliably " +
                                   "cloned. If this function is a method, " + 
                                   "it will be copied directly. If this is " + 
                                   "the top-level object being cloned, then " + 
                                   "an empty object will be returned."));
                if (parentOrAssigner === TOP_LEVEL) continue;
            }
            
            else if (Array.isArray(value))
                cloned = assign(new Array(value.length), 
                                parentOrAssigner, 
                                prop, 
                                metadata);

            else if ([Tag.BOOLEAN, Tag.DATE].includes(tag)) {
                /** @type {BooleanConstructor|DateConstructor} */
                const BooleanOrDateConstructor = tag === Tag.DATE 
                    ? Date 
                    : Boolean;

                cloned = assign(new BooleanOrDateConstructor(Number(value)), 
                                parentOrAssigner, 
                                prop,
                                metadata);
            }
            else if ([Tag.NUMBER, Tag.STRING].includes(tag)) {
                /** @type {NumberConstructor|StringConstructor} */
                const NumberOrStringConstructor = tag === Tag.NUMBER 
                    ? Number 
                    : String;

                cloned = assign(new NumberOrStringConstructor(value), 
                                parentOrAssigner, 
                                prop, 
                                metadata);
            }
            // `typeof Object(Symbol("foo"))` is `"object"
            else if (Tag.SYMBOL === tag) {
                /** @type {Symbol} */
                const symbol = value;

                cloned = assign(
                    Object(Symbol.prototype.valueOf.call(symbol)), 
                    parentOrAssigner, 
                    prop,
                    metadata);
            }
            // `typeof Object(BigInt(3))` is `"object"
            else if (Tag.BIGINT === tag) {
                /** @type {BigInt} */
                const bigint = value;

                cloned = assign(
                    Object(BigInt.prototype.valueOf.call(bigint)), 
                    parentOrAssigner, 
                    prop,
                    metadata);
            }

            else if (Tag.REGEXP === tag) {
                /** @type {RegExp} */
                const regExp = value;

                cloned = new RegExp(regExp.source, regExp.flags);
                assign(cloned, parentOrAssigner, prop, metadata);
            }

            else if (Tag.ERROR === tag) {
                /** @type {Error} */
                const error = value;

                /** @type {Error} */
                let clonedError;

                if (error.name === "AggregateError") {
                    /** @type {AggregateError} */
                    const aggregateError = value;

                    const errors = isIterable(aggregateError.errors) 
                        ? aggregateError.errors 
                        : [];

                    if (!isIterable(aggregateError.errors))
                        log(getWarning("Cloning AggregateError with " + 
                                       "non-iterable errors property. It " +
                                       "will be cloned into an " + 
                                       "AggregateError instance with an " + 
                                       "empty aggregation."));
                    
                    const cause = aggregateError.cause;
                    const message = aggregateError.message;
                    clonedError = cause === undefined
                        ? new AggregateError(errors, message)
                        : new AggregateError(errors, message, { cause });
                }
                else {
                    /** @type {import("../private-types.js").AtomicErrorConstructor} */
                    const ErrorConstructor = getAtomicErrorConstructor(error, 
                                                                       log);

                    const cause = error.cause;
                    clonedError = cause === undefined
                        ? new ErrorConstructor(error.message)
                        : new ErrorConstructor(error.message, { cause });
                }

                const defaultDescriptor = Object.getOwnPropertyDescriptor(
                    new Error, "stack");
                const set = typeof defaultDescriptor === "object" 
                    ? defaultDescriptor.set
                    : undefined;

                queue.push({ 
                    value: error.stack,

                    /** @param {any} cloned */ 
                    parentOrAssigner(cloned) {
                        isExtensibleSealFrozen.push([error.stack, cloned]);
                        Object.defineProperty(clonedError, "stack", {
                            enumerable: false,
                            get: () => cloned,
                            set
                        });
                    }
                });

                cloned = assign(clonedError, parentOrAssigner, prop, metadata);

                propsToIgnore.push("stack");
            }

            else if (Tag.ARRAYBUFFER === tag) {
                const arrayBuffer = new ArrayBuffer(value.byteLength);
                new Uint8Array(arrayBuffer).set(new Uint8Array(value));
                
                cloned = assign(arrayBuffer, parentOrAssigner, prop, metadata);
            }
            
            else if (isTypedArray(value) || Tag.DATAVIEW === tag) {

                /** @type {import("../private-types.js").TypedArrayConstructor} */
                const TypedArray = getTypedArrayConstructor(tag, log);

                // copy data over to clone
                const buffer = new ArrayBuffer(
                    value.buffer.byteLength);
                new Uint8Array(buffer).set(new Uint8Array(value.buffer));
                
                cloned = assign(
                    new TypedArray(buffer, value.byteOffset, value.length),
                    parentOrAssigner,
                    prop,
                    metadata);
                
                for (let n = 0; n < cloned.length; n++)
                    propsToIgnore.push(String(n));
            }

            else if (Tag.MAP === tag) {
                /** @type {Map<any, any>} */
                const originalMap = value;

                const cloneMap = new Map;
                cloned = assign(cloneMap, parentOrAssigner, prop, metadata);

                originalMap.forEach((subValue, key) => {
                    queue.push({ 
                        value: subValue,

                        /** @param {any} cloned */ 
                        parentOrAssigner(cloned) {
                            isExtensibleSealFrozen.push([subValue, cloned]);
                            cloneMap.set(key, cloned);
                        }
                    });
                });
            }

            else if (Tag.SET === tag) {
                /** @type {Set<any>} */
                const originalSet = value;

                const cloneSet = new Set;
                cloned = assign(cloneSet, parentOrAssigner, prop, metadata);

                originalSet.forEach(subValue => {
                    queue.push({ 
                        value: subValue,

                        /** @param {any} cloned */
                        parentOrAssigner(cloned) {
                            isExtensibleSealFrozen.push([subValue, cloned]);
                            cloneSet.add(cloned);
                        }
                    });
                });
            }

            else if (Tag.PROMISE === tag) {
                /** @type {Promise<any>} */
                const promise = value;

                cloned = new Promise((resolve, reject) => {
                    promise.then(resolve).catch(reject);
                });

                assign(cloned, parentOrAssigner, prop, metadata);

                log(Warning.PROMISE);
            }

            else if (Tag.BLOB === tag) {
                /** @type {Blob} */
                const blob = value;
                
                cloned = assign(blob.slice(), parentOrAssigner, prop, metadata);
            }

            else if (Tag.FILE === tag) {
                /** @type {File} */
                const file = value;

                cloned = cloneFile(file);
                assign(cloned, parentOrAssigner, prop, metadata);
            }

            else if (Tag.FILELIST === tag) {
                /** @type {FileList} */
                const fileList = value;

                /** @type {File[]} */
                const files = [];
                for (let index = 0; index < fileList.length; index++) {
                    const file = fileList.item(index);
                    if (file !== null) files.push(cloneFile(file));
                }

                cloned = createFileList(...files);
                assign(cloned, parentOrAssigner, prop, metadata);
            }

            else throw getWarning("Attempted to clone unsupported type.");
        }
        catch(error) {
            const msg = "Encountered error while attempting to clone " + 
            "specific value. The value will be \"cloned\" into an empty " + 
            "object."

            if (error instanceof Error) {
                error.message = `${msg} Error encountered: ${error.message}`;
                const cause = error.cause ? { cause: error.cause } : undefined;
                const stack = error.stack ? error.stack: undefined;
                log(getWarning(error.message, cause, stack));
            } 
            else log(getWarning(msg, { cause: error }));

            cloned = assign({}, parentOrAssigner, prop, metadata);

            // We don't want the prototype if we failed and set the value to an 
            // empty object.
            ignoreProto = true;
        }

        // If customizer returned a primitive, do not clone its properties.
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
                    if (typeof key === "string" 
                        && forbiddenProps[tag] !== undefined
                        && value === forbiddenProps[tag].prototype
                        && forbiddenProps[tag].properties.includes(key)) 
                        return;

                    if (propsToIgnore.includes(key)) return;
                    
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
 * @template T
 * The type of the input value.
 * @template [U = T]
 * The type of the return value. By default, it is the same as the input value. 
 * Nefarious customizer usage could require them be distinct, however. Please do 
 * not do this.
 * @param {T} value The value to deeply copy.
 * @param {import("../public-types.js").CloneDeepOptions|import("../public-types.js").Customizer} [optionsOrCustomizer] 
 * If a function, this argument is used as the customizer.
 * @param {object} [optionsOrCustomizer] 
 * If an object, this argument is used as a configuration object.
 * @param {import("../public-types.js").Customizer} optionsOrCustomizer.customizer 
 * Allows the user to inject custom logic. The function is given the value to 
 * copy. If the function returns an object, the value of the `clone` property on 
 * that object will be used as the clone.
 * @param {import("../public-types.js").Log} optionsOrCustomizer.log 
 * Any errors which occur during the algorithm can optionally be passed to a log 
 * function. `log` should take one argument which will be the error encountered. 
 * Use this to log the error to a custom logger.
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
    /** @type {import("../public-types.js").Customizer|undefined} */
    let customizer;

    /** @type {import("../public-types.js").Log|undefined} */
    let log;

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
    
    return cloneInternalNoRecursion(value, 
                                    customizer, 
                                    log, 
                                    ignoreCloningMethods || false, 
                                    letCustomizerThrow || false);
}
 
export default cloneDeep;
