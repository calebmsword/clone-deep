"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedPrototypes = exports.forbiddenProps = exports["default"] = exports.Tag = void 0;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Contains the tag for various types.
 * @type {Object<string, string>}
 */
var Tag = exports.Tag = Object.freeze({
  ARGUMENTS: '[object Arguments]',
  ARRAY: '[object Array]',
  BOOLEAN: '[object Boolean]',
  DATE: '[object Date]',
  ERROR: '[object Error]',
  FUNCTION: "[object Function]",
  MAP: '[object Map]',
  NUMBER: '[object Number]',
  OBJECT: '[object Object]',
  REGEXP: '[object RegExp]',
  SET: '[object Set]',
  STRING: '[object String]',
  SYMBOL: '[object Symbol]',
  WEAKMAP: '[object WeakMap]',
  WEAKSET: "[object WeakSet]",
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
  BIGINT64: "[object BigInt64Array]",
  BIGUINT64: "[object BigUint64Array]"
});

/**
 * All prototypes of supported types.
 */
var supportedPrototypes = exports.supportedPrototypes = Object.freeze([Array.prototype, Boolean.prototype, Date.prototype, Error.prototype, Function.prototype, Map.prototype, Number.prototype, Object.prototype, RegExp.prototype, Set.prototype, String.prototype, Symbol.prototype, ArrayBuffer.prototype, DataView.prototype, Float32Array.prototype, Float64Array.prototype, Int8Array.prototype, Int16Array.prototype, Int32Array.prototype, Uint8Array.prototype, Uint8ClampedArray.prototype, Uint16Array.prototype, Uint32Array.prototype, BigInt64Array.prototype, BigUint64Array.prototype]);

/**
 * Some native prototypes have properties that cannot be accessed or reassigned.
 * All such properties are stored here.
 */
var forbiddenProps = exports.forbiddenProps = Object.freeze(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Tag.FUNCTION, {
  prototype: Function.prototype,
  properties: ["caller", "callee", "arguments"]
}), Tag.MAP, {
  prototype: Map.prototype,
  properties: ["size"]
}), Tag.SET, {
  prototype: Set.prototype,
  properties: ["size"]
}), Tag.SYMBOL, {
  prototype: Symbol.prototype,
  properties: ["description"]
}), Tag.ARRAYBUFFER, {
  prototype: ArrayBuffer.prototype,
  properties: ["byteLength", "maxByteLength", "resizable"]
}), Tag.DATAVIEW, {
  prototype: DataView.prototype,
  properties: ["buffer", "byteLength", "byteOffset"]
}));

/**
 * Used to log warnings.
 */
var CloneDeepWarning = /*#__PURE__*/function (_Error) {
  _inherits(CloneDeepWarning, _Error);
  var _super = _createSuper(CloneDeepWarning);
  /**
   * @param {string} message 
   * @param {any} [cause] 
   * @param {string} [stack]
   */
  function CloneDeepWarning(message, cause, stack) {
    var _this;
    _classCallCheck(this, CloneDeepWarning);
    _this = _super.call(this, message, cause);
    _this.name = CloneDeepWarning.name;
    if (typeof stack === "string") _this.stack = stack;
    return _this;
  }
  return _createClass(CloneDeepWarning);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Creates a {@link CloneDeepWarning} instance.
 * @param {String} message The error message.
 * @param {Object} [cause] If an object with a `cause` property, it will add a 
 * cause to the error when logged.
 * @param {string} [stack] If provided, determines the stack associated with the
 * error object.
 * @returns {CloneDeepWarning} 
 */
function getWarning(message, cause, stack) {
  return new CloneDeepWarning(message, cause, stack);
}

/**
 * Commonly-used {@link CloneDeepWarning} instances.
 */
var Warning = {
  WEAKMAP: getWarning("Attempted to clone unsupported type WeakMap."),
  WEAKSET: getWarning("Attempted to clone unsupported type WeakSet."),
  FUNCTION_DOT_PROTOTYPE: getWarning("Attempted to clone Function.prototype. strict mode does not allow " + "the caller, callee or arguments properties to be accessed so those " + "properties will not be cloned. Also, native methods cannot be " + "cloned so all methods in Function.prototype will copied directly."),
  IMPROPER_ADDITIONAL_VALUES: getWarning("The additionalValue property must be an array of objects.")
};

/** 
 * This symbol is used to indicate that the cloned value is the top-level object 
 * that will be returned by {@link cloneDeep}.
 * @type {Symbol}
 */
var TOP_LEVEL = Symbol("TOP_LEVEL");

/**
 * Gets a "tag", which is an string which identifies the type of a value.
 * `Object.prototype.toString` returns a string like `"[object <Type>]"`,  where 
 * type is the type of the object. We refer this return value as the **tag**. 
 * Normally, the tag is determined by what `this[Symbol.toStringTag]` is, but 
 * the JavaScript specification for `Object.prototype.toString` requires that 
 * many native JavaScript objects return a specific tag if the object does not 
 * have the `Symbol.toStringTag` property. Also, classes introduced after ES6 
 * typically have their own non-writable `Symbol.toStringTag` property. This 
 * makes `Object.prototype.toString.call` a stronger type-check that 
 * `instanceof`.
 * 
 * @example
 * ```
 * const date = new Date();
 * console.log(date instanceof Date);  // true
 * console.log(tagOf(date));  // "[object Date]"
 * 
 * const dateSubclass = Object.create(Date.prototype);
 * console.log(dateSubclass instance Date);  // true;
 * console.log(tagOf(dateSubClass));  // "[object Object]"
 * 
 * // This is not a perfect type check because we can do:
 * dateSubclass[Symbol.toStringTag] = "Date"
 * console.log(tagOf(dateSubClass));  // "[object Date]"
 * ```
 * 
 * @param {any} value The value to get the tag of.
 * @returns {string} tag A string indicating the value's type.
 */
function tagOf(value) {
  return Object.prototype.toString.call(value);
}

/**
 * Returns `true` if tag is that of a TypedArray subclass, `false` otherwise.
 * @param {string} tag A tag. See {@link tagOf}.
 * @returns {boolean}
 */
function isTypedArray(tag) {
  return [Tag.DATAVIEW, Tag.FLOAT32, Tag.FLOAT64, Tag.INT8, Tag.INT16, Tag.INT32, Tag.UINT8, Tag.UINT8CLAMPED, Tag.UINT16, Tag.UINT32, Tag.BIGINT64, Tag.BIGUINT64].includes(tag);
}

/**
 * Clones the provided value.
 * @param {any} _value The value to clone.
 * @param {Function|undefined} customizer A customizer function.
 * @param {Function} log Receives an error object for logging.
 * @param {boolean|undefined} doThrow Whether errors in the customizer should 
 * cause the function to throw.
 * @returns {any}
 */
function cloneInternalNoRecursion(_value, customizer, log, doThrow) {
  /**
   * Handles the assignment of the cloned value to some persistent place.
   * @param {any} cloned The cloned value.
   * @param {Object|Function|Symbol|undefined} parentOrAssigner Either the 
   * parent object that the cloned value will be assigned to, or a function 
   * which assigns the value itself. If equal to TOP_LEVEL, then it is the 
   * value that will be returned by the algorithm. 
   * @param {PropertyKey|undefined} prop If `parentOrAssigner` is a parent 
   * object, then `parentOrAssigner[prop]` will be assigned `cloned`.
   * @param {PropertyDescriptor|undefined} metadata The property descriptor 
   * for the object. If not an object, then this is ignored.
   * @returns The cloned value.
   */
  function assign(cloned, parentOrAssigner, prop, metadata) {
    if (parentOrAssigner === TOP_LEVEL) result = cloned;else if (typeof parentOrAssigner === "function") parentOrAssigner(cloned, prop, metadata);else if (typeof prop !== "undefined" && _typeof(metadata) === "object") {
      /**
       * @type {PropertyDescriptor}
       */
      var clonedMetadata = {
        configurable: metadata.configurable,
        enumerable: metadata.enumerable
      };
      var hasAccessor = typeof metadata.get === "function" || typeof metadata.set === "function";
      if (!hasAccessor) {
        // `cloned` or getAccessor will determine the value
        clonedMetadata.value = cloned;

        // defineProperty throws if property with accessors is writable
        clonedMetadata.writable = metadata.writable;
      }
      if (typeof metadata.get === "function") clonedMetadata.get = metadata.get;
      if (typeof metadata.set === "function") clonedMetadata.set = metadata.set;
      if (hasAccessor) log(getWarning("Cloning value with name ".concat(String(prop), " whose property") + "descriptor contains a get or set accessor."));
      Object.defineProperty(parentOrAssigner, prop, clonedMetadata);
    }
    return cloned;
  }

  /** 
   * Contains the return value of this function.
   * @type {any}
   */
  var result;

  /** 
   * Will be used to store cloned values so that we don't loop infinitely on 
   * circular references.
   */
  var cloneStore = new Map();

  /** 
   * A queue so we can avoid recursion.
   * @type {import("./types").QueueElement[]}
   */
  var queue = [{
    value: _value,
    parentOrAssigner: TOP_LEVEL
  }];

  /** 
   * We will do a second pass through everything to check Object.isExtensible,
   * Object.isSealed and Object.isFrozen. We do it last so we don't run into 
   * issues where we append properties on a frozen object, etc.
   * @type {Array<[any, any]>[]}
   */
  var isExtensibleSealFrozen = [];
  var _loop = function _loop() {
      /**
       * The value to deeply clone.
       */
      var value = obj.value;

      /** 
       * `parentOrAssigner` is either
       *  - `TOP_LEVEL`: this value is the top-level object that will be 
       * returned by the function
       *  - object: a parent object `value` is nested under
       *  - function: an "assigner" that has the responsibility of assigning 
       * the cloned value to something
       */
      var parentOrAssigner = obj.parentOrAssigner;

      /**
       * `prop` is used with `parentOrAssigner` if it is an object so that the 
       * cloned object will be assigned to `parentOrAssigner[prop]`.
       */
      var prop = obj.prop;

      /**
       * Contains the property descriptor for this value, or undefined.
       */
      var metadata = obj.metadata;

      /**
       * Will contain the cloned object.
       * @type {any}
       */
      var cloned;

      // See if we have a circular reference.
      var seen = cloneStore.get(value);
      if (seen !== undefined) {
        assign(seen, parentOrAssigner, prop, metadata);
        return 0; // continue
      }

      /**
       * If true, do not not clone the properties of value.
       * @type {boolean}
       */
      var ignoreProps = false;

      /**
       * If true, do not have `cloned` share the prototype of `value`.
       * @type {boolean}
       */
      var ignoreProto = false;

      /**
       * Is true if the customizer determines the value of `cloned`.
       * @type {boolean}
       */
      var useCustomizerClone = false;

      // Perform user-injected logic if applicable.
      if (typeof customizer === "function") {
        var clone, additionalValues, ignore;
        try {
          var customResult = customizer(value);
          if (_typeof(customResult) === "object") {
            useCustomizerClone = true;

            // Must wrap destructure in () if not variable declaration
            clone = customResult.clone;
            additionalValues = customResult.additionalValues;
            ignore = customResult.ignore;
            ignoreProps = customResult.ignoreProps;
            ignoreProto = customResult.ignoreProto;
            if (ignore === true) return 0; // continue
            cloned = assign(clone, parentOrAssigner, prop, metadata);
            if (Array.isArray(additionalValues)) additionalValues.forEach(function (object) {
              if (_typeof(object) === "object") queue.push({
                value: object.value,
                parentOrAssigner: object.assigner
              });else throw Warning.IMPROPER_ADDITIONAL_VALUES;
            });else if (additionalValues !== undefined) throw Warning.IMPROPER_ADDITIONAL_VALUES;
          }
        } catch (error) {
          if (doThrow === true) throw error;
          clone = undefined;
          useCustomizerClone = false;
          var msg = "customizer encountered error. Its results will " + "be ignored for the current value and the " + "algorithm will proceed with default behavior. ";
          if (error instanceof Error) {
            error.message = "".concat(msg, "Error encountered: ").concat(error.message);
            var cause = error.cause ? {
              cause: error.cause
            } : undefined;
            var stack = error.stack ? error.stack : undefined;
            log(getWarning(error.message, cause, stack));
          } else log(getWarning(msg, {
            cause: error
          }));
        }
      }

      /**
       * Identifies the type of the value.
       * @type {String}
       */
      var tag = tagOf(value);
      if (forbiddenProps[tag] !== undefined && forbiddenProps[tag].prototype === value) log(getWarning("Attempted to clone ".concat(tag.substring(8, tag.length - 1), ". ") + "This object cannot have the following properties accessed: " + "".concat(forbiddenProps[tag].properties.join(", "), ". The cloned ") + "object will not have any inaccessible properties."));
      try {
        // skip the following "else if" branches
        if (useCustomizerClone === true) {}

        // If value is primitive, just assign it directly.
        else if (value === null || !["object", "function"].includes(_typeof(value))) {
          assign(value, parentOrAssigner, prop, metadata);
          return 0; // continue
        }

        // We won't clone weakmaps or weaksets (or their prototypes).
        else if ([Tag.WEAKMAP, Tag.WEAKSET].includes(tag)) throw tag === Tag.WEAKMAP ? Warning.WEAKMAP : Warning.WEAKSET;

        // Ordinary objects, or the rare `arguments` clone.
        // Also, treat prototypes like ordinary objects. The tag wrongly 
        // indicates that prototypes are instances of themselves.
        else if ([Tag.OBJECT, Tag.ARGUMENTS].includes(tag) || supportedPrototypes.includes(value)) cloned = assign(Object.create(Object.getPrototypeOf(value)), parentOrAssigner, prop, metadata);

        // We only copy functions if they are methods.
        else if (typeof value === "function") {
          cloned = assign(parentOrAssigner !== TOP_LEVEL ? value : Object.create(Function.prototype), parentOrAssigner, prop, metadata);
          log(getWarning("Attempted to clone function" + "".concat(typeof prop === "string" ? " with name ".concat(prop) : "", ". ") + "JavaScript functions cannot be reliably " + "cloned. If this function is a method, " + "it will be copied directly. If this is " + "the top-level object being cloned, then " + "an empty object will be returned."));
          if (parentOrAssigner === TOP_LEVEL) return 0; // continue
        } else if (Array.isArray(value)) cloned = assign(new Array(value.length), parentOrAssigner, prop, metadata);

        // values that will be called using contructor
        else {
          var Value = value.constructor;

          // Booleans, Number, String or Symbols which used `new` syntax 
          // so JavaScript thinks they are objects
          // We also handle Date here because it is convenient
          if ([Tag.BOOLEAN, Tag.DATE].includes(tag)) cloned = assign(new Value(Number(value)), parentOrAssigner, prop, metadata);else if ([Tag.NUMBER, Tag.STRING].includes(tag)) cloned = assign(new Value(value), parentOrAssigner, prop, metadata);else if (Tag.SYMBOL === tag) {
            cloned = assign(Object(Symbol.prototype.valueOf.call(value)), parentOrAssigner, prop, metadata);
          } else if (Tag.REGEXP === tag) {
            var regExp = new Value(value.source, /\w*$/.exec(value));
            regExp.lastIndex = value.lastIndex;
            cloned = assign(regExp, parentOrAssigner, prop, metadata);
          } else if (Tag.ERROR === tag) {
            var _cause = value.cause;
            cloned = assign(_cause === undefined ? new Value(value.message) : new Value(value.message, {
              cause: _cause
            }), parentOrAssigner, prop, metadata);
          } else if (Tag.ARRAYBUFFER === tag) {
            // copy data over to clone
            var arrayBuffer = new Value(value.byteLength);
            new Uint8Array(arrayBuffer).set(new Uint8Array(value));
            cloned = assign(arrayBuffer, parentOrAssigner, prop, metadata);
          } else if (isTypedArray(tag)) {
            // copy data over to clone
            var buffer = new value.buffer.constructor(value.buffer.byteLength);
            new Uint8Array(buffer).set(new Uint8Array(value.buffer));
            cloned = assign(new Value(buffer, value.byteOffset, value.length), parentOrAssigner, prop, metadata);
          } else if (Tag.MAP === tag) {
            /**
             * @type {Map<any, any>}
             */
            var originalMap = value;
            var cloneMap = new Value();
            cloned = assign(cloneMap, parentOrAssigner, prop, metadata);
            originalMap.forEach(function (subValue, key) {
              queue.push({
                value: subValue,
                /**
                 * @param {any} cloned 
                 */
                parentOrAssigner: function parentOrAssigner(cloned) {
                  isExtensibleSealFrozen.push([subValue, cloned]);
                  cloneMap.set(key, cloned);
                }
              });
            });
          } else if (Tag.SET === tag) {
            /**
             * @type {Set<any>}
             */
            var originalSet = value;
            var cloneSet = new Value();
            cloned = assign(cloneSet, parentOrAssigner, prop, metadata);
            originalSet.forEach(function (subValue) {
              queue.push({
                value: subValue,
                /**
                 * @param {any} cloned 
                 */
                parentOrAssigner: function parentOrAssigner(cloned) {
                  isExtensibleSealFrozen.push([subValue, cloned]);
                  cloneSet.add(cloned);
                }
              });
            });
          } else throw getWarning("Attempted to clone unsupported type.");
        }
      } catch (error) {
        var _msg = "Encountered error while attempting to clone " + "specific value. The value will be \"cloned\" into an empty " + "object.";
        if (error instanceof Error) {
          error.message = "".concat(_msg, " Error encountered: ").concat(error.message);
          var _cause2 = error.cause ? {
            cause: error.cause
          } : undefined;
          var _stack = error.stack ? error.stack : undefined;
          log(getWarning(error.message, _cause2, _stack));
        } else log(getWarning(_msg, {
          cause: error
        }));
        cloned = assign({}, parentOrAssigner, prop, metadata);

        // We don't want the prototype if we failed and set the value to an 
        // empty object.
        ignoreProto = true;
      }

      // If the customizer returned a primitive, skip the following.
      if (useCustomizerClone && cloned === null || _typeof(cloned) !== "object") return 0; // continue
      cloneStore.set(value, cloned);
      isExtensibleSealFrozen.push([value, cloned]);

      // Ensure clone has prototype of value
      if (ignoreProto !== true && Object.getPrototypeOf(cloned) !== Object.getPrototypeOf(value)) Object.setPrototypeOf(cloned, Object.getPrototypeOf(value));
      if (ignoreProps === true) return 0; // continue

      // Now copy all enumerable and non-enumerable properties.
      [Object.getOwnPropertyNames(value), Object.getOwnPropertySymbols(value)].forEach(function (array) {
        array.forEach(function (key) {
          if (typeof key === "string" && forbiddenProps[tag] !== undefined && value === forbiddenProps[tag].prototype && forbiddenProps[tag].properties.includes(key)) return;

          // We already assigned TypedArray elements. Only add prop if 
          // it isn't already assigned.
          if (isTypedArray(tag) && _typeof(key) !== "symbol" && Number.isInteger(Number(key)) && Number(key) >= 0 && Number(key) < value.byteLength) return;
          queue.push({
            value: value[key],
            parentOrAssigner: cloned,
            prop: key,
            metadata: Object.getOwnPropertyDescriptor(value, key)
          });
        });
      });
    },
    _ret;
  for (var obj = queue.shift(); obj !== undefined; obj = queue.shift()) {
    _ret = _loop();
    if (_ret === 0) continue;
  }

  // Check extensible, seal, and frozen statuses.
  isExtensibleSealFrozen.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      value = _ref2[0],
      cloned = _ref2[1];
    if (!Object.isExtensible(value)) Object.preventExtensions(cloned);
    if (Object.isSealed(value)) Object.seal(cloned);
    if (Object.isFrozen(value)) Object.freeze(cloned);
  });
  return result;
}

/**
 * Create a deep copy of the provided value.
 * The cloned object will point to the *same prototype* as the original.
 * 
 * This behaves like `structuredClone`, but there are differences:
 *  - The function is not recursive, so the call stack does not blow up for 
 * deeply nested objects. (Unfortunately, as of December 2023, V8 implements 
 * structuredClone with a recursive algorithm. Hopefully this will change in the 
 * future.)
 *  - Methods are copied over to the clone. The functions are not clones, they 
 * point to the same function as the original.
 *  - This algorithm works with all of the listed JavaScript types in 
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#javascript_types,
 * as well as Symbols and Node Buffer objects.
 *  - This algorithm does NOT work for the Web API types in
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#webapi_types).
 *  - The property descriptor of properties are preserved. structuredClone 
 * ignores them.
 *  - Unsupported types do not cause errors to be thrown. Instead, unsupported 
 * types are simply "cloned" into an empty object and a noisy warning is logged 
 * to the console (or sent to the custom logger provided).
 * 
 * WeakMaps and WeakSets are not supported types. It is actually impossible to 
 * properly clone a WeakMap or WeakSet.
 * 
 * Functions also cannot be properly cloned. If you provide a function to this 
 * method, an empty object will be returned. However, if you provide an object 
 * with methods, they will be copied by value (no new function object will be 
 * created). A warning is logged if this occurs. Note that 
 * `typeof Function.prototype === "function"` so Function.prototype is handled 
 * just like functions.
 * 
 * This method will clone many of JavaScripts native classes. These include 
 * Date, RegExp, ArrayBuffer, all the TypedArray subclasses, Map, Set, Number, 
 * Boolean, String, and Symbol. The algorithm type-checks for these classes 
 * using `Object.prototype.toString.call`, so if you override the 
 * `Symbol.toStringTag` irresponsibly, the algorithm may incorrectly try to 
 * clone a value into a native type.
 * 
 * An optional `customizer` can be provided to inject additional logic. The 
 * customizer has the responsibility of determining what object a value should 
 * be cloned into. If it returns an object, then the value of the `clone` 
 * property on that object is used as the clone for the given value. If the 
 * object doesn't have a `clone` property, then the value is cloned into 
 * `undefined`. If the customizer returns anything that is not an object, then 
 * the algorithm will perform its default behavior.
 * 
 * @example
 * ```
 * // Don't clone methods
 * const myObject = { 
 *     a: 1, 
 *     func: () => "I am a function" 
 * };
 * const cloned = cloneDeep(myObject, {
 *     customizer(value) {
 *         if (typeof value === "function") {
 *             return { clone: {} };
 *         }
 *     }
 * });
 * console.log(cloned);  // { a: 1, func: {} }
 * ```
 * 
 * The object returned by the customizer can also have an `additionalValues` 
 * property. If it is an array, then it is an array of objects which represent 
 * additional values that will be cloned. The objects in the array must have the 
 * following properties:
 * 
 *  - `value`: It is the value to clone.
 *  - `assigner`: It must be a function. It has the responsiblity of assigning 
 * the clone of `value` to something. It is passed the clone of `value` as an 
 * argument.
 * 
 * The `additionalValues` property should only be used to clone data an object 
 * can only access through its methods. See the following example. 
 * 
 * @example
 * ```
 * class Wrapper {
 *     #value;
 *     get() {
 *         return this.#value;
 *     }
 *     set(value) {
 *         this.#value = value;
 *     }
 * }
 * 
 * const wrapper = new Wrapper();;
 * wrapper.set({ foo: "bar" });
 * 
 * const cloned = cloneDeep(wrapper, {
 *     customizer(value) {
 *         if (!(value instanceof Wrapper)) return;
 * 
 *         const clonedWrapper = new Wrapper();
 *         
 *         return {
 *             clone: clonedWrapper,
 * 
 *             additionalValues: [{
 *                 // the cloning algorithm will clone 
 *                 // value.get()
 *                 value: value.get(),
 * 
 *                 // and the assigner will make sure it is 
 *                 // stored in clone
 *                 assigner(cloned) {
 *                     clonedWrapper.set(cloned)
 *                 }
 *             }]
 *         };
 *     }
 * });
 * 
 * console.log(wrapper.get());  // { foo: "bar" }
 * console.log(cloned.get());   // { foo: "bar" }
 * console.log(cloned.get() === wrapper.get());  // false
 * ```
 * 
 * The customizer object can have some additional effects by having any of the 
 * following properties:
 * 
 *  - `ignoreProps` -  If `true`, the properties of the cloned value will NOT be 
 * cloned.
 *  - `ignoreProto` - If `true`, the prototype of the value will not be copied 
 * to the clone. 
 *  - `ignore` - If `true`, the value will not be cloned at all.
 * 
 * The customizer has extremely high priority over the default behavior of the 
 * algorithm. The only logic the algorithm prioritizes over the customizer is 
 * the check for circular references. 
 * 
 * The best use of the customizer to support user-made types. You can also use 
 * it to override some of the design decisions made in the algorithm (you could, 
 * for example, use it to throw if the user tries to clone functions, WeakMaps, 
 * or WeakSets). 
 * 
 * @param {any} value The value to deeply copy.
 * @param {import("./types").CloneDeepOptionsOrCustomizer} [optionsOrCustomizer] 
 * If a function, this argument is used as the customizer.
 * @param {object} [optionsOrCustomizer] If an object, this argument is used as 
 * a configuration object.
 * @param {import("./types").Customizer} optionsOrCustomizer.customizer Allows 
 * the user to inject custom logic. The function is given the value to copy. If 
 * the function returns an object, the value of the `clone` property on that object will be used as the clone. 
 * See the documentation for `cloneDeep` for more information.
 * @param {import("./types").Log} optionsOrCustomizer.log Any errors which occur 
 * during the algorithm can optionally be passed to a log function. `log` should 
 * take one argument which will be the error encountered. Use this to the log 
 * the error to a custom logger.
 * @param {string} optionsOrCustomizer.logMode Case-insensitive. If "silent", no 
 * warnings will be logged. Use with caution, as failures to perform true clones 
 * are logged as warnings. If "quiet", the stack trace of the warning is 
 * ignored.
 * @param {boolean} optionsOrCustomizer.letCustomizerThrow If `true`, errors 
 * thrown by the customizer will be thrown by `cloneDeep`. By default, the error 
 * is logged and the algorithm proceeds with default behavior.
 * @returns {Object} The deep copy.
 */
function cloneDeep(value, optionsOrCustomizer) {
  var customizer;
  var log;
  var logMode;
  var letCustomizerThrow;
  if (typeof optionsOrCustomizer === "function") customizer = optionsOrCustomizer;else if (_typeof(optionsOrCustomizer) === "object") {
    log = optionsOrCustomizer.log;
    logMode = optionsOrCustomizer.logMode;
    letCustomizerThrow = optionsOrCustomizer.letCustomizerThrow;
    customizer = optionsOrCustomizer.customizer;
  }
  if (typeof log !== "function") log = console.warn;
  if (typeof logMode === "string") if (logMode.toLowerCase() === "silent") log = function log() {};else if (logMode.toLowerCase() === "quiet")
    /**
     * @type {(error: Error) => void}
     */
    log = function log(error) {
      return console.warn(error.message);
    };
  return cloneInternalNoRecursion(value, customizer, log, letCustomizerThrow);
}
var _default = exports["default"] = cloneDeep;
