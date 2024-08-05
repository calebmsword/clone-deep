const msg = "Illegal invocation";

const metadata = x => Object.getOwnPropertyDescriptors(x);

const proto = x => Object.getPrototypeOf(x);

/**
 * Polyfills unsupported web APIs for a Node environment.
 * This does NOT fully implement the web APIs. Not even close. The goal is to 
 * implement the subset of functionality required for the testing for this 
 * project and nothing more. None of these classes suffice as a genuine polyfill 
 * for actual use. 
 */
export function polyfill() {
    
    // This is far overcomplicated in an attempt to preserve functionality 
    // that isn't necessary for the shim. (That is, calling  
    // metadata(proto(proto(domMatrix))).m11.get.call(domMatrix) is the same as
    // just doing domMatrix.m11.) My apologies.
    // This property isn't even part of the specification and is an 
    // implmentation detail of V8 so it was frankly a waste of time.
    if (typeof globalThis.DOMMatrixReadOnly !== "function") {

        globalThis.DOMMatrixReadOnly = class DOMMatrixReadOnly {
            static #registry = new WeakSet;

            #m11;
            
            #is2D;

            get is2D() {
                return this.#is2D;
            }

            /** @param {[number, number, number, number, number, number] | [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] | undefined} array */
            constructor(array) {
                if (array !== undefined && 
                    (!Array.isArray(array) || ![6, 16].includes(array.length)))
                    throw new TypeError(
                        "TypeError: Failed to construct 'DOMMatrix': The " + 
                        "sequence must contain 6 elements for a 2D matrix or " + 
                        "16 elements for a 3D matrix.");
                
                DOMMatrixReadOnly.#registry.add(this);

                /** @type {(x: number) => void} */
                function setM11(m11) { 
                    this.#m11 = m11;
                }

                if (array === undefined) {
                    this.#is2D = true;
                    setM11.call(this, 1);
                    this.m12 = 0;
                    this.m13 = 0;
                    this.m14 = 0;
                    this.m21 = 0;
                    this.m22 = 1;
                    this.m23 = 0;
                    this.m24 = 0;
                    this.m31 = 0;
                    this.m32 = 0;
                    this.m33 = 1;
                    this.m34 = 0;
                    this.m41 = 0;
                    this.m42 = 0;
                    this.m43 = 0;
                    this.m44 = 1;
                }
                else if (array.length === 6) {
                    const [m11, m12, m21, m22, m41, m42] = array;
                    
                    this.#is2D = true;

                    setM11.call(this, m11);
                    this.m12 = m12;
                    this.m13 = 0;
                    this.m14 = 0;
                    this.m21 = m21;
                    this.m22 = m22;
                    this.m23 = 0;
                    this.m24 = 0;
                    this.m31 = 0;
                    this.m32 = 0;
                    this.m33 = 1;
                    this.m34 = 0;
                    this.m41 = m41;
                    this.m42 = m42;
                    this.m43 = 0;
                    this.m44 = 1;
                }
                else {
                    if (array.length === 6) {
                        const [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, 
                               m33, m34, m41, m42, m43, m44] = array;
                        
                        this.#is2D = true;
    
                        setM11.call(this, m11);
                        this.m12 = m12;
                        this.m13 = m13;
                        this.m14 = m14;
                        this.m21 = m21;
                        this.m22 = m22;
                        this.m23 = m23;
                        this.m24 = m24;
                        this.m31 = m31;
                        this.m32 = m32;
                        this.m33 = m33;
                        this.m34 = m34;
                        this.m41 = m41;
                        this.m42 = m42;
                        this.m43 = m43;
                        this.m44 = m44;
                    }
                }

                this.a = this.#m11;
                this.b = this.m12;
                this.c = this.m21;
                this.d = this.m22;
                this.e = this.m41;
                this.f = this.m42;

                if (!Object.getOwnPropertyNames(DOMMatrixReadOnly.prototype)
                        .includes("m11"))
                    Object.defineProperty(DOMMatrixReadOnly.prototype, "m11", {
                        configurable: "true",
                        enumerable: "true",
                        /** @this DOMMatrixReadOnly */
                        get() {
                            if (!DOMMatrixReadOnly.#registry.has(this)) 
                                throw new TypeError(msg);
                            return this.#m11;
                        }
                    });

                globalThis.DOMMatrix = class DOMMatrix extends 
                    DOMMatrixReadOnly {
                    static #registry = new WeakSet;
        
                    constructor(arg) {
                        super(arg);
                        DOMMatrix.#registry.add(this);
                        
                        if (!Object.getOwnPropertyNames(DOMMatrix.prototype)
                                .includes("m11"))
                            Object.defineProperty(DOMMatrix.prototype, "m11", {
                                configurable: "true",
                                enumerable: "true",
                                get() {
                                    return metadata(proto(proto(this)))
                                        .m11
                                        .get
                                        .call(this);
                                },
                                set(m11) {
                                    if (!DOMMatrix.#registry.has(this)) 
                                        throw new TypeError(msg);
                                    setM11.call(this, m11);
                                }
                            });
                    }
                }

                DOMMatrix.prototype[Symbol.toStringTag] = "DOMMatrix";
            }

            scale() {
                if (!DOMMatrixReadOnly.#registry.has(this)) 
                    throw new TypeError(msg);
                if (this.is2D)
                    return new DOMMatrix([
                        this.a, this.b, this.c, this.d, this.e, this.f]);
                else 
                    return new DOMMatrix([
                        this.m11, this.m12, this.m13, this.m14, 
                        this.m21, this.m22, this.m23, this.m24, 
                        this.m31, this.m32, this.m33, this.m34, 
                        this.m41, this.m42, this.m43, this.m44]);
            }
        };

        new DOMMatrixReadOnly;

        DOMMatrixReadOnly.prototype[Symbol.toStringTag] = "DOMMatrixReadOnly";
    }
    
    if (typeof globalThis.DOMPointReadOnly !== "function") {

        globalThis.DOMPointReadOnly = class DOMPointReadOnly {
            static #registry = new WeakSet;

            #x;

            get x() {
                if (!DOMPointReadOnly.#registry.has(this)) 
                    throw new TypeError(msg);
                return this.#x;
            }

            constructor(x = 0) {
                DOMPointReadOnly.#registry.add(this);

                if (typeof x !== "number") x = 0;
                this.#x = x;
            }

            toJSON() {
                if (!DOMPointReadOnly.#registry.has(this)) 
                    throw new TypeError(msg);
                return { x: this.x };
            }

            /** @param {DOMPoint|DOMPointReadOnly} domPoint */
            static fromPoint(domPoint) {
                return new DOMPointReadOnly(domPoint.x);
            }
        }

        DOMPointReadOnly.prototype[Symbol.toStringTag] = "DOMPointReadOnly";

        globalThis.DOMPoint = class DOMPoint extends DOMPointReadOnly {
            static #registry = new WeakSet;

            #x;

            get x() {
                if (!DOMPoint.#registry.has(this)) 
                    throw new TypeError(msg);
                return this.#x;
            }

            set x(newX) {
                if (!DOMPoint.#registry.has(this)) 
                    throw new TypeError(msg);
                this.#x = newX;
            }

            constructor(x = 0) {
                super(x);

                DOMPoint.#registry.add(this);

                if (typeof x !== "number") x = 0;
                this.#x = x;
            }

            /** 
             * @param {DOMPoint|DOMPointReadOnly} domPoint
             * @override 
             */
            static fromPoint(domPoint) {
                return new DOMPoint(domPoint.x);
            }

        }

        DOMPoint.prototype[Symbol.toStringTag] = "DOMPoint";
    }

    if (typeof globalThis.DOMRectReadOnly !== "function") {
        
        globalThis.DOMRectReadOnly = class DOMRectReadOnly {
            static #registry = new WeakSet;

            #x;

            get x() {
                return this.#x;
            }

            constructor(x) {
                DOMRectReadOnly.#registry.add(this);

                if (typeof x !== "number") x = 0;
                this.#x = x;
            }

            /** @param {DOMRect|DOMRectReadOnly} */
            static fromRect(rect) {
                return new DOMRectReadOnly(rect.x);
            }
        };

        DOMRectReadOnly.prototype[Symbol.toStringTag] = "DOMRectReadOnly";

        globalThis.DOMRect = class DOMRect extends DOMRectReadOnly {
            static #registry = new WeakSet;

            #x;

            get x() {
                return this.#x;
            }

            set x(newX) {
                this.#x = newX;
            }

            constructor(x) {
                super(x)

                DOMRect.#registry.add(this);

                if (typeof x !== "number") x = 0;
                this.#x = x;
            }

            /** @param {DOMRect|DOMRectReadOnly} */
            static fromRect(rect) {
                return new DOMRect(rect.x);
            }
        };

        DOMRect.prototype[Symbol.toStringTag] = "DOMRect";
    }

    if (typeof globalThis.DOMQuad !== "function") {
        globalThis.DOMQuad = class DOMQuad {
            static #registry = new WeakSet;

            /** @type {DOMPoint} */
            #p1;

            /** @type {DOMPoint} */
            #p2;

            /** @type {DOMPoint} */
            #p3;

            /** @type {DOMPoint} */
            #p4;

            get p1() {
                if (!DOMQuad.#registry.has(this))
                    throw new TypeError(msg);
                return this.#p1;
            }

            get p2() {
                if (!DOMQuad.#registry.has(this))
                    throw new TypeError(msg);
                return this.#p2;
            }

            get p3() {
                if (!DOMQuad.#registry.has(this))
                    throw new TypeError(msg);
                return this.#p3;
            }

            get p4() {
                if (!DOMQuad.#registry.has(this))
                    throw new TypeError(msg);
                return this.#p4;
            }

            [Symbol.toStringTag] = "DOMQuad";

            /**
             * @param {DOMPoint|DOMPointReadOnly} p1 
             * @param {DOMPoint|DOMPointReadOnly} p2 
             * @param {DOMPoint|DOMPointReadOnly} p3 
             * @param {DOMPoint|DOMPointReadOnly} p4 
             */
            constructor(p1, p2, p3, p4) {
                DOMQuad.#registry.add(this);

                this.#p1 = p1 ? DOMPoint.fromPoint(p1) : new DOMPoint;
                this.#p2 = p2 ? DOMPoint.fromPoint(p2) : new DOMPoint;
                this.#p3 = p3 ? DOMPoint.fromPoint(p3) : new DOMPoint;
                this.#p4 = p4 ? DOMPoint.fromPoint(p4) : new DOMPoint;
            }

            toJSON() {
                if (!DOMQuad.#registry.has(this))
                    throw new TypeError(msg);
                return {};
            }
        }

        DOMQuad.prototype[Symbol.toStringTag] = "DOMQuad";
    }

    if (typeof globalThis.FileList !== "function") {
        globalThis.FileList = class FileList {
            static #registry = new WeakSet;

            [Symbol.toStringTag] = "FileList";

            /** @type {File[]} */
            #items;

            /**
             * @param {File[]} items 
             */
            constructor(items) {
                FileList.#registry.add(this);
                this.#items = Array.isArray(items) ? items : [];
            }

            /** @type {(index: number) => File} */
            item(index) {
                if (!FileList.#registry.has(this))
                    throw new TypeError(msg);
                return this.#items[index];
            }

            get length() {
                if (!FileList.#registry.has(this))
                    throw new TypeError(msg);
                return this.#items.length;
            }
        }

        FileList.prototype[Symbol.toStringTag] = "FileList";
    }

    if (typeof globalThis.DataTransfer !== "function") {

        class DataTransferItemList {
            /** @type {File[]} */
            #items = [];

            /** @type {(item: File) => void} */
            add(item) {
                this.#items.push(item)
            }

            getAll() {
                return this.#items;
            }
        }

        globalThis.DataTransfer = class DataTransfer {
            #items = new DataTransferItemList;
            
            get items() {
                return this.#items;
            }

            get files() {
                return new FileList(this.items.getAll());
            }
        }
    }
}

// Causes this module to have side effect of populating polyfills.
polyfill();

/**
 * Clear all polyfills.
 */
export function clearPolyfills() {
    globalThis.DOMMatrixReadOnly = undefined;
    globalThis.DOMMatrix = undefined;
    globalThis.DOMPointReadOnly = undefined;
    globalThis.DOMPoint = undefined;
    globalThis.DOMQuad = undefined;
    globablThis.FileList = undefined;
    globalThis.DataTransfer = undefined;
}
