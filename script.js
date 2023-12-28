import cloneDeep from "./clone-deep.js";

let numIterations = 1000;

function useCloneDeep(obj) {
    return cloneDeep(obj, { logMode: "silent" });
}

function useStructuredClone(obj) {
    return structuredClone(obj);
}

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

    const d = {
        f: "string",
        cheese: map,
        thing: error,
        uint: new Uint8Array(new ArrayBuffer(8), 1, 4),
        date: new Date(Date.now()),
        frozen: Object.freeze({ test: 3 }),
        sealed: Object.seal({ test: 3 }),
        number,
        bigint: BigInt(1)
    }

    map.set("g", d);
    d.circular = d;

    return d;
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

function assignValues(values) {
    const [sc, cd] = values.map(n => n.toFixed(4));
    structuredCloneResult.textContent = String(sc);
    cloneDeepResult.textContent = String(cd);
}

let currentHovered;
document.onmousemove = e => {
    currentHovered = e ? e.target : e;
}

function doBenchmark(object) {
    document.body.style.cssText = "cursor: wait !important";

    const temp = currentHovered?.style?.cursor;
    const wasHovered = currentHovered;
    if (wasHovered) wasHovered.style.cssText = "cursor: wait !important";

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
    }, 100);
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

const textinput = document.querySelector(".iterations");

textinput.addEventListener("input", e => {
    numIterations = e.target.value ? e.target.value : 1000;
});
