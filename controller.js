// constants
MEMORY_SIZE = 100;
KNOWN_CODES = {
    "Hello world" : "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>."
}

// app
var app = angular.module('myApp', []);

// Commands
Commands = {};
Commands['>'] = function() { this.memoryPointer++; }
Commands['<'] = function() { this.memoryPointer--; }
Commands['+'] = function() { this.memory[this.memoryPointer]++; }
Commands['-'] = function() { this.memory[this.memoryPointer]--; }
Commands[','] = function() {
    var input = "";
    while (input.length == 0) {
        input = prompt("enter one character for input");
    }

    var value = input.charCodeAt(0);
    this.standardInput.push(input.charAt(0));
    this.memory[this.memoryPointer] = value;
}
Commands['.'] = function() {
    var char = String.fromCharCode(this.memory[this.memoryPointer]);
    this.standardOutput.push(char);
}
Commands['['] = function() { if (this.memory[this.memoryPointer] == 0) this._moveToLoopEnd(); }
Commands[']'] = function() { if (this.memory[this.memoryPointer] > 0) this._moveToLoopBeginning(); }

// Controller 
function brainfuckController($scope, $timeout) {
    // setup memory
    $scope.ops = 10;
    $scope.memory = new Array(MEMORY_SIZE);

    // others
    $scope.memoryPointer = 0;
    $scope.codePointer = -1;
    $scope.code = KNOWN_CODES["Hello world"];
    $scope.standardOutput = [];
    $scope.standardInput = [];
    $scope.isStarted = false;
    $scope.isRunning = false;
    $scope.isFinished = false;

    $scope._reset = function () {
        for (var i = 0; i < MEMORY_SIZE; i++) this.memory[i] = 0;

        this.memoryPointer = 0;
        this.codePointer = -1;
        this.standardOutput = [];
        this.standardInput = [];
        this.isStarted = false;
        this.isRunning = false;
        this.isFinished = false;
    };
    $scope._reset();

    // actions
    $scope.run = function () {
        if (this.isRunning) {
            alert("A code is already running!");
            return;
        }

        this.isRunning = true;
        this._runNext();
    }

    $scope.pause = function () {
        this.isRunning = false;
    }

    $scope.next = function () {
        if (this.isRunning) {
            alert("A code is already running!");
            return;
        }

        this._runNext(true);
    }

    $scope.reset = function () {
        this._reset();
    }

    // private methods
    $scope._runNext = function (doNotRecurse) {
        if (!this.isRunning && !doNotRecurse) {
            return;
        }

        this.isStarted = true;

        if (this.codePointer >= this.code.length) {
            this._runFinished();
            return;
        }

        if (this.codePointer < 0) this._moveToNextSymbol();

        this._runSymbol(this._getSymbol());

        this._moveToNextSymbol();

        var me = this;

        if (!doNotRecurse) {
            $timeout(function () {
                me._runNext();
            }, 1000 / this.ops);
        }
    }

    $scope._getSymbol = function() { return this.code[this.codePointer]; }

    $scope._moveToNextSymbol = function () {
        do{
            this.codePointer++;
        } while (this.codePointer < this.code.length && !Commands[this._getSymbol()]);
    }

    $scope._runFinished = function () {
        this.isRunning = false;
        this.isFinished = true;
    }

    $scope._runSymbol = function(s) {
        var func = Commands[s];
        if (func) {
            func.call(this);
        }
    }

    $scope._moveToLoopEnd = function() {
        var skipCount = 0;

        this.codePointer++;
        while (true) {
            if (this.codePointer >= this.code.length) break;

            if (this._getSymbol() == ']') {
                if (skipCount == 0) break;
                skipCount--;
            }

            if (this._getSymbol() == '[') skipCount++;

            this.codePointer++;
        }
    }

    $scope._moveToLoopBeginning = function () {
        var skipCount = 0;

        this.codePointer--;
        while (true) {
            if (this.codePointer0) break;

            if (this._getSymbol() == '[') {
                if (skipCount == 0) break;
                skipCount--;
            }

            if (this._getSymbol() == ']') skipCount++;

            this.codePointer--;
        }
    }
}

// Controller directives
app.directive('ngSelectionStart', function () {
    return {
        link: function (scope, elm, attrs) {
            scope.$watch(attrs.ngSelectionStart, function (value) {
                elm[0].selectionStart = parseInt(value) || 0;
            }); 
        }
    };
});

app.directive('ngSelectionEnd', function () {
    return {
        link: function (scope, elm, attrs) {
            scope.$watch(attrs.ngSelectionEnd, function (value) {
                elm[0].selectionEnd = parseInt(value) || 0;
            });
        }
    };
});

