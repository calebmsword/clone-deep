/* node:coverage disable */

import './polyfills.js';
// eslint-disable-next-line no-duplicate-imports
import { clearPolyfills, polyfill } from './polyfills.js';

import { mock } from 'node:test';
import {
    assert,
    createLog,
    describe,
    getProto,
    tagOf,
    test
} from './test-utils.js';

import cloneDeep, {
    cloneDeepAsync,
    cloneDeepFully,
    cloneDeepFullyAsync,
    useCustomizers
} from '../index.js';

import { CLONE, Tag } from '../src/utils/constants.js';
import {
    castAsInstanceOf,
    createFileList,
    getSupportedPrototypes,
    getTypedArrayConstructor
} from '../src/utils/helpers.js';
import {
    isBuffer,
    isCallable,
    isDOMMatrix,
    isDOMMatrixReadOnly,
    isDOMPoint,
    isDOMPointReadOnly,
    isDOMRect,
    isDOMRectReadOnly,
    isIterable,
    isObject
} from '../src/utils/type-checking.js';
import { getDescriptors } from '../src/utils/metadata.js';
import { GlobalState } from '../src/clone-deep/clone-deep-utils/global-state.js';

describe('index.js', () => {
    test('exports cloneDeep as a default export. Also exports CLONE, ' +
         'cloneDeepAsync, cloneDeepFully, cloneDeepFullyAsync, and ' +
         'useCustomizers as named exports', async () => {
        const module = await import('../index.js');
        const array = [];
        const getPusher = (n) => {
            return () => {
                array.push(n);
            };
        };

        const clone = module['default']({ a: 'a' });
        const fullClone = module.cloneDeepFully({ a: 'a' });
        module.useCustomizers([
            getPusher(1),
            getPusher(2)
        ])();
        const symbol = module.CLONE;
        const { clone: clonedAsync } = await module
            .cloneDeepAsync({ a: 'a' });
        const { clone: clonedFullyAsync } = await module
            .cloneDeepFullyAsync({ a: 'a' });

        assert.strictEqual(6, Object.keys(module).length);
        assert.deepEqual(clone, { a: 'a' });
        assert.deepEqual(fullClone, { a: 'a' });
        assert.deepEqual(array, [1, 2]);
        assert.deepEqual(clonedAsync, { a: 'a' });
        assert.deepEqual(clonedFullyAsync, { a: 'a' });
        assert.strictEqual('symbol', typeof symbol);
    });
});

describe('cloneDeep without customizer', () => {

    const number = 1234566;
    const string = 'string';
    const boolean = true;
    const bigint = BigInt(7);
    const symbol = Symbol('symbol');
    const symbolKey = Symbol('key');
    const symbolValue = Symbol('value');
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
            nil
        }
    };

    original.circular = original;

    test('cloned !== original', () => {
        // -- act
        const cloned = cloneDeep(original);

        // -- assert
        assert.notStrictEqual(cloned, original);
    });

    test('The cloned object copies primitives by value', () => {
        // -- act
        const cloned = cloneDeep(original);

        // -- assert
        assert.strictEqual(cloned.number, original.number);
        assert.strictEqual(cloned.string, original.string);
        assert.strictEqual(cloned[symbolKey], original[symbolKey]);
        assert.strictEqual(cloned['boolean'], original['boolean']);
        assert.strictEqual(cloned.bigint, original.bigint);
        assert.strictEqual(cloned.undef, original.undef);
        assert.strictEqual(cloned.nil, original.nil);
    });

    test('Nested objects are not ===', () => {
        // -- act
        const cloned = cloneDeep(original);

        // -- assert
        assert.notStrictEqual(cloned.array, original.array);
        assert.notStrictEqual(cloned.nested, original.nested);
    });

    test('Arrays are cloned properly', () => {
        // -- arrange
        const array = [1, 2, {}];
        array.test = number;

        // -- act
        const cloned = cloneDeep(array);

        // -- assert
        assert.deepClone(cloned, array);
        assert.strictEqual(Array.isArray(cloned), true);
        assert.strictEqual(cloned.test, array.test);
    });

    test('Primitives are simply returned by value', () => {
        original.array.forEach((primitive) => {
            assert.strictEqual(cloneDeep(primitive), primitive);
        });
    });

    test('Supported types are cloned into the correct type', () => {
        const getNew = (TypedArray) => {
            return new TypedArray(new ArrayBuffer());
        };

        const getVideoFrame = () => {
            return new VideoFrame(Uint8Array.from([0x7f, 0xff, 0xd4]), {
                timestamp: 0,
                codedWidth: 1,
                codedHeight: 1,
                format: 'I420'
            });
        };

        const type = {
            // "standard" classes
            args: [
                {
                    callee: mock.fn(),
                    length: 0,
                    [Symbol.iterator]() {
                        let index = 0;
                        return {
                            next: () => {
                                return this[index++];
                            },
                            done: () => {
                                return index >= this.length;
                            }
                        };
                    },
                    [Symbol.toStringTag]: 'Arguments'
                },
                Tag.ARGUMENTS
            ],
            array: [[], Tag.ARRAY],
            bigint: [new Object(BigInt(0)), Tag.BIGINT],
            // eslint-disable-next-line no-new-wrappers
            boolean: [new Boolean(), Tag.BOOLEAN],
            date: [new Date(), Tag.DATE],
            error: [new Error(), Tag.ERROR],
            map: [new Map(), Tag.MAP],
            // eslint-disable-next-line no-new-wrappers
            number: [new Number(), Tag.NUMBER],
            object: [new Object(), Tag.OBJECT],
            promise: [
                new Promise((resolve) => {
                    resolve();
                }),
                Tag.PROMISE
            ],
            regexp: [/i/, Tag.REGEXP],
            set: [new Set(), Tag.SET],
            // eslint-disable-next-line no-new-wrappers
            string: [new String(), Tag.STRING],
            symbol: [new Object(Symbol('symbol')), Tag.SYMBOL],

            // ArrayBuffer, DataView and TypedArrays
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
            biguint64: [getNew(BigUint64Array), Tag.BIGUINT64],

            // Web APIs
            blob: [new Blob(), Tag.BLOB],
            domexception: [new DOMException(), Tag.DOMEXCEPTION],
            dommatrix: [new DOMMatrix(), Tag.DOMMATRIX],
            dommatrixro: [new DOMMatrixReadOnly(), Tag.DOMMATRIXREADONLY],
            dompoint: [new DOMPoint(), Tag.DOMPOINT],
            dompointreadonly: [new DOMPointReadOnly(), Tag.DOMPOINTREADONLY],
            domquad: [new DOMQuad(), Tag.DOMQUAD],
            domrect: [new DOMRect(), Tag.DOMRECT],
            domrectreadonly: [new DOMRectReadOnly(), Tag.DOMRECTREADONLY],
            audiodata: [new AudioData({
                data: new ArrayBuffer(1),
                format: 'u8',
                numberOfChannels: 1,
                numberOfFrames: 1,
                timestamp: 0,
                sampleRate: 44100
            }), Tag.AUDIODATA],
            file: [new File([], ''), Tag.FILE],
            filelist: [createFileList([]), Tag.FILELIST],
            imagedata: [new ImageData(10, 10), Tag.IMAGEDATA],
            videoframe: [getVideoFrame(), Tag.VIDEOFRAME],

            // Node types
            buffer: [Buffer.from([]), Tag.BUFFER]
        };

        for (const key of Object.keys(type)) {
            // -- arrange
            const [value, tag] = type[key];

            // -- act
            const cloned = cloneDeep(value);
            const clonedSlow = cloneDeep(value, {
                performanceConfig: {
                    robustTypeChecking: true
                }
            });

            // -- assert
            assert.strictEqual(typeof cloned, 'object');
            if (tag === Tag.BUFFER) {
                assert.true(isBuffer(cloned, { Buffer }));
            } else {
                assert.strictEqual(tagOf(cloned), tag);
            }

            assert.strictEqual(typeof clonedSlow, 'object');
            if (tag === Tag.BUFFER) {
                assert.true(isBuffer(clonedSlow, { Buffer }));
            } else {
                assert.strictEqual(tagOf(clonedSlow), tag);
            }
        }
    });

    test('non-web apis are cloned into the correct type in runtime ' +
         'without Web API polyfills', () => {

        clearPolyfills();

        try {
            const getNew = (TypedArray) => {
                return new TypedArray(new ArrayBuffer());
            };

            const type = {
                args: [
                    {
                        callee: mock.fn(),
                        length: 0,
                        [Symbol.iterator]() {
                            let index = 0;
                            return {
                                next: () => {
                                    return this[index++];
                                },
                                done: () => {
                                    return index >= this.length;
                                }
                            };
                        },
                        [Symbol.toStringTag]: 'Arguments'
                    },
                    Tag.ARGUMENTS
                ],
                array: [[], Tag.ARRAY],
                bigint: [new Object(BigInt(0)), Tag.BIGINT],
                // eslint-disable-next-line no-new-wrappers
                boolean: [new Boolean(), Tag.BOOLEAN],
                date: [new Date(), Tag.DATE],
                error: [new Error(), Tag.ERROR],
                map: [new Map(), Tag.MAP],
                // eslint-disable-next-line no-new-wrappers
                number: [new Number(), Tag.NUMBER],
                object: [new Object(), Tag.OBJECT],
                promise: [
                    new Promise((resolve) => {
                        resolve();
                    }),
                    Tag.PROMISE
                ],
                regexp: [/i/, Tag.REGEXP],
                set: [new Set(), Tag.SET],
                // eslint-disable-next-line no-new-wrappers
                string: [new String(), Tag.STRING],
                symbol: [new Object(Symbol('symbol')), Tag.SYMBOL],

                // ArrayBuffer, DataView and TypedArrays
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
            };

            for (const key of Object.keys(type)) {
                // -- arrange
                const [value, tag] = type[key];

                // -- act
                const cloned = cloneDeep(value);
                const clonedFast = cloneDeep(value, {
                    performanceConfig: {
                        robustTypeChecking: true
                    }
                });

                // -- assert
                assert.strictEqual(typeof cloned, 'object');
                assert.strictEqual(tagOf(cloned), tag);

                assert.strictEqual(typeof clonedFast, 'object');
                assert.strictEqual(tagOf(clonedFast), tag);
            }
        } catch (error) {
            polyfill();
            throw error;
        } finally {
            polyfill();
        }
    });

    test('Unsupported types are cloned into empty objects', () => {
        const type = {
            weakmap: [new WeakMap(), Tag.WEAKMAP],
            weakset: [new WeakSet(), Tag.WEAKSET],
            function: [() => {}, Tag.FUNCTION]
        };

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

    test('Circular references are cloned properly', () => {
        // -- act
        const cloned = cloneDeep(original);

        // -- assert
        assert.notStrictEqual(cloned.circular, original.circular);
        assert.strictEqual(cloned.circular, cloned);
    });

    test('Property descriptors are copied over', () => {
        // -- arrange
        const noAccessorValue = 'noAccessor';
        const accessorValue = 'accessor';

        const get = mock.fn(() => {
            return accessorValue;
        });
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

        cloned.accessor;
        cloned.accessor = 'different value';

        // -- assert
        const descriptor = Object.getOwnPropertyDescriptor(cloned,
                                                           'noAccessor');

        assert.notStrictEqual(cloned, _original);
        assert.strictEqual(descriptor.configurable, false);
        assert.strictEqual(descriptor.enumerable, false);
        assert.strictEqual(cloned.noAccessor, noAccessorValue);
        assert.strictEqual(descriptor.writable, false);

        assert.strictEqual(get.mock.calls.length, 1);
        assert.strictEqual(set.mock.calls.length, 1);
        assert.strictEqual(cloned.accessor, accessorValue);
    });

    test('Cloned objects share prototypes', () => {
        // -- arrange
        const proto = Object.create({ protoProp: 'protoProp' });
        const nestedProto = Object.create({
            nestProtoProp: 'nestedProtoProp'
        });
        const _original = Object.assign(Object.create(proto), {
            nested: Object.create(nestedProto)
        });

        // -- act
        const cloned = cloneDeep(_original);

        // -- assert
        assert.strictEqual(getProto(cloned), getProto(_original));
        assert.strictEqual(getProto(cloned.nested), getProto(_original.nested));
    });

    test('A warning is logged if object with methods is cloned', () => {
        // -- arrange
        const log = mock.fn(() => {});

        const _original = { func: () => {} };

        // -- act
        cloneDeep(_original, { log: createLog(log) });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 1);
        assert.true(typeof calls[0].arguments[0] === 'string');
        assert.true(calls[0].arguments[0].includes(
            'Attempted to clone function'));
    });

    test('A warning is logged if WeakMap or WeakSet is cloned', () => {
        // -- arrange
        const log = mock.fn(() => {});

        const _original = {
            weakmap: new WeakMap(),
            weakset: new WeakSet()
        };

        // -- act
        cloneDeep(_original, { log: createLog(log) });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 2);
        assert.true(calls[0].arguments[0] instanceof Error);
        assert.true(calls[1].arguments[0] instanceof Error);
        assert.true(calls[0].arguments[0].message.includes(
            'Attempted to clone unsupported type WeakMap.'));
        assert.true(calls[1].arguments[0].message.includes(
            'Attempted to clone unsupported type WeakSet.'));
    });

    test('A warning is logged if property with accessor is cloned', () => {
        // -- arrange
        const log = mock.fn(() => {});

        const _original = Object.defineProperties({}, {
            // eslint-disable-next-line getter-return
            get: { get: () => {} },
            set: { set: () => {} },
            // eslint-disable-next-line getter-return
            getAndSet: { get: () => {}, set: () => {} }
        });

        // -- act
        cloneDeep(_original, { log: createLog(log) });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 3);
        assert.strictEqual(calls[0].arguments[0] instanceof Error, true);
        assert.strictEqual(calls[1].arguments[0] instanceof Error, true);
        assert.strictEqual(calls[2].arguments[0] instanceof Error, true);
        calls.forEach((call) => {
            const [{ message }] = call.arguments;
            assert.true(message.includes('get or set accessor'));
        });
    });

    test('A warning is logged if unsupported type is cloned', () => {
        // -- arrange
        const log = mock.fn(() => {});

        const _original = { [Symbol.toStringTag]: 'Unsupported' };

        // -- act
        cloneDeep(_original, { log: createLog(log) });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 1);
        assert.true(calls[0].arguments[0] instanceof Error);
        assert.true(calls[0].arguments[0].message.includes(
            'Attempted to clone unsupported type.'));
    });

    test('A cloned map has cloned content of the original map', () => {
        // -- arrange
        const _original = new Map();

        const keyPrim = 'keyPrim';
        const valuePrim = 'valuePrim';
        _original.set(keyPrim, valuePrim);

        const key = 'key';
        const value = {};
        _original.set(key, value);

        // -- act
        const cloned = cloneDeep(_original);

        // -- assert
        assert.strictEqual(cloned.has(keyPrim) && cloned.has(key), true);
        assert.strictEqual(cloned.get(keyPrim), _original.get(keyPrim));
        assert.notStrictEqual(cloned.get(key), _original.get(key));
    });

    test('A cloned set has the cloned content of the original set', () => {
        // -- arrange
        const _original = new Set();

        const valuePrim = 'valuePrim';
        _original.add(valuePrim);

        const value = {};
        _original.add(value);

        // -- act
        const cloned = cloneDeep(_original);

        // -- assert
        let nonPrimitiveOriginal;
        _original.forEach((_value) => {
            if (typeof _value === 'object') {
                nonPrimitiveOriginal = _value;
            }
        });

        let nonPrimitiveCloned;
        cloned.forEach((_value) => {
            if (typeof _value === 'object') {
                nonPrimitiveCloned = _value;
            }
        });

        assert.true(cloned.size === 2);
        assert.strictEqual(cloned.has(valuePrim), _original.has(valuePrim));
        assert.notStrictEqual(nonPrimitiveCloned, undefined);
        assert.notStrictEqual(nonPrimitiveCloned, nonPrimitiveOriginal);
    });

    test('Maps and Sets have properties cloned', () => {
        // -- arrange
        const _original = {
            map: Object.assign(new Map(), { prop: 'prop' }),
            set: Object.assign(new Set(), { prop: 'prop' })
        };

        // -- act
        const cloned = cloneDeep(_original);

        // -- assert
        assert.strictEqual(cloned.map.prop, _original.map.prop);
        assert.strictEqual(cloned.set.prop, _original.set.prop);
    });

    test('A specific logger is provided if logMode is "silent"', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        // A warning will be logged.
        cloneDeep({ func: () => {} }, { log, logMode: 'silent' });

        // -- assert
        assert.strictEqual(log.mock.calls.length, 0);
    });

    test('TypedArray non-index props are cloned', () => {
        // -- arrange
        const typedArray = new Uint8Array(new ArrayBuffer(8), 1, 4);
        typedArray.prop = 'prop';
        const _original = { typedArray };

        // -- act
        const cloned = cloneDeep(_original);

        // -- assert
        for (let index = 0; index < 8; index++) {
            assert.strictEqual(cloned.typedArray[index],
                               _original.typedArray[index]);
        }

        assert.strictEqual(cloned.typedArray.prop, 'prop');
    });

    test('in robustTypeChecking mode, unrecognized TypedArray instances ' +
         'are cloned into DataViews and a warning is logged', () => {
        // -- arrange
        const typedArray = new Uint8Array(new ArrayBuffer(8), 1, 4);
        Object.defineProperty(typedArray, Symbol.toStringTag, {
            value: 'Float128Array'
        });

        const log = mock.fn(() => {});

        // -- act
        const cloned = cloneDeep(typedArray, {
            performanceConfig: {
                robustTypeChecking: true
            },
            log: createLog(log)
        });

        // -- assert
        assert.doesNotThrow(() => {
            DataView.prototype.getInt8.call(cloned);
        });
        assert.true(log.mock.calls[0].arguments[0].message.includes(
            'Unrecognized TypedArray subclass'));
    });

    test('Extensibility, sealedness, and frozenness cloned', () => {
        // -- arrange/act
        const cloned = cloneDeep({
            inextensible: Object.preventExtensions({}),
            sealed: Object.seal({}),
            frozen: Object.freeze({})
        });

        // -- assert
        assert.false(Object.isExtensible(cloned.inextensible));
        assert.true(Object.isSealed(cloned.sealed));
        assert.true(Object.isFrozen(cloned.frozen));
    });

    test('Native type with changed proto is cloned with that proto', () => {
        // -- arrange
        const map = new Map();
        Object.setPrototypeOf(map, Object.prototype);

        // -- act
        const cloned = cloneDeep(map);

        // -- assert
        assert.strictEqual(getProto(cloned), getProto(map));
    });

    test('Error clones get stack and cause', () => {
        // -- arrange
        const error = new Error('error', { cause: {}});

        // -- act
        const cloned = cloneDeep(error);

        // -- assert
        assert.deepClone(cloned.cause, error.cause);
        assert.strictEqual(cloned.stack, error.stack);
    });

    test('Error stacks are cloned correctly', () => {
        // -- arrange
        const error = new Error('');
        const errorStackReassigned = new Error('');
        errorStackReassigned.stack = Object.preventExtensions({});

        // -- act
        const cloned = cloneDeep(error);
        const clonedStackReassigned = cloneDeep(errorStackReassigned);

        // -- assert
        assert.strictEqual(cloned.stack, error.stack);
        assert.deepClone(clonedStackReassigned.stack,
                         errorStackReassigned.stack);
        assert.false(Object.isExtensible(clonedStackReassigned.stack));
    });

    test('Errors are cloned correctly even if monkeypatched', () => {
        let doMonkeypatch = true;
        try {
            // -- arrange
            const OriginalError = Error;
            // eslint-disable-next-line no-global-assign
            Error = function(...args) {
                if (doMonkeypatch !== true) {
                    return new OriginalError(...args);
                }
                const error = new OriginalError(...args);
                delete error.stack;
                return error;
            };
            Error.prototype = OriginalError.prototype;

            const error = new Error('error', { cause: 'cause' });

            // -- act
            const cloned = cloneDeep(error);

            // -- assert
            assert.strictEqual(cloned.cause, error.cause);
            assert.strictEqual(cloned.stack, error.stack);
        } catch (error) {
            doMonkeypatch = false;
            throw error;
        }
    });

    test('Errors have additional properties cloned', () => {
        // -- arrange
        const error = new Error('error');
        error.property = 'property';

        // -- act
        const cloned = cloneDeep(error);

        // -- assert
        assert.strictEqual(cloned.property, error.property);
    });

    test('Error subclasses are correctly cloned', () => {
        [
            AggregateError,
            EvalError,
            RangeError,
            ReferenceError,
            SyntaxError,
            TypeError,
            URIError
        ].forEach((ErrorClass) => {
            // -- arrange
            const error = new ErrorClass('error');

            // -- act
            const cloned = cloneDeep(error);

            // -- assert
            assert.strictEqual(getProto(cloned), ErrorClass.prototype);
        });
    });

    test('Unrecognized errors are cloned using the ordinary Error ' +
         'constructor function and a warning is logged', () => {
        const ErrorOriginal = Error;

        try {
            // -- arrange
            class TestError extends Error {
                name = 'TestError';
            };

            const log = mock.fn(() => {});

            // monkeypatch Error so we can track if it was called
            let errorOriginalCount = 0;
            // eslint-disable-next-line no-global-assign
            Error = function(...args) {
                errorOriginalCount++;
                return new ErrorOriginal(...args);
            };
            Error.prototype = ErrorOriginal.prototype;

            // -- act
            cloneDeep(new TestError('error'), { log: undefined });
            cloneDeep(new TestError('error'), { log: createLog(log) });

            // -- assert
            // note that TestError inherits the Error constructor
            assert.strictEqual(4, errorOriginalCount);
            assert.strictEqual(log.mock.calls.length, 1);
            assert.true(log.mock.calls[0].arguments[0].message.includes(
                'TestError!'));
        } catch (error) {
            // eslint-disable-next-line no-global-assign
            Error = ErrorOriginal;
            throw error;
        }
    });

    describe('AggregateError', () => {

        test('AggregateError is cloned correctly', () => {
            // -- arrange
            const error = new AggregateError(
                [new Error('a', { cause: 'cause' }), new Error('b')]);

            // -- act
            const cloned = cloneDeep(error);

            // -- assert
            assert.notStrictEqual(cloned, error);
            assert.notStrictEqual(cloned.errors, error.errors);
            assert.deepEqual(cloned, error);
            cloned.errors.forEach((clonedError, index) => {
                const originalError = error.errors[index];
                assert.deepClone(clonedError, originalError);
            });
        });

        test('AggregateError with cause is handled', () => {
            // -- arrange
            const error = new AggregateError(
                [new Error('a', { cause: 'cause' }), new Error('b')],
                '',
                { cause: {}});

            // -- act
            const cloned = cloneDeep(error);

            // -- assert
            assert.deepClone(cloned, error);
            assert.notStrictEqual(cloned.cause, error.cause);
            assert.notStrictEqual(cloned.errors, error.errors);
        });

        test('AggregateError with non-iterable errors is handled with ' +
                'warning', () => {
            // -- arrange
            const log = mock.fn(() => {});

            const error = new AggregateError([]);
            error.errors = {};

            // -- act
            const cloned = cloneDeep(error, { log: createLog(log) });

            // -- assert
            assert.deepClone(cloned, error);
            assert.deepEqual({}, cloned.errors);
            assert.deepClone(error.errors, cloned.errors);
            assert.true(log.mock.calls[0].arguments[0].message.includes(
                'non-iterable'));
        });
    });

    test('functions become empty objects inheriting ' +
         'Function.prototype', () => {
        // eslint-disable-next-line func-names
        [function() {}, () => {}].forEach((func) => {
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

    test('Errors with causes thrown outside customizer handled', () => {
        let temporarilyMonkeypatch = true;
        try {
            // -- arrange
            const log = mock.fn(() => {});

            // save current implementation
            const objectDotCreate = Object.create;
            Object.create = (...args) => {
                if (temporarilyMonkeypatch === true) {
                    throw new Error('error', { cause: 'cause' });
                } else {
                    return objectDotCreate(...args);
                }
            };

            // -- act
            cloneDeep({}, { log: createLog(log) });

            // -- assert
            const { calls } = log.mock;
            temporarilyMonkeypatch = false;

            assert.strictEqual(calls.length, 1);
            assert.notStrictEqual(calls[0].arguments[0].cause, undefined);
        } catch (error) {
            temporarilyMonkeypatch = false;
            throw error;
        }
    });

    test('Non-error objects thrown outside customizer handled', () => {
        let temporarilyMonkeypatch = true;
        try {
            // -- arrange
            const log = mock.fn(() => {});

            // save current implementation
            const objectDotCreate = Object.create;
            Object.create = (...args) => {
                if (temporarilyMonkeypatch === true) {
                    // eslint-disable-next-line no-throw-literal
                    throw 'not an error object';
                } else {
                    return objectDotCreate(...args);
                }
            };

            // -- act
            cloneDeep({}, { log: createLog(log) });

            // -- assert
            const { calls } = log.mock;
            temporarilyMonkeypatch = false;

            assert.strictEqual(calls.length, 1);
            assert.notStrictEqual(calls[0].arguments[0].cause, undefined);
        } catch (error) {
            temporarilyMonkeypatch = false;
            throw error;
        }
    });

    test('Errors without stacks thrown outside customizer handled', () => {
        let temporarilyMonkeypatch = true;
        try {
            // -- arrange
            const log = mock.fn(() => {});

            // save current implementation
            const objectDotCreate = Object.create;
            Object.create = (...args) => {
                if (temporarilyMonkeypatch === true) {
                    throw Object.assign(objectDotCreate(Error.prototype));
                } else {
                    return objectDotCreate(...args);
                }
            };

            // -- act
            cloneDeep({}, { log: createLog(log) });

            // -- assert
            const { calls } = log.mock;
            temporarilyMonkeypatch = false;

            assert.strictEqual(calls.length, 1);
            assert.notStrictEqual(calls[0].arguments[0].stack, undefined);
        } catch (error) {
            temporarilyMonkeypatch = false;
            throw error;
        }
    });

    test('regExp.lastIndex is cloned properly', () => {
        // -- arrange
        const regExp = new RegExp('');
        regExp.lastIndex = {};

        // -- act
        const cloned = cloneDeep(regExp);

        // -- assert
        assert.deepClone(cloned.lastIndex, regExp.lastIndex);
    });

    test('Native prototypes can be cloned without errors', () => {
        getSupportedPrototypes().forEach((proto) => {
            cloneDeep(proto);
        });
    });

    test('FileLists are cloned properly', () => {
        // -- arrange
        const dateFoo = new Date('July 20, 69 20:17:40 GMT+00:00');
        const fileFoo = new File(['foo'], 'foo', {
            type: 'text/plain',
            lastModified: dateFoo.getTime()
        });

        const dateBar = new Date('July 21, 69 20:17:40 GMT+00:00');
        const fileBar = new File([JSON.stringify({ bar: 'bar ' })], 'bar', {
            type: 'application/json',
            lastModified: dateBar.getTime()
        });

        // -- act
        const fileList = createFileList(fileFoo, fileBar);
        const cloned = cloneDeep(fileList);

        // -- assert
        assert.deepClone(cloned, fileList);
        assert.notStrictEqual(cloned.item(0), fileList.item(0));
        assert.notStrictEqual(cloned.item(1), fileList.item(1));
    });

    test('objects with the File prototype are not assumed to be ' +
         'Files', () => {
        // -- arrange
        const fakeFile = Object.create(File.prototype);

        // -- act
        const clone = cloneDeep(fakeFile);

        // -- assert
        assert.strictEqual(Tag.OBJECT, tagOf(clone));
    });

    describe('geometry web APIs', () => {

        test('the geometry classes are deeply cloned', () => {
            [
                DOMMatrix,
                DOMMatrixReadOnly,
                DOMPoint,
                DOMPointReadOnly,
                DOMQuad,
                DOMRect,
                DOMRectReadOnly
            ].forEach((GeometryClass) => {
                // -- arrange
                const _original = new GeometryClass();

                // -- act
                const cloned = cloneDeep(_original);

                // -- assert
                assert.deepClone(_original, cloned);
            });
        });

        test('DOMMatrix is2D property preserved', () => {
            // -- arrange
            const original2D = new DOMMatrix([1, 1, 1, 1, 1, 1]);
            const original3D = new DOMMatrix([
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1
            ]);
            const original2DRO = new DOMMatrixReadOnly([1, 1, 1, 1, 1, 1]);
            const original3DRO = new DOMMatrixReadOnly([
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1
            ]);

            // -- act
            const cloned2D = cloneDeep(original2D);
            const cloned3D = cloneDeep(original3D);
            const cloned2DRO = cloneDeep(original2DRO);
            const cloned3DRO = cloneDeep(original3DRO);

            // -- assert
            assert.strictEqual(cloned2D.is2D, original2D.is2D);
            assert.strictEqual(cloned3D.is2D, original3D.is2D);
            assert.strictEqual(cloned2DRO.is2D, original2DRO.is2D);
            assert.strictEqual(cloned3DRO.is2D, original3DRO.is2D);
        });
    });

    describe('DOMExecption', () => {
        test('DOMException names and codes are cloned properly', () => {
            // -- arrange
            const exc = new DOMException();
            const namedExc = new DOMException('custom msg', 'IndexSizeError');

            // -- act
            const clonedExc = cloneDeep(exc);
            const clonedNamed = cloneDeep(namedExc);

            // -- assert
            assert.deepClone(clonedExc, exc);
            assert.deepClone(clonedNamed, namedExc);

            assert.deepStrictEqual(
                [exc.name, exc.code, exc.stack],
                [clonedExc.name, clonedExc.code, clonedExc.stack]);
            assert.deepStrictEqual(
                [namedExc.name, namedExc.code, namedExc.stack],
                [clonedNamed.name, clonedNamed.code, clonedNamed.stack]);
        });

        test('if stack is nonprimitive, it is still properly ' +
             'cloned', () => {
            // -- arrange
            const exc = new DOMException();
            exc.stack = Object.preventExtensions({});

            // -- act
            const cloned = cloneDeep(exc);

            // -- assert
            assert.deepClone(cloned.stack, exc.stack);
            assert.false(Object.isExtensible(cloned.stack));
        });

        test('if runtime does not provide a stack (or the stack is ' +
             'undefined), cloned DOMException will returned undefined if ' +
             'you access stack', () => {
            // -- arrange
            const exc = new DOMException();
            exc.stack = undefined;

            // -- act
            const cloned = cloneDeep(exc);

            // -- assert
            assert.deepClone(cloned, exc);
            assert.deepStrictEqual(
                [exc.name, exc.code, exc.stack],
                [cloned.name, cloned.code, cloned.stack]);
            assert.undefined(cloned.stack);
        });
    });

    test('DOMQuad correctly clones properties that are pressent in its ' +
         'prototype', () => {
        // -- arrange
        const quad = new DOMQuad();
        Object.defineProperty(quad, 'p1', {
            value: new DOMQuad()
        });

        // -- act
        const cloned = cloneDeep(quad);

        // -- assert
        assert.deepClone(quad, cloned);
        assert.true(Object.getOwnPropertyNames(cloned).includes('p1'));
    });

    test('DOMQuad correctly clones its points', () => {
        // -- arrange
        const quad = new DOMQuad();
        quad.p1.test1 = 'test1';
        Object.defineProperty(quad.p1, 'test2', {
            get: () => {
                return 'test2';
            }
        });

        // -- act
        const cloned = cloneDeep(quad);

        // -- assert
        assert.strictEqual('test1', cloned.p1.test1);
        assert.strictEqual('test2', cloned.p1.test2);
    });

    test('ImageData and ImageBitmap instances are only recognized if ' +
         'they were created by the constructor function', () => {
        // -- arrange
        const fakeImageData = Object.create(ImageData.prototype);
        const fakeImageBitmap = Object.create(ImageBitmap.prototype);

        // -- act
        const cloneData = cloneDeep(fakeImageData);
        const cloneBitmap = cloneDeep(fakeImageBitmap);

        // -- assert
        assert.throws(() => {
            getDescriptors(getProto(ImageData)).width.get?.call(cloneData);
        });
        assert.throws(() => {
            getDescriptors(getProto(ImageBitmap)).height.get?.call(cloneBitmap);
        });
    });

    test('cloneDeep is not asynchronous even if async property is ' +
         'provided in options', () => {
        // -- arrange/act
        const clone = cloneDeep({}, { async: true });

        // -- assert
        assert.true(!isCallable(clone.then));
    });
});

describe('customizer', () => {

    test('Customizer can determine cloned value', () => {
        // -- arrange
        const original = 'original';
        const clone = {};

        // -- act
        const cloned = cloneDeep(original, {
            customizer(value) {
                return {
                    clone,
                    ignoreProps: !isObject(value)
                };
            }
        });

        // -- assert
        // assert.notStrictEqual(cloned, original);
        assert.strictEqual(cloned, clone);
    });

    test('Customizer has no effect if it does not return an object', () => {
        // -- arrange
        const original = 'original';
        const clone = {};

        // -- act
        const cloned = cloneDeep(original, () => {});

        // -- assert
        assert.strictEqual(cloned, original);
        assert.notStrictEqual(cloned, clone);
    });

    test('Customizer can add additional values to clone', () => {
        // -- arrange
        const prop = {};
        const original = { prop };

        const newValue1 = 'newValue1';
        const newValue2 = 'newValue2';

        // -- act
        const cloned = cloneDeep(original, {
            customizer(value) {
                if (value !== prop) {
                    return;
                }
                const clone = {};
                return {
                    clone,
                    additionalValues: [{
                        value: newValue1,
                        assigner: (_cloned) => {
                            clone[0] = _cloned;
                        }
                    }, {
                        value: newValue2,
                        assigner: (_cloned) => {
                            clone[1] = _cloned;
                        }
                    }]
                };
            }
        });

        // -- assert
        assert.deepEqual(Object.values(cloned.prop), [newValue1, newValue2]);
        assert.deepEqual(Object.values(original.prop), []);
    });

    test('If customizer returns improperly formatted additionalValues, ' +
         'they are ignored and warnings are logged ', () => {
        // -- arrange
        const log = mock.fn(() => {});

        const a = 'a';
        const b = 'b';
        const c = 'c';

        const newValue1 = 'newValue1';
        const newValue2 = 'newValue2';
        const newValue3 = 'newValue3';

        // -- act
        const cloned = cloneDeep({ a, b, c }, {
            customizer: (value) => {
                const clone = {};
                if (value === a) {
                    return {
                        clone,

                        // additionalValues must be an array
                        additionalValues: {
                            value: newValue1,
                            assigner: (_cloned) => {
                                clone[0] = _cloned;
                            }
                        },
                        ignoreProto: true,
                        ignoreProps: true
                    };
                }
                if (value === b) {
                    return {
                        clone,

                        // additionalValues must be an array of objects
                        additionalValues: [newValue2],
                        ignoreProto: true,
                        ignoreProps: true
                    };
                }
                if (value === c) {
                    return {
                        clone,

                        // The objects must have an `assigner` function
                        additionalValues: [{ clone: newValue3 }],
                        ignoreProto: true,
                        ignoreProps: true
                    };
                }
            },
            log: createLog(log)
        });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 3);
        calls.forEach((call) => {
            assert.strictEqual(call.arguments[0] instanceof Error, true);
        });

        assert.notStrictEqual(cloned[0], newValue1);
        assert.notStrictEqual(cloned[1], newValue2);
        assert.notStrictEqual(cloned[2], newValue2);
    });

    test('Customizer can cause value to be ignored', () => {
        // -- arrange
        const a = 'a';
        const b = 'b';

        // -- act
        const cloned = cloneDeep({ a, b }, {
            customizer(value) {
                if (value === b) {
                    return { ignore: true };
                }
            }
        });

        // -- assert
        assert.strictEqual(cloned.a, a);
        assert.notStrictEqual(cloned.b, b);
        assert.undefined(cloned.b);
    });

    test('Customizer can cause properties to be ignored', () => {
        // -- arrange
        const nested = { a: 'a', b: 'b' };
        const original = { nested };

        // -- act
        const cloned = cloneDeep(original, {
            customizer(value) {
                if (value === nested) {
                    return {
                        clone: {},
                        ignoreProps: true
                    };
                }
            }
        });

        // -- assert
        assert.true(Object.hasOwn(cloned, 'nested'));
        assert.undefined(cloned.nested.a);
        assert.undefined(cloned.nested.b);
    });

    test('Warning logged, cloneDeep continues if customizer throws', () => {
        // -- arrange
        const log = mock.fn(() => {});
        const a = 'a';

        // -- act
        const cloned = cloneDeep({ a }, {
            customizer: () => {
                throw new Error('error');
            },
            log: createLog(log)
        });

        // -- assert
        const { calls } = log.mock;

        // The customizer will be called again for the property in original
        assert.strictEqual(calls.length, 2);
        assert.true(calls[0].arguments[0] instanceof Error);
        assert.strictEqual(cloned.a, a);
    });

    test('Customizer can cause cloneDeep to throw an error', () => {
        assert['throws'](() => {
            return cloneDeep({}, {
                customizer: () => {
                    throw new Error('error');
                },
                letCustomizerThrow: true
            });
        });
    });

    test('If customizer throws non-error, cloneDeep handles it', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        cloneDeep({}, {
            customizer: () => {
                // eslint-disable-next-line no-throw-literal
                throw 'not an error object';
            },
            log: createLog(log)
        });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 1);
    });

    test('If customizer throws without stack, cloneDeep handles it', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        cloneDeep({}, {
            customizer: () => {
                throw Object.assign(Object.create(Error.prototype));
            },
            log: createLog(log)
        });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 1);
    });

    test('If customizer throws error with cause, cloneDeep handles ' +
         'it', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        cloneDeep({}, {
            customizer: () => {
                throw new Error('error', { cause: 'cause' });
            },
            log: createLog(log)
        });

        // -- assert
        const { calls } = log.mock;
        assert.strictEqual(calls.length, 1);
        assert.notStrictEqual(calls[0].arguments[0].cause, undefined);
    });

    test('Customizer can cause cloned value to not share prototype', () => {
        // -- arrange
        const proto = {};
        const original = Object.create(proto);

        // -- act
        const cloned = cloneDeep(original, {
            customizer() {
                return {
                    clone: {},
                    ignoreProto: true
                };
            }
        });

        // -- assert
        assert.notStrictEqual(getProto(cloned), getProto(original));
    });

    test('customizer can cause props and proto to be ignored without ' +
         'assigning a clone', () => {
        // -- arrange
        const original = Object.assign(Object.create({
            a: 'a',
            [Symbol.toStringTag]: 'Unsupported'
        }), {
            b: 'b',
            c: 'c'
        });

        // -- act
        const clone = cloneDeep(original, {
            customizer() {
                return {
                    useCustomizerClone: false,
                    ignoreProps: true,
                    ignoreProto: true
                };
            }
        });

        // -- assert
        assert.deepEqual(clone, {});
        assert.deepEqual(getProto(clone), Object.prototype);
    });

    test('customizer receives logger', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        cloneDeep({}, {
            customizer(_value, logger) {
                logger.warn('test');
            },
            log: createLog(log)
        });

        // -- assert
        assert.strictEqual(1, log.mock.calls.length);
        assert.strictEqual('test', log.mock.calls[0].arguments[0]);
    });

    test('propsToIgnore property can cause props not to be cloned', () => {
        // -- arrange/act
        const clone = cloneDeep({ a: 'a', b: 'b' }, {
            customizer() {
                return {
                    useCustomizerClone: false,
                    propsToIgnore: ['a']
                };
            }
        });

        // -- assert
        assert.deepEqual(clone, { b: 'b' });
    });

    test('an improper propsToIgnore causes a warning to be logged', () => {
        // -- arrange
        const customizer1 = () => {
            return {
                clone: {},
                propsToIgnore: false
            };
        };
        const log1 = mock.fn(() => {});

        const customizer2 = () => {
            return {
                clone: {},
                propsToIgnore: [{}]
            };
        };
        const log2 = mock.fn(() => {});


        // -- act
        cloneDeep({}, { customizer: customizer1, log: createLog(log1) });
        cloneDeep({}, { customizer: customizer2, log: createLog(log2) });

        // -- assert
        assert.true(true, log1.mock.calls[0].arguments[0].message.includes(
            'is expected to be an array of strings or symbols'));
        assert.true(log2.mock.calls[0].arguments[0].message.includes(
            'is expected to be an array of strings or symbols'));
    });

    test('customizer can force algorithm to throw', () => {
        // -- act/assert
        assert.throws(() => {
            cloneDeep({}, {
                customizer() {
                    return {
                        throwWith: new Error('fail')
                    };
                }
            });
        });
    });
});

describe('cloneDeepFully', () => {

    test('Prototype chain is cloned', () => {
        // -- arrange
        const protoProto = Object.create(null);
        const proto = Object.create(protoProto);
        const original = Object.create(proto);

        // -- act
        const cloned = cloneDeepFully(original);

        // -- assert
        assert.notStrictEqual(getProto(cloned), getProto(original));
        assert.notStrictEqual(getProto(getProto(cloned)),
                              getProto(getProto(original)));
    });

    test('non-boolean options.force is like force === false', () => {
        // -- arrange
        const protoProto = Object.create(null);
        const proto = Object.create(protoProto);
        const original = Object.create(proto);

        // -- act
        const cloned = cloneDeepFully(original, { force: 'true' });

        // -- asser
        assert.notStrictEqual(getProto(cloned), getProto(original));
        assert.notStrictEqual(getProto(getProto(cloned)),
                              getProto(getProto(original)));
    });

    test('Without force, prototypes with methods are not cloned', () => {
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

    test('Primitives are returned by value.', () => {
        [
            null,
            undefined,
            's',
            0,
            BigInt(0),
            Symbol(0)
        ].forEach((primitive) => {
            assert.strictEqual(cloneDeepFully(primitive), primitive);
        });
    });

    test('Without force, cloned functions get Function.prototype', () => {
        // eslint-disable-next-line func-names
        [() => {}, function() {}].forEach((func) => {
            const cloned = cloneDeepFully(func);

            assert.strictEqual(getProto(cloned), getProto(func));
            assert.strictEqual(getProto(cloned), Function.prototype);
        });
    });

    test('With force, cloned functions clone Function.prototype', () => {
        // eslint-disable-next-line func-names
        [() => {}, function() {}].forEach((func) => {
            const cloned = cloneDeepFully(func, { force: true });

            assert.notStrictEqual(getProto(cloned), getProto(func));
        });
    });

    test('Native prototypes can be fully cloned without errors', () => {
        getSupportedPrototypes().forEach((proto) => {
            cloneDeepFully(proto, { force: true });
        });
    });

    test('cloneDeepFully can provide customizer', () => {
        // -- arrange
        const original = 'original';
        const clone = {};

        // -- act
        const cloned = cloneDeepFully(original, {
            customizer(value) {
                const result = { clone };
                if (!isObject(value)) {
                    result.ignoreProps = true;
                }
                return result;
            }
        });

        // -- assert
        assert.notStrictEqual(cloned, original);
        assert.strictEqual(cloned, clone);
    });

    test('cloneDeepFully can provide logger', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        cloneDeepFully({ func: () => {} }, { log: createLog(log) });

        // -- assert
        assert.strictEqual(log.mock.calls.length, 1);
    });

    test('cloneDeepFully can provide logMode', () => {
        // -- arrange
        const logSilent = mock.fn(() => {});

        // -- act
        cloneDeepFully({ func: () => {} }, {
            log: logSilent,
            logMode: 'silent'
        });

        // -- assert
        assert.strictEqual(logSilent.mock.calls.length, 0);
    });

    test('cloneDeepFully can cause customizer to throw', () => {
        assert['throws'](() => {
            cloneDeepFully({}, {
                customizer() {
                    // eslint-disable-next-line no-throw-literal
                    throw 'throw';
                },
                letCustomizerThrow: true
            });
        });
    });

    test('cloneDeepFullyAsync works as expected', async () => {
        // -- arrange
        const proto = {
            test: 'test'
        };
        const topLevel = Object.assign(Object.create(proto), {
            top: 'top'
        });

        // -- act
        const { clone } = await cloneDeepFullyAsync(topLevel);

        // -- assert
        assert.deepClone(clone, topLevel);
        assert.deepClone(getProto(clone), getProto(topLevel));
        assert.strictEqual('test', getProto(clone).test);
    });

    test('cloneDeepFullyAsync performanceConfig, force, and ' +
         'ignoreCloningMethodsbehave as expected', async () => {
        // -- arrange
        const original = {
            [CLONE]() {
                return 'primitive';
            }
        };

        // -- act
        const { clone } = await cloneDeepFullyAsync(original, {
            performanceConfig: {
                robustTypeChecking: true
            },
            force: true,
            ignoreCloningMethods: true
        });

        // -- assert
        assert.deepClone(clone, original);
        assert.deepClone(getProto(clone), Object.prototype);
    });

    test('cloneDeepFullyAsync letCustomizerThrow works', () => {
        // -- arrange
        const original = {};

        // -- act
        const clonePromise = cloneDeepFullyAsync(original, {
            letCustomizerThrow: true,
            customizer() {
                throw new Error('guaranteed to fail');
            }
        });

        // -- assert
        assert.rejects(clonePromise);
    });

    test('cloneDeepFully is not asynchronous even if async property is ' +
         'provided in options', () => {
        // -- arrange/act
        const clone = cloneDeepFully({}, { async: true });

        // -- assert
        assert.true(!isCallable(clone.then));
    });
});

describe('useCustomizers', () => {

    test('useCustomizers takes functions and returns a function', () => {
        // -- arrange/act
        const combined = useCustomizers([() => {}, () => {}]);

        // -- assert
        assert.strictEqual(typeof combined, 'function');
    });

    test('useCustomizers throws if the argument is not an array', () => {
        assert['throws'](() => {
            return useCustomizers('not an array');
        });
    });

    test('useCustomizers throws if array contains non-functions', () => {
        assert['throws'](() => {
            return useCustomizers(['not a function']);
        });
    });

    test('useCustomizers can combine functionality', () => {
        // -- arrange
        const a = 'a';
        const b = 'b';

        const map = {
            [a]: 'z',
            [b]: 'y'
        };

        /**
         * @param {string} str
         * @returns Customizer which clones given `value` into `map[value]`
         * if the provided value is `str`
         */
        const getPropertyMapCustomizer = (str) => {
            return (value) => {
                return value === str ? { clone: map[value] } : undefined;
            };
        };

        // -- act
        const cloned = cloneDeep({ a, b }, {
            customizer: useCustomizers([
                getPropertyMapCustomizer(a),
                getPropertyMapCustomizer(b)
            ])
        });

        // -- assert
        assert.deepEqual(cloned, { a: 'z', b: 'y' });
    });

    test('useCustomizers calls each of its functions in order', () => {
        // -- arrange
        const result = [];

        const getValuePusher = (value) => {
            return () => {
                return result.push(value);
            };
        };
        const customizer01 = mock.fn(getValuePusher(1));
        const customizer02 = mock.fn(getValuePusher(2));

        // -- act
        cloneDeep({}, {
            customizer: useCustomizers([customizer01, customizer02])
        });

        // -- assert
        assert.strictEqual(customizer01.mock.calls.length, 1);
        assert.strictEqual(customizer02.mock.calls.length, 1);
        assert.deepEqual(result, [1, 2]);
    });
});

describe('CLONE', () => {
    test('classes can use the CLONE symbol to create a method ' +
         'responsible for defining the clone of their instances', () => {
        // -- arrange
        class Test {
            [CLONE]() {
                return {
                    clone: {
                        test: 'test'
                    }
                };
            }
        }

        // -- act
        const cloned = cloneDeep(new Test());

        // -- assert
        assert.strictEqual('test', cloned.test);
    });

    test('cloning methods can be ignored entirely if the correct option ' +
         'is used', () => {
        // -- arrange
        class Test {
            [CLONE]() {
                return {
                    clone: {
                        test: 'test'
                    }
                };
            }
        }

        // -- act
        const cloned = cloneDeep(new Test(), {
            ignoreCloningMethods: true
        });
        const cloned2 = cloneDeepFully(new Test(), {
            ignoreCloningMethods: true
        });

        // -- assert
        assert.notStrictEqual('test', cloned.test);
        assert.notStrictEqual('test', cloned2.test);
    });

    test('cloning methods can cause the algorithm to not recurse on ' +
         'specific properties on the clone', () => {
        // -- arrange
        class Test {
            a = 'a';

            b = 'b';

            [CLONE]() {
                return {
                    clone: Object.assign(Object.create(Test.prototype), {
                        a: 'a'
                    }),
                    propsToIgnore: ['b']
                };
            }
        }

        // -- act
        const cloned = cloneDeep(new Test());

        // -- assert
        assert.deepEqual(cloned, { a: 'a' });
    });

    test('cloning methods can be fully responsible for cloning all ' +
         'properties of the resultant clone', () => {
        // -- arrange
        class Test {
            a = 'a';

            b = 'b';

            [CLONE]() {
                return {
                    clone: Object.create(Test.prototype),
                    ignoreProps: true
                };
            }
        }

        // -- act
        const cloned = cloneDeep(new Test());

        // -- assert
        assert.deepEqual(cloned, {});
    });

    test('cloning methods can be fully responsible for the prototype of ' +
         'the resultant clone', () => {
        // -- arrange
        class Test {
            [CLONE]() {
                return {
                    clone: {},
                    ignoreProto: true
                };
            }
        }

        // -- act
        const cloned = cloneDeep(new Test());

        // -- assert
        assert.notStrictEqual(getProto(cloned), Test.prototype);
    });

    test('an improper propsToIgnore causes a warning to be logged', () => {
        // -- arrange
        class Test1 {
            [CLONE]() {
                return {
                    clone: new Test1(),
                    propsToIgnore: false
                };
            }
        }
        const log1 = mock.fn(() => {});

        class Test2 {
            [CLONE]() {
                return {
                    clone: new Test2(),
                    propsToIgnore: [{}]
                };
            }
        }
        const log2 = mock.fn(() => {});


        // -- act
        cloneDeep(new Test1(), { log: createLog(log1) });
        cloneDeep(new Test2(), { log: createLog(log2) });

        // -- assert
        assert.true(log1.mock.calls[0].arguments[0].message.includes(
            'is expected to be an array of strings or symbols'));
        assert.true(log2.mock.calls[0].arguments[0].message.includes(
            'is expected to be an array of strings or symbols'));
    });

    test('if using cloneDeepFully in force mode and observing cloning ' +
            'methods, then any prototype containing a cloning method used ' +
            'for an instance cloned previously in the chain will not be ' +
            'cloned using its cloning method', () => {
        // -- arrange
        class Test {
            [CLONE]() {
                return {
                    clone: {
                        test: 'test'
                    }
                };
            }
        }

        Test.prototype.a = 'a';

        // -- act
        const cloned1 = cloneDeepFully(new Test(), { force: true });
        const cloned2 = cloneDeepFully(Object.create(Test.prototype), {
            force: true
        });

        // -- assert
        assert.strictEqual('test', cloned1.test);
        assert.strictEqual(getProto(cloned1).a, 'a');
        assert.undefined(getProto(cloned1).test);
        assert.strictEqual('test', cloned2.test);
        assert.strictEqual(getProto(cloned2).a, 'a');
        assert.undefined(getProto(cloned2).test);
    });

    test('If using cloneDeepFully in force mode and observing cloning ' +
         'methods, objects NOT instantiated as a class will have their ' +
         'prototype use its cloning method', () => {
        // -- arrange
        const c = {
            [CLONE]() {
                return {
                    clone: {
                        test: 'test'
                    }
                };
            }
        };
        const b = {};
        const a = {};

        Object.setPrototypeOf(a, b);
        Object.setPrototypeOf(b, c);

        // -- act
        const cloned = cloneDeepFully(a, { force: true });

        // -- assert
        assert.strictEqual('test', cloned.test);
        assert.strictEqual(getProto(cloned).test, 'test');
        assert.strictEqual(getProto(getProto(cloned)).test, 'test');
    });

    test('if in "let customizers throw" mode, errors in cloning methods ' +
         'will be thrown', () => {
        // --act/assert
        assert.throws(() => {
            cloneDeep({
                [CLONE]() {
                    throw new Error('fail');
                }
            }, { letCustomizerThrow: true });
        });
    });

    test('if not in "let customizers throw" mode, errors in cloning ' +
         'methods will be logged', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // --act
        cloneDeep({
            [CLONE]() {
                throw new Error('fail');
            }
        }, { log: createLog(log) });

        // -- assert
        // it complains a second time when it tries to clone cloning method
        assert.strictEqual(2, log.mock.calls.length);
    });

    test('cloning method can cause props and proto to be ignored without ' +
         'assigning a clone', () => {
        // -- arrange
        const original = Object.assign(Object.create({
            a: 'a',
            [Symbol.toStringTag]: 'Unsupported',
            [CLONE]() {
                return {
                    useCloningMethod: false,
                    ignoreProps: true,
                    ignoreProto: true
                };
            }
        }), {
            b: 'b',
            c: 'c'
        });

        // -- act
        const clone = cloneDeep(original);

        // -- assert
        assert.deepEqual(clone, {});
        assert.deepEqual(getProto(clone), Object.prototype);
    });

    test('cloning method receives logger', () => {
        const consoleDotLog = console.log;
        try {
            // -- arrange
            const spy = mock.fn(() => {});
            console.log = spy;

            const proto = {
                [CLONE](logger) {
                    logger.info('test');
                }
            };

            // -- act
            cloneDeep(Object.create(proto));

            // -- assert
            assert.strictEqual(1, spy.mock.calls.length);
            assert.strictEqual('test', spy.mock.calls[0].arguments[0]);

        } catch (error) {
            console.log = consoleDotLog;
            throw error;
        }
    });

    test('cloning method can force algorithm to throw', () => {
        // -- act/assert
        assert.throws(() => {
            cloneDeep({
                [CLONE]() {
                    return {
                        throwWith: new Error('fail')
                    };
                }
            });
        });
    });
});

describe('async mode', () => {
    test('Supported types are cloned into the correct type', async () => {
        const getNew = (TypedArray) => {
            return new TypedArray(new ArrayBuffer());
        };

        const type = {
            // "standard" classes
            args: [
                {
                    callee: mock.fn(),
                    length: 0,
                    [Symbol.iterator]() {
                        let index = 0;
                        return {
                            next: () => {
                                return this[index++];
                            },
                            done: () => {
                                return index >= this.length;
                            }
                        };
                    },
                    [Symbol.toStringTag]: 'Arguments'
                },
                Tag.ARGUMENTS
            ],
            array: [[], Tag.ARRAY],
            bigint: [new Object(BigInt(0)), Tag.BIGINT],
            // eslint-disable-next-line no-new-wrappers
            boolean: [new Boolean(), Tag.BOOLEAN],
            date: [new Date(), Tag.DATE],
            error: [new Error(), Tag.ERROR],
            map: [new Map(), Tag.MAP],
            // eslint-disable-next-line no-new-wrappers
            number: [new Number(), Tag.NUMBER],
            object: [new Object(), Tag.OBJECT],
            promise: [
                new Promise((resolve) => {
                    resolve();
                }),
                Tag.PROMISE
            ],
            regexp: [/i/, Tag.REGEXP],
            set: [new Set(), Tag.SET],
            // eslint-disable-next-line no-new-wrappers
            string: [new String(), Tag.STRING],
            symbol: [new Object(Symbol('symbol')), Tag.SYMBOL],

            // ArrayBuffer, DataView and TypedArrays
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
            biguint64: [getNew(BigUint64Array), Tag.BIGUINT64],

            // Web APIs
            blob: [new Blob(), Tag.BLOB],
            domexception: [new DOMException(), Tag.DOMEXCEPTION],
            dommatrix: [new DOMMatrix(), Tag.DOMMATRIX],
            dommatrixro: [new DOMMatrixReadOnly(), Tag.DOMMATRIXREADONLY],
            dompoint: [new DOMPoint(), Tag.DOMPOINT],
            dompointreadonly: [new DOMPointReadOnly(), Tag.DOMPOINTREADONLY],
            domquad: [new DOMQuad(), Tag.DOMQUAD],
            domrect: [new DOMRect(), Tag.DOMRECT],
            domrectreadonly: [new DOMRectReadOnly(), Tag.DOMRECTREADONLY],
            file: [new File([], ''), Tag.FILE],
            filelist: [createFileList([]), Tag.FILELIST],
            imagebitmap: [
                await createImageBitmap(new ImageData(1, 1)),
                Tag.IMAGEBITMAP
            ],
            imagedata: [new ImageData(10, 10), Tag.IMAGEDATA]
        };

        const promises = [];

        for (const key of Object.keys(type)) {
            const [value] = type[key];
            promises.push(cloneDeepAsync(value, { async: true }));
        }

        const settled = await Promise.all(promises);

        settled.forEach(({ clone }, i) => {
            const [, tag] = Object.values(type)[i];

            assert.strictEqual(typeof clone, 'object');
            assert.strictEqual(tagOf(clone), tag);
        });
    });

    test('customizers can cause async results', async () => {
        // -- arrange/act
        const { clone } = await cloneDeepAsync({
            sync: 'sync',
            async: 'not async'
        }, {
            customizer(value) {
                if (value === 'not async') {
                    return {
                        clone: Promise.resolve('async'),
                        async: true
                    };
                }
            },
            async: true
        });

        // -- assert
        assert.deepEqual(clone, {
            sync: 'sync',
            async: 'async'
        });
    });

    test('If the customizer returns an async clone that rejects, then ' +
         'a warning is logged and the value is cloned into an empty ' +
         'object', async () => {
        // -- arrange
        const log = mock.fn(() => {});
        const map = new Date();
        map.primProp = 'prop';
        map.objProp = {};

        // -- arrange/act
        const { clone } = await cloneDeepAsync(map, {
            customizer(value) {
                if (typeof value !== 'object') {
                    return;
                }
                return {
                    clone: Promise.reject(new Error('reason')),
                    async: true
                };
            },
            log: createLog(log),
            async: true
        });

        // -- assert
        assert.deepEqual(clone, { primProp: 'prop', objProp: {}});
        assert.strictEqual(Tag.OBJECT, tagOf(clone));

        // once for top-level object, a second time for objProp
        assert.strictEqual(2, log.mock.calls.length);
    });

    test('uncaught errors result in rejected promise', async () => {
        try {
            // -- act/assert
            await cloneDeepAsync({}, {
                customizer() {
                    throw new Error('fail');
                },
                letCustomizerThrow: true,
                async: true
            });
        } catch (error) {
            // -- assert
            assert.true(error instanceof Error);
        }
    });

    test('customizer throws if async result returned from customizer ' +
         'when cloneDeep is in sync mode', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        cloneDeep({}, {
            customizer() {
                return {
                    async: true
                };
            },
            log: createLog(log)
        });

        // -- assert
        assert.strictEqual(1, log.mock.calls.length);
    });

    test('customizer additionalValues can add async data', async () => {
        // -- arrange/act
        const { clone } = await cloneDeepAsync({}, {
            async: true,
            customizer(value) {
                if (typeof value !== 'object') {
                    return;
                }

                const _clone = {};

                return {
                    clone: _clone,
                    additionalValues: [{
                        async: true,
                        value: 'beans',
                        assigner: (cloned) => {
                            _clone.beans = cloned;
                        }
                    }]
                };
            }
        });

        // -- assert
        assert.deepEqual(clone, { beans: 'beans' });
    });

    test('customizer additionalValues causes customizer to throw ' +
         'if additionalValues adds async data in sync mode', () => {
        // -- arrange
        const log = mock.fn(() => {});

        // -- act
        cloneDeep({}, {
            log: createLog(log),
            customizer(value) {
                if (typeof value !== 'object') {
                    return;
                }

                const _clone = {};

                return {
                    clone: _clone,
                    additionalValues: [{
                        async: true,
                        value: 'beans',
                        assigner: (cloned) => {
                            _clone.beans = cloned;
                        }
                    }]
                };
            }
        });

        // -- assert
        assert.strictEqual(1, log.mock.calls.length);
    });

    test('cloning methods can cause async results', async () => {
        // -- arrange
        const obj = {
            [CLONE]() {
                return {
                    async: true,
                    clone: 'hijacked'
                };
            }
        };

        // -- act
        const { clone } = await cloneDeepAsync(obj, { async: true });

        // -- assert
        assert.deepEqual(clone, 'hijacked');
    });

    test('cloning method complains when it returns async data while ' +
         'cloneDeep is in sync mode', () => {
        // -- arrange
        const log = mock.fn(() => {});
        const obj = {
            [CLONE]() {
                return {
                    async: true,
                    clone: 'hijacked'
                };
            }
        };
        // -- act
        cloneDeep(obj, { log: createLog(log) });

        // -- assert
        // it complains a second time when trying to clone cloning method
        assert.strictEqual(2, log.mock.calls.length);
    });

    test('async mode logs warning when unsupported type', async () => {
        // -- arrange
        const log = mock.fn(() => {});
        const unsupported = {
            [Symbol.toStringTag]: 'Unsupported'
        };

        // -- act
        await cloneDeepAsync(unsupported, { log: createLog(log) });

        // -- assert
        assert.strictEqual(1, log.mock.calls.length);
    });
});

describe('misc', () => {

    test('getTypedArrayConstructor returns DataView constructor if ' +
         'non-TypedArray tag is provided', () => {
        // -- arrange/act
        const constructor = getTypedArrayConstructor('', createLog(() => {}));

        // -- assert
        assert.strictEqual(DataView, constructor);
    });

    test('isIterable', () => {
        // -- act/assert
        assert.true(isIterable([]));
        assert.true(isIterable(''));
        assert.true(isIterable({
            [Symbol.iterator]: () => {
                return {
                    next: () => {
                        true;
                    }
                };
            }
        }));
        assert.false(isIterable({}));
        assert.false(isIterable(null));
    });

    test('geometry type checkers function as expected', () => {
        polyfill();

        // -- arrange
        const domMatrix = new DOMMatrix();
        const domMatrixReadOnly = new DOMMatrixReadOnly();
        const domPoint = new DOMPoint();
        const domPointReadOnly = new DOMPointReadOnly();
        const domRect = new DOMRect();
        const domRectReadOnly = new DOMRectReadOnly();

        // -- act/assert
        assert.true(true, isDOMMatrix(domMatrix));
        assert.false(isDOMMatrix(domMatrixReadOnly));
        assert.false(isDOMMatrix({}));

        assert.true(true, isDOMMatrixReadOnly(domMatrixReadOnly));
        assert.false(isDOMMatrixReadOnly(domMatrix));
        assert.false(isDOMMatrixReadOnly({}));

        assert.true(isDOMPoint(domPoint));
        assert.false(isDOMPoint(domPointReadOnly));
        assert.false(isDOMPoint({}));

        assert.true(isDOMPointReadOnly(domPointReadOnly));
        assert.false(isDOMPointReadOnly(domPoint));
        assert.false(isDOMPointReadOnly({}));

        assert.true(isDOMRect(domRect));
        assert.false(isDOMRect(domRectReadOnly));
        assert.false(isDOMRect({}));

        assert.true(isDOMRectReadOnly(domRectReadOnly));
        assert.false(isDOMRectReadOnly(domRect));
        assert.false(isDOMRectReadOnly({}));
    });

    test('createFileList throws if DataTransfer is not available', () => {
        // -- act/assert
        try {
            clearPolyfills();

            assert['throws'](() => {
                createFileList(new File(['Foo'], 'foo'));
            });
        } catch (error) {
            polyfill();
            throw error;
        } finally {
            polyfill();
        }
    });

    test('castAsInstanceOf behaves as expected', () => {
        // -- act/assert
        assert.truthy(castAsInstanceOf(new Error(''), Error));
        assert.undefined(castAsInstanceOf(new Date(), Map));
        assert.undefined(castAsInstanceOf(new Date(), null));
        assert.undefined(castAsInstanceOf(new Date(), () => {
            return new Date();
        }));
    });

    test('GlobalState properties are read-only at runtime', () => {
        // -- arrange
        const globalState = new GlobalState({
            value: '',
            log: () => {
                /* no-op */
            },
            ignoreCloningMethods: false,
            doThrow: false,
            async: false
        });

        // -- act/assert
        [
            'container',
            'cloneStore',
            'queue',
            'pendingResults',
            'isExtensibleSealFrozen',
            'customizer',
            'supportedPrototypes',
            'parentObjectRegistry',
            'performanceConfig',
            'ignoreCloningMethods',
            'doThrow',
            'async'
        ].forEach((property) => {
            assert.throws(() => {
                globalState[property] = '';
            });
        });
    });
});
