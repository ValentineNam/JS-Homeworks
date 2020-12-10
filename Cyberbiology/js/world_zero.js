"use strict";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGTH = 600;
// const GENOM = [];
const GENOM_LENGTH = 16;
const WORLD_X = 5;
const WORLD_Y = 5;
let bot_obj = {};

let bot = {
    objType: 'bot',
    energy: [100,1024],
    age: [100,1024],
    minerals: [100,256],
    posX: 0,
    posY: 0,
    direction: 0,
    speed: 100,
    flagAttacked: 0,
    flagSleeping: 0,
    flagHungry: 0,
    flagAlive: 1,
    genom: []
}

let tree = {
    objType: 'tree',
    energy: [200,2048],
    age: [200,2048],
    minerals: [200,2048],
    posX: 1,
	posY: 1,
	flagAlive: 1  
}

let mineral = {
    objType: 'mineral',
    energy: [20,256],
    age: [200,4096],
    minerals: [2048,2048],
    posX: 1,
	posY: 1,
	flagAlive: 1  
}

// for (let i = GENOM_LENGTH; i > 0; i--) {
// 	GENOM.push(getRandomInt(0, 5));
// }

function create2DArray(rows = 5, columns = 5) {
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

//!  Почему-то работает не корректно...
function main() {
	let worldMatrix = create2DArray(WORLD_X,WORLD_Y);
	pullTheWorld(worldMatrix);
	for(let j = 0; j < worldMatrix.length; j++) {
		for(let i = 0; i < worldMatrix[j].length; i++) {
			let elem = worldMatrix[j][i];
			// console.log(elem);
			GenomVM(elem.genom);
			console.log(`x: ${elem.posX}, y: ${elem.posY}`);
			console.log(elem.genom);
		}
	}
	// worldMatrix.forEach(element => {
	// 	element.forEach(elem => {
	// 		GenomVM(elem.genom);
	// 		console.log(`x: ${elem.posX}, y: ${elem.posY}`);
	// 		console.log(elem.genom);
	// 	});
	// });
}

function GenomVM(botObject) {
	let breakFlag = 0;
	let actCounter = 16;
	let adr = 0;

	let energy = botObject.energy;
	let direction = botObject.direction; //* направление взгляда бота 1 сев, 2 сев-вос, 3 восток ... 8 сев-зап, 0 - никуда
	let posX = botObject.posX;
	let posY = botObject.posY;

	let botGenom = botObject.genom;

	while (breakFlag != 1 && actCounter > 0) {
		// console.log(`Action counter: ${actCounter}`);
		switch (botGenom[adr]) {
			case 0:
				adr = incAdr(adr);
				genomMutate(botGenom);
				actCounter--;
				// console.log("Mutate and Go To: " + adr);
				// console.log(botGenom);
				break;
			case 1: //Move front
				let frontCoordinates = getFrontCellCoordinates(botObject.direction, posX, posY);
				if (frontCoordinates != -1) {
					//ToDo: Понять что тут должно быть
					let frontObject = worldMatrix[frontCoordinates[0],frontCoordinates[1]];
					let x = botCheckDirection(frontObject.objType); 
					x != -1? true: false;
				};
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
function botCheckDirection(objType) {
	// ToDo: дописать передачу координат и типа объекта
	// если пусто = 0, родственник = 1, чужой бот = 2, дерево = 3, минерал = 4, стена = -1
	let x;
	switch (objType) {
		case 'space':
			x = 0;
			break;
		case 'relative':
			x = 1;
			break;
		case 'stranger':
			x = 2;
			break;
		case 'tree':
			x = 3;
			break;
		case 'mineral':
			x = 4;
			break;
		case 'wall':
			x = -1;
			break;
		default:
			x = 255;
			break;
	}
	return x;
}

// console.log(botCheckDirection('space'));
// console.log(botCheckDirection('relative'));
// console.log(botCheckDirection('stranger'));
// console.log(botCheckDirection('tree'));
// console.log(botCheckDirection('mineral'));
// console.log(botCheckDirection('wall'));
// console.log(botCheckDirection('somethingElse'));

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

function randomGenomGenerator(genomLength = 16, genomLowAdr = 0, genomHighAdr = 5) {
	let GENOM = [];
	for (let x = genomLength; x > 0; x--) {
		GENOM.push(getRandomInt(genomLowAdr, genomHighAdr));
	};
	return GENOM;
}

bot_obj = {
	energy: 999,
	direction: 0, //* направление взгляда бота 1 сев, 2 сев-вос, 3 восток ... 8 сев-зап, 0 - никуда
	posX: 0,
	posY: 0,
	genom: randomGenomGenerator(GENOM_LENGTH, 0, 5)
}

// TODO: Tree VM
function treeVM(params) {
	return
}

// TODO: Minerals VM
function mineralsVM(params) {
	return
}

// TODO: Create new bot
function createBot(params) {
	return
}

// TODO: Create new child
function createChild(params) {
	return
}

// TODO: Check genom diffs
function isRelative(a, b) {
	let x = -1;
	const MAX_DIFF = 2;
	let diff = 0;
	if (a.length == b.length) {
		for (let i = 0; i < a.length; i++) {
			if (a[i] != b[i]) {
				diff++;
			}
			if (diff > MAX_DIFF) {
				x = 0;
				break;
			}
		}
		if (diff <= MAX_DIFF) {
			x = 1;
		}
	}
	return x; // -1 разного размера геномы, 0 не родственники, 1 родственники
}

function pullTheWorld(arr) {
	for(let j = 0; j < arr.length; j++) {
		for(let i = 0; i < arr[j].length; i++) {
			arr[j][i] = bot_obj;
//			console.log(arr[j][i])
			arr[j][i].energy = getRandomInt(0, 999);
			arr[j][i].posX = j;
			arr[j][i].posY = i;
			arr[j][i].genom = randomGenomGenerator(GENOM_LENGTH, 0, 5);
			console.log(arr[j][i]);
			// TODO: здесь должна быть функция добавления объектов на землю
		}
	}
	return arr;
}

// TODO: один такт местного времени
function tick(params) {
	return
}

// TODO: отрисовка канваса - должна вызываться каждый тик. Пока что рисуем просто в консольку
function render(arr) {
	// setTimeout(() => console.clear(), 1000);
	for(let j = 0; j < arr.length; j++) {
		let line = '';
		for(let i = 0; i < arr[j].length; i++) {
			if (arr[j][i] != undefined && arr[j][i].objType == 'bot') {
				line += 'x';
			}
			else {
				line += 'o';
			}
		}
		console.log(line);
	}
}

//Вычисление координат клетки в направлении взгляда бота
// Прости меня будущий я, но как это сделать иначе мне не понятно 18.11.20
function getFrontCellCoordinates(viewDirection = 0, botPosX, botPosY) {
	let coordsXY = [undefined, undefined];
	if (viewDirection != 0) {
		switch (viewDirection) {
			case 1:
				if (botPosY != 0) {
					coordsXY = [botPosX, botPosY - 1];	
				} else {
					return -1;
				}
				break;
			case 2:
				if (botPosX < WORLD_X - 1 && botPosY != 0) {
					coordsXY = [botPosX + 1, botPosY - 1];	
				} else {
					return -1;
				}
				break;
			case 3:
				if (botPosX < WORLD_X - 1) {
					coordsXY = [botPosX + 1, botPosY];	
				} else {
					return -1;
				}
				break;
			case 4:
			if (botPosX < WORLD_X - 1 && botPosY < WORLD_Y - 1) {
				coordsXY = [botPosX + 1, botPosY + 1];	
			} else {
				return -1;
			}
			break;
			case 5:
			if (botPosY < WORLD_Y - 1) {
				coordsXY = [botPosX, botPosY + 1];	
			} else {
				return -1;
			}
			case 6:
			if (botPosX > 0 && botPosY < WORLD_Y - 1) {
				coordsXY = [botPosX - 1, botPosY + 1];	
			} else {
				return -1;
			}
			break;
			case 7:
			if (botPosX > 0) {
				coordsXY = [botPosX - 1, botPosY];	
			} else {
				return -1;
			}
			break;
			case 8:
			if (botPosX > 0 && botPosY > 0) {
				coordsXY = [botPosX - 1, botPosY - 1];	
			} else {
				return -1;
			}
			break;

			default:
				return -1;
				// break;
		}
	}
	return coordsXY; //[x,y] || -1
}

let worldMatrix = create2DArray(WORLD_X,WORLD_Y);
bot.genom = randomGenomGenerator(16, 0, 5);
worldMatrix[2][2] = bot;
// pullTheWorld(worldMatrix);

// console.log(worldMatrix);
// render(worldMatrix);
// console.log(getFrontCellCoordinates(1, 2, 3));
// console.log(getFrontCellCoordinates(1, 2, 1));
// console.log(getFrontCellCoordinates(1, 2, 0));
// console.log(getFrontCellCoordinates(2, 3, 1));
// console.log(getFrontCellCoordinates(2, 4, 0));
// console.log(getFrontCellCoordinates(2, 4, 1));
// console.log(getFrontCellCoordinates(3, 4, 1));
// console.log(getFrontCellCoordinates(3, 4, 0));
// console.log(getFrontCellCoordinates(3, 4, 1));
// console.log(getFrontCellCoordinates(4, 4, 1));
// console.log(getFrontCellCoordinates(4, 3, 4));
// console.log(getFrontCellCoordinates(4, 4, 3));
// console.log(getFrontCellCoordinates(5, 4, 1));
// console.log(getFrontCellCoordinates(5, 4, 0));
// console.log(getFrontCellCoordinates(5, 4, 4));
// console.log(getFrontCellCoordinates(6, 1, 4));
// console.log(getFrontCellCoordinates(6, 1, 4));
// console.log(getFrontCellCoordinates(6, 0, 4));
// console.log(getFrontCellCoordinates(7, 1, 0));
// console.log(getFrontCellCoordinates(7, 1, 4));
// console.log(getFrontCellCoordinates(7, 0, 4));
// console.log(getFrontCellCoordinates(8, 1, 1));
// console.log(getFrontCellCoordinates(8, 1, 0));
// console.log(getFrontCellCoordinates(8, 0, 4));

//console.log(bot_obj);
//GenomVM(bot_obj);
//console.log(bot_obj.genom);

//console.log(GENOM);
//main();
// let g0 = [1,2,3], g1 = [1,2,3,4,5], g2 = [1,2,3,0,0], g3 = [0,0,0,4,5];

// console.log('-1');
// console.log(isRelative(g0,g1));

// console.log('1');
// console.log(isRelative(g1,g2));

// console.log('0');
// console.log(isRelative(g2,g3));