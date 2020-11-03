"use strict";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGTH = 600;
const GENOM = [];
const GENOM_LENGTH = 16;
const WORLD_X = 5;
const WORLD_Y = 5;
let bot_obj = {};

for (let i = GENOM_LENGTH; i > 0; i--) {
	GENOM.push(getRandomInt(0, 5));
}

function Create2DArray(rows = 5, columns = 5) {
	let x = new Array(rows);
	for (let i = 0; i < rows; i++) {
		x[i] = new Array(columns);
	}
	return x;
 }

function getRandomInt(min, max) {
	if (min < max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * (min - max + 1)) + max;
	}
}

//console.log(GENOM);
//console.log("Genom length is: " + GENOM.length);

function GenomVM(botGenom) {
	let breakFlag = 0;
	let actCounter = 16;
	let adr = 0;

	let energy = 999;
	let direction = 0; //* направление взгляда бота 1 сев, 2 сев-вос, 3 восток ... 8 сев-зап, 0 - никуда
	let posX = 1;
	let posY = 1;

	while (breakFlag != 1 && actCounter > 0) {
		switch (botGenom[adr]) {
			case 0:
				adr = incAdr(adr);
				genomMutate(botGenom);
				actCounter--;
				// console.log("Mutate and Go To: " + adr);
				// console.log(botGenom);
				break;
			case 1:
				adr = incAdr(adr);
				actCounter--;
				// console.log("1 Go To adr: " + adr);
				break;
			case 2:
				adr = jumpAdr(adr, 2);
				actCounter--;
				// console.log("2 Go To adr: " + adr);
				break;
			case 3:
				adr = jumpAdr(adr, 3);
				actCounter--;
				// console.log("3 Go To adr: " + adr);
				break;
			case 4:
				adr = jumpAdr(adr, 4);
				actCounter--;
				// console.log("4 Go To adr: " + adr);
				break;
			case 5:
				adr = jumpAdr(adr, 5);
				actCounter--;
				// console.log("5 Go To adr: " + adr);
				break;
			default:
				adr = 0;
				// console.log("Bad jump. Go To adr: " + adr);
				breakFlag = 1;
				break;
		}
	}
}

function jumpAdr(adr, step) {
	adr += step;
	adr = adr % GENOM_LENGTH;
	return adr;
}

function incAdr(adr) {
	adr++;
	adr = adr % GENOM_LENGTH;
	return adr;
}

function genomMutate(botGenom) {
	let pos = getRandomInt(0, botGenom.length - 1);
	let oldGen = botGenom[pos];
	while (oldGen == botGenom[pos]) {
		botGenom[pos] = getRandomInt(0, 5);
	}
	return botGenom;
}

// TODO: функция проверки объекта в направлении взягляда бота
function botCheckDirection(botGenom) {
	
}

function incEnergy(energy, increment) {
	(energy + increment <= 999) ?
	(energy += increment) :
	(energy = 999);
	if (energy + increment <= 0) {
		energy = 0;
	} 
	return energy;
}

function decEnergy(energy, increment) {
	(energy - increment > 0) ?
	(energy -= increment) :
	(energy = 0);
	return energy;
}

bot_obj = {
	energy: 999,
	direction: 0, //* направление взгляда бота 1 сев, 2 сев-вос, 3 восток ... 8 сев-зап, 0 - никуда
	posX: 1,
	posY: 1,
	genom: GENOM
}

function pullTheWorld(arr) {
	for(let j = 0; j < arr.length; j++) {
		for(let i = 0; i < arr[j].length; i++) {
			arr[j][i] = ''+ i + j;
			// TODO: здесь должна быть функция добавления объектов на землю
		}
	}
	return arr;
}

// TODO: один такт местного времени
function tick(params) {
	return
}

// TODO: отрисовка канваса, должна вызываться каждый тик
function render(params) {
	return
}

let worldMatrix = Create2DArray(WORLD_X,WORLD_Y);

pullTheWorld(worldMatrix);

console.log(worldMatrix);

//GenomVM(bot_obj.genom);

//console.log(GENOM);

