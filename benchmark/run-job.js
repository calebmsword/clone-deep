// eslint-disable-next-line
const clone = function(){function v(e,t){return null!=t&&e instanceof t}var m,_,h;try{m=Map}catch(e){m=function(){}}try{_=Set}catch(e){_=function(){}}try{h=Promise}catch(e){h=function(){}}function w(e,b,t,y,g){"object"==typeof b&&(t=b.depth,y=b.prototype,g=b.includeNonEnumerable,b=b.circular);var j=[],O=[],d="undefined"!=typeof Buffer;return void 0===b&&(b=!0),void 0===t&&(t=1/0),function o(e,c){if(null===e)return null;if(0===c)return e;var f,t;if("object"!=typeof e)return e;if(v(e,m))f=new m;else if(v(e,_))f=new _;else if(v(e,h))f=new h(function(t,r){e.then(function(e){t(o(e,c-1))},function(e){r(o(e,c-1))})});else if(w.__isArray(e))f=[];else if(w.__isRegExp(e))f=new RegExp(e.source,x(e)),e.lastIndex&&(f.lastIndex=e.lastIndex);else if(w.__isDate(e))f=new Date(e.getTime());else{if(d&&Buffer.isBuffer(e))return f=Buffer.allocUnsafe?Buffer.allocUnsafe(e.length):new Buffer(e.length),e.copy(f),f;v(e,Error)?f=Object.create(e):void 0===y?(t=Object.getPrototypeOf(e),f=Object.create(t)):(f=Object.create(y),t=y)}if(b){var r=j.indexOf(e);if(-1!=r)return O[r];j.push(e),O.push(f)}for(var n in v(e,m)&&e.forEach(function(e,t){var r=o(t,c-1),n=o(e,c-1);f.set(r,n)}),v(e,_)&&e.forEach(function(e){var t=o(e,c-1);f.add(t)}),e){var u;t&&(u=Object.getOwnPropertyDescriptor(t,n)),u&&null==u.set||(f[n]=o(e[n],c-1))}if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++){var a=i[n];(!(p=Object.getOwnPropertyDescriptor(e,a))||p.enumerable||g)&&(f[a]=o(e[a],c-1),p.enumerable||Object.defineProperty(f,a,{enumerable:!1}))}}if(g){var l=Object.getOwnPropertyNames(e);for(n=0;n<l.length;n++){var p,s=l[n];(p=Object.getOwnPropertyDescriptor(e,s))&&p.enumerable||(f[s]=o(e[s],c-1),Object.defineProperty(f,s,{enumerable:!1}))}}return f}(e,t)}function t(e){return Object.prototype.toString.call(e)}function x(e){var t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),t}return w.clonePrototype=function(e){if(null===e)return null;var t=function(){};return t.prototype=e,new t},w.__objToStr=t,w.__isDate=function(e){return"object"==typeof e&&"[object Date]"===t(e)},w.__isArray=function(e){return"object"==typeof e&&"[object Array]"===t(e)},w.__isRegExp=function(e){return"object"==typeof e&&"[object RegExp]"===t(e)},w.__getRegExpFlags=x,w}();

const getPrimitivesOnlyObject = () => {
    return {
        string: 'string',
        number: 123456789,
        boolean: true,
        array: ['string', 123456789, false]
    };
};

const getOrdinaryObject = () => {
    const map = new Map();
    map.set('p', { p: 'p', g: { h: 'h' }});
    map.prop = 'property on map';
    map.set('test', 3);

    const error = new Error('error');
    const number = 3;
    Object.freeze(number);

    const object = {
        f: 'string',
        map,
        error,
        uint: new Uint8Array(new ArrayBuffer(8), 1, 4),
        date: new Date(Date.now()),
        frozen: Object.freeze({ test: 3 }),
        sealed: Object.seal({ test: 3 }),
        number,
        bigint: BigInt(1)

    };

    map.set('g', object);
    object.circular = object;

    return object;
};

const getNestedObject = () => {
    const obj = {};
    let next = obj;
    for (let number = 0; number < 500; number++) {
        next.property = {};
        next = next.property;
    }
    return obj;
};

const getPrototypeChain = (numIterations) => {
    let temp = {};
    for (let i = 0; i < numIterations; i++) {
        temp = Object.create(temp);
    }
    return temp;
};

const runJob = async (type, numIterations, numPrototypes, config) => {
    const [
        cloneDeepModule,
        lodashModule,
        esToolkitModule
    ] = await Promise.all([
        import('../index.js'),
        import('https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm'),
        import('https://esm.sh/es-toolkit@%5E1')
    ]);

    const { default: cloneDeep, cloneDeepFully } = cloneDeepModule;
    const lodash = lodashModule.default.cloneDeep;
    const esToolkit = esToolkitModule.cloneDeep;

    const useStructuredClone = (object) => {
        return structuredClone(object);
    };

    const useLodash = (object) => {
        return lodash(object);
    };

    const useClone = (object) => {
        return clone(object, {
            circular: true,
            includeNonEnumerable: true
        });
    };

    const useEsToolkit = (object) => {
        return esToolkit(object);
    };

    const useCloneDeep = (object) => {
        return cloneDeep(object, {
            performanceConfig: config,
            logMode: 'silent'
        });
    };

    const useCloneDeepFully = (object) => {
        return cloneDeepFully(object, { logMode: 'silent' });
    };

    let object;

    switch (type) {
    case 'primitives':
        object = getPrimitivesOnlyObject();
        break;
    case 'ordinary':
        object = getOrdinaryObject();
        break;
    case 'nested':
        object = getNestedObject();
        break;
    case 'prototype':
        object = getPrototypeChain(numPrototypes);
        break;
    default:
        object = undefined;
        break;
    }

    const result = [];

    if (object !== undefined) {
        const funcs = type !== 'prototype'
            ? [
                useStructuredClone,
                useLodash,
                useClone,
                useEsToolkit,
                useCloneDeep
            ] : [
                useCloneDeepFully
            ];
        console.log(funcs);
        funcs.forEach((func) => {
            const max = type === 'prototype'
                ? 1
                : numIterations;
            const divisor = type === 'prototype'
                ? numPrototypes
                : numIterations;

            if (func === useCloneDeep || func === useCloneDeepFully) {
                console.profile();
            }

            const before = Date.now();

            for (let n = 0; n < max; n++) {
                func(object);
            }

            const after = Date.now();

            if (func === useCloneDeep || func === useCloneDeepFully) {
                console.profileEnd();
            }

            result.push((after - before) / divisor);
        });
    }

    return result;
};

export default runJob;
