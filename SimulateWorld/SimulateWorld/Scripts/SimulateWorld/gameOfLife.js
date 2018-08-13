var gameOfLife = new function () {

    $thisGameOfLife = this;
    this.columnNumber;
    this.rowNumber;
    this.bornList;
    this.aliveList;
    this.timer;
    this.currentPixelArray;
    this.stepCounter = 0;

    this.init = function () {
        $thisGameOfLife.setTableSize(); //set table size by height/width input
        var gridDivWidth = $('#gridDiv').width(); // get grid container width
        $('#gridDiv').height(gridDivWidth); // set container height equal to container width
        $thisGameOfLife.createGridTable();  // create table by tr and th elements with classes and events
        $thisGameOfLife.createRulesTables(); // create table with rules numbers
        $thisGameOfLife.setConwayRules(); // mark rules of Conway's game of life
        $thisGameOfLife.currentPixelArray = $thisGameOfLife.createArrayFromTable();
        $("#emptyArray").text(JSON.stringify($thisGameOfLife.createArrayFromTable()));
      
    };

    this.setTableSize = function () {
        $thisGameOfLife.rowNumber = $("#HeightNumber").val();
        $thisGameOfLife.columnNumber = $("#WidthNumber").val();
    };

    // Conway's game of life rules
    this.setConwayRules = function () {
        $("#liveCell_0_1").removeClass("rule-inactive").addClass("rule-active");
        $("#liveCell_0_2").removeClass("rule-inactive").addClass("rule-active");
        $("#bornCell_0_2").removeClass("rule-inactive").addClass("rule-active");
        $thisGameOfLife.setBornRules(); // set rules
        $thisGameOfLife.setAliveRules();  
    };

    this.createGridTable = function () {
        var table = document.getElementById("gridBox");
        // remove old table 
        while (table.lastChild) {
            table.removeChild(table.lastChild);
        }
        // create table
        for (var j = 0; j < $thisGameOfLife.rowNumber; j++) {
            var row = document.createElement("tr");
            row.id = "row_" + j.toString();
            for (var i = 0; i < $thisGameOfLife.columnNumber; i++) {
                var cell = document.createElement("th");
                cell.id = "cell_" + j.toString() + "_" + i.toString();
                cell.classList.add("cell", "game-of-life-dead");
                cell.addEventListener("click", function (event) { gameOfLife.changeColor(event.target); });
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        $("#emptyArray").text(JSON.stringify($thisGameOfLife.createArrayFromTable()));
    };

    this.changeColor = function (cell) {
        $thisGameOfLife.setTableSize();
        $thisGameOfLife.setAliveRules();
        $thisGameOfLife.setBornRules();
        if ($(cell).hasClass("game-of-life-dead")) {
            $(cell).removeClass("game-of-life-dead").addClass("game-of-life-alive");
        } else {
            $(cell).removeClass("game-of-life-alive").addClass("game-of-life-dead");
        }
        $thisGameOfLife.currentPixelArray = $thisGameOfLife.createArrayFromTable();
        $thisGameOfLife.setArrayInTextArea($thisGameOfLife.currentPixelArray);
        refreshStepCounter();
    };

    this.changeColorLight = function (cell) {
        if ($(cell).hasClass("rule-inactive")) {
            $(cell).addClass("rule-active");
            $(cell).removeClass("rule-inactive");
        } else {
            $(cell).addClass("rule-inactive");
            $(cell).removeClass("rule-active");
        }
        $thisGameOfLife.setBornRules();
        $thisGameOfLife.setAliveRules();
    };

    this.createRulesTables = function () {
        var numberOfNeighbours = 9;
        var cellsInRow = 8;
        var fullRowNumber = Math.floor(numberOfNeighbours / cellsInRow);
        var lastRow = numberOfNeighbours % cellsInRow;

        var containerWidth = $("#live-rules-div").width();
        var cellWidth = (parseInt(containerWidth / cellsInRow)).toString() + "px";

        // Alive
        var liveTable = document.getElementById("alive-rules");
        for (j = 0; j < fullRowNumber; j++) {

            var liveRow = document.createElement("tr");
            liveRow.id = "liveRow_" + j.toString();

            for (i = 0; i < cellsInRow; i++) {
                var liveCell = document.createElement("th");
                liveCell.id = "liveCell_" + j.toString() + "_" + i.toString();
                liveCell.classList.add("liveCell", "rule-inactive");
                liveCell.style.height = cellWidth;
                liveCell.style.width = cellWidth;
                liveCell.textContent = (j * cellsInRow + i + 1).toString();
                liveCell.addEventListener("click", function (event) { gameOfLife.changeColorLight(event.target); });
                liveRow.appendChild(liveCell);
            }
            liveTable.appendChild(liveRow);
        }

        // Dead
        var deadTable = document.getElementById("born-rules");
        for (j = 0; j < fullRowNumber; j++) {

            var bornRow = document.createElement("tr");
            bornRow.id = "bornRow_" + j.toString();

            for (i = 0; i < cellsInRow; i++) {
                var bornCell = document.createElement("th");
                bornCell.id = "bornCell_" + j.toString() + "_" + i.toString();
                bornCell.classList.add("bornCell", "rule-inactive");
                bornCell.style.height = cellWidth;
                bornCell.style.width = cellWidth;
                bornCell.textContent = (j * cellsInRow + i + 1).toString();
                bornCell.addEventListener("click", function (event) { gameOfLife.changeColorLight(event.target); });
                bornRow.appendChild(bornCell);
            }
            deadTable.appendChild(bornRow);
        }
    };

    this.setBornRules = function () {
        $thisGameOfLife.bornList = [];
        $(".bornCell").each(function () {
            if ($(this).hasClass("rule-active")) {
                $thisGameOfLife.bornList.push(parseInt(this.textContent));
            }
        });
    };

    this.setAliveRules = function () {
        $thisGameOfLife.aliveList = [];
        $(".liveCell").each(function () {
            if ($(this).hasClass("rule-active")) {
                $thisGameOfLife.aliveList.push(parseInt(this.textContent));
            }
        });
    };

    this.takeAStep = function () {
        $thisGameOfLife.currentPixelArray = $thisGameOfLife.getArrayFromTextArea();
        $thisGameOfLife.currentPixelArray = $thisGameOfLife.oneStepLoopArrayColors($thisGameOfLife.currentPixelArray);
        increaseStep();
        $thisGameOfLife.setArrayInTextArea($thisGameOfLife.currentPixelArray);
    };

    this.createArrayFromTable = function () {
        var pixelArray = new Array($thisGameOfLife.rowNumber);
        for (var i = 0; i < $thisGameOfLife.rowNumber; i++) {
            pixelArray[i] = new Array($thisGameOfLife.columnNumber);
            for (var j = 0; j < $thisGameOfLife.columnNumber; j++) {
                var cell = document.getElementById("cell_" + i.toString() + "_" + j.toString());
                pixelArray[i][j] = $(cell).hasClass("game-of-life-alive")? 1 : 0;
            }
        }
        return pixelArray;
    };

    this.getArrayFromTextArea = function () {
        var pixelArrayString = $("#testDisplay").text();
        var pixelArray = JSON.parse(pixelArrayString);
        return pixelArray;
    };

    this.getEmptyArray = function () {
        var pixelArrayString = $("#emptyArray").text();
        var pixelArray = JSON.parse(pixelArrayString);
        return pixelArray;
    };

    this.setArrayInTextArea = function (pixelArray) {
        var pixelArrayString = JSON.stringify(pixelArray);
        $("#testDisplay").text(pixelArrayString);
    };

    this.setCellsColoursByArray = function (pixelArray) {
        for (var i = 0; i < $thisGameOfLife.rowNumber; i++) {
            for (var j = 0; j < $thisGameOfLife.columnNumber; j++) {
                var cell = document.getElementById("cell_" + i.toString() + "_" + j.toString());
                var newClass = pixelArray[i][j] === 1 ? "game-of-life-alive" : "game-of-life-dead";
                $(cell).removeClass("game-of-life-alive game-of-life-dead").addClass(newClass);
            }
        }
    };

    this.oneStepLoopArray = function (startArray) {
        var resultArray = $thisGameOfLife.getEmptyArray();
        for (var i = 0; i < $thisGameOfLife.rowNumber; i++) {
            for (var j = 0; j < $thisGameOfLife.columnNumber; j++) {
                var liveNeighbors = 0;
                var limitTop = i - 1 < 0 ? $thisGameOfLife.rowNumber - 1 : i - 1;
                var limitBottom = i + 1 < $thisGameOfLife.rowNumber ? i + 1 : 0;
                var limitLeft = j - 1 < 0 ? $thisGameOfLife.columnNumber - 1 : j - 1;
                var limitRight = j + 1 < $thisGameOfLife.columnNumber ? j + 1 : 0;
                startArray[limitTop][limitLeft] === 1 ? liveNeighbors++ : null;
                startArray[limitTop][j] === 1 ? liveNeighbors++ : null;
                startArray[limitTop][limitRight] === 1 ? liveNeighbors++ : null;
                startArray[i][limitLeft] === 1 ? liveNeighbors++ : null;
                startArray[i][limitRight] === 1 ? liveNeighbors++ : null;
                startArray[limitBottom][limitLeft] === 1 ? liveNeighbors++ : null;
                startArray[limitBottom][j] === 1 ? liveNeighbors++ : null;
                startArray[limitBottom][limitRight] === 1 ? liveNeighbors++ : null;

                if (startArray[i][j] === 0) {
                    if (jQuery.inArray(liveNeighbors, $thisGameOfLife.bornList) !== -1) {
                        resultArray[i][j] = 1;
                    } else {
                        resultArray[i][j] = 0;
                    }
                } else {
                    if (jQuery.inArray(liveNeighbors, $thisGameOfLife.aliveList) === -1) {
                        resultArray[i][j] = 0;
                    } else {
                        resultArray[i][j] = 1;
                    }
                }
            }
        }
        return resultArray;
    };

    function increaseStep() {
        $thisGameOfLife.stepCounter++;
        $("#test2").val($thisGameOfLife.stepCounter);
    }

    this.oneStepLoopArrayColors = function (startArray) {
        var resultArray = $thisGameOfLife.getEmptyArray();
        for (var i = 0; i < $thisGameOfLife.rowNumber; i++) {
            for (var j = 0; j < $thisGameOfLife.columnNumber; j++) {
                var liveNeighbors = 0;
                var limitTop = i - 1 < 0 ? $thisGameOfLife.rowNumber - 1 : i - 1;
                var limitBottom = i + 1 < $thisGameOfLife.rowNumber ? i + 1 : 0;
                var limitLeft = j - 1 < 0 ? $thisGameOfLife.columnNumber - 1 : j - 1;
                var limitRight = j + 1 < $thisGameOfLife.columnNumber ? j + 1 : 0;
                startArray[limitTop][limitLeft] === 1 ? liveNeighbors++ : null;
                startArray[limitTop][j] === 1 ? liveNeighbors++ : null;
                startArray[limitTop][limitRight] === 1 ? liveNeighbors++ : null;
                startArray[i][limitLeft] === 1 ? liveNeighbors++ : null;
                startArray[i][limitRight] === 1 ? liveNeighbors++ : null;
                startArray[limitBottom][limitLeft] === 1 ? liveNeighbors++ : null;
                startArray[limitBottom][j] === 1 ? liveNeighbors++ : null;
                startArray[limitBottom][limitRight] === 1 ? liveNeighbors++ : null;

                var cell = document.getElementById("cell_" + i.toString() + "_" + j.toString());
                if (startArray[i][j] === 0) {
                    if (jQuery.inArray(liveNeighbors, $thisGameOfLife.bornList) !== -1) {
                        resultArray[i][j] = 1;
                        $(cell).removeClass("game-of-life-dead").addClass("game-of-life-alive");
                    } else {
                        resultArray[i][j] = 0;
                    }
                } else {
                    if (jQuery.inArray(liveNeighbors, $thisGameOfLife.aliveList) === -1) {
                        resultArray[i][j] = 0;
                        $(cell).removeClass("game-of-life-alive").addClass("game-of-life-dead");
                    } else {
                        resultArray[i][j] = 1;
                    }
                }
            }
        }
        return resultArray;
    };


    this.startLife = function () {
        if ($("#start").prop("checked")) {
            $thisGameOfLife.currentPixelArray = $thisGameOfLife.getArrayFromTextArea();
            $thisGameOfLife.timer = setInterval(liveTimer, 50);
        } else {
            clearInterval($thisGameOfLife.timer);
            $thisGameOfLife.setArrayInTextArea($thisGameOfLife.currentPixelArray);
        }
    };

    function liveTimer() {
        increaseStep();
        $thisGameOfLife.currentPixelArray = $thisGameOfLife.oneStepLoopArrayColors($thisGameOfLife.currentPixelArray);
    }

    function refreshStepCounter() {
        $thisGameOfLife.stepCounter = 0;
        $("#test2").val($thisGameOfLife.stepCounter);
    }

    this.goToTypedStep = function () {
        var stepToGo = parseInt($("#test2").val());
        var step = $thisGameOfLife.stepCounter;
        var pixelArray = $thisGameOfLife.currentPixelArray;
        while (step < stepToGo) {
            pixelArray = $thisGameOfLife.oneStepLoopArray(pixelArray);
            step++;
        }
        $thisGameOfLife.currentPixelArray = pixelArray;
        $thisGameOfLife.setCellsColoursByArray($thisGameOfLife.currentPixelArray);
        $thisGameOfLife.setArrayInTextArea($thisGameOfLife.currentPixelArray);
        $thisGameOfLife.stepCounter = step;
    };
};