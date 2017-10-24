// DOM
const canvas = document.getElementById('ominus');
const context = canvas.getContext('2d');

const DOMspeed = document.getElementById('speed');
const DOMspeedDisplay = document.getElementById('speedDisplay');
let speed = 0;

const DOMscale = document.getElementById('scale');
const DOMscaleDisplay = document.getElementById('scaleDisplay');

const DOMnationCount = document.getElementById('nationCount');
const DOMnationCountDisplay = document.getElementById('nationCountDisplay');

const DOMcontinentWidth = document.getElementById('continentWidth');
const DOMcontinentWidthDisplay = document.getElementById('continentWidthDisplay');

const DOMcontinentHeight = document.getElementById('continentHeight');
const DOMcontinentHeightDisplay = document.getElementById('continentHeightDisplay');

// variables
const continent = new Continent(0, 0);
let nations = [];
let nationCount = 5;

let camOffset = {
	x: 0,
	y: 0
};
let camDir = {
	x: 0,
	y: 0
}

let overclock = 1;

function draw() {
	background('#000');
	continent.draw();
}

function nextRound() {
	if (!pause) {
		for (let anotherturn = 0; anotherturn < overclock; anotherturn++) {

			nations.forEach(nation => {
				nation.nextTurn();
			});
		}

		if (nations.length == 1) {
			if (nations[0].outerCells.length + nations[0].innerCells.length < continent.cells.length) {
				setTimeout(nextRound, speed);

			}
		} else if (nations.length > 1) {
			setTimeout(nextRound, speed);
		}
	}
}

function start() {
	continent.createNew(DOMcontinentWidth.value, DOMcontinentHeight.value);
	nations = [];
	nationCount = DOMnationCount.value;
	for (let i = 0; i < nationCount; i++) {
		nations.push(new Nation(i));
	}



	for (let i = 0; i < nations.length; i++) {
		let x = Math.random() * continent.cells[0].length | 0;
		let y = Math.random() * continent.cells.length | 0;
		let maxIterations = 200;
		while (continent.cells[y][x].state != undefined && maxIterations--) {
			x = Math.random() * continent.cells[0].length | 0;
			y = Math.random() * continent.cells.length | 0;
		}
		continent.cells[y][x].nation = nations[i];
		nations[i].outerCells.push(continent.cells[y][x]);
	}


	nextRound();
}

let pause = false;

function togglePause() {
	pause = pause ? false : true;
	if (!pause) {
		nextRound();
	}
}

let lastTime = 0;

function updateMenu(time = 0) {
	let dt = time - lastTime;
	lastTime = time;

	// update DOM
	speed = DOMspeed.value * 100;
	DOMspeedDisplay.innerText = 'Alle ' + (speed / 1000).toFixed(1) + ' Sekunden';

	continent.scale = DOMscale.value;
	DOMscaleDisplay.innerText = 'x' + (DOMscale.value / 40).toFixed(1);

	DOMnationCountDisplay.innerText = DOMnationCount.value;
	DOMcontinentWidthDisplay.innerText = DOMcontinentWidth.value;
	DOMcontinentHeightDisplay.innerText = DOMcontinentHeight.value;

	// draw
	camOffset.x -= camDir.x * dt;
	camOffset.x = constrain(camOffset.x, -50, (parseInt(continent.width * continent.scale) + 50) - canvas.width);
	camOffset.y -= camDir.y * dt;
	camOffset.y = constrain(camOffset.y, -50, (parseInt(continent.height * continent.scale) + 300) - canvas.height);
	draw();

	// recall
	requestAnimationFrame(updateMenu);
}


updateMenu();