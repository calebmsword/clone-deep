import assert from "node:assert";
import { describe, mock, test } from "node:test";

import cloneDeep, { Tag } from "./clone-deep.js";

describe("Default cloneDeep", () => {

    const tagOf = value => Object.prototype.toString.call(value);
    
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

    test("The cloned object does not === original", () => {
        const cloned = cloneDeep(original);

        assert.notStrictEqual(cloned, original);
    });

    test("The cloned object copies primitives by value", () => {
        const cloned = cloneDeep(original);

        assert.strictEqual(cloned.number, original.number);
        assert.strictEqual(cloned.string, original.string);
        assert.strictEqual(cloned[symbolKey], original[symbolKey]);
        assert.strictEqual(cloned.boolean, original.boolean);
        assert.strictEqual(cloned.bigint, original.bigint);
        assert.strictEqual(cloned.undef, original.undef);
        assert.strictEqual(cloned.nil, original.nil);
    });

    test("Nested objects are not ===", () => {
        const cloned = cloneDeep(original);

        console.log(cloned.array === original.array);

        assert.notStrictEqual(cloned.array, original.array);
        assert.notStrictEqual(cloned.nested, original.nested);
    });

    test("Arrays with non-index properties have non-index props cloned", () => {
        const array = [1, 2, {}];
        array.test = number;

        const cloned = cloneDeep(array);

        assert.notStrictEqual(cloned, original);
        assert.strictEqual(cloned[0], array[0]);
        assert.strictEqual(cloned[1], array[1]);
        assert.notStrictEqual(cloned[2], array[2]);
        assert.strictEqual(cloned[1], array[1]);
        assert.strictEqual(Array.isArray(array), true);
        assert.strictEqual(cloned.test, array.test);
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
            boolean: [new Boolean(), Tag.BOOLEAN],
            date: [new Date(), Tag.DATE],
            error: [new Error(), Tag.ERROR],
            map: [new Map(), Tag.MAP],
            number: [new Number(), Tag.NUMBER],
            object: [new Object(), Tag.OBJECT],
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
            const [value, tag] = type[key];
            const cloned = cloneDeep(value);

            assert.strictEqual(tagOf(cloned), tag);
        }
    });

    test("Unsupported types are cloned into empty objects", () => {
        const type = {
            weakmap: [new WeakMap(), Tag.WEAKMAP],
            weakset: [new WeakSet(), Tag.WEAKSET],
            function: [() => {}, "[object Function]"]
        }

        for (const key of Object.keys(type)) {
            console.log(key)
            const [value, tag] = type[key];
            const cloned = cloneDeep(value);

            assert.notStrictEqual(tagOf(cloned), tag);
            assert.strictEqual(tagOf(cloned), Tag.OBJECT);
        }
    });

    test("Circular references are cloned properly", () => {
        const cloned = cloneDeep(original);

        assert.notStrictEqual(cloned.circular, original.circular);
        assert.strictEqual(cloned.circular, cloned);
    });

    test("Property descriptors are copied over", () => {
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

        const cloned = cloneDeep(_original);

        // Note that cloned.accessor is accessed TWICE. `get` is called TWICE.
        cloned.accessor;
        cloned.accessor = "different value";

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
        const proto = Object.create({ protoProp: "protoProp" });
        const nestedProto = Object.create({ nestProtoProp: "nestedProtoProp" });

        const _original = Object.assign(Object.create(proto), {
            nested: Object.create(nestedProto)
        });

        const getProto = object => Object.getPrototypeOf(object);

        const cloned = cloneDeep(_original);

        assert.strictEqual(getProto(cloned), getProto(_original));
        assert.strictEqual(getProto(cloned.nested), getProto(_original.nested));
    });

    test("A warning is logged if object with methods is cloned", () => {
        const log = mock.fn(() => {});

        const _original = { func: () => {} };

        cloneDeep(_original, { log });

        const calls = log.mock.calls;
        assert.strictEqual(calls.length, 1);
        assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
    });

    test("A warning is logged if weakmap or weakset is cloned", () => {
        const log = mock.fn(() => {});

        const _original = { weakmap: new WeakMap(), weakset: new WeakSet() };

        cloneDeep(_original, { log });

        const calls = log.mock.calls;
        assert.strictEqual(calls.length, 2);
        assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
        assert.strictEqual(calls[1].arguments[0] instanceof Error, true);
    });

    test("A warning is logged if property with accessor is cloned", () => {
        const log = mock.fn(() => {});

        const _original = Object.defineProperties({}, {
            get: { get: () => {} },
            set: { set: () => {} },
            getAndSet: { get: () => {}, set: () => {} }
        });

        cloneDeep(_original, { log });

        const calls = log.mock.calls;
        assert.strictEqual(calls.length, 3);
        assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
        assert.strictEqual(calls[1].arguments[0] instanceof Error, true);
        assert.strictEqual(calls[2].arguments[0] instanceof Error, true);
    });

    test("A warning is logged if unsupported type is cloned", () => {
        const log = mock.fn(() => {});

        const _original = { [Symbol.toStringTag]: "Unsupported" };

        cloneDeep(_original, { log });

        const calls = log.mock.calls;
        assert.strictEqual(calls.length, 1);
        assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
    });

    test("A cloned map has cloned content of the original map", () => {
        const _original = new Map();

        const keyPrim = "keyPrim";
        const valuePrim = "valuePrim";
        _original.set(keyPrim, valuePrim);

        const key = "key";
        const value = {};
        _original.set(key, value);

        const cloned = cloneDeep(_original);

        assert.strictEqual(cloned.has(keyPrim) && cloned.has(key), true);
        assert.strictEqual(cloned.get(keyPrim), _original.get(keyPrim));
        assert.notStrictEqual(cloned.get(key), _original.get(key));
    });

    test("A cloned set has the cloned content of the original set", () => {
        const _original = new Set();

        const valuePrim = "valuePrim";
        _original.add(valuePrim);

        const value = {};
        _original.add(value);

        const cloned = cloneDeep(_original);

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
        const _original = {
            map: Object.assign(new Map(), { prop: "prop" }),
            set: Object.assign(new Set(), { prop: "prop" }),
        }

        const cloned = cloneDeep(_original);

        assert.strictEqual(cloned.map.prop, _original.map.prop);
        assert.strictEqual(cloned.set.prop, _original.set.prop);
    });

    test('A specific logger is provided if logMode is "quiet"', () => {
        const log = mock.fn(() => {});

        // A warning will be logged.
        cloneDeep({ func: () => {} }, { logMode: "quiet" });

        assert.strictEqual(log.mock.calls.length, 0);
    });

    test('A specific logger is provided if logMode is "silent"', () => {
        const log = mock.fn(() => {});

        // A warning will be logged.
        cloneDeep({ func: () => {} }, { logMode: "silent" });

        assert.strictEqual(log.mock.calls.length, 0);
    });

    test("TypedArray non-index props are cloned", () => {
        const typedArray = new Uint8Array(new ArrayBuffer(8), 1, 4)
        typedArray.prop = "prop";
        const _original = { typedArray };

        const cloned = cloneDeep(_original);

        for (let i = 0; i < 8; i++)
            assert.strictEqual(cloned.typedArray[i], _original.typedArray[i]);

        assert.strictEqual(cloned.typedArray.prop, "prop");
    });

    test("Extensibility, sealedness, and frozeness cloned", () => {
        const cloned = cloneDeep({
            inextensible: Object.preventExtensions({}),
            sealed: Object.seal({}),
            frozen: Object.freeze({})
        });

        assert.strictEqual(Object.isExtensible(cloned.inextensible), false);
        assert.strictEqual(Object.isSealed(cloned.sealed), true);
        assert.strictEqual(Object.isFrozen(cloned.frozen), true);
    });

    test("Native type with changed proto is cloned with that proto", () => {
        const map = new Map();
        Object.setPrototypeOf(map, Object.prototype);

        const cloned = cloneDeep(map);

        const getProto = object => Object.getPrototypeOf(object);

        assert.strictEqual(getProto(cloned), getProto(map));
    });

    test("Errors with causes are cloned", () => {
        const error = new Error("error", { cause: "cause" });

        const cloned = cloneDeep(error);

        assert.strictEqual(cloned.cause, error.cause);
    });
});

describe("cloneDeep customizer", () => {

    test("Customizer can determine cloned value", () => {
        const original = "original";
        const clone = {};
        const cloned = cloneDeep(original, () => ({ clone }));

        assert.notStrictEqual(cloned, original);
        assert.strictEqual(cloned, clone);
    });

    test("Customizer has no effect if it does not return an object", () => {
        const original = "original";
        const clone = {};
        const cloned = cloneDeep(original, () => {});

        assert.strictEqual(cloned, original);
        assert.notStrictEqual(cloned, clone);
    });

    test("Customizer can add additional values to clone", () => {
        const prop = {};
        const original = { prop };

        const newValue1 = "newValue1";
        const newValue2 = "newValue2";

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

        assert.strictEqual(cloned.prop[0], newValue1);
        assert.strictEqual(cloned.prop[1], newValue2);
        assert.strictEqual(original.prop[0], undefined);
        assert.strictEqual(original.prop[1], undefined);
    });

    test("Improper additionalValues are ignored ", () => {
        const a = "a";
        const b = "b";

        const newValue1 = "newValue1";
        const newValue2 = "newValue2";

        const cloned = cloneDeep({ a, b }, value => {
            const clone = {};
            if (value === a)
                return {
                    clone,
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
                    additionalValues: [newValue2],
                    ignoreProto: true,
                    ignoreProps: true
                };
        });

        assert.notStrictEqual(cloned[0], newValue1);
        assert.notStrictEqual(cloned[1], newValue2);
    });

    test("Customizer can cause value to be ignored", () => {
        const a = "a";
        const b = "b";

        const cloned = cloneDeep({ a, b }, value => {
            if (value === b) return { ignore: true };
        });

        assert.strictEqual(cloned.a, a);
        assert.notStrictEqual(cloned.b, b);
        assert.strictEqual(cloned.b, undefined);
    });

    test("Customizer can cause properties to be ignored", () => {
        const nested = { a: "a", b: "b" };
        const original = { nested };

        const cloned = cloneDeep(original, value => {
            if (value === nested) {
                return {
                    clone: {},
                    ignoreProps: true
                }
            }
        });

        assert.strictEqual(cloned.hasOwnProperty("nested"), true);
        assert.strictEqual(cloned.nested.a, undefined);
        assert.strictEqual(cloned.nested.b, undefined);
    });

    test("Warning logged, cloneDeep continues if customizer throws", () => {
        const log = mock.fn(() => {});
        const a = "a";


        const cloned = cloneDeep({ a }, {
            customizer: () => { 
                throw new Error("error"); 
            },
            log
        });

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

    test("Customizer can cause cloned value to not share prototype", () => {
        const proto = {};
        const original = Object.create(proto);

        const cloned = cloneDeep(original, () => {
            return {
                clone: {},
                ignoreProto: true
            }
        });

        const getProto = object => Object.getPrototypeOf(object);

        assert.notStrictEqual(getProto(cloned), getProto(original));
    });
});


// describe("cloneDeep utils", () => {

// });
