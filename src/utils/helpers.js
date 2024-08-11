import { supportedPrototypes, Tag, WebApi } from "./constants.js";
import { getWarning } from "./clone-deep-warning.js";
import { isCallable } from "./type-checking.js";

/**
 * Gets the appropriate TypedArray constructor for the given object tag.
 * @param {string} tag
 * The tag for the object.
 * @param {import("../types").Log} log
 * A logging function.
 * @returns {import("./types").TypedArrayConstructor}
 */
export function getTypedArrayConstructor(tag, log) {
    switch (tag) {
        case Tag.DATAVIEW:
            return DataView;
        case Tag.FLOAT32:
            return Float32Array;
        case Tag.FLOAT64:
            return Float64Array;
        case Tag.INT8:
            return Int8Array;
        case Tag.INT16:
            return Int16Array;
        case Tag.INT32:
            return Int32Array;
        case Tag.UINT8:
            return Uint8Array;
        case Tag.UINT8CLAMPED:
            return Uint8ClampedArray;
        case Tag.UINT16:
            return Uint16Array;
        case Tag.UINT32:
            return Uint32Array;
        case Tag.BIGINT64:
            return BigInt64Array;
        case Tag.BIGUINT64:
            return BigUint64Array;
        default:
            log(getWarning("Unrecognized TypedArray subclass. This object " + 
                           "will be cloned into a DataView instance."));
            return DataView;
    }
}

/**
 * Gets the appropriate error constructor for the error name.
 * @param {Error} value
 * The object itself. This is necessary to correctly find constructors for 
 * various Error subclasses.
 * @param {import("../types").Log} [log]
 * An optional logging function.
 * @returns {import("./types").AtomicErrorConstructor}
 */
export function getAtomicErrorConstructor(value, log) {
    const {name} = value;
    switch (name) {
        case "Error":
            return Error;
        case "EvalError":
            return EvalError;
        case "RangeError":
            return RangeError;
        case "ReferenceError":
            return ReferenceError;
        case "SyntaxError":
            return SyntaxError;
        case "TypeError":
            return TypeError;
        case "URIError":
            return URIError;
        default:
            if (log !== undefined)
                {log(getWarning("Cloning error with unrecognized name " + 
                                `${name}! It will be cloned into an ` + 
                                "ordinary Error object."))}
            return Error;
    }
}

/**
 * Creates a FileList.
 * See https://github.com/fisker/create-file-list.
 * @param  {...File} files 
 * @returns {FileList}
 */
export function createFileList(...files) {
    if (!isCallable(globalThis.DataTransfer))
        {throw getWarning("Cannot create FileList in this runtime.");}

    const dataTransfer = new DataTransfer;

    for (const file of files) {dataTransfer.items.add(file);}

    return dataTransfer.files;
}

/**
 * Returns a deep clone of the given File.
 * @param {File} file 
 * @returns {File}
 */
export function cloneFile(file) {
    return new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
    });
}

/**
 * Attempts to retreive a web API from the global object.
 * Doing this in a way that utilizes TypeScript effectively is obtuse, hence 
 * this function was made so that TypeScript jank doesn't obfuscate code 
 * elsewhere.
 * @param {string} string 
 * @returns {new (...args: any[]) => any | undefined}
 */
export function getWebApiFromString(string) {
    /** @type {any} */
    const __global = globalThis;

    /** @type {{ [key: string]: new (...args: any[]) => any | undefined }} */
    const global = __global;

    return global[string];
}   

/**
 * Returns an array of prototypes of available supported types for this runtime.
 * @returns {any[]}
 */
export function getSupportedPrototypes() {
    /** @type {object[]} */
    const webApiPrototypes = [];

    Object.keys(WebApi).forEach(webApiString => {
        const WebApi = getWebApiFromString(webApiString);

        if (WebApi !== undefined && isCallable(WebApi)) 
            {webApiPrototypes.push(WebApi.prototype);}
    });

    return supportedPrototypes.concat(webApiPrototypes);
}
