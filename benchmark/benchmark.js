import cloneDeep from "../src/clone-deep/clone-deep.js";

/**
 * This script is meant to be run as the script for the benchmark UI. The 
 * associated HTML is in index.html. Run `node benchmark\serve.js` in the 
 * directory containing index.html and the UI will be hosted at 
 * http://localhost:8787.
 */

let numIterations = 1000;
const textinput = document.querySelector(".iterations");


textinput.addEventListener("input", e => {
    numIterations = e.target.value || 1000;
});

function getPrimitivesOnlyObject() {
    return {
        string: "string",
        number: 123456789,
        boolean: true,
        array: ["string", 123456789, false]
    };
}

function getOrdinaryObject() {
    const map = new Map();
    map.set("p", { p: "p", g: { h: "h" } });
    map.prop = "property on map";
    map.set("test", 3);

    const error = new Error("error");
    const number = 3;
    Object.freeze(number);

    const object = {
        f: "string",
        map,
        error,
        uint: new Uint8Array(new ArrayBuffer(8), 1, 4),
        date: new Date(Date.now()),
        frozen: Object.freeze({ test: 3 }),
        sealed: Object.seal({ test: 3 }),
        number,
        bigint: BigInt(1)

    }

    map.set("g", object);
    object.circular = object;

    return object;
};

function getNestedObject() {
    const obj = {};
    let next = obj;
    for (let i = 0; i < 1000; i++) {
        next.b = {};
        next = next.b;
    }
    return obj;
}

const DECIMAL_PLACES = 4;

function assignValues(values) {
    const [sc, cd] = values.map(n => n.toFixed(DECIMAL_PLACES));
    structuredCloneResult.textContent = String(sc);
    cloneDeepResult.textContent = String(cd);
}

let currentHovered;
document.onmousemove = e => {
    currentHovered = e.target;
}

function doBenchmark(object) {
    document.body.style.cssText = "cursor: wait !important";

    const temp = currentHovered?.style?.cursor;
    const wasHovered = currentHovered;
    if (wasHovered) wasHovered.style.cssText = "cursor: wait !important";

    function useCloneDeep(obj) {
        return cloneDeep(obj, { logMode: "silent" });
    }
    
    function useStructuredClone(obj) {
        return structuredClone(obj);
    }

    setTimeout(() => {
        const result = [];

        [useStructuredClone, useCloneDeep].forEach(func => {
            const before = Date.now();
            for (let i = 0; i < numIterations; i++) func(object);
            const after = Date.now();
            result.push((after - before) / numIterations);
        });

        document.body.style.cursor = "auto";
        if (wasHovered) wasHovered.style.cursor = temp;
        assignValues(result);

    // Give browser time to repaint so cursor changes before expensive 
    // synchronous JavaScript causes browser to freeze
    }, 500);
}

const structuredCloneResult = document.querySelector(".top .result-text");
const cloneDeepResult = document.querySelector(".bottom .result-text");

const primitivesOnlyButton = document.querySelector(".button.primitives-only");
const ordinaryObjectButton = document.querySelector(".button.ordinary-object");
const deeplyNestedButton = document.querySelector(".button.deeply-nested");

primitivesOnlyButton.addEventListener("click", () => {
    doBenchmark(getPrimitivesOnlyObject());
});

ordinaryObjectButton.addEventListener("click", () => {
    doBenchmark(getOrdinaryObject());
});

deeplyNestedButton.addEventListener("click", () => {
    doBenchmark(getNestedObject());
});
