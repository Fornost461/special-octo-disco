if (typeof loadedFiles === "undefined") { var loadedFiles = {}; }

var MATH = (function () {
    "use strict";
    return {
        notNumbers: function(...args) {
            return args.findIndex(function (element) {return !Number.isFinite(element)}) > -1;
        },

        notIntegers: function(...args) {
            return args.findIndex(function (element) {return !Number.isSafeInteger(element)}) > -1;
        },

        argument: function (x, y) {
            if (MATH.notNumbers(x, y)) { throw new TypeError("x and y must be numbers"); }
            return Math.atan2(y, x);
        },

        modulus: function (x, y) {
            if (MATH.notNumbers(x, y)) { throw new TypeError("x and y must be numbers"); }
            return Math.sqrt(x*x+y*y);
        },

        enforceMin: function(value, min) {
            if (MATH.notNumbers(value, min)) { throw new TypeError("value and min must be numbers"); }
            return value < min ? min : value;
        },

        enforceMax: function(value, max) {
            if (MATH.notNumbers(value, max)) { throw new TypeError("value and max must be numbers"); }
            return value > max ? max : value;
        },

        enforceInterval: function(value, min, max) {
            if (min > max) { throw new RangeError("min must be smaller than max"); }
            return MATH.enforceMin(MATH.enforceMax(value, max), min);
        }
    };
})();

loadedFiles["Math.js"] = true;
