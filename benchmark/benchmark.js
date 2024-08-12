import cloneDeep from '../src/clone-deep/clone-deep.js';

/**
 * This script is meant to be run as the script for the benchmark UI. The
 * associated HTML is in index.html. Run `node benchmark\serve.js` in the
 * directory containing index.html and the UI will be hosted at
 * http://localhost:8787.
 */

// -- DOM elements
const structuredCloneResult = document.querySelector('.top .result-text');
const cloneDeepResult = document.querySelector('.bottom .result-text');

const primitivesOnlyButton = document.querySelector('.button.primitives-only');
const ordinaryObjectButton = document.querySelector('.button.ordinary-object');
const deeplyNestedButton = document.querySelector('.button.deeply-nested');

const textinput = document.querySelector('.iterations');


// -- constant variables
const DECIMAL_PLACES = 4;


// -- stateful variables
let numIterations = 1000;
let currentHovered; // the DOM element that is currently being hovered over


// -- helper functions
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

const assignValues = (values) => {
    const [sc, cd] = values.map((number) => {
        return number.toFixed(DECIMAL_PLACES);
    });
    structuredCloneResult.textContent = String(sc);
    cloneDeepResult.textContent = String(cd);
};

const doBenchmark = (object) => {
    document.body.style.cssText = 'cursor: wait !important';

    const temp = currentHovered?.style?.cursor;
    const wasHovered = currentHovered;
    if (wasHovered) {
        wasHovered.style.cssText = 'cursor: wait !important';
    }

    const useCloneDeep = (obj) => {
        return cloneDeep(obj, { logMode: 'silent' });
    };

    const useStructuredClone = (obj) => {
        return structuredClone(obj);
    };

    setTimeout(() => {
        const result = [];

        [useStructuredClone, useCloneDeep].forEach((func) => {
            const before = Date.now();
            for (let number = 0; number < numIterations; number++) {
                func(object);
            }
            const after = Date.now();
            result.push((after - before) / numIterations);
        });

        document.body.style.cursor = 'auto';
        if (wasHovered) {
            wasHovered.style.cursor = temp;
        }
        assignValues(result);

    // Give browser time to repaint so cursor changes before expensive
    // synchronous JavaScript causes browser to freeze
    }, 500);
};


// add event listeners
document.onmousemove = (event) => {
    currentHovered = event.target;
};

textinput.addEventListener('input', (event) => {
    numIterations = event.target.value || 1000;
});

primitivesOnlyButton.addEventListener('click', () => {
    doBenchmark(getPrimitivesOnlyObject());
});

ordinaryObjectButton.addEventListener('click', () => {
    doBenchmark(getOrdinaryObject());
});

deeplyNestedButton.addEventListener('click', () => {
    doBenchmark(getNestedObject());
});
