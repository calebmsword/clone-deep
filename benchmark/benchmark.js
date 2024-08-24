// This script is meant to be run as the script for the benchmark UI. The
// associated HTML is in index.html. Run `node benchmark\serve.js` in the
// directory containing index.html and the UI will be hosted at
// http://localhost:8787.
import runJob from './run-job.js';


// -- constant variables
const worker = new Worker('benchmark/worker.js');
const DECIMAL_PLACES = 3;
const DEFAULT_NUM_ITERATIONS = 1000;
const DEFAULT_NUM_PROTOTYPES = 1000;
const TypeChecking = Object.freeze({
    DEFAULT: 'DEFAULT',
    ROBUST: 'ROBUST'
});


// -- stateful variables
let numIterations = DEFAULT_NUM_ITERATIONS;
let numPrototypes = DEFAULT_NUM_PROTOTYPES;
let benchmarking = false;
let ignoreCircularReferences = false;
let ignorePropertyDescriptors = false;
let ignoreMetadata = false;
let typeChecking = TypeChecking.DEFAULT;
let block = false;
let elementUnderCursor;


// -- DOM elements
const structuredCloneResult = document.querySelector('.top .result-text');
const lodashResult = document.querySelector('.lodash .result-text');
const cloneResult = document.querySelector('.clone .result-text');
const esToolkitResult = document.querySelector('.es .result-text');
const cloneDeepResult = document.querySelector('.bottom .result-text');
const protoResult = document.querySelector('.proto .result-text');

const circularCheckbox = document.querySelector('#ignoreCircular');
const descriptorCheckbox = document.querySelector('#ignoreDesc');
const metadataCheckbox = document.querySelector('#ignoreMeta');

const radioDefault = document.querySelector('#default');
const radioRobust = document.querySelector('#robust');

const syncCheckbox = document.querySelector('.sync-checkbox');

const iterationsInput = document.querySelector('.iterations');
const prototypesInput = document.querySelector('.prototypes');

const primitivesOnlyButton = document.querySelector('.button.primitives-only');
const ordinaryObjectButton = document.querySelector('.button.ordinary-object');
const deeplyNestedButton = document.querySelector('.button.deeply-nested');
const protoChainButton = document.querySelector('.button.prototype-chain');

const radioButtons = [
    radioDefault,
    radioRobust
];

const buttons = [
    primitivesOnlyButton,
    ordinaryObjectButton,
    deeplyNestedButton,
    protoChainButton
];

const radioToTypeChecking = new Map([
    [radioDefault, TypeChecking.DEFAULT],
    [radioRobust, TypeChecking.ROBUST]
]);


// -- helper functions
const assignValues = (values, type) => {
    if (type === 'prototype') {
        protoResult.textContent = String(values[0].toFixed(DECIMAL_PLACES));
        return;
    }

    const [sc, ld, cl, es, cd] = values.map((number) => {
        return number.toFixed(DECIMAL_PLACES);
    });
    structuredCloneResult.textContent = String(sc);
    lodashResult.textContent = String(ld);
    cloneResult.textContent = String(cl);
    esToolkitResult.textContent = String(es);
    cloneDeepResult.textContent = String(cd);
};

const doBenchmark = (type) => {
    benchmarking = true;

    const oldCursorStyle = elementUnderCursor.style.cursor;

    document.body.style.cssText = 'cursor: wait !important';

    buttons.forEach((element) => {
        element.classList.remove('pressable');
    });

    const cleanup = (result) => {
        document.body.style.cssText = 'auto';
        elementUnderCursor.style.cursor = oldCursorStyle;

        buttons.forEach((element) => {
            element.classList.add('pressable');
        });

        benchmarking = false;

        assignValues(result, type);
    };

    const config = {
        ignoreCircularReferences,
        ignorePropertyDescriptors,
        ignoreMetadata,
        typeChecking
    };

    if (block) {
        setTimeout(async () => {
            cleanup(await runJob(type, numIterations, numPrototypes, config));
        }, 250);

        return;
    }

    worker.onmessage = ({ data }) => {
        cleanup(data.result);
    };

    worker.postMessage({ type, numIterations, numPrototypes, config });
};

const updateTypeChecking = (context) => {
    typeChecking = radioToTypeChecking.get(context.target);
};

window.getState = () => {
    [
        numIterations,
        numPrototypes,
        benchmarking,
        ignoreCircularReferences,
        ignorePropertyDescriptors,
        ignoreMetadata,
        typeChecking,
        block
    ].forEach(console.log);
};


// -- event listeners
document.onmousemove = (event) => {
    elementUnderCursor = event.target;
};

iterationsInput.addEventListener('input', (event) => {
    numIterations = Number(event.target.value || DEFAULT_NUM_ITERATIONS);
});

prototypesInput.addEventListener('input', (event) => {
    numPrototypes = Number(event.target.value || DEFAULT_NUM_PROTOTYPES);
});

circularCheckbox.addEventListener('change', (event) => {
    ignoreCircularReferences = event.currentTarget.checked;
    ignoreCircularReferences
        ? ordinaryObjectButton.classList.add('invisible')
        : ordinaryObjectButton.classList.remove('invisible');
});

descriptorCheckbox.addEventListener('change', (event) => {
    ignorePropertyDescriptors = event.currentTarget.checked;
});

metadataCheckbox.addEventListener('change', (event) => {
    ignoreMetadata = event.currentTarget.checked;
});

radioButtons.forEach((element) => {
    element.addEventListener('change', updateTypeChecking);
});

syncCheckbox.addEventListener('change', (event) => {
    block = event.currentTarget.checked;
});

primitivesOnlyButton.addEventListener('click', () => {
    if (!benchmarking) {
        doBenchmark('primitives');
    }
});

ordinaryObjectButton.addEventListener('click', () => {
    if (!benchmarking) {
        doBenchmark('ordinary');
    }
});

deeplyNestedButton.addEventListener('click', () => {
    if (!benchmarking) {
        doBenchmark('nested');
    }
});

protoChainButton.addEventListener('click', () => {
    if (!benchmarking) {
        doBenchmark('prototype');
    }
});
