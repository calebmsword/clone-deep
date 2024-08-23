import { TOP_LEVEL } from './assign.js';
import { getSupportedPrototypes } from '../../utils/helpers.js';

/**
 * Container for various data structures often used in cloneDeep.
 */
export class GlobalState {
    /**
     * Contains the cloned value.
     * @type {{ clone: any }}
     * @readonly
     */
    container;

    /**
     * Will be used to store cloned values so that we don't loop infinitely on
     * circular references.
     * @readonly
     */
    cloneStore = new Map();

    /**
     * A queue so we can avoid recursion.
     * @type {import('../../types').QueueItem[]}
     * @readonly
     */
    queue;

    /**
     * A list. Each item contains a promise which resolves to the clone of a
     * value, as well as metadata for that clone.
     * @type import('../../types').PendingResultItem[]}
     * @readonly
     */
    pendingResults = [];

    /**
     * We will do a second pass through everything to check Object.isExtensible,
     * Object.isSealed and Object.isFrozen. We do it last so we don't run into
     * issues where we append properties on a frozen object, etc.
     * @type {Array<[any, any]>}
     * @readonly
     */
    isExtensibleSealFrozen = [];

    /**
     * An optional function which customizes the behavior of CloneDeep.
     * @type {import('../../types').Customizer|undefined}
     * @readonly
     */
    customizer;

    /**
     * An array of all prototypes of supported types in this runtime.
     * @type {any[]}
     * @readonly
     */
    supportedPrototypes;

    /**
     * This is used by cloneDeepFully to check if an object with a cloning
     * method is in the prototype of an object that was cloned earlier in the
     * chain.
     * @type {Set<any>|undefined}
     * @readonly
     */
    parentObjectRegistry;

    /**
     * Whether or not type-checking will be more performant.
     * @type {boolean}
     * @readonly
     */
    prioritizePerformance;

    /**
     * Whether cloning methods should even be considered.
     * @type {boolean}
     * @readonly
     */
    ignoreCloningMethods;

    /**
     * Whether errors in the customizer should cause the function to throw.
     * @type {boolean}
     * @readonly
     */
    doThrow;

    /**
     * Whether the algorithm will return the clone asynchronously.
     * @type {boolean|undefined}
     * @readonly
     */
    async;

    /**
     * @param {Object} spec
     * @param {any} spec.value
     * The initial value being cloned.
     * @param {import('../../types').Log} spec.log
     * A logger.
     * @param {import('../../types').Customizer} [spec.customizer]
     * A function which modifies the default behavior of cloneDeep.
     * @param {Set<any>} [spec.parentObjectRegistry]
     * This is used by cloneDeepFully to check if an object with a cloning
     * method is in the prototype of an object that was cloned earlier in the
     * chain.
     * @param {boolean} spec.prioritizePerformance
     * Whether or not type-checking will be more performant.
     * @param {boolean} spec.ignoreCloningMethods
     * Whether cloning methods should even be considered.
     * @param {boolean} spec.doThrow
     * Whether errors in the customizer should cause the function to throw.
     * @param {boolean} [spec.async]
     * Whether the algorithm will return the clone asynchronously.
     */
    constructor({
        value,
        log,
        customizer,
        parentObjectRegistry,
        prioritizePerformance,
        ignoreCloningMethods,
        doThrow,
        async
    }) {
        this.container = { clone: undefined };
        this.customizer = customizer;
        this.log = log;
        this.queue = [{ value, parentOrAssigner: TOP_LEVEL }];
        this.supportedPrototypes = getSupportedPrototypes();
        this.parentObjectRegistry = parentObjectRegistry;
        this.prioritizePerformance = Boolean(prioritizePerformance);
        this.ignoreCloningMethods = Boolean(ignoreCloningMethods);
        this.doThrow = Boolean(doThrow);
        this.async = Boolean(async);

        return new Proxy(this, {
            set() {
                throw new TypeError('GlobalState properties are readonly!');
            }
        });
    }
}
