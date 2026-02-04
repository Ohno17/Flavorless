const display = document.getElementById("display");
const workers = document.getElementById("workers")

const genspeedcost = document.getElementById("genspeedcost");
const genamtcost = document.getElementById("genamtcost");
const workercost = document.getElementById("workercost");
const value = document.getElementById("value");

const upggenspdbtn = document.getElementById("upggenspdbtn");
const upggenamtbtn = document.getElementById("upggenamtbtn");
const buyworkerbtn = document.getElementById("buyworkerbtn");

const array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const gameData = loadGame();

var generatorInterval = -1;
var workerExecutors = [];

function createWorkerExecutors() {
    for (let i = 0; i < gameData.workers.length; i++) {
        workerExecutors.push({"executor": new bfworker(array, gameData.workers[i].code), "held": null, "active": null});
    }
}

function displayNumbers() {
    genspeedcost.innerHTML = gameData.genspeedcost;
    genamtcost.innerHTML = gameData.genamtcost;
    workercost.innerHTML = gameData.workercost;
    value.innerHTML = gameData.value;

    upggenspdbtn.disabled = gameData.value < gameData.genspeedcost;
    upggenamtbtn.disabled = gameData.value < gameData.genamtcost;
    buyworkerbtn.disabled = gameData.value < gameData.workercost;
}

function displayArray() {
    display.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        if (i == array.length - 1)
            display.innerHTML += "<" + array[i] + "> ";
        else
            display.innerHTML += array[i] + " ";
    }
}

function displayWorkers() {
    workers.innerHTML = "";
    for (let i = 0; i < gameData.workers.length; i++) {
        const row = document.createElement("tr");
        const tdtext = document.createElement("td");
        const tdheld = document.createElement("td");
        const tdactive = document.createElement("td");
        const textarea = document.createElement("textarea");
        const checkbox = document.createElement("input");

        textarea.innerHTML = gameData.workers[i].code;
        textarea.rows = "6";
        textarea.cols = "40";
        textarea.onchange = function() {
            workerExecutors[i].executor.reset(textarea.value);
            checkbox.checked = false;
        };
        tdheld.innerHTML = gameData.workers[i].held + "v";
        workerExecutors[i].held = tdheld;
        checkbox.type = "checkbox";
        checkbox.checked = workerExecutors[i].executor.active;
        workerExecutors[i].active = checkbox;
        checkbox.onchange = function() {
            workerExecutors[i].executor.reset(textarea.value);
            workerExecutors[i].executor.active = checkbox.checked;
        };

        tdtext.append(textarea);
        tdactive.append(checkbox);

        row.append(tdtext);
        row.append(tdheld);
        row.append(tdactive);

        workers.append(row);
    }
}

function setGeneratorUpdate() {
    if (generatorInterval !== -1) clearInterval(generatorInterval);
    generatorInterval = setInterval(generatorUpdate, gameData.genTime);
}

function generatorUpdate() {
    const cellIndex = Math.floor((array.length - 1) * Math.random());
    array[cellIndex] += gameData.genAmount;
    displayArray();
}

function sellerUpdate() {
    if (array[array.length - 1] > 0) {array[array.length - 1]--;
    gameData.value++;displayNumbers();}
}

function workersUpdate() {
    for (let i = 0; i < workerExecutors.length; i++) {
        gameData.workers[i].code = workerExecutors[i].executor.commands;
        gameData.workers[i].held = workerExecutors[i].executor.held + "v";
        workerExecutors[i].held.innerHTML = workerExecutors[i].executor.held;
        workerExecutors[i].active.checked = workerExecutors[i].executor.active;

        if (!workerExecutors[i].executor.active) continue;

        setTimeout(function() {
            workerExecutors[i].executor.run();
        }, Math.random() * 500);
    }
}

function cost(cost) {
    if (cost > gameData.value) return false;
    gameData.value -= cost;
    displayNumbers();
    return true;
}

function upgradeGeneratorSpeed() {
    if (cost(gameData.genspeedcost)) {
        gameData.genTime *= 0.75;
        gameData.genspeedcost = Math.floor(gameData.genspeedcost * 1.6);
        setGeneratorUpdate();
        displayNumbers();
    }
}

function upgradeGeneratorAmount() {
    if (cost(gameData.genamtcost)) {
        gameData.genAmount = Math.floor(gameData.genAmount * 1.4);
        gameData.genamtcost = Math.floor(gameData.genamtcost * 1.6);
        displayNumbers();
    }
}

function buyWorker() {
    if (cost(gameData.workercost)) {
        gameData.workercost = Math.floor(gameData.workercost * 1.7);

        const index = gameData.workers.push({"code":"enter code here", "held": 0});
        workerExecutors.push({"executor": new bfworker(array, gameData.workers[index - 1].code), "held": null, "active": null});
        displayNumbers();
        displayWorkers();
    }
}

createWorkerExecutors();

displayWorkers();
displayArray();
displayNumbers();

setGeneratorUpdate();
setInterval(sellerUpdate, 350);
setInterval(workersUpdate, 500);

function save() {
    saveGame(gameData);
}

setInterval(save, 1000);
window.addEventListener("beforeunload", save);
