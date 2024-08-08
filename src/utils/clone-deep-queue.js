import { getWarning } from "./clone-deep-warning.js";

export class CloneDeepQueue {
    /** @type {{ clone: any }} */
    #resultContainer
    
    /** @type {(value: any) => any} */
    #cloneDeep

    /** @type {import("../../private-types").QueueElement[]} */
    #queue;

    /** @type {import("../../public-types").Log} */
    #log;

    /** @type {(clone: any, parentOrAssigner?: Function|symbol|any, prop?: string|symbol, metadata?: PropertyDescriptor) => any} */
    #assign;

    /** @type {boolean} */
    #async;

    /**
     * @param {{ clone: any }} valueContainer
     * @param {(value: any) => any} cloneDeep
     * @param {import("../../public-types").Log} log
     * @param {(clone: any, parentOrAssigner?: Function|symbol|any, prop?: string|symbol, metadata?: PropertyDescriptor) => any} assign
     * @param {boolean} async
     */
    constructor(valueContainer, cloneDeep, log, assign, async) {
        this.#resultContainer = valueContainer;
        this.#cloneDeep = cloneDeep;
        this.#log = log;
        this.#assign = assign;
        this.#async = async;

        this.#resultContainer = { clone: undefined };
        this.#queue = [{ value: undefined }];
    }

    /** @param {unknown} error */
    #handleError(error) {
        const msg = "Encountered error while attempting to clone specific " + 
                    "value. The value will be \"cloned\" into an empty object."

        if (error instanceof Error) {
            error.message = `${msg} Error encountered: ${error.message}`;
            const cause = error.cause ? { cause: error.cause } : undefined;
            const stack = error.stack ? error.stack: undefined;
            this.#log(getWarning(error.message, cause, stack));
        } 
        else this.#log(getWarning(msg, { cause: error }));
    }

    /**
     * 
     * @param {*} value 
     * @param {*} parentOrAssigner 
     * @param {*} prop 
     * @param {*} metadata 
     */
    push(value, parentOrAssigner, prop, metadata) {
        this.#queue.push({ value, parentOrAssigner, prop, metadata });
    }

    /**
     * 
     * @param {*} promiseClone 
     * @param {*} poA 
     * @param {*} prop 
     * @param {*} metadata 
     */
    pushAsync(promiseClone, poA, prop, metadata) {
        Promise.resolve(promiseClone)
            .then(cloned => this.#assign(cloned, poA, prop, metadata))
            .catch(this.#handleError)
            .finally(() => {
                
            });
    }
    
    handleThisEventLoopTurn() {
        let result;

        // copy logic from cloneDeep

        this.#resultContainer.clone = result;

        if (this.#async) return Promise.resolve(this.#resultContainer);
    }
}
