const msg = "Illegal invocation";

const metadata = x => Object.getOwnPropertyDescriptors(x);

const proto = x => Object.getPrototypeOf(x);

export function polyfill() {
    
    if (typeof globalThis.DOMMatrixReadOnly !== "function") {

        globalThis.DOMMatrixReadOnly = class DOMMatrixReadOnly {
            static #registry = new WeakSet;

            #m11;

            /** @param {number} m11 */
            constructor(m11 = 0) {
                DOMMatrixReadOnly.#registry.add(this);

                /** @type {(x: number) => void} */
                function setM11(m11) { 
                    this.#m11 = m11;
                }

                setM11.call(this, m11);

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

                globalThis.DOMMatrix = class DOMRect extends DOMMatrixReadOnly {
                    static #registry = new WeakSet;
        
                    constructor(m11 = 0) {
                        super(m11);
                        DOMRect.#registry.add(this);
                        
                        if (!Object.getOwnPropertyNames(DOMRect.prototype)
                                .includes("m11"))
                            Object.defineProperty(DOMRect.prototype, "m11", {
                                configurable: "true",
                                enumerable: "true",
                                get() {
                                    return metadata(proto(proto(this)))
                                        .m11
                                        .get
                                        .call(this);
                                },
                                set(m11) {
                                    if (!DOMRect.#registry.has(this)) 
                                        throw new TypeError(msg);
                                    setM11.call(this, m11);
                                }
                            });
                    }
                }
            }

            scale() {
                if (!DOMMatrixReadOnly.#registry.has(this)) 
                    throw new TypeError(msg);
                return new DOMMatrixReadOnly(this.#m11);
            }
        };

        new DOMMatrixReadOnly;
    }
    
    if (typeof globalThis.DOMPointReadOnly !== "function") {
        globalThis.DOMPointReadOnly = class DOMPointReadOnly {
            static #registry = new WeakSet;

            #x = 0;

            constructor() {
                DOMPointReadOnly.#registry.add(this);

                /** @type {(x: number) => void} */
                function setX(x) { 
                    this.#x = x;
                }

                if (!Object.getOwnPropertyNames(DOMPointReadOnly.prototype)
                        .includes("x"))
                    Object.defineProperty(DOMPointReadOnly.prototype, "x", {
                        configurable: "true",
                        enumerable: "true",
                        /** @this DOMPointReadOnly */
                        get() {
                            if (!DOMPointReadOnly.#registry.has(this)) 
                                throw new TypeError(msg);
                            return this.#x;
                        }
                    });

                globalThis.DOMPoint = class DOMPoint extends DOMPointReadOnly {
                    static #registry = new WeakSet;
        
                    constructor() {
                        super();
                        DOMPoint.#registry.add(this);
                        
                        if (!Object.getOwnPropertyNames(DOMPoint.prototype)
                                .includes("x"))
                            Object.defineProperty(DOMPoint.prototype, "x", {
                                configurable: "true",
                                enumerable: "true",
                                get() {
                                    return metadata(proto(proto(this)))
                                        .x
                                        .get
                                        .call(this);
                                },
                                set(x) {
                                    if (!DOMPoint.#registry.has(this)) 
                                        throw new TypeError(msg);
                                    setX.call(this, x);
                                }
                            });
                    }
                }
            }

            toJSON() {
                if (!DOMPointReadOnly.#registry.has(this)) 
                    throw new TypeError(msg);
                return { x: this.#x };
            }
        };

        new DOMPointReadOnly;
    }

    if (typeof globalThis.DOMRectReadOnly !== "function") {
        globalThis.DOMRectReadOnly = class DOMRectReadOnly {
            static #registry = new WeakSet;

            /** @type {number} */
            #x = 0;

            constructor() {

                DOMRectReadOnly.#registry.add(this);

                /** @type {(x: number) => void} */
                function setX(x) { 
                    this.#x = x;
                }

                if (!Object.getOwnPropertyNames(DOMRectReadOnly.prototype)
                        .includes("x"))
                    Object.defineProperty(DOMRectReadOnly.prototype, "x", {
                        configurable: "true",
                        enumerable: "true",
                        /** @this DOMRectReadOnly */
                        get() {
                            if (!DOMRectReadOnly.#registry.has(this)) 
                                throw new TypeError(msg);
                            return this.#x;
                        }
                    });

                globalThis.DOMRect = class DOMRect extends DOMRectReadOnly {
                    static #registry = new WeakSet;
        
                    constructor() {
                        super();
                        DOMRect.#registry.add(this);
                        
                        if (!Object.getOwnPropertyNames(DOMRect.prototype)
                                .includes("x"))
                            Object.defineProperty(DOMRect.prototype, "x", {
                                configurable: "true",
                                enumerable: "true",
                                get() {
                                    return metadata(proto(proto(this)))
                                        .x
                                        .get
                                        .call(this);
                                },
                                set(x) {
                                    if (!DOMRect.#registry.has(this)) 
                                        throw new TypeError(msg);
                                    setX.call(this, x);
                                }
                            });
                    }
                }
            }
        };

        new DOMRectReadOnly;
    }

    if (typeof globalThis.DOMQuad !== "function") {
        globalThis.DOMQuad = class DOMQuad {
            static #registry = new WeakSet;

            constructor() {
                DOMQuad.#registry.add(this);
            }

            toJSON() {
                if (!DOMQuad.#registry.has(this))
                    throw new TypeError(msg);
                return {};
            }
        }
    }

    if (typeof globalThis.FileList !== "function") {
        globalThis.FileList = class FileList {
            static #registry = new WeakSet;

            // [Symbol.toStringTag] = "FileList";

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

polyfill();
