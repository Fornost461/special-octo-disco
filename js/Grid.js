if (typeof loadedFiles === "undefined") { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Tile.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Colors.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("CursorColor.js")) { throw new Error("module required"); }
if (!loadedFiles.hasOwnProperty("Keyboard.js")) { throw new Error("module required"); }

function makeGrid(gameArea) {
    "use strict";
    var instance = {};

    // private fields
    var tileWidth = 32;
    var tileHeight = 32;
    var tileGapH = 1;  // horizontal gap between 2 tiles
    var tileGapV = 1;  //   vertical gap between 2 tiles

    var nCols;
    var nRows;
    var width;
    var height;
    var x;
    var y;
    
    var context = gameArea.getContext();
    var cursorColor = makeCursorColor(context);
    var previousCursorLocation;
    var cursorOnATile;

    var intervalID = null;
    var timeoutID = null;
    var keysDown = {};

    // private methods
    function initialize() {
        var row;
        var column;
        nCols = Math.floor((gameArea.getWidth() - tileGapH) / (tileWidth + tileGapH));
        nRows = Math.floor((gameArea.getHeight() - tileGapV) / (tileHeight + tileGapV));
        width = tileGapH + nCols * (tileWidth + tileGapH);
        height = tileGapV + nRows * (tileWidth + tileGapH);
        x = Math.floor((gameArea.getWidth() - width) / 2);
        y = Math.floor((gameArea.getHeight() - height) / 2);
        previousCursorLocation = { row: -1, column: -1};
        cursorOnATile = false;
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
        instance.draw();
    }

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
        } else if (key === Keyboard.H) {
            alert("[mouse] paint\n"
                + "[enter] generate a new scenery\n"
                + "[space] play / pause\n"
                + "[B] toggle bright mode\n"
                + "[D] toggle dark mode\n"
                + "[P] toggle pretty mode (enabled by default)\n"
                + "[H] show this help");
        } else if (key === Keyboard.B) {
            Colors.mode = Colors.mode === 3 ? 1 : 3;
            //~ console.info("toggle bright mode: " + String(Colors.mode));
            instance.renew();
        } else if (key === Keyboard.D) {
            Colors.mode = Colors.mode === 2 ? 1 : 2;
            //~ console.info("toggle dark mode: " + String(Colors.mode));
            instance.renew();
        } else if (key === Keyboard.P) {
            Colors.mode = Colors.mode === 1 ? 0 : 1;
            //~ console.info("toggle pretty mode: " + String(Colors.mode));
            instance.renew();
        }
    }

    // privileged methods
    instance.draw = function ()
    {
        var row;
        var column;
        gameArea.clear();
        for (row = 0; row < nRows; row++)
        {
            for (column = 0; column < nCols; column++)
            {
                instance.tiles[row][column].draw();
            }
        }
    };

    instance.renew = function ()
    {
        var row;
        var column;
        Colors.renewComponents();
        gameArea.clear();
        for (row = 0; row < nRows; row++)
        {
            for (column = 0; column < nCols; column++)
            {
                instance.tiles[row][column].color.initialize();
                instance.tiles[row][column].draw();
            }
        }
    };

    instance.startAnimation = function (interval = 712)
    {
        intervalID = setInterval(instance.renew, interval);
    };

    instance.stopAnimation = function ()
    {
        clearInterval(intervalID);
        intervalID = null;
    };

    instance.toggleAnimation = function ()
    {
        if (intervalID === null)
        {
            instance.startAnimation();
        }
        else
        {
            instance.stopAnimation();
        }
    };

    instance.magicCursor = function (event)
    {
        var pixelPos = gameArea.getMousePos(event);
        var cursorWasOnATile = cursorOnATile;
        var cursorOnANewTile = false;
        var row;
        var column;
        cursorOnATile = false;
        row = pixelToTileCoordinate(pixelPos.y, y, tileHeight, tileGapV, nRows);
        if (row !== null)
        {
            column = pixelToTileCoordinate(pixelPos.x, x, tileWidth, tileGapH, nCols);
            if (column !== null)
            {
                cursorOnATile = true;
                if (row !== previousCursorLocation.row || column !== previousCursorLocation.column)
                {
                    cursorOnANewTile = true;
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

    initialize();
    gameArea.getCanvas().addEventListener("mousemove", instance.magicCursor);
    addEventListener("keydown", handleKeyDown);

    // update coordinates after user resizes window
    addEventListener("resize", function()
    {
        if (timeoutID !== null)
        {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(initialize, 100);
    });

    return instance;
}

loadedFiles["Grid.js"] = true;
