// This script is meant to be run as the script for the benchmark UI. The
// associated HTML is in index.html. Run `node benchmark\serve.js` in the
// directory containing index.html and the UI will be hosted at
// http://localhost:8787.


// -- constant variables
const DECIMAL_PLACES = 4;
const worker = new Worker('benchmark/worker.js');

// -- stateful variables
let numIterations = 1000;
let benchmarking = false;


// -- DOM elements
const structuredCloneResult = document.querySelector('.top .result-text');
const cloneDeepResult = document.querySelector('.bottom .result-text');

const primitivesOnlyButton = document.querySelector('.button.primitives-only');
const ordinaryObjectButton = document.querySelector('.button.ordinary-object');
const deeplyNestedButton = document.querySelector('.button.deeply-nested');

const textinput = document.querySelector('.iterations');

const buttons = [
    primitivesOnlyButton,
    ordinaryObjectButton,
    deeplyNestedButton
];


// -- helper functions
const assignValues = (values) => {
    const [sc, cd] = values.map((number) => {
        return number.toFixed(DECIMAL_PLACES);
    });
    structuredCloneResult.textContent = String(sc);
    cloneDeepResult.textContent = String(cd);
};

const doBenchmark = (type) => {
    benchmarking = true;

    document.body.style.cssText = 'cursor: wait !important';

    buttons.forEach((element) => {
        element.classList.remove('pressable');
    });

    worker.onmessage = ({ data }) => {
        const { result } = data;

        document.body.style.cssText = 'auto';

        buttons.forEach((element) => {
            element.classList.add('pressable');
        });

        assignValues(result);

        benchmarking = false;
    };

    worker.postMessage({ type, numIterations });
};


// -- event listeners
textinput.addEventListener('input', (event) => {
    numIterations = event.target.value || 1000;
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
