if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Colors.js")) { throw new Error("module required"); }

function makeTile(ctx, x = 0, y = 0, width = 10, height = 10) {
    "use strict";
    var instance = {};

    // public fields
    instance.context = ctx;
    instance.x = x;
    instance.y = y;
    instance.width = width;
    instance.height = height;
    instance.color = makeColor(ctx);
    instance.color.initializePretty();

    instance.draw = function () {
        instance.color.apply();
        instance.context.fillRect(instance.x, instance.y, instance.width, instance.height);
    };

    instance.drawNoColor = function () {
        instance.context.fillRect(instance.x, instance.y, instance.width, instance.height);
    };

    return instance;
}

loadedFiles["Tile.js"] = true;
