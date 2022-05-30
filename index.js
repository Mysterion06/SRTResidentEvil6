const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

var names = ['Leon', 'Helena', 'Chris', 'Piers', 'Jake', 'Sherry', 'Ada', 'Agent'];

window.onload = function () {
	getData();
	setInterval(getData, POLLING_RATE);
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log("Error: " + err);
		});
}

function GetColor(data) {
	if (data.HealthState == 1) return ["fine", "green"];
	else if (data.HealthState == 2) return ["fineToo", "yellow"];
	else if (data.HealthState == 3) return ["caution", "orange"];
	else if (data.HealthState == 4) return ["danger", "red"];
	return ["dead", "grey"];
}

function DrawProgressBar(current, max, percent, label, colors) {
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="bar"><div class="progressbar ${colors[0]}" style="width:${(percent * 100)}%">
		<div id="currentprogress">${label}${current} / ${max}</div><div class="${colors[1]}" id="percentprogress">${(percent * 100).toFixed(1)}%</div></div></div>`;
}

function DrawTextBlock(label, val, colors, hideParam) {
	if (hideParam) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title ${colors[0]}">${label}: <span class="${colors[1]}">${val}</span></div>`;
}

function GetPlayerDA(data, value) {
	var playerDA;
	if (data.PlayerID == 0 || data.PlayerID == 2 || data.PlayerID == 4 || data.PlayerID == 6) {
		switch (data.PlayerID + value) {
			case 0:
				return playerDA = data.Stats.DALeon;
			case 1:
				return playerDA = data.Stats.DAHelena;
			case 2:
				return playerDA = data.Stats.DAChris;
			case 3:
				return playerDA = data.Stats.DAPiers;
			case 4:
				return playerDA = data.Stats.DAJake;
			case 5:
				return playerDA = data.Stats.DASherry;
			case 6:
				return playerDA = data.Stats.DAAda;
			case 7:
				return playerDA = data.Stats.DAHunk;
			default:
		}
	} else {
		switch (data.PlayerID - value) {
			case 0:
				return playerDA = data.Stats.DALeon;
			case 1:
				return playerDA = data.Stats.DAHelena;
			case 2:
				return playerDA = data.Stats.DAChris;
			case 3:
				return playerDA = data.Stats.DAPiers;
			case 4:
				return playerDA = data.Stats.DAJake;
			case 5:
				return playerDA = data.Stats.DASherry;
			case 6:
				return playerDA = data.Stats.DAAda;
			case 7:
				return playerDA = data.Stats.DAHunk;
			default:
		}
	}
}

function ResidentEvil6(data) {
	let _colors = GetColor(data.Player);
	let _colors2 = GetColor(data.Player2);
	// Check which character we are playing currently to prevent showing wrong data
	if (data.PlayerID == 0 || data.PlayerID == 2 || data.PlayerID == 4 || data.PlayerID == 6) {
		// Player HP
		DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.PercentageHP, names[data.PlayerID] + ": ", _colors);
		DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.PercentageHP, names[data.PlayerID + 1] + ": ", _colors2);

		// Player DA
		DrawTextBlock("DA " + names[data.PlayerID], GetPlayerDA(data, 0), ["white", "green2"]);
		DrawTextBlock("DA " + names[data.PlayerID + 1], GetPlayerDA(data, 1), ["white", "green2"]);
	} else {
		// Player HP
		DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.PercentageHP, names[data.PlayerID - 1] + ": ", _colors);
		DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.PercentageHP, names[data.PlayerID] + ": ", _colors2);

		// Player DA
		DrawTextBlock("DA " + names[data.PlayerID - 1], GetPlayerDA(data, 1), ["white", "green2"]);
		DrawTextBlock("DA " + names[data.PlayerID], GetPlayerDA(data, 0), ["white", "green2"]);
	}

	// Enemy HP
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});

	// Versions
	DrawTextBlock("TV", data.VersionInfo, ["white", "green2"]);
	DrawTextBlock("GV", data.GameInfo, ["white", "green2"]);
}

function appendData(data) {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
	ResidentEvil6(data);
}
