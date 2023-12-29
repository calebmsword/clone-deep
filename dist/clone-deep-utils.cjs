"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneDeepFully = cloneDeepFully;
exports.useCustomizers = useCustomizers;
var _cloneDeep = _interopRequireDefault(require("./clone-deep.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Deeply clones the provided object and its prototype chain.
 * @param {any} value The object to clone.
 * @param {import("./types").CloneDeepFullyOptionsOrCustomizer} [options] 
 * Configures the clone. If a function, it is used as the customizer for the 
 * clone. 
 * @param {object} [options] If an object, it is used as a configuration object.
 * See the documentation for `cloneDeep`.
 * @param {boolean} options.force If `true`, prototypes with methods will be 
 * cloned. Normally, this function stops if it reaches any prototype with 
 * methods.
 * @param {import("./types").Customizer} options.customizer See the 
 * documentation for `cloneDeep`.
 * @param {import("./types").Log} options.log See the documentation for 
 * `cloneDeep`.
 * @param {string} options.logMode See the documentation for `cloneDeep`.
 * @param {boolean} options.letCustomizerThrow See the documentation for 
 * `cloneDeep`.
 * @returns {any} The deep copy.
 */
function cloneDeepFully(value, options) {
  if (!["object", "function"].includes(_typeof(options))) options = {};
  if (_typeof(options) === "object" && typeof options.force !== "boolean") options.force = false;

  /**
   * Returns an array of all properties in the object.
   * This includes symbols and non-enumerable properties. `undefined` or 
   * `null` returns an empty array.
   * @param {Object} o An object.
   * @returns {(String|Symbol)[]} An array of property names.
   */
  function getAllPropertiesOf(o) {
    /** @readonly */
    return [Object.getOwnPropertyNames(o), Object.getOwnPropertySymbols(o)].flat();
  }

  /**
   * Is true if the provided object has methods. Is false otherwise.
   * @param {any} o An object
   * @returns {Boolean}
   */
  function hasMethods(o) {
    // We cannot access some properties of Function.prototype in strict mode
    if (o === Function.prototype) return true;
    // TypeScript doesn't allow Symbols to be the index of an object. This 
    // is actually intended behavior. See 
    // https://github.com/Microsoft/TypeScript/issues/24587.
    // @ts-ignore
    return getAllPropertiesOf(o).some(function (key) {
      return typeof o[key] === "function";
    });
  }
  var clone = (0, _cloneDeep["default"])(value, options);
  var tempClone = clone;
  var tempOrig = value;
  while (tempOrig !== null && ["object", "function"].includes(_typeof(tempOrig)) && Object.getPrototypeOf(tempOrig) !== null && (!hasMethods(Object.getPrototypeOf(tempOrig)) || _typeof(options) === "object" && options.force)) {
    var newProto = (0, _cloneDeep["default"])(Object.getPrototypeOf(tempOrig), options);
    Object.setPrototypeOf(tempClone, newProto);
    tempClone = Object.getPrototypeOf(tempClone);
    tempOrig = Object.getPrototypeOf(tempOrig);
  }
  return clone;
}

/**
 * Creates a customizer which composes other customizers.
 * The customizers are executed in order. The first to return an object is used 
 * as the result. If no customizer returns an object, undefined is returned.
 * @param {Function[]} customizers An array of customizer functions.
 * @returns {Function} A new customizer which composes the provided customizers.
 */
function useCustomizers(customizers) {
  if (!Array.isArray(customizers) || customizers.some(function (element) {
    return typeof element !== "function";
  })) throw new Error("useCustomizers must receive an array of functions");

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
        if (_typeof(result) === "object") return result;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
}
