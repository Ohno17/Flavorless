
function bfworker(array, commands) {
    this.array = array;
    this.commands = commands;
    this.operations = {};

    this.held = 0;
    this.active = false;

    this.pcstack = [];
    this.pc = 0;
    this.dc = 0;

    let self = this;

    this.operations["+"] = function() {
        if (self.held == 0) return;
        self.held--;
        self.array[self.dc]++;
        if (self.array[self.dc] > 255) self.dc = 0;
    };
    this.operations["-"] = function() {
        if (self.array[self.dc] == 0) return;
        self.held++;
        self.array[self.dc]--;
    };
    this.operations[">"] = function() {
        self.dc++;
        if (self.dc >= self.array.length) self.dc = 0;
    };
    this.operations["<"] = function() {
        self.dc--;
        if (self.dc < 0) self.dc = self.array.length - 1;
    };
    this.operations["."] = function() {
        console.log(self.array[self.dc]);
    };
    this.operations["["] = function() {
        self.pcstack.push(self.pc);
    };
    this.operations["]"] = function() {
        if (self.array[self.dc] != 0) self.pc = self.pcstack.pop() - 1;
    };
    this.operations["}"] = function() {
        if (self.held != 0) self.pc = self.pcstack.pop() - 1;
    };
}

bfworker.prototype.reset = function(commands) {
    this.commands = commands;
    this.active = false;
    this.pcstack = [];
    this.pc = 0;
    this.dc = 0;
}

bfworker.prototype.run = function() {
    let func = this.operations[this.commands[this.pc]];
    while (!func && this.pc < this.commands.length) {
        this.pc++;
        func = this.operations[this.commands[this.pc]];
    }
    if (func) func();

    this.pc++;
    if (this.pc >= this.commands.length) {
        this.pc = 0;
        this.active = false;
    }
};
