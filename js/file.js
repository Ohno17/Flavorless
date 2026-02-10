const fullResetButton = document.getElementById("fullResetButton");

let fullResetArmed = false;

function saveGame(gameData) {
    localStorage.setItem("save", JSON.stringify(gameData));
}

function loadGame(reset) {
    const data = localStorage.getItem("save");

    if (reset) {
        if (data) localStorage.setItem("failed", data);
        localStorage.removeItem("save");
        window.removeEventListener("beforeunload", save);
        window.location.reload();

        return;
    }

    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (parsed) return parsed;
        } catch (e) {
            localStorage.setItem("failed", data);
            console.error("Failed to parse save. Loading fallback...");
        }
    }

    return {
        "array": [0,0,0,0,0],

        "value": 0,
        "level": 1,
        "xp": 0,

        "genTime": 1000,
        "genAmount": 1,

        "genspeedcost": 20,
        "genamtcost": 10,
        "workercost": 5,

        "workers": [
            {"code": "enter code here\n[->+]", "held": 0}
        ]
    };
}

function fullReset() {
    if (fullResetArmed) {
        loadGame(true);
        return;
    }

    fullResetArmed = true;
    fullResetButton.innerHTML = "Are you sure? Click again to confirm";
    setTimeout(function() {
        fullResetArmed = false;
        fullResetButton.innerHTML = "Reset Game";
    }, 2000);
}
