if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Math.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Random.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Lists.js")) { throw new Error("module required"); }

function Color() {
    throw new Error("obsolete call to Color(). use makeColor() instead");
}

function makeColor(context, red, green, blue) {
    "use strict";
    var instance = {};

    // private fields
    var components = {};
    var badComponents = [[1,2,0],[0,2,1]];  // codes which generate ugly colors

    // private methods
    var randComponent = function (intensity) {
        //~ return 0;
        if (intensity === 0) { return 0; }
        if (intensity === 1) { return Random.between(120, 255); }
        return 255;
    };

    // public fields
    instance.context = context;

    // privileged methods
    instance.add = function (color) {
        instance.r += color.r;
        instance.g += color.g;
        instance.b += color.b;
        return instance.enforceValidity();
    };

    instance.apply = function () {
        instance.context.fillStyle = instance.toString();
    };

    instance.enforceValidity = function () {
        var nr = MATH.enforceInterval(instance.r, 0, 255);
        var ng = MATH.enforceInterval(instance.g, 0, 255);
        var nb = MATH.enforceInterval(instance.b, 0, 255);

        if (instance.r === nr && instance.g === ng && instance.b === nb) {
            return true;
        }
        else {
            instance.r = nr;
            instance.g = ng;
            instance.b = nb;
            return false;
        }
    };

    instance.initialize = function (red, green, blue) {
        instance.r = typeof red === "undefined" ? Random.between(0, 255) : red;
        instance.g = typeof green === "undefined" ? Random.between(0, 255) : green;
        instance.b = typeof blue === "undefined" ? Random.between(0, 255) : blue;
        instance.enforceValidity();
    };

    instance.initializePretty = function () {
        instance.r = randComponent(components.r);
        instance.g = randComponent(components.g);
        instance.b = randComponent(components.b);
        instance.enforceValidity();
    };

    instance.renewComponents = function () {
        var newComponents;
        do {
            newComponents = Random.sort([0, 1, 2]);
        } while (Lists.inArray(badComponents, Lists.equals, newComponents));
        components.r = newComponents[0];
        components.g = newComponents[1];
        components.b = newComponents[2];
    };

    instance.toString = function () {
        return "rgb(" + instance.r + "," + instance.g + "," + instance.b + ")";
    };

    instance.renewComponents();
    instance.initialize(red, green, blue);

    return instance;
}

loadedFiles["Color.js"] = true;
