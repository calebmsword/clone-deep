import cloneDeep from "./clone-deep.js";
import { cloneDeepFully } from "./clone-deep-utils.js";

const map = new Map();
map.set("p", { p: "p", g: { h: "h" } });
map.prop = "property on map";
map.set("test", 3);
map.set("descriptor", Object.defineProperties({}, {
    test: {
        get() {
            return "cheese"
        }
    }
}))

const error = new Error("error");

const number = 3;
Object.freeze(number);

const d = {
    e: Symbol("symbol"),
    f: "string",
    [Symbol("g")]: "property is symbol",
    cheese: map,
    thing: error,
    weakmap: new WeakMap(),
    func: () => "i am a function",
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

const original = 
Object.freeze([{
    a: {
        b: "gruyere",
        c: "american"
    }
}, 
{
    d: d
}
]);

const testClone = () => {
    console.log("Functions cannot be cloned:\n", cloneDeep(() => "i am a function"));
    
    const cloned = cloneDeep(original);

    console.log("The cloned object:\n", cloned);
    console.log("cloned object === original object?\n", cloned === original)
    console.log("Nested objects are also cloned:\n", original[0].a !== cloned[0].a);
    console.log("The map on the cloned object:\n", cloned[1].d.cheese);
    console.log("The values in map get property descriptors:\n", cloned[1].d.cheese.get("descriptor").test);
    console.log("The values in the cloned map are clones of the values in the original map:\n", cloned[1].d.cheese.get("p") === map.get("p"), cloned[1].d.cheese.get("p"));
    console.log("Dates are cloned into Date instances:\n", cloned[1].d.date instanceof Date)
    console.log("Non-enumerable properties are cloned:\n", cloned[1].d.invisible);
    console.log("Frozen objects remain frozen:", Object.isFrozen(cloned[1].d.frozen) && Object.isFrozen(cloned));
    console.log("Sealed objects remain sealed:", Object.isFrozen(cloned[1].d.frozen));
    console.log("Frozen primitives stay frozen", cloned[1].d.number, Object.isFrozen(cloned[1].d.number));
    console.log("bigint primitives is cloned as bigint:", typeof cloned[1].d.bigint === "bigint")
}


const dontCloneMethodsCustomizer = () => {
    const myObject = { 
        a: 1, 
        func: () => "I am a function" 
    };
    const cloned = cloneDeep(myObject, {
        customizer(value) {
            if (typeof value === "function") {
                return { clone: {}, ignoreProto: true };
            }
        }
    });
    
    console.log("cloned object has empty object instead of method", cloned);  // { func: {}, a: 1 }
};

const actuallyDontCloneMethodsCustomizer = () => {
    const myObject = { 
        a: 1, 
        func: () => "I am a function" 
    };
    const cloned = cloneDeep(myObject, {
        customizer(value) {
            if (typeof value === "function") {
                return { ignore: true };
            }
        }
    });
    console.log("cloned object has no property for method", cloned);  // { a: 1 }
};

const cloneWrapperEs6ClassCustomizer = () => {
    class Wrapper {
        #value;
        get() {
            return this.#value;
        }
        set(value) {
            this.#value = value;
        }
    }

    const wrapper = new Wrapper();;
    wrapper.set({ foo: "bar" });

    const cloned = cloneDeep(wrapper, {
        customizer(value) {
            if (!(value instanceof Wrapper)) return;

            const clone = new Wrapper();
            
            return {
                clone,

                additionalValues: [{
                    // the cloning algorithm will clone this
                    value: value.get(),

                    // but the assigner will make sure it is 
                    // stored in clonedWrapper
                    assigner(cloned) {
                        clone.set(cloned)
                    }
                }]
            };
        }
    });
    
    console.log("clone gets { foo: 'bar' } object:", cloned.get());  // { foo: "bar" }
    console.log("cloned.get() === wrapper.get()?", cloned.get() === wrapper.get());  // false
};

const cloneWrapperFactoryCustomizer = () => {
    const registry = new WeakSet();

    const getWrapper = () => {
        let value;
        const wrapper = Object.freeze(Object.assign(Object.create(null), {
            get() {
                return value;
            },
            set(newValue) {
                value = newValue;
            }
        }));
        registry.add(wrapper);
        return wrapper;
    }

    const isWrapper = candidate => registry.has(candidate);

    const wrapper = getWrapper();
    wrapper.set({ foo: "bar" });

    const original = {
        test: "test",
        wrapper
    }

    const cloned = cloneDeep(original, {
        customizer(value) {
            if (!isWrapper(value)) return;

            const clone = getWrapper();

            return {
                clone,

                // Clone the wrapped value
                additionalValues: [{
                    value: value.get(),
                    assigner(cloned) {
                        clone.set(cloned);
                    }
                }],

                // DON'T COPY THE GET/SET METHODS!!!
                // WE DON'T WANT THE ORIGINAL CLOSURE! WE NEED THE NEW CLOSURE!
                ignoreProps: true
            }
        }
    });

    console.log("original:", original);
    console.log("original.wrapper.get():", original.wrapper.get());
    console.log("cloned:", cloned);
    console.log("original === cloned || original.wrapper === cloned.wrapper?", original === cloned || original.wrapper === cloned.wrapper);
    console.log("cloned.wrapper.get():", cloned.wrapper.get());
    console.log("cloned.wrapper.get() === original.wrapper.get()?", original.wrapper.get() === cloned.wrapper.get());
}

const testCloneDeepFully = () => {
    const a = Object.create(null);
    a.test = "test";

    const b = Object.create(a);
    b.method = function() {};

    const c = Object.create(b);
    c.prop = "prop";

    const d = Object.create(c);
    d.own = "own";

    const dCloned = cloneDeepFully(d);

    const dProto1 = Object.getPrototypeOf(dCloned);
    const dProto2 = Object.getPrototypeOf(dProto1);
    const dProto3 = Object.getPrototypeOf(dProto2);

    console.log("cloned:", dCloned);
    console.log("proto of cloned:", dProto1);
    console.log("proto-proto of cloned:", dProto2);
    console.log("proto-proto-proto of cloned:", dProto3);

    console.log("cloned === original", d === dCloned);
    console.log("proto of cloned === proto of original", dProto1 === c);
    console.log("proto^2 of cloned === proto^2 of original", dProto2 === b);
    console.log("proto^3 of cloned === proto^3 of original", dProto3 === a);

    const dClonedForced = cloneDeepFully(d, {
        force: true
    });

    const dForcedProto1 = Object.getPrototypeOf(dClonedForced);
    const dForcedProto2 = Object.getPrototypeOf(dForcedProto1);
    const dForcedProto3 = Object.getPrototypeOf(dForcedProto2);

    console.log("cloned === original", d === dClonedForced);
    console.log("proto of cloned === proto of original", dForcedProto1 === c);
    console.log("proto^2 of cloned === proto^2 of original", dForcedProto2 === b);
    console.log("proto^3 of cloned === proto^3 of original", dForcedProto3 === a);
}

const testNesting = () => {
    const LAYERS = 10**6;

    const obj = {};
    let next = obj;
    for (let i = 0; i < LAYERS; i++) {
        next.b = {};
        next = next.b;
    }

    const ITERATIONS = 100;

    const before = Date.now();

    for (let i = 0; i < ITERATIONS; i++) cloneDeep(obj);

    const after = Date.now();

    console.log(
        `${LAYERS} layers, ${ITERATIONS} iterations, average time (s):\n`,
        ((after - before) / ITERATIONS) / 1000
    );
}

testClone();
dontCloneMethodsCustomizer();
actuallyDontCloneMethodsCustomizer();
cloneWrapperEs6ClassCustomizer();
cloneWrapperFactoryCustomizer();
testCloneDeepFully();
// testNesting();
