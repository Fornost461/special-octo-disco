if (typeof loadedFiles === "undefined") { var loadedFiles = {}; }

var Lists = (function () {
    "use strict";
    return {
        /* superficial comparison */
        equals: function (a, b) {
            var i = 0;
            var l = a.length;
            if (l !== b.length) { return false; }
            while (i < l && a[i] === b[i]) { i++; }
            return i >= l;
        },

        inArray: function (array, areEqual, element) {
            var i = 0;
            var l = array.length;
            while (i < l && !areEqual(element, array[i])) { i++; }
            return i < l;
        }
    };
})();

loadedFiles["Lists.js"] = true;

