if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Colors.js")) { throw new Error("module required"); }

function makeGameArea() {
    "use strict";
    var instance = {};

    // private fields
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var x;
    var y;
    // Cross-browser support for requestAnimationFrame
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

    //~ canvas.width = 712;
    //~ canvas.height = 440;
    //~ canvas.width = window.innerWidth;
    //~ canvas.height = window.innerHeight;
    //~ canvas.style.display = "block";
    //~ canvas.style.margin = "auto";
    //~ canvas.style.margin = "0";
    document.body.style.margin = "0";
    canvas.style.position = "absolute";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    
    document.body.appendChild(canvas);

    (function () {
        var rect = canvas.getBoundingClientRect();
        x = rect.left;
        y = rect.top;
    })();

    // public fields
    instance.bgColor = makeColor(context);

    // private methods
    var learnDimensions = function () {
        canvas.width = instance.getWidth();
        canvas.height = instance.getHeight();
    };

    // privileged methods
    instance.getContext = function () {
        return context;
    };

    instance.getCanvas = function () {
        return canvas;
    };

    instance.getWidth = function () {
        return canvas.offsetWidth;
    };

    instance.getHeight = function () {
        return canvas.offsetHeight;
    };

    instance.getMousePos = function (event) {
        return {
            x: event.clientX - x,
            y: event.clientY - y
        };
    }

    instance.clear = function () {
        //~ if (instance.mode === 0) {
        instance.bgColor.initialize();
        //~ } else if (instance.mode === 1) {
            //~ instance.bgColor.initializePretty();
        //~ } else if (instance.mode === 2) {
            //~ instance.bgColor.initialize(0, 0, 0);
        //~ } else if (instance.mode === 3) {
            //~ instance.bgColor.initialize(255, 255, 255);
        //~ }
        instance.bgColor.apply();
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    instance.nextFrame = function (f) {
        requestAnimationFrame(f);
    };

    learnDimensions();

    // update coordinates after user resizes window
    addEventListener("resize", learnDimensions);

    return instance;
}

loadedFiles["Canvas.js"] = true;
