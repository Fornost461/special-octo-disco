if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
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
    //~ this.r = typeof red === "undefined" ? Random.between(160, 255) : red;
    //~ this.g = typeof green === "undefined" ? Random.between(0, 0) : green;
    //~ this.b = typeof blue === "undefined" ? Random.between(182, 210) : blue;
    this.r = typeof red === "undefined" ? Random.between(0, 255) : red;
    this.g = typeof green === "undefined" ? Random.between(0, 255) : green;
    this.b = typeof blue === "undefined" ? Random.between(0, 255) : blue;
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
