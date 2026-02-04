
function saveGame(gameData) {
    localStorage.setItem("save", JSON.stringify(gameData));
}

function loadGame() {
    const data = localStorage.getItem("save");
    if (data) {
        const parsed = JSON.parse(data);
        if (parsed) return parsed;
    }

    return {
        "value": 0,
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
