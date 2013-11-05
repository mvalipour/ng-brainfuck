// constants
MEMORY_SIZE = 100;

function brainfuckController($scope, $timeout) {
    // setup memory
    $scope.ops = 10;
    $scope.memory = new Array(MEMORY_SIZE);

    // others
    $scope.memoryPointer = 0;
    $scope.codePointer = 0;
    $scope.code = "++++++[>++++++++++<-]>+++++."; //A
    $scope.standardOutput = [];
    $scope.standardInput = [];
    $scope.isStarted = false;
    $scope.isRunning = false;
    $scope.isFinished = false;

    $scope._reset = function () {
        for (var i = 0; i < MEMORY_SIZE; i++) this.memory[i] = 0;

        this.memoryPointer = 0;
        this.codePointer = 0;
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

        this.isStarted = true;
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

        if (this.codePointer >= this.code.length) {
            this._runFinished();
            return;
        }

        this._runSymbol(this.code[this.codePointer]);
        this.codePointer++;

        var codeEl = $("#txtCode").get(0);
        codeEl.selectionStart = this.codePointer;
        codeEl.selectionEnd = this.codePointer + 1;

        var me = this;

        if (!doNotRecurse) {
            $timeout(function () {
                me._runNext();
            }, 1000 / this.ops);
        }
    }

    $scope._runFinished = function () {
        this.isRunning = false;
        this.isFinished = true;
    }

    $scope._runSymbol = function(s) {
        if (s == '>') {
            this.memoryPointer++;
        }
        else if (s == '<') {
            this.memoryPointer--;
        }
        else if (s == '+') {
            this.memory[this.memoryPointer]++;
        }
        else if (s == '-') {
            this.memory[this.memoryPointer]--;
        }
        else if (s == ',') {
            var input = "";
            while (input.length == 0) {
                input = prompt("enter one character for input");
            }

            var value = input.charCodeAt(0);
            this.standardInput.push(input.charAt(0));
            this.memory[this.memoryPointer] = value;
        }
        else if (s == '.') {
            var char = String.fromCharCode(this.memory[this.memoryPointer]);
            this.standardOutput.push(char);
        }
        else if (s == '[') {
            if (this.memory[this.memoryPointer] == 0) this._moveToLoopEnd();
        }
        else if (s == ']') {
            if (this.memory[this.memoryPointer] > 0) this._moveToLoopBeginning();
        }
        else {
            throw "symbold '" + s + "' is not a valid command";
        }
    }

    $scope._moveToLoopEnd = function() {
        var skipCount = 0;

        this.codePointer++;
        while (true) {
            if (this.codePointer >= this.code.length) break;

            if (this.code[this.codePointer] == ']') {
                if (skipCount == 0) break;
                skipCount--;
            }

            if (this.code[this.codePointer] == '[') skipCount++;

            this.codePointer++;
        }
    }

    $scope._moveToLoopBeginning = function () {
        var skipCount = 0;

        this.codePointer--;
        while (true) {
            if (this.codePointer0) break;

            if (this.code[this.codePointer] == '[') {
                if (skipCount == 0) break;
                skipCount--;
            }

            if (this.code[this.codePointer] == ']') skipCount++;

            this.codePointer--;
        }
    }

}
