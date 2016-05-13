if (typeof loadedFiles === "undefined") { var loadedFiles = {}; }

var Random = (function () {
    "use strict";
    return {
        /* expects integers */
        between: function (min, max) {
            if (min > max) { throw new RangeError("random(min, max): max must be bigger than min"); }
            return Math.floor(min + Math.random() * (max + 1 - min));
        },

        boolean: function () {
            return Random.inList([false, true]);
        },

        inList: function (list) {
            return list[Random.between(0, list.length - 1)];
        },

        /* like inList but ‘list’ loses the selected element */
        fromList: function (list) {
            var i = Random.between(0, list.length - 1);
            var element = list[i];
            list.splice(i, 1);
            return element;
        },

        /* side-effect: ‘list’ is emptied */
        sort: function (list) {
            var newList = [];
            while (list.length > 0) {
                newList.push(Random.fromList(list));
            }
            return newList;
        }
    };
})();

loadedFiles["Random.js"] = true;
