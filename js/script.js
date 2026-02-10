const display = document.getElementById("display");
const workers = document.getElementById("workers");

const genspeedcost = document.getElementById("genspeedcost");
const genamtcost = document.getElementById("genamtcost");
const workercost = document.getElementById("workercost");

const value = document.getElementById("value");
const level = document.getElementById("lvl");
const xp = document.getElementById("exp");

const upggenspdbtn = document.getElementById("upggenspdbtn");
const upggenamtbtn = document.getElementById("upggenamtbtn");
const buyworkerbtn = document.getElementById("buyworkerbtn");

const gameData = loadGame();

var generatorInterval = -1;
var workerExecutors = [];

function createWorkerExecutors() {
    for (let i = 0; i < gameData.workers.length; i++) {
        workerExecutors.push({"executor": new bfworker(gameData.array, gameData.workers[i].code), "held": null, "active": null});
    }
}

function setAllActive(bool) {
    for (let i = 0; i < workerExecutors.length; i++) {
        if (workerExecutors[i].active.checked == bool) continue;
        workerExecutors[i].active.checked = bool;
        workerExecutors[i].active.dispatchEvent(new Event('change'));
    }
}

function xpReq() {
    return gameData.level * gameData.level * 0.5;
}

// still have to call disp
function addXp(amt) {
    gameData.xp += amt;
    if (gameData.xp >= xpReq()) {
        gameData.xp = 0;
        gameData.level++;

        if (gameData.array.length < 30) gameData.array.unshift(0);
        displayArray();
    }
}

function displayNumbers() {
    genspeedcost.innerHTML = gameData.genspeedcost;
    genamtcost.innerHTML = gameData.genamtcost;
    workercost.innerHTML = gameData.workercost;

    value.innerHTML = gameData.value;
    level.innerHTML = gameData.level;
    xp.value = gameData.xp / xpReq();

    upggenspdbtn.disabled = gameData.value < gameData.genspeedcost;
    upggenamtbtn.disabled = gameData.value < gameData.genamtcost;
    buyworkerbtn.disabled = gameData.value < gameData.workercost;
}

function displayArray() {
    display.innerHTML = "";
    for (let i = 0; i < gameData.array.length; i++) {
        display.innerHTML += gameData.array[i];

        for (let j = 0; j < workerExecutors.length; j++) {
            if (workerExecutors[j].executor.dc == i) {
                display.innerHTML += "<sup><sup>$"+j+"</sup></sup> ";
            }
        }

        if (i == gameData.array.length - 1) display.innerHTML += "<sub>goal</sub>";
        else display.innerHTML += " ";
    }
}

function displayWorkers() {
    workers.innerHTML = "";
    for (let i = 0; i < gameData.workers.length; i++) {
        const row = document.createElement("tr");
        const tdnum = document.createElement("td");
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
        tdnum.innerHTML = i + 1;

        tdtext.append(textarea);
        tdactive.append(checkbox);

        row.append(tdnum);
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
    const cellIndex = Math.floor((gameData.array.length - 1) * Math.random());
    gameData.array[cellIndex] += gameData.genAmount;
    displayArray();
}

function sellerUpdate() {
    gameData.value += gameData.array[gameData.array.length - 1];
    addXp(gameData.array[gameData.array.length - 1] * gameData.array[gameData.array.length - 1]);
    gameData.array[gameData.array.length - 1] = 0;
    displayNumbers();
}

function workersUpdate() {
    save();
    for (let i = 0; i < workerExecutors.length; i++) {
        gameData.workers[i].code = workerExecutors[i].executor.commands;
        gameData.workers[i].held = workerExecutors[i].executor.held;
        workerExecutors[i].held.innerHTML = workerExecutors[i].executor.held + "v";
        workerExecutors[i].active.checked = workerExecutors[i].executor.active;

        if (!workerExecutors[i].executor.active) continue;

        setTimeout(function() {
            workerExecutors[i].executor.run();
            addXp(1);
            displayNumbers();
            displayArray();
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
        workerExecutors.push({"executor": new bfworker(gameData.array, gameData.workers[index - 1].code), "held": null, "active": null});
        displayNumbers();
        displayWorkers();
    }
}

createWorkerExecutors();

displayWorkers();
displayArray();
displayNumbers();

setGeneratorUpdate();
setInterval(sellerUpdate, 1000);
setInterval(workersUpdate, 500);

function save() {
    saveGame(gameData);
}

window.addEventListener("beforeunload", save);
