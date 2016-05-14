if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Math.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Random.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Lists.js")) { throw new Error("module required"); }

var Colors = (function () {
    "use strict";
    var singleton = {};

    // private fields
    var badComponents = [[1,2,0],[0,2,1]];  // codes which generate ugly colors

    // public fields
    singleton.mode = 1;

    // privileged methods
    singleton.renewComponents = function () {
        var newComponents;
        do {
            newComponents = Random.sort([0, 1, 2]);
        } while (Lists.inArray(badComponents, Lists.equals, newComponents));
        singleton.rIntensity = newComponents[0];
        singleton.gIntensity = newComponents[1];
        singleton.bIntensity = newComponents[2];
    };

    singleton.renewComponents();

    return singleton;
})();

function makeColor(context, red, green, blue) {
    "use strict";
    var instance = {};

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
    instance.setRGB = function (r, g, b) {
        instance.r = r;
        instance.g = g;
        instance.b = b;
    }

    instance.map = function (f) {
        instance.setRGB(f(), f(), f());
    }

    instance.add = function (color) {
        instance.r += color.r;
        instance.g += color.g;
        instance.b += color.b;
        return instance.enforceValidity(true);
    };

    instance.apply = function () {
        instance.context.fillStyle = instance.toString();
    };

    /* if ‘returnRes’ is specified, return an object saying which values were wrong */
    instance.enforceValidity = function (returnRes) {
        var nr = MATH.enforceInterval(instance.r, 0, 255);
        var ng = MATH.enforceInterval(instance.g, 0, 255);
        var nb = MATH.enforceInterval(instance.b, 0, 255);
        var res = null;

        if (instance.r === nr && instance.g === ng && instance.b === nb)
        {
            return null;
        }
        else
        {
            if (typeof returnRes !== "undefined")
            {
                res = {
                    r: instance.r !== nr,
                    g: instance.g !== ng,
                    b: instance.b !== nb
                };
            }
            instance.setRGB(nr, ng, nb);
            return res;
        }
    };

    instance.initialize = function (red, green, blue)
    {
        if (typeof red === "undefined" || typeof green === "undefined" || typeof blue === "undefined")
        {
            if (Colors.mode === 0)
            {   // random
                instance.map(function () { return Random.between(0, 255); });
            }
            else if (Colors.mode === 1)
            {   // pretty
                instance.setRGB(
                    randComponent(Colors.rIntensity),
                    randComponent(Colors.gIntensity),
                    randComponent(Colors.bIntensity)
                );
            }
            else if (Colors.mode === 2)
            {   // dark
                instance.setRGB(0, 0, 0);
            }
            else if (Colors.mode === 3)
            {   // bright
                instance.setRGB(255, 255, 255);
            }
        }
        else
        {
            instance.r = red;
            instance.g = green;
            instance.b = blue;
        }
        instance.enforceValidity();
    };

    instance.toString = function () {
        return "rgb(" + instance.r + "," + instance.g + "," + instance.b + ")";
    };

    instance.initialize(red, green, blue);

    return instance;
}

loadedFiles["Colors.js"] = true;
