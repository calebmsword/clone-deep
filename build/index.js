'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _createClass(e, r, t) {
  return Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toArray(r) {
  return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

/**
 * Used to log warnings.
 */
var CloneDeepError = /*#__PURE__*/function (_Error) {
  /**
   * @param {string} message
   * @param {ErrorOptions} [cause]
   * @param {string} [stack]
   */
  function CloneDeepError(message, cause, stack) {
    var _this;
    _classCallCheck(this, CloneDeepError);
    _this = _callSuper(this, CloneDeepError, [message, cause]);
    _this.name = CloneDeepError.name;
    if (typeof stack === 'string') {
      Object.defineProperty(_this, 'stack', {
        value: stack
      });
    }
    return _this;
  }
  _inherits(CloneDeepError, _Error);
  return _createClass(CloneDeepError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Creates a {@link CloneDeepError} instance.
 * @param {String} message The error message.
 * @param {ErrorOptions} [cause] If an object with a `cause` property, it will
 * add a cause to the error when logged.
 * @param {string} [stack] If provided, determines the stack associated with the
 * error object.
 * @returns {CloneDeepError}
 */
var getError = function getError(message, cause, stack) {
  return new CloneDeepError(message, cause, stack);
};

/**
 * Commonly-used {@link CloneDeepError} instances.
 */
var CloneError = {
  WEAKMAP: getError('Attempted to clone unsupported type WeakMap.'),
  WEAKSET: getError('Attempted to clone unsupported type WeakSet.'),
  IMPROPER_ADDITIONAL_VALUES: getError('The additionalValue property must be an array of objects. The ' + 'objects must have a `value` property and an `assigner` property ' + 'that is a function.'),
  CUSTOMIZER_ASYNC_IN_SYNC_MODE: getError('Customizer attempted to asynchronously get the clone for an object, ' + 'but cloneDeep was not run in async mode.'),
  ADDITIONAL_VALUES_ASYNC_IN_SYNC_MODE: getError('Customizer attempted to add additional values asynchronously, but ' + 'cloneDeep was not run in async mode.'),
  CUSTOMIZER_IMPROPER_PROPS_TO_IGNORE: getError('return value of customizer is an object whose propsToIgnore ' + 'property, if not undefined, is expected to be an array of strings ' + 'or symbols. The given result is not this type of array so it will ' + 'have no effect.'),
  CLONING_METHOD_ASYNC_IN_SYNC_MODE: getError('Cloning method attempted to asynchronously get the clone for an ' + 'object, but cloneDeep was not run in async mode.'),
  CLONING_METHOD_IMPROPER_PROPS_TO_IGNORE: getError('return value of CLONE method is an object whose propsToIgnore ' + 'property, if not undefined, is expected to be an array of strings ' + 'or symbols. The given result is not this type of array so it will ' + 'have no effect.'),
  UNSUPPORTED_TYPE: getError('Attempted to clone unsupported type.'),
  IMPROPER_AGGREGATE_ERRORS: getError('Cloning AggregateError with non-iterable errors property. It will ' + 'be cloned into an AggregateError instance with an empty aggregation.'),
  FILELIST_DISALLOWED: getError('Cannot create FileList in this runtime.'),
  UNRECOGNIZED_TYPEARRAY_SUBCLASS: getError('Unrecognized TypedArray subclass. This object will be cloned into a ' + 'DataView instance.')
};

/** @type {import('../types').Log} */
var defaultLog = {
  warn: function warn(error) {
    console.warn(_typeof(error) === 'object' ? error.message : error);
  },
  error: function error(_error) {
    console.error(_error);
  }
};

/** Used to create methods for cloning objects.*/
var CLONE = Symbol('CLONE');

/**
 * Contains the tag for various types.
 * @type {import('./types').Tag}
 */
var Tag = Object.freeze({
  // "standard" classes
  ARGUMENTS: '[object Arguments]',
  ARRAY: '[object Array]',
  BIGINT: '[object BigInt]',
  BOOLEAN: '[object Boolean]',
  DATE: '[object Date]',
  ERROR: '[object Error]',
  FUNCTION: '[object Function]',
  MAP: '[object Map]',
  NUMBER: '[object Number]',
  OBJECT: '[object Object]',
  PROMISE: '[object Promise]',
  REGEXP: '[object RegExp]',
  SET: '[object Set]',
  STRING: '[object String]',
  SYMBOL: '[object Symbol]',
  WEAKMAP: '[object WeakMap]',
  WEAKSET: '[object WeakSet]',
  // ArrayBuffer, DataView and TypedArrays
  ARRAYBUFFER: '[object ArrayBuffer]',
  DATAVIEW: '[object DataView]',
  FLOAT32: '[object Float32Array]',
  FLOAT64: '[object Float64Array]',
  INT8: '[object Int8Array]',
  INT16: '[object Int16Array]',
  INT32: '[object Int32Array]',
  UINT8: '[object Uint8Array]',
  UINT8CLAMPED: '[object Uint8ClampedArray]',
  UINT16: '[object Uint16Array]',
  UINT32: '[object Uint32Array]',
  BIGINT64: '[object BigInt64Array]',
  BIGUINT64: '[object BigUint64Array]',
  // Web APIs
  AUDIODATA: '[object AudioData]',
  BLOB: '[object Blob]',
  DOMEXCEPTION: '[object DOMException]',
  DOMMATRIX: '[object DOMMatrix]',
  DOMMATRIXREADONLY: '[object DOMMatrixReadOnly]',
  DOMPOINT: '[object DOMPoint]',
  DOMPOINTREADONLY: '[object DOMPointReadOnly]',
  DOMRECT: '[object DOMRect]',
  DOMRECTREADONLY: '[object DOMRectReadOnly]',
  DOMQUAD: '[object DOMQuad]',
  FILE: '[object File]',
  FILELIST: '[object FileList]',
  IMAGEDATA: '[object ImageData]',
  VIDEOFRAME: '[object VideoFrame]',
  // Async Web APIs
  IMAGEBITMAP: '[object ImageBitmap]',
  // Node types
  BUFFER: '[object Buffer]'
});
var Es6NativeTypes = Object.freeze({
  ArrayBuffer: 'ArrayBuffer',
  BigInt: 'BigInt',
  Map: 'Map',
  Promise: 'Promise',
  Set: 'Set',
  Symbol: 'Symbol',
  DataView: 'DataView',
  Float32Array: 'Float32Array',
  Float64Array: 'Float64Array',
  Int8Array: 'Int8Array',
  Int16Array: 'Int16Array',
  Int32Array: 'Int32Array',
  Uint8Array: 'Uint8Array',
  Uint8ClampedArray: 'Uint8ClampedArray',
  Uint16Array: 'Uint16Array',
  Uint32Array: 'Uint32Array',
  BigInt64Array: 'BigInt64Array',
  BigUint64Array: 'BigUint64Array'
});
var WebApis = Object.freeze({
  AudioData: 'AudioData',
  Blob: 'Blob',
  DOMException: 'DOMException',
  DOMMatrix: 'DOMMatrix',
  DOMMatrixReadOnly: 'DOMMatrixReadOnly',
  DOMPoint: 'DOMPoint',
  DOMPointReadOnly: 'DOMPointReadOnly',
  DOMQuad: 'DOMQuad',
  DOMRect: 'DOMRect',
  DOMRectReadOnly: 'DOMRectReadOnly',
  File: 'File',
  FileList: 'FileList',
  ImageBitmap: 'ImageBitmap',
  ImageData: 'ImageData',
  VideoFrame: 'VideoFrame'
});
var NodeTypes = Object.freeze({
  Buffer: 'Buffer'
});

/** All prototypes of supported types. */
var supportedPrototypes = Object.freeze([Array.prototype, Boolean.prototype, Date.prototype, Error.prototype, Function.prototype, Number.prototype, Object.prototype, RegExp.prototype, String.prototype]);

/**
 * Gets the prototype of the provided object.
 * @param {any} value
 * @returns {any}
 */
var getPrototype = function getPrototype(value) {
  return Object.getPrototypeOf(value);
};

/**
 * Retrieves the property descriptors of the provided object.
 * The result is a hash which maps properties to their property descriptor.
 * @param {any} value
 * @returns {{ [property: string|symbol]: PropertyDescriptor }}
 */
var getDescriptors = function getDescriptors(value) {
  return Object.getOwnPropertyDescriptors(value);
};

/**
 * Whether the provided property descriptor is the default value.
 * @param {PropertyDescriptor} [descriptor]
 * @returns {boolean}
 */
var isDefaultDescriptor = function isDefaultDescriptor(descriptor) {
  return _typeof(descriptor) === 'object' && descriptor.configurable === true && descriptor.enumerable === true && descriptor.writable === true;
};

/**
 * Whether the property descriptor is for a property with getter and/or setter.
 * @param {PropertyDescriptor} [metadata]
 * @returns {boolean}
 */
var hasAccessor = function hasAccessor(metadata) {
  return _typeof(metadata) === 'object' && (typeof metadata.get === 'function' || typeof metadata.set === 'function');
};

/**
 * Returns an array of all properties in the object.
 * This includes symbols and non-enumerable properties. `undefined` or `null`
 * returns an empty array.
 * @param {Object} object An object.
 * @returns {(string|symbol)[]} An array of property names.
 */
var getAllPropertiesOf = function getAllPropertiesOf(object) {
  return [Object.getOwnPropertyNames(object), Object.getOwnPropertySymbols(object)].flat();
};

/**
 * Is true if the provided object has methods. Is false otherwise.
 * @param {any} object An object
 * @returns {Boolean}
 */
var hasMethods = function hasMethods(object) {
  // We cannot access some properties of Function.prototype in strict mode
  if (object === Function.prototype) {
    return true;
  }
  return getAllPropertiesOf(object).some(function (key) {
    return typeof object[key] === 'function';
  });
};

/**
 * Iterate the provided callback on every owned property of the given object.
 * This includes symbols and non-enumerable properties but not properties from
 * the prototype chain.
 * This is more performant than using {@link getAllPropertiesOf}.
 * @param {any} object
 * @param {(key: string|symbol) => void} propertyCallback
 */
var forAllOwnProperties = function forAllOwnProperties(object, propertyCallback) {
  [Object.getOwnPropertyNames(object), Object.getOwnPropertySymbols(object)].forEach(function (array) {
    array.forEach(propertyCallback);
  });
};

/**
 * Gets the appropriate TypedArray constructor for the given object tag.
 * @param {string} tag
 * The tag for the object.
 * @param {import('../types').Log} log
 * A logging function.
 * @returns {import('./types').TypedArrayConstructor}
 */
var getTypedArrayConstructor = function getTypedArrayConstructor(tag, log) {
  switch (tag) {
    case Tag.DATAVIEW:
      return DataView;
    case Tag.FLOAT32:
      return Float32Array;
    case Tag.FLOAT64:
      return Float64Array;
    case Tag.INT8:
      return Int8Array;
    case Tag.INT16:
      return Int16Array;
    case Tag.INT32:
      return Int32Array;
    case Tag.UINT8:
      return Uint8Array;
    case Tag.UINT8CLAMPED:
      return Uint8ClampedArray;
    case Tag.UINT16:
      return Uint16Array;
    case Tag.UINT32:
      return Uint32Array;
    case Tag.BIGINT64:
      return BigInt64Array;
    case Tag.BIGUINT64:
      return BigUint64Array;
    default:
      log.warn(CloneError.UNRECOGNIZED_TYPEARRAY_SUBCLASS);
      return DataView;
  }
};

/**
 * Gets the appropriate error constructor for the error name.
 * @param {Error} value
 * The object itself. This is necessary to correctly find constructors for
 * various Error subclasses.
 * @param {import('../types').Log} [log]
 * An optional logging function.
 * @returns {import('./types').AtomicErrorConstructor}
 */
var getAtomicErrorConstructor = function getAtomicErrorConstructor(value, log) {
  var name = value.name;
  switch (name) {
    case 'Error':
      return Error;
    case 'EvalError':
      return EvalError;
    case 'RangeError':
      return RangeError;
    case 'ReferenceError':
      return ReferenceError;
    case 'SyntaxError':
      return SyntaxError;
    case 'TypeError':
      return TypeError;
    case 'URIError':
      return URIError;
    default:
      if (log !== undefined) {
        log.warn(getError('Cloning error with unrecognized name ' + "".concat(name, "! It will be cloned into an ") + 'ordinary Error object.'));
      }
      return Error;
  }
};

/**
 * Creates a FileList.
 * See https://github.com/fisker/create-file-list.
 * @param  {...File} files
 * @returns {FileList|undefined}
 */
var createFileList = function createFileList() {
  var _dataTransfer2;
  var getDataTransfer = function getDataTransfer() {
    try {
      return new DataTransfer();
    } catch (_unused) {
      return new ClipboardEvent('').clipboardData;
    }
  };
  var dataTransfer;
  try {
    dataTransfer = getDataTransfer();
  } catch (_unused2) {
    throw CloneError.FILELIST_DISALLOWED;
  }
  for (var _len = arguments.length, files = new Array(_len), _key = 0; _key < _len; _key++) {
    files[_key] = arguments[_key];
  }
  for (var _i = 0, _files = files; _i < _files.length; _i++) {
    var _dataTransfer;
    var file = _files[_i];
    (_dataTransfer = dataTransfer) === null || _dataTransfer === void 0 || _dataTransfer.items.add(file);
  }
  return (_dataTransfer2 = dataTransfer) === null || _dataTransfer2 === void 0 ? void 0 : _dataTransfer2.files;
};

/**
 * Returns a deep clone of the given File.
 * @param {File} file
 * @returns {File}
 */
var cloneFile = function cloneFile(file) {
  return new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified
  });
};

/** @type {any} */
var __global = globalThis;

/** @type {{ [key: string]: new (...args: any[]) => any | undefined }} */
var global = __global;

/** @typedef {new (...args: any[]) => any} Constructor */

/**
 * Attempts to retreive a web API from the global object.
 * Doing this in a way that utilizes TypeScript effectively is obtuse, hence
 * this function was made so that TypeScript jank doesn't obfuscate code
 * elsewhere.
 * @param {string} string
 * @returns {Constructor | undefined}
 */
var getConstructorFromString = function getConstructorFromString(string) {
  return global[string];
};

/**
 * Returns an array of prototypes of available supported types for this runtime.
 * @returns {any[]}
 */
var getSupportedPrototypes = function getSupportedPrototypes() {
  /** @type {object[]} */
  var additionalPrototypes = [];
  Object.keys(WebApis).forEach(function (webApiString) {
    var PotentialWebApi = getConstructorFromString(webApiString);
    if (PotentialWebApi !== undefined && isCallable(PotentialWebApi)) {
      additionalPrototypes.push(PotentialWebApi.prototype);
    }
  });
  Object.keys(Es6NativeTypes).forEach(function (typeArrayString) {
    var PotentialArray = getConstructorFromString(typeArrayString);
    if (PotentialArray !== undefined && isCallable(PotentialArray)) {
      additionalPrototypes.push(PotentialArray.prototype);
    }
  });
  Object.keys(NodeTypes).forEach(function (typeArrayString) {
    var PotentialArray = getConstructorFromString(typeArrayString);
    if (PotentialArray !== undefined && isCallable(PotentialArray)) {
      additionalPrototypes.push(PotentialArray.prototype);
    }
  });
  return supportedPrototypes.concat(additionalPrototypes);
};

/**
 * Returns an object containing all constructors in this runtime.
 * The object maps names of a constructor ('Array', 'Map', 'AudioData') to the
 * constructor itself, or `undefined` if the constructor is not available in
 * this runtime.
 * @returns {Readonly<{ [key: string]: Constructor | undefined }>}
 */
var getSupportedConstructors = function getSupportedConstructors() {
  /** @type {{ [key: string]: Constructor | undefined }} */
  var result = {};
  Object.values(Tag).forEach(function (tag) {
    var name = tag.substring(8, tag.length - 1);
    result[name] = getConstructorFromString(name);
  });
  return Object.freeze(result);
};

/**
 * @template T
 * Returns the provided value as an "instance" of the given "class".
 * Where a "class" is a constructor function, and being an instance means having
 * the prototype of the constructor function in the prototype chain.
 * If the provided value is not a suitable instance of the class, then the
 * function returns `undefined`.
 * @param {any} value
 * @param {T extends new (...args: any[]) => any ? T : never} constructor
 * @returns {undefined | ReturnType<T>}
 */
var castAsInstanceOf = function castAsInstanceOf(value, constructor) {
  if (!isCallable(constructor)) {
    return;
  }
  var tempPrototype = getPrototype(value);
  while (tempPrototype !== null) {
    if (tempPrototype === constructor.prototype) {
      return value;
    }
    tempPrototype = getPrototype(tempPrototype);
  }
  return;
};

var toString = Object.prototype.toString;

/**
 * Gets the tag using `Object.prototype.toString`.
 * Since we cache the lookup for `Object.prototype.toString` in the
 * implementation of this function, this is slightly more performant than
 * calling `Object.prototype.toString.call` explicitly.
 * @param {any} value
 * @returns {string}
 */
var toStringTag = function toStringTag(value) {
  return toString.call(value);
};

/**
 * Determines whether a particular property is read-only.
 * @param {any} value
 * Any object.
 * @param {string|symbol} property
 * The property on the object whose mutability will be checked.
 * A function which modifies the value assigned to that property.
 */
var isReadOnly = function isReadOnly(value, property) {
  try {
    var original = value[property];
    value[property] = value[property] + 1;
    var _final = value[property];
    value[property] = original;
    return _final !== original + 1;
  } catch (_unused) {
    // The web specification does not determine whether an implementation
    // should throw if reassignment of a readonly property of a web api
    // is performed; hence we use a try-catch to catch runtimes which will
    // throw.
    return true;
  }
};

/**
 * Whether the provided value can be called as a function.
 * @param {any} value
 * @returns {boolean}
 */
var isCallable = function isCallable(value) {
  return typeof value === 'function';
};

/**
 * A factory which creates type checkers for readonly geometry (sub)classes.
 * @param {string} webApiString
 * The name of an immutable geometry subclass.
 * @param {string|symbol|{ name: string|symbol }} methodOrProp
 * If a primitive, then the name of a method on the immutable geometry subclass.
 * If an object, it should be a hash with a single property `"name"` that
 * refers to a non-method property on the instance.
 * @param {string|symbol} property
 * An instance property.
 * @returns {{ [method: string]: (value: any) => boolean }}
 */
var getGeometryCheckers = function getGeometryCheckers(webApiString, methodOrProp, property) {
  /** @type {Map<any, boolean>} */
  var registry = new Map();

  /**
   * @param {any} value
   * @returns {boolean}
   */
  var isSubclass = function isSubclass(value) {
    var PotentialWebApi = getConstructorFromString(webApiString);
    if (typeof PotentialWebApi !== 'function') {
      return false;
    }
    if (registry.has(value)) {
      var _result = registry.get(value);
      if (typeof _result === 'boolean') {
        return _result;
      }
    }
    var descriptors = getDescriptors(getPrototype(new PotentialWebApi()));

    /** @type {boolean} */
    var result;
    try {
      if (_typeof(methodOrProp) === 'object') {
        var _descriptors$methodOr;
        (_descriptors$methodOr = descriptors[methodOrProp.name].get) === null || _descriptors$methodOr === void 0 || _descriptors$methodOr.call(value);
      } else {
        PotentialWebApi === null || PotentialWebApi === void 0 || PotentialWebApi.prototype[methodOrProp].call(value);
      }
      result = true;
    } catch (_unused2) {
      result = false;
    }
    registry.set(value, result);
    return result;
  };

  /** @type {(value?: any) => boolean} */
  var isMutable = _typeof(methodOrProp) === 'object' ? function (value) {
    return !isReadOnly(value, methodOrProp.name);
  } : function (value) {
    return !isReadOnly(value, property);
  };

  /** @type {(value: any) => boolean} */
  var isImmutableType = function isImmutableType(value) {
    return isSubclass(value) && !isMutable(value);
  };

  /** @type {(value: any) => boolean} */
  var isMutableType = function isMutableType(value) {
    return isSubclass(value) && isMutable(value);
  };
  var immutableClassName = webApiString;
  var mutableClassName = webApiString.substring(0, webApiString.length - 8);
  return _defineProperty(_defineProperty({}, "is".concat(immutableClassName), isImmutableType), "is".concat(mutableClassName), isMutableType);
};
var _getGeometryCheckers = getGeometryCheckers(WebApis.DOMMatrixReadOnly, 'scale', 'm11'),
  isDOMMatrixReadOnly = _getGeometryCheckers.isDOMMatrixReadOnly,
  isDOMMatrix = _getGeometryCheckers.isDOMMatrix;
var _getGeometryCheckers2 = getGeometryCheckers(WebApis.DOMPointReadOnly, 'toJSON', 'x'),
  isDOMPointReadOnly = _getGeometryCheckers2.isDOMPointReadOnly,
  isDOMPoint = _getGeometryCheckers2.isDOMPoint;
var _getGeometryCheckers3 = getGeometryCheckers(WebApis.DOMRectReadOnly, {
    name: 'x'
  }, 'x'),
  isDOMRectReadOnly = _getGeometryCheckers3.isDOMRectReadOnly,
  isDOMRect = _getGeometryCheckers3.isDOMRect;
var isFile = function isFile(value) {
  try {
    var _getDescriptors$lastM;
    (_getDescriptors$lastM = getDescriptors(File.prototype).lastModified.get) === null || _getDescriptors$lastM === void 0 || _getDescriptors$lastM.call(value);
    return true;
  } catch (_unused3) {
    return false;
  }
};

/**
 * Returns `true` if the given value is an ImageBitmap, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
var isImageBitmap = function isImageBitmap(value) {
  try {
    var _getDescriptors$heigh;
    (_getDescriptors$heigh = getDescriptors(ImageBitmap.prototype).height.get) === null || _getDescriptors$heigh === void 0 || _getDescriptors$heigh.call(value);
    return true;
  } catch (_unused4) {
    return false;
  }
};

/**
 * Returns `true` if the given value is an ImageBitmap, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
var isImageData = function isImageData(value) {
  try {
    var _getDescriptors$width;
    (_getDescriptors$width = getDescriptors(ImageData.prototype).width.get) === null || _getDescriptors$width === void 0 || _getDescriptors$width.call(value);
    return true;
  } catch (_unused5) {
    return false;
  }
};

/**
 * Returns `true` if the given value is a DOMException, `false` otherwise.
 * @param {any} value
 * @returns {boolean}
 */
var isDOMException = function isDOMException(value) {
  try {
    var _getDescriptors$code$;
    var domException = castAsInstanceOf(value, DOMException);
    if (!domException) {
      return false;
    }
    (_getDescriptors$code$ = getDescriptors(DOMException.prototype).code.get) === null || _getDescriptors$code$ === void 0 || _getDescriptors$code$.call(domException);
    return true;
  } catch (_unused6) {
    return false;
  }
};

/**
 * Whether the provided value is iterable.
 * See https://stackoverflow.com/a/32538867/22334683.
 * @param {any} value
 * The value whose iterability will be checked.
 * @returns {boolean}
 */
var isIterable = function isIterable(value) {
  if (value === null || value === undefined) {
    return false;
  }
  return typeof value[Symbol.iterator] === 'function';
};
var typedArrayTags = Object.freeze([Tag.FLOAT32, Tag.FLOAT64, Tag.INT8, Tag.INT16, Tag.INT32, Tag.UINT8, Tag.UINT8CLAMPED, Tag.UINT16, Tag.UINT32, Tag.BIGINT64, Tag.BIGUINT64]);

/**
 * Returns `true` if given value is a TypedArray instance, `false` otherwise.
 * @param {string} value
 * Any arbitrary value
 * @param {string} tag
 * The tag for the value.
 * @param {import('../clone-deep/clone-deep-utils/types').PerformanceConfig} [performanceConfig]
 * Whether type-checking should be done performantly.
 * @returns {boolean}
 */
var isTypedArray = function isTypedArray(value, tag, performanceConfig) {
  if ((performanceConfig === null || performanceConfig === void 0 ? void 0 : performanceConfig.robustTypeChecking) !== true) {
    return typedArrayTags.includes(tag);
  }
  try {
    var _getPrototype;
    (_getPrototype = getPrototype(getPrototype(new Float32Array(new ArrayBuffer(0))))) === null || _getPrototype === void 0 || _getPrototype.lastIndexOf.call(value);
    return true;
  } catch (_unused7) {
    return false;
  }
};

/**
 * Returns `true` if given value is a Buffer instance, `false` otherwise.
 * @param {any} value
 * @param {{ [key: string]: (new (...args: any[]) => any)|undefined}} supportedConstructors
 * @returns {boolean}
 */
var isBuffer = function isBuffer(value, supportedConstructors) {
  var NodeBuffer = supportedConstructors['Buffer'];
  return NodeBuffer !== undefined && value instanceof NodeBuffer;
};

/**
 * Returns true if the provided value is an object, false otherwise.
 * @param {any} value
 * @returns {boolean}
 */
var isObject = function isObject(value) {
  return value !== null && ['object', 'function'].includes(_typeof(value));
};

/**
 * @param {any} value
 * @returns {boolean}
 */
var isStringOrSymbol = function isStringOrSymbol(value) {
  return ['string', 'symbol'].includes(_typeof(value));
};

/**
 * Returns true if the provided value is an array of strings or symbols.
 * @param {any} value
 * @returns {boolean}
 */
var isPropertyKeyArray = function isPropertyKeyArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every(isStringOrSymbol);
};

/**
 * Checks the clone store to see if we the given value was already cloned.
 * This is used to avoid infinite loops on objects with circular references.
 * This may have a side effect of saving the clone to a persistent place.
 * @param {any} value
 * The value to check.
 * @param {Map<any, any>} cloneStore
 * The clone store.
 * @param {(clone: any) => any} saveClone
 * Handles saving the provided clone to a persistent place.
 * @returns {boolean}
 * Whether the store contained a clone for this value.
 */
var checkCloneStore = function checkCloneStore(value, cloneStore, saveClone) {
  if (cloneStore.has(value)) {
    saveClone(cloneStore.get(value));
    return true;
  }
  return false;
};

/**
 * Checks if a cloned parent object is an "instance" of the provided value.
 * We say "instance" to say that the constructor for the cloned object used the
 * value as its prototype.
 * @param {any} value
 * The value to check.
 * @param {Set<any>|undefined} registry
 * The "parent object registry" used internally by cloneDeepFully. A "parent
 * object" is a top-level object that was cloned. For example, if we have:
 *
 * ```
 * const protoChild = {};
 * const protoParent = { protoChild };
 *
 * const childObject = {};
 * const parentObject = Object.create(protoParent);
 * parent.childObject = childObject;
 *
 * const cloned = cloneDeepFully(parentObject);
 * ```
 *
 * `parentObject` and `protoParent` would be "parent objects" stored in the
 * parent object registry.
 * @returns {boolean}
 * Whether registered parent object is an instance of the given value.
 */
var checkParentObjectRegistry = function checkParentObjectRegistry(value, registry) {
  var ignoreCloningMethodsThisLoop = false;
  if (registry !== undefined) {
    _toConsumableArray(registry).some(function (object) {
      var _object$constructor;
      if (value === (object === null || object === void 0 || (_object$constructor = object.constructor) === null || _object$constructor === void 0 ? void 0 : _object$constructor.prototype)) {
        ignoreCloningMethodsThisLoop = true;
        return true;
      }
      return false;
    });
  }
  return ignoreCloningMethodsThisLoop;
};

/**
 * If an error occurs when handling supported types, it will be handled here.
 * This will have a side effect of storing an empty object in the place where
 * a successful clone should have gone.
 * @param {unknown} thrown
 * The error thrown.
 * @param {import('../../types').Log} log
 * A logger.
 * @param {(clone: any) => any} saveClone
 * Handles saving the provided clone to a persistent place.
 * @returns {{ cloned: any, ignoreProto: boolean }}
 * An object containing the dummy clone value that was saved and a boolean
 * property indicating that the prototype for the dummy clone value should not
 * be checked.
 */
var handleError = function handleError(thrown, log, saveClone) {
  var msg = 'Encountered error while attempting to clone specific value. ' + 'The value will be "cloned" into an empty object. Error ' + 'encountered:';
  var error = castAsInstanceOf(thrown, Error);
  if (error) {
    error.message = "".concat(msg, " ").concat(error.message);
    var cause = error.cause ? {
      cause: error.cause
    } : undefined;
    var stack = error.stack ? error.stack : undefined;
    log.error(getError(error.message, cause, stack));
  } else {
    log.error(getError(msg, {
      cause: thrown
    }));
  }
  return {
    cloned: saveClone({}),
    ignoreProto: true
  };
};

/**
 * Error handler used for customizers or cloning methods.
 * This method always returns the value `false`, in case you would like to flag
 * that an error was thrown.
 * @param {Object} spec
 * @param {import('../../types').Log} spec.log
 * The logger.
 * @param {unknown} spec.error
 * The error thrown by the customizer/cloning method.
 * @param {boolean} [spec.doThrow]
 * Whether errors thrown by customizers/cloning methods should be thrown by
 * the algorithm.
 * @param {string} spec.name
 * Either 'Customizer' or 'Cloning method'.
 * @returns {boolean}
 */
var handleCustomError = function handleCustomError(_ref) {
  var log = _ref.log,
    thrown = _ref.error,
    doThrow = _ref.doThrow,
    name = _ref.name;
  if (doThrow === true) {
    throw thrown;
  }
  var msg = "".concat(name, " encountered error. Its results will be ignored for ") + 'the current value and the algorithm will proceed with ' + 'default behavior. ';
  var error = castAsInstanceOf(thrown, Error);
  if (error) {
    error.message = "".concat(msg, "Error encountered: ").concat(error.message);
    var cause = error.cause ? {
      cause: error.cause
    } : undefined;
    var stack = error.stack ? error.stack : undefined;
    log.error(getError(error.message, cause, stack));
  } else {
    log.error(getError(msg, {
      cause: error
    }));
  }
  return false;
};

/**
 * Performs last-minute pruning of the cloned value.
 * This function stores the cloned value in the clone store, check that
 * prototype is the same as the original value, and adds properties of the
 * original value to the queue.
 * @param {Object} spec
 * @param {any} spec.value
 * The value that was cloned.
 * @param {any} spec.cloned
 * The clone of `value`.
 * @param {boolean} spec.cloneIsCached
 * Whether the clone was acquired from the clone store.
 * @param {boolean|undefined} spec.ignoreProto
 * If tre, the algorithm will not ensure that `value` and `clone` share
 * prototypes.
 * @param {boolean|undefined} spec.ignoreProps
 * If true, the algorithm will not add additional values from the properties of
 * `value` to the queue.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {boolean} spec.useCloningMethod
 * Whether cloning methods will be observed.
 * @param {Map<any, any>} spec.cloneStore
 * A store of previously cloned values, used to resolve circular references.
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue storing all values to clone.
 * @param {boolean} [spec.asyncResult]
 * Whether the clone of this value was acquired asynchronously.
 */
var finalizeClone = function finalizeClone(_ref2) {
  var value = _ref2.value,
    cloned = _ref2.cloned,
    cloneIsCached = _ref2.cloneIsCached,
    ignoreProto = _ref2.ignoreProto,
    ignoreProps = _ref2.ignoreProps,
    propsToIgnore = _ref2.propsToIgnore,
    cloneStore = _ref2.cloneStore,
    queue = _ref2.queue,
    asyncResult = _ref2.asyncResult;
  if (!isObject(cloned) || cloneIsCached || asyncResult) {
    return;
  }
  cloneStore.set(value, cloned);
  if (!ignoreProto && getPrototype(cloned) !== getPrototype(value)) {
    Object.setPrototypeOf(cloned, getPrototype(value));
  }
  if (!ignoreProps && isObject(value)) {
    forAllOwnProperties(value, function (key) {
      if (propsToIgnore.includes(key)) {
        return;
      }
      var meta = Object.getOwnPropertyDescriptor(value, key);
      queue.push({
        value: !hasAccessor(meta) ? value[key] : undefined,
        parentOrAssigner: cloned,
        prop: key,
        metadata: meta
      });
    });
  }
};

/**
 * Ensures each clone has the correct extensibility/sealedness/frozenness.
 * @param {[any, any][]} isExtensibleSealFrozen
 */
var handleMetadata$1 = function handleMetadata(isExtensibleSealFrozen) {
  isExtensibleSealFrozen.forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      value = _ref4[0],
      cloned = _ref4[1];
    if (!Object.isExtensible(value)) {
      Object.preventExtensions(cloned);
    }
    if (Object.isSealed(value)) {
      Object.seal(cloned);
    }
    if (Object.isFrozen(value)) {
      Object.freeze(cloned);
    }
  });
};

/**
 * This symbol is used to indicate that the cloned value is the top-level object
 * that will be returned by {@link cloneDeepInternal}.
 * @type {symbol}
 */
var TOP_LEVEL = Symbol('TOP_LEVEL');

/**
 * Handles the task of assigning a cloned result using a property descriptor.
 * @template [T=any]
 * The type of the cloned value.
 * @param {Object} spec
 * @param {import('../../types').Log} spec.log
 * A logger.
 * @param {T} spec.cloned
 * The resultant cloned value.
 * @param {object} spec.parent
 * The object that will have a property assigned the cloned value.
 * @param {PropertyKey} spec.prop
 * The property of the parent object that will hold the cloned value.
 * @param {PropertyDescriptor} spec.metadata
 * The property descriptor.
 */
var handleMetadata = function handleMetadata(_ref) {
  var log = _ref.log,
    cloned = _ref.cloned,
    parent = _ref.parent,
    prop = _ref.prop,
    metadata = _ref.metadata;
  /** @type {PropertyDescriptor} */
  var clonedMetadata = {
    configurable: metadata.configurable,
    enumerable: metadata.enumerable
  };
  if (!hasAccessor(metadata)) {
    // `cloned` or getAccessor will determine the value
    clonedMetadata.value = cloned;

    // defineProperty throws if property with accessors is writable
    clonedMetadata.writable = metadata.writable;
  }
  if (typeof metadata.get === 'function') {
    clonedMetadata.get = metadata.get;
  }
  if (typeof metadata.set === 'function') {
    clonedMetadata.set = metadata.set;
  }
  if (hasAccessor(metadata)) {
    log.warn(getError("Cloning value with name ".concat(String(prop), " whose property ") + 'descriptor contains a get or set accessor.'));
  }
  Object.defineProperty(parent, prop, clonedMetadata);
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles the assignment of the cloned value to some persistent place.
 * @template U
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * A logger.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {any} spec.cloned
 * The cloned value.
 * @returns {any}
 * The cloned value.
 */
var assign = function assign(_ref2) {
  var globalState = _ref2.globalState,
    queueItem = _ref2.queueItem,
    cloned = _ref2.cloned;
  var container = globalState.container,
    log = globalState.log;
  var parentOrAssigner = queueItem.parentOrAssigner,
    prop = queueItem.prop,
    metadata = queueItem.metadata;
  if (parentOrAssigner === TOP_LEVEL) {
    container.clone = cloned;
  } else if (typeof parentOrAssigner === 'function') {
    parentOrAssigner(cloned, prop, metadata);
  } else if (_typeof(parentOrAssigner) === 'object' && (typeof prop === 'string' || _typeof(prop) === 'symbol') && isDefaultDescriptor(metadata)) {
    /** @type {{ [key: string|symbol|number]: any }} */
    var parent = parentOrAssigner;
    parent[prop] = cloned;
  } else if (_typeof(parentOrAssigner) === 'object' && typeof prop !== 'undefined' && _typeof(metadata) === 'object') {
    handleMetadata({
      log: log,
      cloned: cloned,
      parent: parentOrAssigner,
      prop: prop,
      metadata: metadata
    });
  }
  return cloned;
};

/**
 * Validates and processes any `additionalValues` from a customizer.
 * @param {Object} spec
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {import('../../utils/types').AdditionalValue[]} [spec.additionalValues]
 * Data associated with value that also will be cloned. This should only
 * represent data that is inaccessible via property access (like, for example,
 * the data in a Set or Map).
 * @param {boolean} [spec.asyncMode]
 * Whether the algorithm is run in async mode.
 * @param {import('../../types').QueueItem[]} spec.queue
 * The queue storing all values to clone.
 * @param {import('../../types').PendingResultItem[]} [spec.pendingResults]
 * The list of all clones that can only be acquired asynchronously.
 */
var handleAdditionalValues = function handleAdditionalValues(_ref) {
  var additionalValues = _ref.additionalValues,
    asyncMode = _ref.asyncMode,
    queue = _ref.queue,
    pendingResults = _ref.pendingResults;
  additionalValues === null || additionalValues === void 0 || additionalValues.forEach(function (additionalValueConfig) {
    var additionalValue = additionalValueConfig.value,
      assigner = additionalValueConfig.assigner,
      async = additionalValueConfig.async;
    if (!isObject(additionalValueConfig) || !isCallable(assigner)) {
      throw CloneError.IMPROPER_ADDITIONAL_VALUES;
    }
    if (async && !asyncMode) {
      throw CloneError.ADDITIONAL_VALUES_ASYNC_IN_SYNC_MODE;
    }
    if (async) {
      pendingResults === null || pendingResults === void 0 || pendingResults.push({
        queueItem: {
          parentOrAssigner: assigner
        },
        promise: Promise.resolve(additionalValue),
        propsToIgnore: []
      });
    } else {
      queue.push({
        value: additionalValueConfig.value,
        parentOrAssigner: additionalValueConfig.assigner
      });
    }
  });
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Processes the return value from the provided customizer.
 * This may have the side effect of saving the cloned value to some persistent
 * place, as well as pushing more elements in the appropriate queue if
 * necessary. Errors from the customizers are also handled here.
 * @param {Object} spec
 * @param {import('../../types').Customizer} spec.customizer
 * The customizer used to qualify the default behavior of cloneDeepInternal.
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * An array of properties of the given value that will not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     useCustomizerClone: boolean,
 *     ignoreProto: boolean|undefined,
 *     ignoreProps: boolean|undefined,
 *     async?: boolean
 * }}
 */
var handleCustomizer = function handleCustomizer(_ref) {
  var customizer = _ref.customizer,
    globalState = _ref.globalState,
    queueItem = _ref.queueItem,
    propsToIgnore = _ref.propsToIgnore,
    saveClone = _ref.saveClone;
  var log = globalState.log,
    queue = globalState.queue,
    pendingResults = globalState.pendingResults,
    doThrow = globalState.doThrow,
    asyncMode = globalState.async;
  var value = queueItem.value;

  /** @type {any} */
  var cloned;

  /** @type {boolean} */
  var useCustomizerClone = false;

  /** @type {import('../../utils/types').AdditionalValue[]|undefined} */
  var additionalValues;

  /** @type {boolean|undefined} */
  var ignoreProps;

  /** @type {boolean|undefined} */
  var ignoreProto;

  /** @type {boolean|undefined} */
  var async;

  /** @type {Error|undefined} */
  var throwWith;
  var forceThrow = false;
  try {
    var customResult = customizer(value, log);
    if (_typeof(customResult) !== 'object') {
      return {
        cloned: cloned,
        useCustomizerClone: false,
        ignoreProto: ignoreProto,
        ignoreProps: ignoreProps,
        async: async
      };
    }
    additionalValues = customResult.additionalValues;
    ignoreProps = customResult.ignoreProps;
    ignoreProto = customResult.ignoreProto;
    async = customResult.async;
    throwWith = customResult.throwWith;
    if (throwWith !== undefined) {
      forceThrow = true;
      throw throwWith;
    }
    useCustomizerClone = typeof customResult.useCustomizerClone === 'boolean' ? customResult.useCustomizerClone : true;
    if (!Array.isArray(additionalValues) && additionalValues !== undefined) {
      throw CloneError.IMPROPER_ADDITIONAL_VALUES;
    }
    if (async && !asyncMode) {
      throw CloneError.CUSTOMIZER_ASYNC_IN_SYNC_MODE;
    }
    if (customResult.propsToIgnore !== undefined && !isPropertyKeyArray(customResult.propsToIgnore)) {
      throw CloneError.CUSTOMIZER_IMPROPER_PROPS_TO_IGNORE;
    }
    if (Array.isArray(customResult.propsToIgnore) && isPropertyKeyArray(customResult.propsToIgnore)) {
      propsToIgnore.push.apply(propsToIgnore, _toConsumableArray(customResult.propsToIgnore));
    }
    if (!asyncMode) {
      cloned = saveClone(customResult.clone);
    } else {
      pendingResults === null || pendingResults === void 0 || pendingResults.push({
        queueItem: queueItem,
        promise: Promise.resolve(customResult.clone),
        ignoreProto: ignoreProto,
        ignoreProps: ignoreProps,
        propsToIgnore: []
      });
    }
    handleAdditionalValues({
      queueItem: queueItem,
      additionalValues: additionalValues,
      asyncMode: asyncMode,
      queue: queue,
      pendingResults: pendingResults
    });
  } catch (error) {
    useCustomizerClone = handleCustomError({
      log: log,
      error: error,
      doThrow: doThrow || forceThrow,
      name: 'Customizer'
    });
  }
  return {
    cloned: cloned,
    useCustomizerClone: useCustomizerClone,
    ignoreProto: ignoreProto,
    ignoreProps: ignoreProps,
    async: async
  };
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles Web API types that can only be cloned asynchronously.
 * @param {Object} spec
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag for the value.
 * @param {(promise: Promise<any>, options?: {
 *     ignoreProps?: boolean,
 *     ignoreProto?: boolean
 * }) => void} spec.pushPendingResult
 * A callback which adds the given promise to the list of pendingResults.
 * @returns {boolean}
 */
var handleAsyncWebTypes = function handleAsyncWebTypes(_ref) {
  var queueItem = _ref.queueItem,
    tag = _ref.tag,
    pushPendingResult = _ref.pushPendingResult;
  var value = queueItem.value;
  var asyncWebTypeDetected = true;
  if (Tag.IMAGEBITMAP === tag) {
    /** @type {ImageBitmap} */
    var imageBitmap = value;
    pushPendingResult(createImageBitmap(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height));
  } else {
    asyncWebTypeDetected = false;
  }
  return asyncWebTypeDetected;
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag of the provided value.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     nativeTypeDetected: boolean
 * }}
 */
var handleEcmaTypes = function handleEcmaTypes(_ref) {
  var globalState = _ref.globalState,
    queueItem = _ref.queueItem,
    tag = _ref.tag,
    propsToIgnore = _ref.propsToIgnore,
    saveClone = _ref.saveClone;
  var performanceConfig = globalState.performanceConfig,
    log = globalState.log,
    queue = globalState.queue,
    isExtensibleSealFrozen = globalState.isExtensibleSealFrozen,
    supportedPrototypes = globalState.supportedPrototypes;
  var value = queueItem.value,
    parentOrAssigner = queueItem.parentOrAssigner,
    prop = queueItem.prop;

  /** @type {any} */
  var cloned;
  var ignoreProps = false;
  var ignoreProto = false;
  var nativeTypeDetected = true;

  // We won't clone weakmaps or weaksets (or their prototypes).
  if ([Tag.WEAKMAP, Tag.WEAKSET].includes(tag)) {
    throw tag === Tag.WEAKMAP ? CloneError.WEAKMAP : CloneError.WEAKSET;

    // Ordinary objects, or the rare `arguments` clone.
    // Also, treat prototypes like ordinary objects. The tag wrongly
    // indicates that prototypes are instances of themselves.
  } else if ([Tag.OBJECT, Tag.ARGUMENTS].includes(tag) || supportedPrototypes.includes(value)) {
    cloned = saveClone(Object.create(getPrototype(value)));

    // We only copy functions if they are methods.
  } else if (typeof value === 'function') {
    cloned = saveClone(parentOrAssigner !== TOP_LEVEL ? value : Object.create(Function.prototype));
    log.warn("Attempted to clone function" + "".concat(typeof prop === 'string' ? " with name ".concat(prop) : '', ". JavaScript functions cannot be reliably ") + 'cloned. If this function is a method, it will be copied ' + 'directly. If this is the top-level object being cloned, ' + 'then an empty object will be returned.');
    ignoreProps = true;
    ignoreProto = true;
  } else if (Array.isArray(value)) {
    cloned = saveClone(new Array(value.length));
  } else if ([Tag.BOOLEAN, Tag.DATE].includes(tag)) {
    /** @type {BooleanConstructor|DateConstructor} */
    var BooleanOrDateConstructor = tag === Tag.DATE ? Date : Boolean;
    cloned = saveClone(new BooleanOrDateConstructor(Number(value)));
  } else if ([Tag.NUMBER, Tag.STRING].includes(tag)) {
    /** @type {NumberConstructor|StringConstructor} */
    var NumberOrStringConstructor = tag === Tag.NUMBER ? Number : String;
    cloned = saveClone(new NumberOrStringConstructor(value));

    // `typeof Object(Symbol("foo"))` is `"object"
  } else if (Tag.SYMBOL === tag) {
    /** @type {Symbol} */
    var symbol = value;
    cloned = saveClone(Object(Symbol.prototype.valueOf.call(symbol)));

    // `typeof Object(BigInt(3))` is `"object"
  } else if (Tag.BIGINT === tag) {
    /** @type {BigInt} */
    var bigint = value;
    cloned = saveClone(Object(BigInt.prototype.valueOf.call(bigint)));
  } else if (Tag.REGEXP === tag) {
    /** @type {RegExp} */
    var regExp = value;
    cloned = saveClone(new RegExp(regExp.source, regExp.flags));
  } else if (Tag.ERROR === tag) {
    /** @type {Error} */
    var error = value;

    /** @type {Error} */
    var clonedError;
    if (error.name === 'AggregateError') {
      /** @type {AggregateError} */
      var aggregateError = value;
      var errors = isIterable(aggregateError.errors) ? aggregateError.errors : [];
      if (!isIterable(aggregateError.errors)) {
        log.warn(CloneError.IMPROPER_AGGREGATE_ERRORS);
      }
      var cause = aggregateError.cause;
      var message = aggregateError.message;
      clonedError = cause === undefined ? new AggregateError(errors, message) : new AggregateError(errors, message, {
        cause: cause
      });
    } else {
      /** @type {import('../../utils/types').AtomicErrorConstructor} */
      var ErrorConstructor = getAtomicErrorConstructor(error, log);
      var _cause = error.cause;
      clonedError = _cause === undefined ? new ErrorConstructor(error.message) : new ErrorConstructor(error.message, {
        cause: _cause
      });
    }
    var defaultDescriptor = Object.getOwnPropertyDescriptor(new Error(), 'stack');
    var set = _typeof(defaultDescriptor) === 'object' ? defaultDescriptor.set : undefined;
    queue.push({
      value: error.stack,
      /** @param {any} clonedValue */parentOrAssigner: function parentOrAssigner(clonedValue) {
        isExtensibleSealFrozen.push([error.stack, clonedValue]);
        Object.defineProperty(clonedError, 'stack', {
          enumerable: (defaultDescriptor === null || defaultDescriptor === void 0 ? void 0 : defaultDescriptor.enumerable) || false,
          get: function get() {
            return clonedValue;
          },
          set: set
        });
      }
    });
    cloned = saveClone(clonedError);
    propsToIgnore.push('stack');
  } else if (Tag.ARRAYBUFFER === tag) {
    var arrayBuffer = new ArrayBuffer(value.byteLength);
    new Uint8Array(arrayBuffer).set(new Uint8Array(value));
    cloned = saveClone(arrayBuffer);
  } else if (isTypedArray(value, tag, performanceConfig) || Tag.DATAVIEW === tag) {
    /** @type {import('../../utils/types').TypedArrayConstructor} */
    var TypedArray = getTypedArrayConstructor(tag, log);

    // copy data over to clone
    var buffer = new ArrayBuffer(value.buffer.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(value.buffer));
    cloned = saveClone(new TypedArray(buffer, value.byteOffset, value.length));
    for (var index = 0; index < cloned.length; index++) {
      propsToIgnore.push(String(index));
    }
  } else if (Tag.MAP === tag) {
    /** @type {Map<any, any>} */
    var originalMap = value;
    var cloneMap = new Map();
    cloned = saveClone(cloneMap);
    originalMap.forEach(function (subValue, key) {
      queue.push({
        value: subValue,
        /** @param {any} clonedValue */parentOrAssigner: function parentOrAssigner(clonedValue) {
          isExtensibleSealFrozen.push([subValue, clonedValue]);
          cloneMap.set(key, clonedValue);
        }
      });
    });
  } else if (Tag.SET === tag) {
    /** @type {Set<any>} */
    var originalSet = value;
    var cloneSet = new Set();
    cloned = saveClone(cloneSet);
    originalSet.forEach(function (subValue) {
      queue.push({
        value: subValue,
        /** @param {any} clonedValue */parentOrAssigner: function parentOrAssigner(clonedValue) {
          isExtensibleSealFrozen.push([subValue, clonedValue]);
          cloneSet.add(clonedValue);
        }
      });
    });
  } else if (Tag.PROMISE === tag) {
    /** @type {Promise<any>} */
    var promise = value;
    cloned = new Promise(function (resolve, reject) {
      promise.then(resolve)['catch'](reject);
    });
    saveClone(cloned);
  } else {
    nativeTypeDetected = false;
  }
  return {
    cloned: cloned,
    ignoreProps: ignoreProps,
    ignoreProto: ignoreProto,
    nativeTypeDetected: nativeTypeDetected
  };
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles Node types.
 * @param {Object} spec
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag for the value.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     nodeTypeDetected: boolean
 * }}
 */
var handleNodeTypes = function handleNodeTypes(_ref) {
  var queueItem = _ref.queueItem,
    tag = _ref.tag,
    saveClone = _ref.saveClone;
  var value = queueItem.value;
  var nodeTypeDetected = true;
  var cloned;
  if (Tag.BUFFER === tag) {
    /** @type {import('./types').Buffer} */
    var buffer = value;
    cloned = saveClone(buffer.slice());
  } else {
    nodeTypeDetected = false;
  }
  return {
    cloned: cloned,
    nodeTypeDetected: nodeTypeDetected
  };
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag of the provided value.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     webTypeDetected: boolean
 * }}
 */
var handleSyncWebTypes = function handleSyncWebTypes(_ref) {
  var globalState = _ref.globalState,
    queueItem = _ref.queueItem,
    tag = _ref.tag,
    propsToIgnore = _ref.propsToIgnore,
    saveClone = _ref.saveClone;
  var queue = globalState.queue,
    isExtensibleSealFrozen = globalState.isExtensibleSealFrozen;
  var value = queueItem.value;

  /** @type {any} */
  var cloned;
  var webTypeDetected = true;
  if (Tag.BLOB === tag) {
    /** @type {Blob} */
    var blob = value;
    cloned = saveClone(blob.slice());
  } else if (Tag.FILE === tag) {
    /** @type {File} */
    var file = value;
    cloned = saveClone(cloneFile(file));
  } else if (Tag.FILELIST === tag) {
    /** @type {FileList} */
    var fileList = value;

    /** @type {File[]} */
    var files = [];
    for (var index = 0; index < fileList.length; index++) {
      var _file = fileList.item(index);
      if (_file !== null) {
        files.push(cloneFile(_file));
      }
    }
    cloned = saveClone(createFileList.apply(void 0, files));
  } else if (Tag.DOMEXCEPTION === tag) {
    /** @type {DOMException} */
    var exception = value;
    var clonedException = new DOMException(exception.message, exception.name);
    var descriptor = Object.getOwnPropertyDescriptor(exception, 'stack');
    queue.push({
      value: exception.stack,
      /** @param {any} clonedValue */parentOrAssigner: function parentOrAssigner(clonedValue) {
        isExtensibleSealFrozen.push([exception.stack, clonedValue]);
        Object.defineProperty(clonedException, 'stack', {
          enumerable: (descriptor === null || descriptor === void 0 ? void 0 : descriptor.enumerable) || false,
          get: function get() {
            return clonedValue;
          }
        });
      }
    });
    cloned = saveClone(clonedException);
    propsToIgnore.push('stack');
  } else if (Tag.DOMMATRIX === tag) {
    /** @type {DOMMatrix} */
    var matrix = value;
    cloned = saveClone(matrix.scale(1));
  } else if (Tag.DOMMATRIXREADONLY === tag) {
    /** @type {DOMMatrixReadOnly} */
    var _matrix = value;
    cloned = _matrix.is2D ? new DOMMatrixReadOnly([_matrix.a, _matrix.b, _matrix.c, _matrix.d, _matrix.e, _matrix.f]) : new DOMMatrixReadOnly([_matrix.m11, _matrix.m12, _matrix.m13, _matrix.m14, _matrix.m21, _matrix.m22, _matrix.m23, _matrix.m24, _matrix.m31, _matrix.m32, _matrix.m33, _matrix.m34, _matrix.m41, _matrix.m42, _matrix.m43, _matrix.m44]);
    saveClone(cloned);
  } else if ([Tag.DOMPOINT, Tag.DOMPOINTREADONLY].includes(tag)) {
    /** @type {DOMPoint} */
    var domPoint = value;
    var Class = tag === Tag.DOMPOINT ? DOMPoint : DOMPointReadOnly;
    cloned = saveClone(Class.fromPoint(domPoint));
  } else if (Tag.DOMQUAD === tag) {
    /** @type {import('../../utils/types').DOMQuadExtended} */
    var quad = value;

    /** @type {import('../../utils/types').DOMQuadExtended} */
    cloned = new DOMQuad(quad.p1, quad.p2, quad.p3, quad.p4);
    ['p1', 'p2', 'p3', 'p4'].forEach(function (pointProperty) {
      /** @type {import('../../utils/types').DOMPointExtended} */
      var point = quad[pointProperty];
      forAllOwnProperties(point, function (key) {
        var meta = Object.getOwnPropertyDescriptor(point, key);
        queue.push({
          value: !hasAccessor(meta) ? point[key] : null,
          parentOrAssigner: cloned[pointProperty],
          prop: key,
          metadata: meta
        });
      });
    });
    saveClone(cloned);
  } else if ([Tag.DOMRECT, Tag.DOMRECTREADONLY].includes(tag)) {
    /** @type {DOMRect|DOMRectReadOnly} */
    var domRect = value;
    var _Class = tag === Tag.DOMRECT ? DOMRect : DOMRectReadOnly;
    cloned = saveClone(_Class.fromRect(domRect));
  } else if (Tag.IMAGEDATA === tag) {
    /** @type {ImageData} */
    var imageData = value;

    // ImageData::data is read-only so clone it now instead of later
    propsToIgnore.push('data');
    var dataArray = Uint8ClampedArray.from(imageData.data);
    cloned = saveClone(new ImageData(dataArray, imageData.width, imageData.height, {
      colorSpace: imageData.colorSpace
    }));
  } else if ([Tag.AUDIODATA, Tag.VIDEOFRAME].includes(tag)) {
    /** @type {import('./types').AudioData | import('./types').VideoFrame} */
    var data = value;
    cloned = saveClone(data.clone());
  } else {
    webTypeDetected = false;
  }
  return {
    cloned: cloned,
    webTypeDetected: webTypeDetected
  };
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {string} spec.tag
 * The tag for the value.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean|undefined,
 *     ignoreProto: boolean|undefined
 * }}
 */
var handleTag = function handleTag(_ref) {
  var globalState = _ref.globalState,
    queueItem = _ref.queueItem,
    tag = _ref.tag,
    propsToIgnore = _ref.propsToIgnore,
    saveClone = _ref.saveClone;
  var log = globalState.log,
    pendingResults = globalState.pendingResults,
    async = globalState.async;
  var cloned;
  var ignoreProps;
  var ignoreProto;
  try {
    /** @type {boolean|undefined} */
    var nodeTypeDetected;

    /** @type {boolean|undefined} */
    var nativeTypeDetected;

    /** @type {boolean|undefined} */
    var webTypeDetected;

    /** @type {boolean|undefined} */
    var asyncWebTypeDetected;
    var _handleNodeTypes = handleNodeTypes({
      queueItem: queueItem,
      tag: tag,
      saveClone: saveClone
    });
    cloned = _handleNodeTypes.cloned;
    nodeTypeDetected = _handleNodeTypes.nodeTypeDetected;
    if (!nodeTypeDetected) {
      var _handleEcmaTypes = handleEcmaTypes({
        globalState: globalState,
        queueItem: queueItem,
        tag: tag,
        propsToIgnore: propsToIgnore,
        saveClone: saveClone
      });
      cloned = _handleEcmaTypes.cloned;
      ignoreProps = _handleEcmaTypes.ignoreProps;
      ignoreProto = _handleEcmaTypes.ignoreProto;
      nativeTypeDetected = _handleEcmaTypes.nativeTypeDetected;
    }
    if (!nodeTypeDetected && !nativeTypeDetected) {
      var _handleSyncWebTypes = handleSyncWebTypes({
        globalState: globalState,
        queueItem: queueItem,
        tag: tag,
        propsToIgnore: propsToIgnore,
        saveClone: saveClone
      });
      cloned = _handleSyncWebTypes.cloned;
      webTypeDetected = _handleSyncWebTypes.webTypeDetected;
    }
    if (async && !nodeTypeDetected && !nativeTypeDetected && !webTypeDetected) {
      /**
       * Pushes the given promise into the list of pending results.
       * @param {Promise<any>} promise
       */
      var pushPendingResult = function pushPendingResult(promise) {
        pendingResults === null || pendingResults === void 0 || pendingResults.push({
          queueItem: queueItem,
          promise: promise,
          propsToIgnore: propsToIgnore
        });
      };
      asyncWebTypeDetected = handleAsyncWebTypes({
        queueItem: queueItem,
        tag: tag,
        pushPendingResult: pushPendingResult
      });
    }
    if (!nodeTypeDetected && !nativeTypeDetected && !webTypeDetected && !asyncWebTypeDetected) {
      throw CloneError.UNSUPPORTED_TYPE;
    }
  } catch (error) {
    var _handleError = handleError(error, log, saveClone);
    cloned = _handleError.cloned;
    ignoreProto = _handleError.ignoreProto;
  }
  return {
    cloned: cloned,
    ignoreProps: ignoreProps,
    ignoreProto: ignoreProto
  };
};

/** @typedef {import('../../utils/types').Assigner} Assigner */

/**
 * Handles the return value from a cloning method.
 * @param {Object} spec
 * @param {import('./global-state.js').GlobalState} spec.globalState
 * The fundamental data structures used for cloneDeep.
 * @param {import('../../types').QueueItem} spec.queueItem
 * Describes the value and metadata of the data being cloned.
 * @param {(string|symbol)[]} spec.propsToIgnore
 * A list of properties under this value that should not be cloned.
 * @param {(clone: any) => any} spec.saveClone
 * A function which stores the clone of `value` into the cloned object.
 * @returns {{
 *     cloned: any,
 *     ignoreProps: boolean,
 *     ignoreProto: boolean,
 *     useCloningMethod: boolean,
 *     async?: boolean
 * }}
 */
var handleCloningMethods = function handleCloningMethods(_ref) {
  var globalState = _ref.globalState,
    queueItem = _ref.queueItem,
    propsToIgnore = _ref.propsToIgnore,
    saveClone = _ref.saveClone;
  var log = globalState.log,
    pendingResults = globalState.pendingResults,
    parentObjectRegistry = globalState.parentObjectRegistry,
    asyncMode = globalState.async,
    doThrow = globalState.doThrow;
  var value = queueItem.value;

  /** @type {any} */
  var cloned;
  var ignoreProps = false;
  var ignoreProto = false;
  var useCloningMethod = true;

  /** @type {boolean|undefined} */
  var async;

  /** @type {Error|undefined} */
  var throwWith;
  var forceThrow = false;
  try {
    if (!isCallable(value[CLONE])) {
      return {
        cloned: cloned,
        ignoreProps: ignoreProps,
        ignoreProto: ignoreProto,
        useCloningMethod: false,
        async: async
      };
    }
    if (checkParentObjectRegistry(value, parentObjectRegistry)) {
      return {
        cloned: cloned,
        ignoreProps: ignoreProps,
        ignoreProto: ignoreProto,
        useCloningMethod: false,
        async: async
      };
    }

    /** @type {import('../../utils/types').CloningMethodResult} */
    var result = value[CLONE](value, log);
    if (!isObject(result)) {
      return {
        cloned: cloned,
        ignoreProps: ignoreProps,
        ignoreProto: ignoreProto,
        useCloningMethod: false,
        async: async
      };
    }
    if (result.throwWith !== undefined) {
      forceThrow = true;
      throw throwWith;
    }
    if (result.async && !asyncMode) {
      throw CloneError.CLONING_METHOD_ASYNC_IN_SYNC_MODE;
    }
    if (result.propsToIgnore !== undefined && !isPropertyKeyArray(result.propsToIgnore)) {
      throw CloneError.CLONING_METHOD_IMPROPER_PROPS_TO_IGNORE;
    }
    if (typeof result.useCloningMethod === 'boolean') {
      useCloningMethod = result.useCloningMethod;
    }
    if (typeof result.ignoreProps === 'boolean') {
      ignoreProps = result.ignoreProps;
    }
    if (typeof result.ignoreProto === 'boolean') {
      ignoreProto = result.ignoreProto;
    }
    if (Array.isArray(result.propsToIgnore) && isPropertyKeyArray(result.propsToIgnore)) {
      propsToIgnore.push.apply(propsToIgnore, _toConsumableArray(result.propsToIgnore));
    }
    if (!result.async) {
      cloned = saveClone(result.clone);
    } else {
      async = true;
      pendingResults === null || pendingResults === void 0 || pendingResults.push({
        queueItem: queueItem,
        promise: Promise.resolve(result.clone),
        ignoreProto: ignoreProto,
        ignoreProps: ignoreProps,
        propsToIgnore: propsToIgnore
      });
    }
  } catch (error) {
    useCloningMethod = handleCustomError({
      log: log,
      error: error,
      doThrow: doThrow || forceThrow,
      name: 'Cloning method'
    });
  }
  return {
    cloned: cloned,
    ignoreProps: ignoreProps,
    ignoreProto: ignoreProto,
    useCloningMethod: useCloningMethod,
    async: async
  };
};

/** @typedef {new (...args: any[]) => any} Constructor */

/**
 * Convenience array used for `getTag`.
 * @type {Array<[Constructor|string, string, string, ...any]>}
 */
var classesToTypeCheck = [
// "standard" classes
['ArrayBuffer', 'slice', Tag.ARRAYBUFFER], ['BigInt', 'valueOf', Tag.BIGINT], [Boolean, 'valueOf', Tag.BOOLEAN], [Date, 'getUTCMilliseconds', Tag.DATE], [Function, 'bind', Tag.FUNCTION], [Map, 'has', Tag.MAP], [Number, 'valueOf', Tag.NUMBER], ['Promise', 'then', Tag.PROMISE], [RegExp, 'exec', Tag.REGEXP], ['Set', 'has', Tag.SET], [String, 'valueOf', Tag.STRING], ['Symbol', 'valueOf', Tag.SYMBOL], ['WeakMap', 'has', Tag.WEAKMAP], ['WeakSet', 'has', Tag.WEAKSET],
// ArrayBuffer, DataView and TypedArrays
['DataView', 'getInt8', Tag.DATAVIEW],
// Web APIs
['AudioData', 'allocationSize', Tag.AUDIODATA, {
  planeIndex: 1
}], ['Blob', 'clone', Tag.BLOB], ['DOMQuad', 'toJSON', Tag.DOMQUAD], ['FileList', 'item', Tag.FILELIST, 0], ['VideoFrame', 'allocationSize', Tag.VIDEOFRAME, 0],
// Node types
['Buffer', 'toString', Tag.BUFFER]];

/**
 * Convenience array used for `getTag`.
 * Certain classes that require special handling to type check are handled here.
 * @type {Array<[(value: any) => boolean, string]>}
 */
var typeCheckers = [[isDOMException, Tag.DOMEXCEPTION], [isDOMMatrix, Tag.DOMMATRIX], [isDOMMatrixReadOnly, Tag.DOMMATRIXREADONLY], [isDOMPoint, Tag.DOMPOINT], [isDOMPointReadOnly, Tag.DOMPOINTREADONLY], [isDOMRect, Tag.DOMRECT], [isDOMRectReadOnly, Tag.DOMRECTREADONLY], [isFile, Tag.FILE], [isImageBitmap, Tag.IMAGEBITMAP], [isImageData, Tag.IMAGEDATA]];

/**
 * Gets a "tag", which is an string which identifies the type of a value.
 *
 * `Object.prototype.toString` returns a string like `"[object <Type>]"`,  where
 * `"<Type>"` is the type of the object. We refer this return value as the
 * **tag**. Normally, the tag is determined by what `this[Symbol.toStringTag]`
 * is, but the JavaScript specification for `Object.prototype.toString` requires
 * that many native JavaScript objects return a specific tag if the object does
 * not have the `Symbol.toStringTag` property. Also, classes introduced after
 * ES6 typically have their own non-writable `Symbol.toStringTag` property. This
 * makes `Object.prototype.toString.call` a stronger type-check that
 * `instanceof`.
 *
 * @example
 * ```
 * const array = new Array();
 *
 * console.log(array instanceof Array);
 * // true
 *
 * console.log(Object.prototype.toString.call(array));
 * // "[object Array]"
 *
 *
 * const arraySubclass = Object.create(Array.prototype);
 *
 * console.log(arraySubclass instance Array);
 * // true;
 *
 * console.log(Object.prototype.toString.call(arraySubclass));
 * // "[object Object]"
 *
 *
 * // Note this is not a perfect type check because we can do:
 * arraySubclass[Symbol.toStringTag] = "Array"
 * console.log(Object.prototype.toString.call(arraySubclass));
 * // "[object Array]"
 * ```
 *
 * However, most native classes will throw if their prototype methods are called
 * on an object that wasn't called with the appropriate constructor function.
 * This can be used as a stronger type check than
 * `Object.prototype.toString.call` on classes where this is applicable.
 *
 * @example
 * ```
 * const isMap = value => {
 *     try {
 *         Map.prototype.has.call(value);
 *         return true;
 *     }
 *     catch {
 *         return false;
 *     }
 * }
 *
 * console.log(isMap(new Map()));
 * // true
 *
 * console.log(isMap(Object.create(Map.prototype)));
 * // false
 *
 * console.log(isMap({ [Symbol.toStringTag]: "Map" }));
 * // false
 * ```
 *
 * Some classes don't have any native instances, but instead have properties
 * with get/set accessors. These accessors typically throw if bound to incorrect
 * instances so we can use a nearly equivalent technique for them.
 *
 * Currently, only Array, Error subclasses, and TypedArray subclasses are having
 * their tag retrieved from `Object.prototype.toString.call`. All other classes
 * are checked by binding the given value to the appropriate prototype method or
 * accessor function. No matter which method is used, we return the tag
 * associated with the detected class.
 *
 * Since calling prototype methods can be expensive, it is possible to call this
 * function is such a way that `Object.prototype.toString.call` is solely used
 * to determine tags using the `performanceConfig.robustTypeChecking` parameter.
 *
 * @param {any} value
 * The value to get the tag of.
 * Whether type-checking should be done performantly.
 * @param {import('./global-state.js').GlobalState} globalState
 * The global application state.
 * @returns {string} tag
 * A string indicating the value's type.
 */
var getTag = function getTag(value, globalState) {
  var performanceConfig = globalState.performanceConfig,
    supportedConstructors = globalState.supportedConstructors;
  if ((performanceConfig === null || performanceConfig === void 0 ? void 0 : performanceConfig.robustTypeChecking) !== true) {
    if (isBuffer(value, supportedConstructors)) {
      return Tag.BUFFER;
    }
    return toStringTag(value);
  }

  /** @type {undefined|string} */
  var result;
  classesToTypeCheck.some(function (_ref) {
    var _ref2 = _toArray(_ref),
      constructorOrString = _ref2[0],
      method = _ref2[1],
      tag = _ref2[2],
      args = _ref2.slice(3);
    var constructor = typeof constructorOrString === 'string' ? supportedConstructors[constructorOrString] : constructorOrString;
    if (constructor === undefined) {
      return false; // continue iterating
    }
    try {
      var _constructor$prototyp;
      (_constructor$prototyp = constructor.prototype[method]).call.apply(_constructor$prototyp, [value].concat(_toConsumableArray(args)));
      result = tag;
      return true; // stop iterating
    } catch (_unused) {
      return false; // continue iterating
    }
  });
  if (result === undefined) {
    typeCheckers.some(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        typeChecker = _ref4[0],
        tag = _ref4[1];
      if (typeChecker(value)) {
        result = tag;
        return true; // stop iterating
      }
      return false; // continue iterating
    });
  }
  return result || toStringTag(value);
};

/**
 * Iterate through all items in the queue.
 * @param {import('./global-state.js').GlobalState} globalState
 * The global application state.
 */
var processQueue = function processQueue(globalState) {
  var queue = globalState.queue,
    customizer = globalState.customizer,
    cloneStore = globalState.cloneStore,
    isExtensibleSealFrozen = globalState.isExtensibleSealFrozen,
    ignoreCloningMethods = globalState.ignoreCloningMethods;
  var _loop = function _loop(queueItem) {
    var value = queueItem.value;

    /**
     * A shortcut for conveniently using {@link assign}.
     * @param {any} clonedValue
     * @returns {any}
     */
    var saveClone = function saveClone(clonedValue) {
      return assign({
        globalState: globalState,
        queueItem: {
          value: queueItem === null || queueItem === void 0 ? void 0 : queueItem.value,
          parentOrAssigner: queueItem === null || queueItem === void 0 ? void 0 : queueItem.parentOrAssigner,
          prop: queueItem === null || queueItem === void 0 ? void 0 : queueItem.prop,
          metadata: queueItem === null || queueItem === void 0 ? void 0 : queueItem.metadata
        },
        cloned: clonedValue
      });
    };

    /**
     * Will contain the cloned object.
     * @type {any}
     */
    var cloned;

    /** Whether the clone for this value has been cached in the store. */
    var cloneIsCached = false;

    /**
     * If true, do not not clone the properties of value.
     * @type {boolean|undefined}
     */
    var ignoreProps = false;

    /**
     * If true, do not have `cloned` share the prototype of `value`.
     * @type {boolean|undefined}
     */
    var ignoreProto = false;

    /** Whether the provided value is a non-object. */
    var isPrimitive = !isObject(value);

    /** Is true if the provided value has a valid cloning method. */
    var useCloningMethod = false;

    /** Is true if the customizer determines the value of `cloned`. */
    var useCustomizerClone = false;

    /**
     * Is true if the clone will be resolved asynchronously.
     * @type {boolean|undefined}
     */
    var asyncResult;

    /**
     * Any properties in `value` added here will not be cloned.
     * @type {(string|symbol)[]}
     */
    var propsToIgnore = [];

    /** Identifies the type of the value. */
    var tag = getTag(value, globalState);
    cloneIsCached = checkCloneStore(value, cloneStore, saveClone);
    if (!cloneIsCached && typeof customizer === 'function') {
      var _handleCustomizer = handleCustomizer({
        customizer: customizer,
        globalState: globalState,
        queueItem: queueItem,
        propsToIgnore: propsToIgnore,
        saveClone: saveClone
      });
      cloned = _handleCustomizer.cloned;
      useCustomizerClone = _handleCustomizer.useCustomizerClone;
      ignoreProto = _handleCustomizer.ignoreProto;
      ignoreProps = _handleCustomizer.ignoreProps;
      asyncResult = _handleCustomizer.async;
    }
    if (!useCustomizerClone && isPrimitive) {
      saveClone(value);
    }
    var ignore = cloneIsCached || useCustomizerClone || isPrimitive;
    if (!ignore && !ignoreCloningMethods) {
      var cloningMethodResult = handleCloningMethods({
        globalState: globalState,
        queueItem: queueItem,
        propsToIgnore: propsToIgnore,
        saveClone: saveClone
      });
      cloned = cloningMethodResult.cloned;
      useCloningMethod = cloningMethodResult.useCloningMethod;
      asyncResult = cloningMethodResult.async;
      ignoreProps || (ignoreProps = cloningMethodResult.ignoreProps);
      ignoreProto || (ignoreProto = cloningMethodResult.ignoreProto);
    }
    if (!ignore && !useCloningMethod) {
      var handleTagResult = handleTag({
        globalState: globalState,
        queueItem: queueItem,
        tag: tag,
        propsToIgnore: propsToIgnore,
        saveClone: saveClone
      });
      cloned = handleTagResult.cloned;
      ignoreProps || (ignoreProps = handleTagResult.ignoreProps);
      ignoreProto || (ignoreProto = handleTagResult.ignoreProto);
    }
    isExtensibleSealFrozen.push([value, cloned]);
    finalizeClone({
      value: value,
      cloneStore: cloneStore,
      queue: queue,
      cloned: cloned,
      cloneIsCached: cloneIsCached,
      ignoreProto: ignoreProto,
      ignoreProps: ignoreProps,
      useCloningMethod: useCloningMethod,
      propsToIgnore: propsToIgnore,
      asyncResult: asyncResult
    });
  };
  for (var queueItem = queue.shift(); queueItem; queueItem = queue.shift()) {
    _loop(queueItem);
  }
};

/**
 * Processes pending results.
 * @param {import('./global-state.js').GlobalState} globalState
 */
var processPendingResults = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(globalState) {
    var log, queue, cloneStore, pendingResults, clones;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          log = globalState.log, queue = globalState.queue, cloneStore = globalState.cloneStore, pendingResults = globalState.pendingResults;
          _context.next = 3;
          return Promise.allSettled(pendingResults.map(function (result) {
            return result.promise;
          }));
        case 3:
          clones = _context.sent;
          clones.forEach(function (clone, i) {
            /** @type {any} */
            var cloned;
            var result = pendingResults[i];
            if (clone.status === 'rejected') {
              log.warn(getError('Promise rejected' + (result.queueItem.prop !== undefined ? ' for value assigned to property ' + "\"".concat(String(result.queueItem.prop), "\". ") : '. ') + 'This value will be cloned into an empty object.', {
                cause: clone.reason
              }));
              cloned = {};
            } else {
              cloned = clone.value;
            }
            assign({
              globalState: globalState,
              queueItem: result.queueItem,
              cloned: cloned
            });
            finalizeClone({
              value: result.queueItem.value,
              cloned: cloned,
              cloneIsCached: false,
              ignoreProto: result.ignoreProto,
              ignoreProps: result.ignoreProps,
              useCloningMethod: false,
              propsToIgnore: result.propsToIgnore,
              cloneStore: cloneStore,
              queue: queue
            });
          });
          pendingResults.length = 0;
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function processPendingResults(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Container for various data structures often used in cloneDeep.
 */
var GlobalState = /*#__PURE__*/_createClass(
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
 * @param {import('./types').PerformanceConfig} [spec.performanceConfig]
 * Whether or not type-checking will be more performant.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods should even be considered.
 * @param {boolean} spec.doThrow
 * Whether errors in the customizer should cause the function to throw.
 * @param {boolean} [spec.async]
 * Whether the algorithm will return the clone asynchronously.
 */
function GlobalState(_ref) {
  var value = _ref.value,
    log = _ref.log,
    customizer = _ref.customizer,
    parentObjectRegistry = _ref.parentObjectRegistry,
    performanceConfig = _ref.performanceConfig,
    ignoreCloningMethods = _ref.ignoreCloningMethods,
    doThrow = _ref.doThrow,
    async = _ref.async;
  _classCallCheck(this, GlobalState);
  /**
   * Contains the cloned value.
   * @type {{ clone: any }}
   * @readonly
   */
  _defineProperty(this, "container", void 0);
  /**
   * Will be used to store cloned values so that we don't loop infinitely on
   * circular references.
   * @readonly
   */
  _defineProperty(this, "cloneStore", new Map());
  /**
   * A queue so we can avoid recursion.
   * @type {import('../../types').QueueItem[]}
   * @readonly
   */
  _defineProperty(this, "queue", void 0);
  /**
   * A list. Each item contains a promise which resolves to the clone of a
   * value, as well as metadata for that clone.
   * @type import('../../types').PendingResultItem[]}
   * @readonly
   */
  _defineProperty(this, "pendingResults", []);
  /**
   * We will do a second pass through everything to check Object.isExtensible,
   * Object.isSealed and Object.isFrozen. We do it last so we don't run into
   * issues where we append properties on a frozen object, etc.
   * @type {Array<[any, any]>}
   * @readonly
   */
  _defineProperty(this, "isExtensibleSealFrozen", []);
  /**
   * An optional function which customizes the behavior of CloneDeep.
   * @type {import('../../types').Customizer|undefined}
   * @readonly
   */
  _defineProperty(this, "customizer", void 0);
  /**
   * An array of all prototypes of supported types in this runtime.
   * @type {any[]}
   * @readonly
   */
  _defineProperty(this, "supportedPrototypes", void 0);
  /**
   * An object mapping constructor names to the constructor itself, or
   * `undefined` if the constructor is not available in this runtime.
   * @type {Readonly<{ [key: string]: (new (...args: any[]) => any) | undefined }>}
   * @readonly
   */
  _defineProperty(this, "supportedConstructors", void 0);
  /**
   * This is used by cloneDeepFully to check if an object with a cloning
   * method is in the prototype of an object that was cloned earlier in the
   * chain.
   * @type {Set<any>|undefined}
   * @readonly
   */
  _defineProperty(this, "parentObjectRegistry", void 0);
  /**
   * Whether or not type-checking will be more performant.
   * @type {import('./types').PerformanceConfig|undefined}
   * @readonly
   */
  _defineProperty(this, "performanceConfig", void 0);
  /**
   * Whether cloning methods should even be considered.
   * @type {boolean}
   * @readonly
   */
  _defineProperty(this, "ignoreCloningMethods", void 0);
  /**
   * Whether errors in the customizer should cause the function to throw.
   * @type {boolean}
   * @readonly
   */
  _defineProperty(this, "doThrow", void 0);
  /**
   * Whether the algorithm will return the clone asynchronously.
   * @type {boolean|undefined}
   * @readonly
   */
  _defineProperty(this, "async", void 0);
  this.container = {
    clone: undefined
  };
  this.customizer = customizer;
  this.log = log;
  this.queue = [{
    value: value,
    parentOrAssigner: TOP_LEVEL
  }];
  this.supportedPrototypes = getSupportedPrototypes();
  this.supportedConstructors = getSupportedConstructors();
  this.parentObjectRegistry = parentObjectRegistry;
  this.performanceConfig = performanceConfig;
  this.ignoreCloningMethods = Boolean(ignoreCloningMethods);
  this.doThrow = Boolean(doThrow);
  this.async = Boolean(async);
  return new Proxy(this, {
    set: function set() {
      throw new TypeError('GlobalState properties are readonly!');
    }
  });
});

/**
 * Clones the provided value.
 * @template T
 * See CloneDeep.
 * @template [U = T]
 * See CloneDeep.
 * @param {Object} spec
 * @param {T} spec.value
 * The value to clone.
 * @param {import('../types').Customizer|undefined} spec.customizer
 * A customizer function.
 * @param {import('../types').Log} spec.log
 * Receives an error object for logging.
 * @param {import('./clone-deep-utils/types').PerformanceConfig} [spec.performanceConfig]
 * Whether or not type-checking will be more performant.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} spec.doThrow
 * Whether errors in the customizer should cause the function to throw.
 * @param {Set<any>} [spec.parentObjectRegistry]
 * This is used by cloneDeepFully to check if an object with a cloning method is
 * in the prototype of an object that was cloned earlier in the chain.
 * @param {boolean} [spec.async]
 * Whether or not the algorithm will return the clone asynchronously.
 * @returns {U | Promise<{ clone: U }>}
 */
var cloneDeepInternal = function cloneDeepInternal(_ref) {
  var value = _ref.value,
    customizer = _ref.customizer,
    log = _ref.log,
    performanceConfig = _ref.performanceConfig,
    ignoreCloningMethods = _ref.ignoreCloningMethods,
    doThrow = _ref.doThrow,
    parentObjectRegistry = _ref.parentObjectRegistry,
    async = _ref.async;
  var globalState = new GlobalState({
    value: value,
    log: log,
    customizer: customizer,
    parentObjectRegistry: parentObjectRegistry,
    performanceConfig: performanceConfig,
    ignoreCloningMethods: ignoreCloningMethods,
    doThrow: doThrow,
    async: async
  });
  if (!async) {
    var _globalState$performa;
    processQueue(globalState);
    if (((_globalState$performa = globalState.performanceConfig) === null || _globalState$performa === void 0 ? void 0 : _globalState$performa.ignoreMetadata) !== true) {
      handleMetadata$1(globalState.isExtensibleSealFrozen);
    }
    return globalState.container.clone;
  }

  /** @returns {Promise<void>} */
  var _processData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _globalState$performa2;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            processQueue(globalState);
            if (!(globalState.pendingResults.length > 0)) {
              _context.next = 6;
              break;
            }
            _context.next = 5;
            return processPendingResults(globalState);
          case 5:
            return _context.abrupt("return", _processData());
          case 6:
            if (((_globalState$performa2 = globalState.performanceConfig) === null || _globalState$performa2 === void 0 ? void 0 : _globalState$performa2.ignoreMetadata) !== true) {
              handleMetadata$1(globalState.isExtensibleSealFrozen);
            }
            _context.next = 12;
            break;
          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", Promise.reject(_context.t0));
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 9]]);
    }));
    return function processData() {
      return _ref2.apply(this, arguments);
    };
  }();
  return _processData().then(function () {
    return globalState.container;
  });
};

/** @typedef {import('./clone-deep-utils/types').PerformanceConfig} PerformanceConfig */

/** @typedef {import('../types').CloneDeepProxyOptions} CloneDeepProxyOptions */

/** @typedef {import('../types').CloneDeepOptions} CloneDeepOptions */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * @template T
 * The type of the input value.
 * @template [U = T]
 * The type of the return value, which by default is the same as `T`. Strictly
 * speaking it is possible for the types to differ because we don't support
 * all types, and customizers and cloning methods can arbitrarily manipulate
 * the resultant type of the clone. Provide this parameter if you know what you
 * are doing.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepProxyOptions} [options]
 * @param {object} [options]
 * @param {Customizer} options.customizer
 * Allows the user to inject custom logic. The function is given the value to
 * copy. If the function returns an object, the value of the `clone` property on
 * that object will be used as the clone.
 * @param {Log} options.log
 * Any errors which occur during the algorithm can optionally be passed to a log
 * function. `log` should take one argument which will be the error encountered.
 * Use this to log the error to a custom logger.
 * @param {PerformanceConfig} [options.performanceConfig]
 * Whether type-checking will be done performantly or robustly.
 * @param {boolean} options.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {string} options.logMode
 * Case-insensitive. If "silent", no warnings will be logged. Use with caution,
 * as failures to perform true clones are logged as warnings.
 * @param {boolean} options.letCustomizerThrow
 * If `true`, errors thrown by the customizer will be thrown by `cloneDeep`. By
 * default, the error is logged and the algorithm proceeds with default
 * behavior.
 * @param {boolean} options.async
 * If `true`, the function will return a promise that resolves with the cloned
 * object.
 * @returns {U | Promise<{ clone: U }>}
 * The deep copy.
 */
var cloneDeepProxy = function cloneDeepProxy(value, options) {
  var _log, _log2;
  /** @type {Customizer|undefined} */
  var customizer;

  /** @type {Log|undefined} */
  var log;

  /** @type {PerformanceConfig|undefined} */
  var performanceConfig;

  /** @type {string|undefined} */
  var logMode;

  /** @type {boolean|undefined} */
  var letCustomizerThrow = false;

  /** @type {boolean|undefined} */
  var ignoreCloningMethods = false;

  /** @type {boolean|undefined} */
  var async = false;
  if (options !== null && _typeof(options) === 'object') {
    customizer = options.customizer;
    log = options.log;
    performanceConfig = options.performanceConfig;
    logMode = options.logMode;
    ignoreCloningMethods = options.ignoreCloningMethods;
    letCustomizerThrow = options.letCustomizerThrow;
    async = options.async;
  }
  if (log === undefined || !isCallable((_log = log) === null || _log === void 0 ? void 0 : _log.warn) || !isCallable((_log2 = log) === null || _log2 === void 0 ? void 0 : _log2.error)) {
    log = defaultLog;
  }
  if (typeof logMode === 'string' && logMode.toLowerCase() === 'silent') {
    var noop = function noop() {};
    log = {
      warn: noop,
      error: noop
    };
  }

  /** @type {U | Promise<{ clone: U }>} */
  return cloneDeepInternal({
    value: value,
    customizer: customizer,
    log: log,
    performanceConfig: performanceConfig || {},
    ignoreCloningMethods: ignoreCloningMethods || false,
    doThrow: letCustomizerThrow || false,
    async: async || false
  });
};

/**
 * I should be able to use conditional types to correctly have
 * cloneDeepOptionsProxy return a promise or a non-promise without problems. But
 * it does not work. See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil casting to force the return to have the
 * correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for cloneDeepProxy.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepOptions} [options]
 * @returns {U}
 * See documentation for_cloneDeep.
 */
var cloneDeep = function cloneDeep(value, options) {
  if (options === null || _typeof(options) !== 'object') {
    options = {};
  }
  options.async = false;
  return /** @type {U} */cloneDeepProxy(value, options);
};

/**
 * I should be able to use conditional types to correctly have _cloneDeep return
 * a promise or a non-promise without problems. But it does not work.
 * See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil "casting" to force the return to have
 * the correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for cloneDeepProxy.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepOptions} [options]
 * @returns {Promise<{ clone: U }> }
 * See documentation for_cloneDeep..
 */
var cloneDeepAsync$1 = function cloneDeepAsync(value, options) {
  if (options === null || _typeof(options) !== 'object') {
    options = {};
  }
  options.async = true;
  return /** @type {Promise<{ clone: U }>} */cloneDeepProxy(value, options);
};

/** @typedef {import('../clone-deep/clone-deep-utils/types').PerformanceConfig} PerformanceConfig */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * Handles internal logic for the full deep clone.
 * @template [T=any]
 * The type of the input value.
 * @template [U = T]
 * The return type of the clone.
 * @param {Object} spec
 * @param {T} spec.value
 * The value to clone.
 * @param {Customizer|undefined} spec.customizer
 * A customizer that would qualify the default behavior of `cloneDeep`.
 * @param {Log} spec.log
 * A logger.
 * @param {string|undefined} spec.logMode
 * Either "silent" or "quiet". This will configure the behavior of the default
 * logger.
 * @param {PerformanceConfig} spec.performanceConfig
 * Whether type-checking will be performed performantly.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} spec.letCustomizerThrow
 * Whether errors from the customizer will be thrown by the algorithm.
 * @param {boolean} spec.force
 * If true, then prototypes with methods will be cloned.
 * @returns {U}
 */
var cloneDeepFullyInternal = function cloneDeepFullyInternal(_ref) {
  var value = _ref.value,
    customizer = _ref.customizer,
    log = _ref.log,
    logMode = _ref.logMode,
    performanceConfig = _ref.performanceConfig,
    ignoreCloningMethods = _ref.ignoreCloningMethods,
    letCustomizerThrow = _ref.letCustomizerThrow,
    force = _ref.force;
  /** @type {U} */
  var clone = cloneDeep(value, {
    customizer: customizer,
    log: log,
    logMode: logMode,
    performanceConfig: performanceConfig,
    ignoreCloningMethods: ignoreCloningMethods,
    letCustomizerThrow: letCustomizerThrow
  });

  /** @type {U} */
  var tempClone = clone;

  /** @type {any} */
  var tempOrig = value;
  var parentObjectRegistry = ignoreCloningMethods !== true ? new Set() : undefined;
  while (isObject(tempOrig) && Object.getPrototypeOf(tempOrig) !== null && (!hasMethods(Object.getPrototypeOf(tempOrig)) || force)) {
    if (ignoreCloningMethods !== true) {
      parentObjectRegistry === null || parentObjectRegistry === void 0 || parentObjectRegistry.add(tempOrig);
    }
    var newProto = cloneDeepInternal({
      value: Object.getPrototypeOf(tempOrig),
      customizer: customizer,
      log: log,
      performanceConfig: performanceConfig,
      ignoreCloningMethods: ignoreCloningMethods,
      doThrow: letCustomizerThrow,
      parentObjectRegistry: parentObjectRegistry,
      async: false
    });
    Object.setPrototypeOf(tempClone, newProto);
    tempClone = Object.getPrototypeOf(tempClone);
    tempOrig = Object.getPrototypeOf(tempOrig);
  }
  return clone;
};

/**
 * Handles internal logic for the full deep clone.
 * @template [T=any]
 * The type of the input value.
 * @template [U = T]
 * The return type of the clone.
 * @param {Object} spec
 * @param {T} spec.value
 * The value to clone.
 * @param {Customizer|undefined} spec.customizer
 * A customizer that would qualify the default behavior of `cloneDeep`.
 * @param {Log} spec.log
 * A logger.
 * @param {string|undefined} spec.logMode
 * Either "silent" or "quiet". This will configure the behavior of the default
 * logger.
 * @param {PerformanceConfig} spec.performanceConfig
 * Whether type-checking will be performed performantly.
 * @param {boolean} spec.ignoreCloningMethods
 * Whether cloning methods will be observed.
 * @param {boolean} spec.letCustomizerThrow
 * Whether errors from the customizer will be thrown by the algorithm.
 * @param {boolean} spec.force
 * If true, then prototypes with methods will be cloned.
 * @returns {Promise<{ clone: U }>}
 */
var cloneDeepFullyInternalAsync = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref2) {
    var value, customizer, log, logMode, performanceConfig, ignoreCloningMethods, letCustomizerThrow, force, _yield$cloneDeepAsync, clone, tempOrig, parentObjectRegistry, pendingCloneContainers, containers, _tempClone;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          value = _ref2.value, customizer = _ref2.customizer, log = _ref2.log, logMode = _ref2.logMode, performanceConfig = _ref2.performanceConfig, ignoreCloningMethods = _ref2.ignoreCloningMethods, letCustomizerThrow = _ref2.letCustomizerThrow, force = _ref2.force;
          _context.next = 3;
          return /** @type {Promise<{ clone: U }>} */(
            cloneDeepAsync$1(value, {
              customizer: customizer,
              log: log,
              logMode: logMode,
              performanceConfig: performanceConfig,
              ignoreCloningMethods: ignoreCloningMethods,
              letCustomizerThrow: letCustomizerThrow,
              async: true
            })
          );
        case 3:
          _yield$cloneDeepAsync = _context.sent;
          clone = _yield$cloneDeepAsync.clone;
          /** @type {any} */
          tempOrig = value;
          parentObjectRegistry = ignoreCloningMethods !== true ? new Set() : undefined;
          /** @type Promise<{ clone: any }>[]*/
          pendingCloneContainers = [];
          while (isObject(tempOrig) && Object.getPrototypeOf(tempOrig) !== null && (!hasMethods(Object.getPrototypeOf(tempOrig)) || force)) {
            if (ignoreCloningMethods !== true) {
              parentObjectRegistry === null || parentObjectRegistry === void 0 || parentObjectRegistry.add(tempOrig);
            }
            pendingCloneContainers.push(cloneDeepInternal({
              value: Object.getPrototypeOf(tempOrig),
              customizer: customizer,
              log: log,
              performanceConfig: performanceConfig,
              ignoreCloningMethods: ignoreCloningMethods,
              doThrow: letCustomizerThrow,
              parentObjectRegistry: parentObjectRegistry,
              async: true
            }));
            tempOrig = Object.getPrototypeOf(tempOrig);
          }
          _context.next = 12;
          return Promise.all(pendingCloneContainers);
        case 12:
          containers = _context.sent;
          _tempClone = clone;
          containers.forEach(function (_ref4) {
            var newProto = _ref4.clone;
            Object.setPrototypeOf(_tempClone, newProto);
            _tempClone = Object.getPrototypeOf(_tempClone);
          });
          return _context.abrupt("return", {
            clone: clone
          });
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function cloneDeepFullyInternalAsync(_x) {
    return _ref3.apply(this, arguments);
  };
}();

/** @typedef {import('../clone-deep/clone-deep-utils/types').PerformanceConfig} PerformanceConfig */

/** @typedef {import('../types').CloneDeepFullyProxyOptions} CloneDeepFullyProxyOptions */

/** @typedef {import('../types').CloneDeepFullyOptions} CloneDeepFullyOptions */

/** @typedef {import('../types').Customizer} Customizer */

/** @typedef {import('../types').Log} Log */

/**
 * Deeply clones the provided object and its prototype chain.
 * @template T
 * See the documentation for `cloneDeep`.
 * @template [U = T | Promise<{ clone: T }>]
 * See the documentation for `cloneDeep`.
 * @param {T} value
 * The object to clone.
 * @param {CloneDeepFullyProxyOptions} options
 * @param {object} options
 * @param {boolean} options.force
 * If `true`, prototypes with methods will be cloned. Normally, this function
 * stops if it reaches any prototype with methods.
 * @param {Customizer} options.customizer
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.ignoreCloningMethods
 * See the documentation for `cloneDeep`.
 * @param {Log} options.log
 * See the documentation for `cloneDeep`.
 * @param {PerformanceConfig} [options.performanceConfig]
 * See the documentation for `cloneDeep`.
 * @param {string} options.logMode
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.letCustomizerThrow
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.async
 * See the documentation for `cloneDeep`.
 * @returns {U | Promise<{ clone: U }>} The deep copy.
 */
var cloneDeepFullyProxy = function cloneDeepFullyProxy(value, options) {
  var customizer = options.customizer,
    log = options.log,
    logMode = options.logMode,
    performanceConfig = options.performanceConfig,
    ignoreCloningMethods = options.ignoreCloningMethods,
    letCustomizerThrow = options.letCustomizerThrow,
    force = options.force,
    async = options.async;
  if (!async) {
    return cloneDeepFullyInternal({
      value: value,
      customizer: customizer,
      log: log || defaultLog,
      logMode: logMode,
      performanceConfig: performanceConfig || {},
      ignoreCloningMethods: ignoreCloningMethods || false,
      letCustomizerThrow: letCustomizerThrow || false,
      force: force || false
    });
  }
  return cloneDeepFullyInternalAsync({
    value: value,
    customizer: customizer,
    log: log || defaultLog,
    logMode: logMode,
    performanceConfig: performanceConfig || {},
    ignoreCloningMethods: ignoreCloningMethods || false,
    letCustomizerThrow: letCustomizerThrow || false,
    force: force || false
  });
};

/**
 * I should be able to use conditional types to correctly have
 * cloneDeepFullyOptionsProxy return a promise or a non-promise without
 * problems. But it does not work. See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil "casting" to force the return to have
 * the correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for_cloneDeep.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepFullyOptions} [options]
 * @returns {U}
 * See documentation for_cloneDeep.
 */
var cloneDeepFully$1 = function cloneDeepFully(value, options) {
  if (options === null || _typeof(options) !== 'object') {
    options = {};
  }
  options.async = false;
  return /** @type {U} */cloneDeepFullyProxy(value, options);
};

/**
 * I should be able to use conditional types to correctly have
 * cloneDeepFullyOptionsProxy return a promise or a non-promise without
 * problems. But it does not work. See https://github.com/microsoft/TypeScript/issues/33912.
 * As a workaround, I perform some evil "casting" to force the return to have
 * the correct type.
 * @template T
 * The type of the input value.
 * @template [U = T]
 * See documentation for_cloneDeep.
 * @param {T} value
 * The value to deeply copy.
 * @param {CloneDeepFullyOptions} [options]
 * @returns {Promise<{ clone: U }> }
 * See documentation for_cloneDeep..
 */
var cloneDeepFullyAsync$1 = function cloneDeepFullyAsync(value, options) {
  if (options === null || _typeof(options) !== 'object') {
    options = {};
  }
  options.async = true;
  return /** @type {Promise<{ clone: U }>}*/(
    cloneDeepFullyProxy(value, options)
  );
};

/**
 * Creates a customizer which composes other customizers.
 * The customizers are executed in order. The first to return an object is used
 * as the result. If no customizer returns an object, undefined is returned.
 * @param {import('./types').Customizer[]} customizers
 * An array of customizer functions.
 * @returns {import('./types').Customizer}
 * A new customizer which composes the provided customizers.
 */
var useCustomizers$1 = function useCustomizers(customizers) {
  if (!Array.isArray(customizers) || customizers.some(function (func) {
    return typeof func !== 'function';
  })) {
    throw new Error('useCustomizers must receive an array of functions');
  }

  /**
   * @param {any} value
   * @returns {object|void}
   */
  return function combinedCustomizer(value) {
    var _iterator = _createForOfIteratorHelper(customizers),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var customizer = _step.value;
        var result = customizer(value);
        if (_typeof(result) === 'object') {
          return result;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
};

var cloneDeepAsync = cloneDeepAsync$1;
var cloneDeepFully = cloneDeepFully$1;
var cloneDeepFullyAsync = cloneDeepFullyAsync$1;
var useCustomizers = useCustomizers$1;

exports.CLONE = CLONE;
exports.cloneDeepAsync = cloneDeepAsync;
exports.cloneDeepFully = cloneDeepFully;
exports.cloneDeepFullyAsync = cloneDeepFullyAsync;
exports.default = cloneDeep;
exports.useCustomizers = useCustomizers;
