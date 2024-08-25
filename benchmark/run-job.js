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
    map.set('p', { p: 'p', g: { h: 'h' }});
    map.prop = 'property on map';
    map.set('test', 3);

    const error = new Error('error');
    const number = 3;
    Object.freeze(number);

    const object = {
        f: 'string',
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
    for (let number = 0; number < 500; number++) {
        next.property = {};
        next = next.property;
    }
    return obj;
};

const getPrototypeChain = (numIterations) => {
    let temp = {};
    for (let i = 0; i < numIterations; i++) {
        temp = Object.create(temp);
    }
    return temp;
};

const runJob = async (type, numIterations, numPrototypes, config) => {
    const [
        cloneDeepModule,
        lodashModule,
        cloneModule,
        esToolkitModule
    ] = await Promise.all([
        import('../index.js'),
        import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm'),
        import('https://esm.run/clone@2.1.2'),
        import('https://esm.sh/es-toolkit@%5E1')
    ]);

    const { default: cloneDeep, cloneDeepFully } = cloneDeepModule;
    const lodash = lodashModule.default.cloneDeep;
    const { default: clone } = cloneModule;
    const esToolkit = esToolkitModule.cloneDeep;

    const useStructuredClone = (object) => {
        return structuredClone(object);
    };

    const useLodash = (object) => {
        return lodash(object);
    };

    const useClone = (object) => {
        return clone(object, {
            circular: true,
            includeNonEnumerable: true
        });
    };

    const useEsToolkit = (object) => {
        return esToolkit(object);
    };

    const useCloneDeep = (object) => {
        return cloneDeep(object, {
            performanceConfig: config,
            logMode: 'silent'
        });
    };

    const useCloneDeepFully = (object) => {
        return cloneDeepFully(object, { logMode: 'silent' });
    };

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
    case 'prototype':
        object = getPrototypeChain(numPrototypes);
        break;
    default:
        object = undefined;
        break;
    }

    const result = [];

    if (object !== undefined) {
        const funcs = type !== 'prototype'
            ? [
                useStructuredClone,
                useLodash,
                useClone,
                useEsToolkit,
                useCloneDeep
            ] : [
                useCloneDeepFully
            ];
        funcs.forEach((func) => {
            const max = type === 'prototype'
                ? 1
                : numIterations;
            const divisor = type === 'prototype'
                ? numPrototypes
                : numIterations;

            if (func === useCloneDeep || func === useCloneDeepFully) {
                console.profile();
            }

            const before = Date.now();

            for (let n = 0; n < max; n++) {
                func(object);
            }

            const after = Date.now();

            if (func === useCloneDeep || func === useCloneDeepFully) {
                console.profileEnd();
            }

            result.push((after - before) / divisor);
        });
    }

    return result;
};

export default runJob;
