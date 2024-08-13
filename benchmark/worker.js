// This script functions as a Web Worker for benchmark.js.

const getPrimitivesOnlyObject = () => {
    return {
        string: 'string',
        number: 123456789,
        boolean: true,
        array: ['string', 123456789, false]
    };
};

const getOrdinaryObject = () => {
    const map = new Map();
    map.set('p', { p_: 'p', g_: { h_: 'h' }});
    map.prop = 'property on map';
    map.set('test', 3);

    const error = new Error('error');
    const number = 3;
    Object.freeze(number);

    const object = {
        f_: 'string',
        map,
        error,
        uint: new Uint8Array(new ArrayBuffer(8), 1, 4),
        date: new Date(Date.now()),
        frozen: Object.freeze({ test: 3 }),
        sealed: Object.seal({ test: 3 }),
        number,
        bigint: BigInt(1)

    };

    map.set('g', object);
    object.circular = object;

    return object;
};

const getNestedObject = () => {
    const obj = {};
    let next = obj;
    for (let number = 0; number < 1000; number++) {
        next.property = {};
        next = next.property;
    }
    return obj;
};

(async () => {
    const module = await import('../src/clone-deep/clone-deep.js');
    const cloneDeep = module['default'];

    const useCloneDeep = (object) => {
        return cloneDeep(object, { logMode: 'silent' });
    };

    const useStructuredClone = (obj) => {
        return structuredClone(obj);
    };

    onmessage = ({ data }) => {
        const { type, numIterations } = data;
        let object;

        switch (type) {
        case 'primitives':
            object = getPrimitivesOnlyObject();
            break;
        case 'ordinary':
            object = getOrdinaryObject();
            break;
        case 'nested':
            object = getNestedObject();
            break;
        default:
            object = undefined;
            break;
        }

        const result = [];

        if (object !== undefined) {
            [useStructuredClone, useCloneDeep].forEach((func) => {
                const before = Date.now();
                for (let number = 0; number < numIterations; number++) {
                    func(object);
                }
                const after = Date.now();
                result.push((after - before) / numIterations);
            });
        }

        postMessage({ result });
    };
})();
