if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Tile.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("CursorColor.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Keyboard.js")) { throw new Error("module required"); }

function makeGrid(gameArea) {
    "use strict";
    var instance = {};

    // private fields
    var tileWidth = 40;
    var tileHeight = 40;
    var tileGapH = 1;  // horizontal gap between 2 tiles
    var tileGapV = 1;  //   vertical gap between 2 tiles

    var nCols = Math.floor(gameArea.getWidth() / (tileWidth + tileGapH));
    var nRows = Math.floor(gameArea.getHeight() / (tileHeight + tileGapV));
    var width = tileGapH + nCols * (tileWidth + tileGapH);
    var height = tileGapV + nRows * (tileWidth + tileGapH);
    var x = Math.floor((gameArea.getWidth() - width) / 2);
    var y = Math.floor((gameArea.getHeight() - height) / 2);
    
    var context = gameArea.getContext();
    var cursorColor = makeCursorColor(context);
    var previousCursorLocation = { row: -1, column: -1};
    var cursorOnATile = false;

    var intervalID = null;
    var timeoutID = null;
    var keysDown = {};

    // private methods
    function computeTileCoordinate(gridOffset, tileIndex, tileSize, tileGap) {
        return gridOffset + tileGap + tileIndex * (tileGap + tileSize);
    }

    function pixelToTileCoordinate(coord, gridOffset, tileSize, tileGap, max) {
        var tiles = gridOffset + tileGap;
        var tile = tileSize + tileGap;
        var tileIndex = -1;
        while (tiles <= coord) {
            tiles += tile;
            tileIndex += 1;
        }
        return -1 < tileIndex && tileIndex < max && coord <= tiles - tileGap
            ? tileIndex
            : null;
    }

    function handleKeyDown(event) {
        var key = event.keyCode;
        //~ console.info("Pressed: " + String(key));
        if (key === Keyboard.ENTER) {
            instance.renew();
        } else if (key === Keyboard.SPACE) {
            instance.toggleAnimation();
        }
    }
    
    function reload() {
        // window.location.reload bugs if directly specified in setTimeout
        window.location.reload();
    }

    // initialize 2D-array ‘instance.tiles’
    (function () {
        var row;
        var column;
        instance.tiles = [];
        for (row = 0; row < nRows; row++) {
            instance.tiles[row] = [];
            for (column = 0; column < nCols; column++) {
                instance.tiles[row][column] = makeTile(
                    context,
                    computeTileCoordinate(x, column, tileWidth, tileGapH),
                    computeTileCoordinate(y, row, tileHeight, tileGapV),
                    tileWidth,
                    tileHeight
                );
            }
        }
    })();

    // privileged methods
    instance.draw = function () {
        var row;
        var column;
        for (row = 0; row < nRows; row++) {
            for (column = 0; column < nCols; column++) {
                instance.tiles[row][column].draw();
            }
        }
    };

    instance.renew = function () {
        var row;
        var column;
        gameArea.clear();
        for (row = 0; row < nRows; row++) {
            for (column = 0; column < nCols; column++) {
                instance.tiles[row][column].color.initialize();
                instance.tiles[row][column].draw();
            }
        }
    };

    instance.startAnimation = function (interval = 712) {
        intervalID = setInterval(instance.renew, interval);
    };

    instance.stopAnimation = function () {
        clearInterval(intervalID);
        intervalID = null;
    };

    instance.toggleAnimation = function () {
        if (intervalID === null) {
            instance.startAnimation();
        }
        else {
            instance.stopAnimation();
        }
    };

    instance.magicCursor = function (event) {
        var pixelPos = gameArea.getMousePos(event);
        var cursorWasOnATile = cursorOnATile;
        var cursorOnANewTile = false;
        var row;
        var column;
        cursorOnATile = false;
        row = pixelToTileCoordinate(pixelPos.y, y, tileHeight, tileGapV, nRows);
        if (row !== null) {
            column = pixelToTileCoordinate(pixelPos.x, x, tileWidth, tileGapH, nCols);
            if (column !== null) {
                cursorOnATile = true;
                if (row !== previousCursorLocation.row || column !== previousCursorLocation.column) {
                    cursorOnANewTile = true;
                    //~ instance.tiles[row][column].color.initialize(0, Random.between(160, 255), 0);
                    cursorColor.nextStep();
                    cursorColor.apply();
                    instance.tiles[row][column].drawNoColor();
                    previousCursorLocation.row = row;
                    previousCursorLocation.column = column;
                }
            }
        }
        if (cursorWasOnATile && (!cursorOnATile || cursorOnANewTile)) {
            //~ instance.tiles[previousCursorLocation.row][previousCursorLocation.column].color.initialize();
            //~ instance.tiles[previousCursorLocation.row][previousCursorLocation.column].draw();
            if (!cursorOnANewTile) {
                previousCursorLocation.row = -1;
                previousCursorLocation.column = -1;
            }
        }
    };

    gameArea.getCanvas().addEventListener("mousemove", instance.magicCursor);
    addEventListener("keydown", handleKeyDown);

    // reload after resizing to prevent a distorted game experience
    window.onresize = function(){
        if (timeoutID !== null) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(reload, 100);
    };

    return instance;
}

loadedFiles["Grid.js"] = true;
