if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Math.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Random.js")) { throw new Error("module required"); }

function Color(context, red, green, blue) {
    "use strict";
    this.context = context;
    this.initialize(red, green, blue);
}

Color.prototype.enforceValidity = function () {
    var nr = MATH.enforceInterval(this.r, 0, 255);
    var ng = MATH.enforceInterval(this.g, 0, 255);
    var nb = MATH.enforceInterval(this.b, 0, 255);

    if (this.r === nr && this.g === ng && this.b === nb) {
        return true;
    }
    else {
        this.r = nr;
        this.g = ng;
        this.b = nb;
        return false;
    }
};

Color.prototype.initialize = function (red, green, blue) {
    this.r = typeof red === "undefined" ? Random.between(0, 255) : red;
    this.g = typeof green === "undefined" ? Random.between(0, 255) : green;
    this.b = typeof blue === "undefined" ? Random.between(0, 255) : blue;
    this.enforceValidity();
};

var components = {};
var randComponent = function (intensity) {
    //~ return 0;
    if (intensity === 0) { return 0; }
    if (intensity === 1) { return Random.between(120, 255); }
    return 255;
}
var weightedSum = function (list, base) {
    var p = base;
    var i = list.length - 1;
    var n = list[i];
    for (i--; i >= 0 ; i--) {
        n += p * list[i];
        p *= base;
    }
    return n;
}
var uglyList = function (list) {
    var n = weightedSum(list, 10);  // codes are easier to read in decimal than in ternary
    return n === 120 || n === 21;   // codes which generate ugly colors
}
var renewComponents = function () {
    var list;
    do {
        list = Random.sort([0, 1, 2]);
    } while (uglyList(list));
    components.r = list[0];
    components.g = list[1];
    components.b = list[2];
};
renewComponents();

/* yields r, g, b, rg, gb or rb but not rgb */
Color.prototype.initializePretty = function () {
    this.r = randComponent(components.r);
    this.g = randComponent(components.g);
    this.b = randComponent(components.b);
    this.enforceValidity();
};

Color.prototype.toString = function () {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
};

Color.prototype.apply = function () {
    this.context.fillStyle = this.toString();
};

Color.prototype.add = function (color) {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;
    return this.enforceValidity();
};

loadedFiles["Color.js"] = true;
