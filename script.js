import cloneDeep from "./clone-deep.js";

const map = new Map();
map.set("p", { p: "p", g: { h: "h" } });
map.prop = "property on map";
map.set("test", 3);
// map.set("descriptor", Object.defineProperties({}, {
//     test: {
//         get() {
//             return "cheese"
//         }
//     }
// }))

const error = new Error("error");

const number = 3;
Object.freeze(number);

const d = {
    // e: Symbol("symbol"),
    f: "string",
    // [Symbol("g")]: "property is symbol",
    cheese: map,
    thing: error,
    // weakmap: new WeakMap(),
    // func: () => "i am a function",
    uint: new Uint8Array(new ArrayBuffer(8), 1, 4),
    date: new Date(Date.now()),
    frozen: Object.freeze({ test: 3 }),
    sealed: Object.seal({ test: 3 }),
    number,
    bigint: BigInt(1)
}

Object.defineProperty(d, "invisible", {
    enumerable: false,
    get() {
        return "gruyere";
    },
    set() {}
});

map.set("g", d);

d.circular = d;

// const obj = 
// Object.freeze([{
//     a: {
//         b: "gruyere",
//         c: "american"
//     }
// }, 
// {
//     d: d
// }
// ]);

function useStructuredClone(obj) {
    return structuredClone(obj);
}

const obj = {};
let next = obj;
for (let i = 0; i < 1000; i++) {
    next.b = {};
    next = next.b;
}

let before = Date.now();
for (let i = 0; i < 1000; i++) cloneDeep(obj, { logMode: "silent" });
let after = Date.now();
console.log(((after - before) / 1000));

before = Date.now();
for (let i = 0; i < 1000; i++) useStructuredClone(obj);
after = Date.now();
console.log(((after - before) / 1000));
