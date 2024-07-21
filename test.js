import assert from "node:assert";
import { describe, mock, test } from "node:test";

import { 
    Tag, 
    supportedPrototypes, 
    forbiddenProps, 
    getTypedArrayConstructor,
    isIterable
} from "./clone-deep-helpers.js";
import  cloneDeep from "./clone-deep.js";
import { cloneDeepFully, useCustomizers } from "./clone-deep-utils.js";

// we will monkeypatch console.warn in a second, so hold onto the original 
// implementation for safekeeping
const consoleDotWarn = console.warn;

// convenient helper functions
const getProto = object => Object.getPrototypeOf(object);
const tagOf = value => Object.prototype.toString.call(value);

try {
    // There are so many warnings logged that it slows the test down
    console.warn = () => {};

    describe("cloneDeep without customizer", () => {
        
        const number = 1234566;
        const string = "string";
        const boolean = true;
        const bigint = BigInt(7);
        const symbol = Symbol("symbol");
        const symbolKey = Symbol("key");
        const symbolValue = Symbol("value");
        const undef = undefined;
        const nil = null;

        const original = {
            number,
            string,
            [symbolKey]: symbolValue,
            boolean,
            bigint,
            undef,
            nil,
            array: [
                number,
                string,
                symbol,
                boolean,
                bigint,
                undef,
                nil
            ],
            nested: {
                number,
                string,
                [symbolKey]: symbolValue,
                boolean,
                bigint,
                undef,
                nil,
            }
        };

        original.circular = original;

        test("cloned !== original", () => {
            // -- act
            const cloned = cloneDeep(original);

            // -- assert
            assert.notStrictEqual(cloned, original);
        });

        test("The cloned object copies primitives by value", () => {
            // -- act
            const cloned = cloneDeep(original);

            // -- assert
            assert.strictEqual(cloned.number, original.number);
            assert.strictEqual(cloned.string, original.string);
            assert.strictEqual(cloned[symbolKey], original[symbolKey]);
            assert.strictEqual(cloned.boolean, original.boolean);
            assert.strictEqual(cloned.bigint, original.bigint);
            assert.strictEqual(cloned.undef, original.undef);
            assert.strictEqual(cloned.nil, original.nil);
        });

        test("Nested objects are not ===", () => {
            // -- act
            const cloned = cloneDeep(original);

            // -- assert
            assert.notStrictEqual(cloned.array, original.array);
            assert.notStrictEqual(cloned.nested, original.nested);
        });

        test("Arrays are cloned properly", () => {
            // -- arrange
            const array = [1, 2, {}];
            array.test = number;

            // -- act
            const cloned = cloneDeep(array);

            // -- assert
            assert.notStrictEqual(cloned, original);
            assert.strictEqual(cloned[0], array[0]);
            assert.strictEqual(cloned[1], array[1]);
            assert.notStrictEqual(cloned[2], array[2]);
            assert.strictEqual(cloned[1], array[1]);
            assert.strictEqual(Array.isArray(cloned), true);
            assert.strictEqual(cloned.test, array.test);
        });

        test("Primitives are simply returned by value", () => {
            original.array.forEach(primitive => {
                assert.strictEqual(cloneDeep(primitive), primitive);
            });
        });

        test("Supported types are cloned into the correct type", () => {
            const getNew = TypedArray => new TypedArray(new ArrayBuffer());

            const type = {
                args: [
                        {
                            callee: mock.fn(),
                            length: 0,
                            [Symbol.iterator]() {
                                let i = 0;
                                return {
                                    next: () => this[i++],
                                    done: () => i >= this.length
                                }
                            },
                            [Symbol.toStringTag]: "Arguments"
                        },
                        Tag.ARGUMENTS
                ],
                array: [[], Tag.ARRAY],
                bigint: [new Object(BigInt(0)), Tag.BIGINT],
                boolean: [new Boolean(), Tag.BOOLEAN],
                date: [new Date(), Tag.DATE],
                error: [new Error(), Tag.ERROR],
                map: [new Map(), Tag.MAP],
                number: [new Number(), Tag.NUMBER],
                object: [new Object(), Tag.OBJECT],
                promise: [new Promise(r => r()), Tag.PROMISE],
                regexp: [/i/, Tag.REGEXP],
                set: [new Set(), Tag.SET],
                string: [new String(), Tag.STRING],
                symbol: [new Object(Symbol("symbol")), Tag.SYMBOL],
                arraybuffer: [new ArrayBuffer(), Tag.ARRAYBUFFER],
                dataview: [getNew(DataView), Tag.DATAVIEW],
                float32: [getNew(Float32Array), Tag.FLOAT32],
                float64: [getNew(Float64Array), Tag.FLOAT64],
                int8: [getNew(Int8Array), Tag.INT8],
                int16: [getNew(Int16Array), Tag.INT16],
                int32: [getNew(Int32Array), Tag.INT32],
                uint8: [getNew(Uint8Array), Tag.UINT8],
                uint8Clamped: [getNew(Uint8ClampedArray), Tag.UINT8CLAMPED],
                uint16: [getNew(Uint16Array), Tag.UINT16],
                uint32: [getNew(Uint32Array), Tag.UINT32],
                bigint64: [getNew(BigInt64Array), Tag.BIGINT64],
                biguint64: [getNew(BigUint64Array), Tag.BIGUINT64]
            }

            for (const key of Object.keys(type)) {
                // -- arrange
                const [value, tag] = type[key];

                // -- act
                const cloned = cloneDeep(value);

                // -- assert
                assert.strictEqual(tagOf(cloned), tag);
            }
        });

        test("Unsupported types are cloned into empty objects", () => {
            const type = {
                weakmap: [new WeakMap(), Tag.WEAKMAP],
                weakset: [new WeakSet(), Tag.WEAKSET],
                function: [() => {}, Tag.FUNCTION]
            }

            for (const key of Object.keys(type)) {
                // -- arrange
                const [value, tag] = type[key];
                
                // -- act
                const cloned = cloneDeep(value);
                
                // -- assert
                assert.notStrictEqual(tagOf(cloned), tag);
                assert.strictEqual(tagOf(cloned), Tag.OBJECT);
            }
        });

        test("Circular references are cloned properly", () => {
            // -- act
            const cloned = cloneDeep(original);

            // -- assert
            assert.notStrictEqual(cloned.circular, original.circular);
            assert.strictEqual(cloned.circular, cloned);
        });

        test("Property descriptors are copied over", () => {
            // -- arrange
            const noAccessorValue = "noAccessor";
            const accessorValue = "accessor";

            const get = mock.fn(() => accessorValue);
            const set = mock.fn(() => {});

            const _original = Object.defineProperties({}, {
                noAccessor: {
                    configurable: false,
                    enumerable: false,
                    value: noAccessorValue,
                    writable: false
                },
                accessor: {
                    get,
                    set
                }
            });

            // -- act
            const cloned = cloneDeep(_original);

            // Note that cloned.accessor is accessed TWICE.
            cloned.accessor;
            cloned.accessor = "different value";

            // -- assert
            const descriptor = Object.getOwnPropertyDescriptor(cloned, 
                                                               "noAccessor");

            assert.notStrictEqual(cloned, _original);
            assert.strictEqual(descriptor.configurable, false);
            assert.strictEqual(descriptor.enumerable, false);
            assert.strictEqual(cloned.noAccessor, noAccessorValue);
            assert.strictEqual(descriptor.writable, false);

            assert.strictEqual(get.mock.calls.length, 2);
            assert.strictEqual(set.mock.calls.length, 1);
            assert.strictEqual(cloned.accessor, accessorValue);
        });

        test("Cloned objects share prototypes", () => {
            // -- arrange
            const proto = Object.create({ protoProp: "protoProp" });
            const nestedProto = Object.create({ 
                nestProtoProp: "nestedProtoProp" 
            });
            const _original = Object.assign(Object.create(proto), {
                nested: Object.create(nestedProto)
            });

            // -- act
            const cloned = cloneDeep(_original);

            // -- assert
            assert.strictEqual(getProto(cloned), getProto(_original));
            assert.strictEqual(getProto(cloned.nested), 
                               getProto(_original.nested));
        });

        test("A warning is logged if object with methods is cloned", () => {
            // -- arrange
            const log = mock.fn(() => {});

            const _original = { func: () => {} };

            // -- act
            cloneDeep(_original, { log });

            // == assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 1);
            assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
            assert.strictEqual(
                calls[0].arguments[0].message.includes(
                    "Attempted to clone function"), 
                true);
        });

        test("A warning is logged if WeakMap or WeakSet is cloned", () => {
            // -- arrange
            const log = mock.fn(() => {});

            const _original = { 
                weakmap: new WeakMap(), 
                weakset: new WeakSet() 
            };

            // -- act
            cloneDeep(_original, { log });

            // -- assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 2);
            assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
            assert.strictEqual(calls[1].arguments[0] instanceof Error, true);
            assert.strictEqual(
                calls[0].arguments[0].message.includes(
                    "Attempted to clone unsupported type WeakMap."), 
                true);
            assert.strictEqual(
                calls[1].arguments[0].message.includes(
                    "Attempted to clone unsupported type WeakSet."), 
                true);
        });

        test("A warning is logged if property with accessor is cloned", () => {
            // -- arrange
            const log = mock.fn(() => {});

            const _original = Object.defineProperties({}, {
                get: { get: () => {} },
                set: { set: () => {} },
                getAndSet: { get: () => {}, set: () => {} }
            });

            // -- act
            cloneDeep(_original, { log });

            // -- assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 3);
            assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
            assert.strictEqual(calls[1].arguments[0] instanceof Error, true);
            assert.strictEqual(calls[2].arguments[0] instanceof Error, true);
            calls.forEach(call => {
                const message = call.arguments[0].message;
                assert.strictEqual(message.includes("get or set accessor"), 
                                   true);
            });
        });

        test("A warning is logged if unsupported type is cloned", () => {
            // -- arrange
            const log = mock.fn(() => {});

            const _original = { [Symbol.toStringTag]: "Unsupported" };

            // -- act
            cloneDeep(_original, { log });

            // -- assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 1);
            assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
            assert.strictEqual(
                calls[0].arguments[0].message.includes(
                    "Attempted to clone unsupported type."), 
                true);
        });

        test("A warning is logged if prototype with forbidden props " +
             "is cloned", () => {
            Object.values(forbiddenProps).forEach(({ prototype }) => {
                // -- arrange
                const log = mock.fn(() => {});

                // -- act
                cloneDeep(prototype, { log });

                // -- assert
                const calls = log.mock.calls;
                const error = calls[0].arguments[0];
                assert.strictEqual(calls.length > 0, true);
                assert.strictEqual(error instanceof Error, true);
                assert.strictEqual(
                    error.message.includes(
                        "The cloned object will not have any inaccessible " + 
                        "properties"),
                    true);
            });
        });

        test("A warning is logged if a promise is cloned", () => {
            // -- arrange
            const log = mock.fn(() => {});

            const promise = new Promise(resolve => resolve());

            // -- act
            cloneDeep(promise, { log });

            // -- assert
            const calls = log.mock.calls;
            const error = calls[0].arguments[0];
            assert.strictEqual(calls.length, 1);
            assert.strictEqual(error instanceof Error, true);
            assert.strictEqual(
                error.message.includes("Attempted to clone a Promise."), 
                true);
        });

        test("A cloned map has cloned content of the original map", () => {
            // -- arrange
            const _original = new Map();

            const keyPrim = "keyPrim";
            const valuePrim = "valuePrim";
            _original.set(keyPrim, valuePrim);

            const key = "key";
            const value = {};
            _original.set(key, value);

            // -- act
            const cloned = cloneDeep(_original);

            // -- assert
            assert.strictEqual(cloned.has(keyPrim) && cloned.has(key), true);
            assert.strictEqual(cloned.get(keyPrim), _original.get(keyPrim));
            assert.notStrictEqual(cloned.get(key), _original.get(key));
        });

        test("A cloned set has the cloned content of the original set", () => {
            // -- arrange
            const _original = new Set();

            const valuePrim = "valuePrim";
            _original.add(valuePrim);

            const value = {};
            _original.add(value);

            // -- act
            const cloned = cloneDeep(_original);

            // -- assert
            let nonPrimitiveOriginal;
            _original.forEach(value => {
                if (typeof value === "object") nonPrimitiveOriginal = value;
            });

            let nonPrimitiveCloned;
            cloned.forEach(value => {
                if (typeof value === "object") nonPrimitiveCloned = value;
            });
            
            assert.strictEqual(cloned.size === 2, true);
            assert.strictEqual(cloned.has(valuePrim), _original.has(valuePrim));
            assert.notStrictEqual(nonPrimitiveCloned, undefined);
            assert.notStrictEqual(nonPrimitiveCloned, nonPrimitiveOriginal);
        });

        test("Maps and Sets have properties cloned", () => {
            // -- arrange
            const _original = {
                map: Object.assign(new Map(), { prop: "prop" }),
                set: Object.assign(new Set(), { prop: "prop" }),
            }

            // -- act
            const cloned = cloneDeep(_original);

            // -- assert
            assert.strictEqual(cloned.map.prop, _original.map.prop);
            assert.strictEqual(cloned.set.prop, _original.set.prop);
        });

        test('A specific logger is provided if logMode is "quiet"', () => {
            // -- arrange
            const log = mock.fn(() => {});

            // -- act
            // A warning will be logged.
            cloneDeep({ func: () => {} }, { log, logMode: "quiet" });

            // -- assert
            assert.strictEqual(log.mock.calls.length, 0);
        });

        test('A specific logger is provided if logMode is "silent"', () => {
            // -- arrange
            const log = mock.fn(() => {});

            // -- act
            // A warning will be logged.
            cloneDeep({ func: () => {} }, { log, logMode: "silent" });

            // -- assert
            assert.strictEqual(log.mock.calls.length, 0);
        });

        test("TypedArray non-index props are cloned", () => {
            // -- arrange
            const typedArray = new Uint8Array(new ArrayBuffer(8), 1, 4)
            typedArray.prop = "prop";
            const _original = { typedArray };

            // -- act
            const cloned = cloneDeep(_original);

            // -- assert
            for (let i = 0; i < 8; i++)
                assert.strictEqual(cloned.typedArray[i], 
                                   _original.typedArray[i]);

            assert.strictEqual(cloned.typedArray.prop, "prop");
        });

        test("Extensibility, sealedness, and frozenness cloned", () => {
            // -- arrange/act
            const cloned = cloneDeep({
                inextensible: Object.preventExtensions({}),
                sealed: Object.seal({}),
                frozen: Object.freeze({})
            });

            // -- assert
            assert.strictEqual(Object.isExtensible(cloned.inextensible), false);
            assert.strictEqual(Object.isSealed(cloned.sealed), true);
            assert.strictEqual(Object.isFrozen(cloned.frozen), true);
        });

        test("Native type with changed proto is cloned with that proto", () => {
            // -- arrange
            const map = new Map();
            Object.setPrototypeOf(map, Object.prototype);

            // -- act
            const cloned = cloneDeep(map);

            // -- assert
            assert.strictEqual(getProto(cloned), getProto(map));
        });

        test("Error clones get stack and cause", () => {
            // -- arrange
            const error = new Error("error", { cause: {} });

            // -- act
            const cloned = cloneDeep(error);

            // -- assert
            assert.deepEqual(cloned.cause, error.cause);
            assert.notStrictEqual(cloned.cause, error.cause);
            assert.strictEqual(cloned.stack, error.stack);
        });

        test("Error stacks are cloned correctly", () => {
            // -- arrange
            const error = new Error("");
            const errorStackReassigned = new Error("");
            errorStackReassigned.stack = Object.preventExtensions({});

            // -- act
            const cloned = cloneDeep(error);
            const clonedStackReassigned = cloneDeep(errorStackReassigned);

            // -- assert
            assert.strictEqual(cloned.stack, error.stack);
            assert.notStrictEqual(clonedStackReassigned.stack, 
                                  errorStackReassigned.stack);
            assert.deepEqual(clonedStackReassigned.stack, 
                             errorStackReassigned.stack);
            assert.strictEqual(Object.isExtensible(clonedStackReassigned.stack), 
                               false);
        })

        test("Errors are cloned correctly even if monkeypatched", () => {
            let doMonkeypatch = true;
            try {
                // -- arrange
                const OriginalError = Error;
                Error = function(...args) {
                    if (doMonkeypatch !== true) 
                        return new OriginalError(...args);
                    const error = new OriginalError(...args);
                    delete error.stack;
                    return error;
                }
                Error.prototype = OriginalError.prototype;

                const error = new Error("error", { cause: "cause" });

                // -- act
                const cloned = cloneDeep(error);
                
                // -- assert
                assert.strictEqual(cloned.cause, error.cause);
                assert.strictEqual(cloned.stack, error.stack);
            }
            catch (error) {
                doMonkeypatch = false;
                throw error;
            }
        });

        test("Errors have additional properties cloned", () => {
            // -- arrange
            const error = new Error("error");
            error.property = "property";

            // -- act
            const cloned = cloneDeep(error);

            // -- assert
            assert.strictEqual(cloned.property, error.property);
        });

        test("Error subclasses are correctly cloned", () => {
            [
                AggregateError, 
                EvalError,
                RangeError, 
                ReferenceError, 
                SyntaxError, 
                TypeError, 
                URIError
            ].forEach(ErrorClass => {
                // -- arrange
                const error = new ErrorClass("error");

                // -- act
                const cloned = cloneDeep(error);

                // -- assert
                assert.strictEqual(getProto(cloned), ErrorClass.prototype);
            });
        });

        test("Unrecognized errors are cloned using the ordinary Error " + 
             "constructor function and a warning is logged", () => {
            const ErrorOriginal = Error;

            try {
                // -- arrange
                class TestError extends Error {
                    name = "TestError";
                };

                const log = mock.fn(() => {});
                
                // monkeypatch Error so we can track if it was called
                let errorOriginalCount = 0;
                Error = function(...args) {
                    errorOriginalCount++;
                    return ErrorOriginal(...args);
                }
                Error.prototype = ErrorOriginal.prototype;

                // -- act
                cloneDeep(new TestError("error"), { log: undefined });
                cloneDeep(new TestError("error"), { log });
                
                // -- assert
                // note that TestError inherits the Error constructor
                assert.strictEqual(4, errorOriginalCount);
                assert.strictEqual(log.mock.calls.length, 1);
                assert.strictEqual(true, 
                                   log
                                    .mock
                                    .calls[0]
                                    .arguments[0]
                                    .message
                                    .includes("TestError!"));
            }
            catch(error) {
                Error = ErrorOriginal;
                throw error;
            }
        });

        describe("AggregateError", () => {

            test("AggregateError is cloned correctly", () => {
                // -- arrange 
                const error = new AggregateError(
                    [new Error("a", { cause: "cause" }), new Error("b")]);

                // -- act
                const cloned = cloneDeep(error);

                // -- assert
                assert.notStrictEqual(cloned, error);
                assert.notStrictEqual(cloned.errors, error.errors);
                assert.deepEqual(cloned, error);
                cloned.errors.forEach((clonedError, i) => {
                    const originalError = error.errors[i];
                    assert.notStrictEqual(clonedError, originalError);
                    assert.deepEqual(clonedError, originalError);
                });
            });

            test("AggregateError with cause is handled", () => {
                // -- arrange 
                const error = new AggregateError(
                    [new Error("a", { cause: "cause" }), new Error("b")], 
                    "",
                    { cause: {} });

                // -- act
                const cloned = cloneDeep(error);

                // -- assert
                assert.strictEqual(cloned !== error, true);
                assert.strictEqual(cloned.errors !== error.errors, true);
                assert.deepEqual(cloned, error);
                assert.notStrictEqual(cloned.cause, error.cause);
                
            });

            test("AggregateError with non-iterable errors is handled with " + 
                 "warning", () => {
                // -- arrange
                const log = mock.fn(() => {});

                const error = new AggregateError([]);
                error.errors = {};

                // -- act
                const cloned = cloneDeep(error, { log });

                // -- assert
                assert.deepEqual(cloned, error);
                assert.deepEqual({}, cloned.errors);
                assert.notStrictEqual(cloned.errors, error.errors);
                assert.deepEqual(error.errors, cloned.errors);
                assert.strictEqual(log
                                    .mock
                                    .calls[0]
                                    .arguments[0]
                                    .message
                                    .includes("non-iterable"), 
                                   true);
            });
        });

        test('Function.prototype is "cloned" with allowed properties', () => {
            // -- arrange
            const expectedProperties = [
                "length",
                "name",
                "constructor",
                "apply",
                "bind",
                "call",
                "toString",
                Symbol.hasInstance
            ]

            // -- act
            const cloned = cloneDeep(Function.prototype);

            // -- assert
            assert.strictEqual([
                ...Object.getOwnPropertyNames(cloned),
                ...Object.getOwnPropertySymbols(cloned)
            ].length, expectedProperties.length);
            
            expectedProperties.forEach(key => {
                assert.strictEqual(cloned.hasOwnProperty(key), true);
            });
        });

        test("functions become empty objects inheriting " + 
             "Function.prototype", () => {
            [function() {}, () => {}].forEach(func => {
                // -- act
                const cloned = cloneDeep(func);

                // -- assert
                assert.strictEqual(getProto(cloned), Function.prototype);
                assert.strictEqual([
                    ...Object.getOwnPropertyNames(cloned),
                    ...Object.getOwnPropertySymbols(cloned)
                ].length, 0);
            });
        });

        test("Errors with causes thrown outside customizer handled", () => {
            let temporarilyMonkeypatch = true;
            try {
                // -- arrange
                const log = mock.fn(() => {});

                // save current implementation
                const objectDotCreate = Object.create;
                Object.create = (...args) => {
                    if (temporarilyMonkeypatch === true) 
                        throw new Error("error", { cause: "cause" });
                    else 
                        return objectDotCreate(...args);
                }

                // -- act
                cloneDeep({}, { log });

                // -- assert
                const calls = log.mock.calls;
                temporarilyMonkeypatch = false;

                assert.strictEqual(calls.length, 1);
                assert.notStrictEqual(calls[0].arguments[0].cause, undefined);
            }
            catch(error) {
                temporarilyMonkeypatch = false;
                throw error;
            }
        });

        test("Non-error objects thrown outside customizer handled", () => {
            let temporarilyMonkeypatch = true;
            try {
                // -- arrange
                const log = mock.fn(() => {});

                // save current implementation
                const objectDotCreate = Object.create;
                Object.create = (...args) => {
                    if (temporarilyMonkeypatch === true) 
                        throw "not an error object";
                    else 
                        return objectDotCreate(...args);
                }

                // -- act
                cloneDeep({}, { log });

                // -- assert
                const calls = log.mock.calls;
                temporarilyMonkeypatch = false;

                assert.strictEqual(calls.length, 1);
                assert.notStrictEqual(calls[0].arguments[0].cause, undefined);
            }
            catch(error) {
                temporarilyMonkeypatch = false;
                throw error;
            }
        });

        test("Errors without stacks thrown outside customizer handled", () => {
            let temporarilyMonkeypatch = true;
            try {
                // -- arrange
                const log = mock.fn(() => {});

                // save current implementation
                const objectDotCreate = Object.create;
                Object.create = (...args) => {
                    if (temporarilyMonkeypatch === true) 
                        throw Object.assign(objectDotCreate(Error.prototype));
                    else 
                        return objectDotCreate(...args);
                }

                // -- act
                cloneDeep({}, { log });

                // -- assert
                const calls = log.mock.calls;
                temporarilyMonkeypatch = false;

                assert.strictEqual(calls.length, 1);
                assert.notStrictEqual(calls[0].arguments[0].stack, undefined);
            }
            catch(error) {
                temporarilyMonkeypatch = false;
                throw error;
            }
        });

        test("regExp.lastIndex is cloned properly", () => {
            // -- arrange
            const regExp = new RegExp("");
            regExp.lastIndex = {};

            // -- act
            const cloned = cloneDeep(regExp);

            // -- assert
            assert.deepEqual(cloned.lastIndex, regExp.lastIndex);
            assert.notStrictEqual(cloned.lastIndex, regExp.lastIndex);
        });

        test("Native prototypes can be cloned without errors", () => {
            supportedPrototypes.forEach(proto => {
                cloneDeep(proto);
            });
        });
    });

    describe("cloneDeep customizer", () => {

        test("Customizer can determine cloned value", () => {
            // -- arrange
            const original = "original";
            const clone = {};

            // -- act
            const cloned = cloneDeep(original, () => ({ clone }));

            // -- assert
            assert.notStrictEqual(cloned, original);
            assert.strictEqual(cloned, clone);
        });

        test("Customizer has no effect if it does not return an object", () => {
            // -- arrange
            const original = "original";
            const clone = {};

            // -- act
            const cloned = cloneDeep(original, () => {});

            // -- assert
            assert.strictEqual(cloned, original);
            assert.notStrictEqual(cloned, clone);
        });

        test("Customizer can add additional values to clone", () => {
            // -- arrange
            const prop = {};
            const original = { prop };

            const newValue1 = "newValue1";
            const newValue2 = "newValue2";

            // -- act
            const cloned = cloneDeep(original, value => {
                if (value !== prop) return;
                const clone = {};
                return {
                    clone,
                    additionalValues: [{
                        value: newValue1,
                        assigner: cloned => {
                            clone[0] = cloned;
                        }
                    }, {
                        value: newValue2,
                        assigner: cloned => {
                            clone[1] = cloned;
                        }
                    }]
                };
            });

            // -- assert
            assert.deepEqual(Object.values(cloned.prop), 
                             [newValue1, newValue2]);
            assert.deepEqual(Object.values(original.prop), []);
        });

        test("If customizer returns improperly formatted additionalValues, " + 
             "they are ignored and warnings are logged ", () => {
            // -- arrange
            const log = mock.fn(() => {});
            
            const a = "a";
            const b = "b";
            const c = "c";

            const newValue1 = "newValue1";
            const newValue2 = "newValue2";
            const newValue3 = "newValue3";

            // -- act
            const cloned = cloneDeep({ a, b, c }, {
                customizer: value => {
                    const clone = {};
                    if (value === a)
                        return {
                            clone,

                            // additionalValues must be an array
                            additionalValues: {
                                value: newValue1,
                                assigner: cloned => {
                                    clone[0] = cloned;
                                }
                            },
                            ignoreProto: true,
                            ignoreProps: true
                        };
                    if (value === b)
                        return {
                            clone,

                            // additionalValues must be an array of objects
                            additionalValues: [newValue2],
                            ignoreProto: true,
                            ignoreProps: true
                        };
                    if (value === c)
                        return {
                            clone,

                            // The objects must have an `assigner` function
                            additionalValues: [{ clone: newValue3 }],
                            ignoreProto: true,
                            ignoreProps: true
                        };
                },
                log
            });

            // -- assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 3);
            calls.forEach(call => {
                assert.strictEqual(call.arguments[0] instanceof Error, true);
            });

            assert.notStrictEqual(cloned[0], newValue1);
            assert.notStrictEqual(cloned[1], newValue2);
            assert.notStrictEqual(cloned[2], newValue2);
        });

        test("Customizer can cause value to be ignored", () => {
            // -- arrange
            const a = "a";
            const b = "b";

            // -- act
            const cloned = cloneDeep({ a, b }, value => {
                if (value === b) return { ignore: true };
            });

            // -- assert
            assert.strictEqual(cloned.a, a);
            assert.notStrictEqual(cloned.b, b);
            assert.strictEqual(cloned.b, undefined);
        });

        test("Customizer can cause properties to be ignored", () => {
            // -- arrange
            const nested = { a: "a", b: "b" };
            const original = { nested };

            // -- act
            const cloned = cloneDeep(original, value => {
                if (value === nested) {
                    return {
                        clone: {},
                        ignoreProps: true
                    }
                }
            });

            // -- assert
            assert.strictEqual(cloned.hasOwnProperty("nested"), true);
            assert.strictEqual(cloned.nested.a, undefined);
            assert.strictEqual(cloned.nested.b, undefined);
        });

        test("Warning logged, cloneDeep continues if customizer throws", () => {
            // -- arrange
            const log = mock.fn(() => {});
            const a = "a";

            // -- act
            const cloned = cloneDeep({ a }, {
                customizer: () => { 
                    throw new Error("error"); 
                },
                log
            });

            // -- assert
            const calls = log.mock.calls;
            
            // The customizer will be called again for the property in original
            assert.strictEqual(calls.length, 2);
            assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
            assert.strictEqual(cloned.a, a);
        });

        test("Customizer can cause cloneDeep to throw an error", () => {
            assert.throws(() => cloneDeep({}, {
                customizer: () => {
                    throw new Error("error");
                },
                letCustomizerThrow: true
            }))
        });

        test("If customizer throws non-error, cloneDeep handles it", () => {
            // -- arrange
            const log = mock.fn(() => {});

            // -- act
            cloneDeep({}, {
                customizer: () => {
                    throw "not an error object";
                },
                log
            });

            // -- assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 1);
        });

        test("If customizer throws without stack, cloneDeep handles it", () => {
            // -- arrange
            const log = mock.fn(() => {});

            // -- act
            cloneDeep({}, {
                customizer: () => {
                    throw Object.assign(Object.create(Error.prototype));
                },
                log
            });

            // -- assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 1);
        });

        test("If customizer throws error with cause, cloneDeep handles it", () => {
            // -- arrange
            const log = mock.fn(() => {});

            // -- act
            cloneDeep({}, {
                customizer: () => {
                    throw new Error("error", { cause: "cause" });
                },
                log
            });

            // -- assert
            const calls = log.mock.calls;
            assert.strictEqual(calls.length, 1);
            assert.notStrictEqual(calls[0].arguments[0].cause, undefined);
        });

        test("Customizer can cause cloned value to not share prototype", () => {
            // -- arrange
            const proto = {};
            const original = Object.create(proto);

            // -- act
            const cloned = cloneDeep(original, () => {
                return {
                    clone: {},
                    ignoreProto: true
                }
            });

            // -- assert
            assert.notStrictEqual(getProto(cloned), getProto(original));
        });
    });

    describe("cloneDeepFully", () => {

        test("Prototype chain is cloned",  () => {
            // -- arrange
            const proto_proto = Object.create(null);
            const proto = Object.create(proto_proto);
            const original = Object.create(proto);

            // -- act
            const cloned = cloneDeepFully(original);

            // -- assert
            assert.notStrictEqual(getProto(cloned), getProto(original));
            assert.notStrictEqual(getProto(getProto(cloned)), 
                                  getProto(getProto(original)));
        });

        test("non-boolean options.force is like force === false",  () => {
            // -- arrange
            const proto_proto = Object.create(null);
            const proto = Object.create(proto_proto);
            const original = Object.create(proto);

            // -- act
            const cloned = cloneDeepFully(original, { force: "true" });

            // -- asser
            assert.notStrictEqual(getProto(cloned), getProto(original));
            assert.notStrictEqual(getProto(getProto(cloned)), 
                                  getProto(getProto(original)));
        });

        test("Without force, prototypes with methods are not cloned", () => {
            // -- arrange
            const original = Object.create({});

            // -- act
            const cloned = cloneDeepFully(original);

            // -- assert
            assert.notStrictEqual(getProto(cloned), getProto(original));
            assert.strictEqual(getProto(getProto(cloned)), 
                               getProto(getProto(original)));
        });

        test('Prototypes with methods can be "cloned" by force', () => {
            // -- arrange
            const original = Object.create({});

            // -- act
            const cloned = cloneDeepFully(original, { force: true });

            // -- assert
            assert.notStrictEqual(getProto(cloned), getProto(original));
            assert.notStrictEqual(getProto(getProto(cloned)), 
                                getProto(getProto(original)));
        });

        test("Primitives are returned by value.",  () => {
            [
                null, 
                undefined, 
                "s", 
                0, 
                BigInt(0), 
                Symbol(0)
            ].forEach(primitive => {
                assert.strictEqual(cloneDeepFully(primitive), primitive);
            });
        });

        test("Without force, cloned functions get Function.prototype",  () => {
            [() => {}, function() {}].forEach(func => {
                const cloned = cloneDeepFully(func);

                assert.strictEqual(getProto(cloned), getProto(func));
                assert.strictEqual(getProto(cloned), Function.prototype);
            });
        });

        test("With force, cloned functions clone Function.prototype", () => {
            [() => {}, function() {}].forEach(func => {
                const cloned = cloneDeepFully(func, { force: true });

                assert.notStrictEqual(getProto(cloned), getProto(func));
            });
        });

        test("Native prototypes can be fully cloned without errors", () => {
            supportedPrototypes.forEach(proto => {
                cloneDeepFully(proto);
            });
        });

        test("cloneDeepFully can provide customizer", () => {
            // -- arrange
            const original = "original";
            const clone = {};

            // -- act
            const cloned = cloneDeepFully(original, () => ({ clone }));

            // -- assert
            assert.notStrictEqual(cloned, original);
            assert.strictEqual(cloned, clone);
        });

        test("cloneDeepFully can provide logger", () => {
            // -- arrange
            const log = mock.fn(() => {});

            // -- act
            cloneDeepFully({ func: () => {} }, { log });

            // -- assert
            assert.strictEqual(log.mock.calls.length, 1);
        });

        test("cloneDeepFully can provide logMode", () => {
            // -- arrange
            const logQuiet = mock.fn(() => {});
            const logSilent = mock.fn(() => {});

            // -- act
            cloneDeepFully({ func: () => {} }, { 
                log: logQuiet, 
                logMode: "quiet" 
            });
            cloneDeepFully({ func: () => {} }, { 
                log: logSilent, 
                logMode: "silent" 
            });

            // -- assert
            assert.strictEqual(logQuiet.mock.calls.length, 0);
            assert.strictEqual(logSilent.mock.calls.length, 0);
        });

        test("cloneDeepFully can cause customizer to throw", () => {
            assert.throws(() => {
                cloneDeepFully({}, {
                    customizer() {
                        throw "throw";
                    },
                    letCustomizerThrow: true
                });
            });
        });
    });

    describe("useCustomizers", () => {

        test("useCustomizers takes functions and returns a function", () => {
            // -- arrange/act
            const combined = useCustomizers([() => {}, () => {}]);

            // -- assert
            assert.strictEqual(typeof combined, "function");
        });

        test("useCustomizers throws if the argument is not an array", () => {
            assert.throws(() => useCustomizers("not an array"));
        });

        test("useCustomizers throws if array contains non-functions", () => {
            assert.throws(() => useCustomizers(["not a function"]));
        });

        test("useCustomizers can combine functionality", () => {
            // -- arrange
            const a = "a";
            const b = "b";

            const map = {
                [a]: "z",
                [b]: "y"
            }
            
            /**
             * @param {string} str 
             * @returns Customizer which clones given `value` into `map[value]` 
             * if the provided value is `str`
             */
            const getPropertyMapCustomizer = str => value => 
                value === str ? { clone: map[value] } : undefined;

            // -- act
            const cloned = cloneDeep({ a, b }, useCustomizers([
                getPropertyMapCustomizer(a),
                getPropertyMapCustomizer(b)
            ]));

            // -- assert
            assert.deepEqual(cloned, { a: "z", b: "y" });
        });

        test("useCustomizers calls each of its functions in order", () => {
            // -- arrange
            const result = [];

            const getValuePusher = value => () => result.push(value);
            const customizer01 = mock.fn(getValuePusher(1));
            const customizer02 = mock.fn(getValuePusher(2));

            // -- act
            cloneDeep({}, useCustomizers([customizer01, customizer02]));

            // -- assert
            assert.strictEqual(customizer01.mock.calls.length, 1);
            assert.strictEqual(customizer02.mock.calls.length, 1);
            assert.deepEqual(result, [1, 2]);
        });
    });

    describe("misc", () => {

        test("getTypedArrayConstructor returns DataView constructor if " + 
             "non-TypedArray tag is provided", () => {
            // -- arrange/act
            const constructor = getTypedArrayConstructor("");

            // -- assert
            assert.strictEqual(DataView, constructor);
        });

        test("isIterable", () => {
            // -- act/assert
            assert.strictEqual(true, isIterable([]));
            assert.strictEqual(true, isIterable(""));
            assert.strictEqual(true, isIterable({
                [Symbol.iterator]: () => ({
                    next: () => {
                        done: true
                    }
                })
            }));
            assert.strictEqual(false, isIterable({}));
            assert.strictEqual(false, isIterable(null));
        });
    });
}
catch(error) {
    console.warn = consoleDotWarn;
    throw error;
}
