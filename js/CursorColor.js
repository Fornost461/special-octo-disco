if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Colors.js")) { throw new Error("module required"); }

function makeCursorColor(context, red, green, blue) {
    "use strict";
    var instance = {};

    // private fields

    // private methods
    function privateFunction(args) {
        
    }

    // public fields
    instance.color = makeColor(context, red, green, blue);
    instance.increment = 6;
    instance.stepsBeforeNewVector = 0;
    instance.maxStepsWithoutChange = 4;
    instance.vector = {
        r: 0,
        g: 0,
        b: 0
    };

    // privileged methods
    instance.apply = function () {
        instance.color.apply();
    };

    instance.nextStep = function () {
        var boundariesHit;
        if (instance.stepsBeforeNewVector < 1) {
            instance.renewVector();
        }
        boundariesHit = instance.color.add(instance.vector);
        if (boundariesHit === null) {
            instance.stepsBeforeNewVector--;
        }
        else {
            if (boundariesHit.r)
            {
                instance.vector.r *= -1;
            }
            if (boundariesHit.g)
            {
                instance.vector.g *= -1;
            }
            if (boundariesHit.b)
            {
                instance.vector.b *= -1;
            }
        }
    };

    instance.renewVector = function () {
        instance.vector.r = instance.increment * Random.between(-1, 1);
        instance.vector.g = instance.increment * Random.between(-1, 1);
        instance.vector.b = instance.increment * Random.between(-1, 1);

        instance.stepsBeforeNewVector = Random.between(1, 10);

        // prevent too much time without color changing
        if (instance.vector.r === 0 && instance.vector.g === 0 && instance.vector.b === 0) {
            if (instance.stepsBeforeNewVector > instance.maxStepsWithoutChange) {
                instance.stepsBeforeNewVector = instance.maxStepsWithoutChange;
            }
        }
    };
    
    return instance;
}

loadedFiles["CursorColor.js"] = true;
