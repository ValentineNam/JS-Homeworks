'use strict'

import { drawTree, drawBush, drawGrass, drawBot } from './draw_models.js';

const
	CANVAS_WIDTH = 601,
	CANVAS_HEIGTH = 601,
	GRID_SIZE = 30,
	GENOM_LENGTH = 16,
	MUTATION_FACTOR = 15,
	GENS = 11, // количество разных генов
	STEPS = 200;

let render_speed = 1,
	timerId,
	world_width = Math.floor(CANVAS_WIDTH / GRID_SIZE),
	world_heigth = Math.floor(CANVAS_HEIGTH / GRID_SIZE);

let worldTime = 0;
let worldEnergy = world_width * world_heigth * 256;
let fullWorldEnergy = 0;

let worldMatrix = create2DArray(world_width, world_heigth);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGTH;

/* Класс бот */
class Bot {
	constructor(x, y, color) {
		this.objType = 'bot';
		this.age = [0,1024];
		this.x = x;
		this.y = y;
		this.color = color; // ! ToDo: цвет наследуется от предков и зависит от характера питания
		this.direction = 1;
		this.flagAttacked = [0,0]; // * позиция 0 - в текущем ходе, 1я - в предыдущем; 1-8 - направление, откуда атакаван или 0 - не атакован
		this.flagSleeping = 0; // * 1-10 спит, 0 не спит
		this.flagHungry = 0;
		this.flagMoved = 0;
		this.flagAlive = 1;
		this.energy = [0,1024];
		this.minerals = [0,256];
		this.speed = 10;
		this.genom = []; // * от этого генома зависит поведение бота, по сути этого его ментальная программа
		this.paramsGenom = []; // ! ToDo: сделать параметрический геном, от которого зависит - какие параметры какие значения будут иметь
		this.eatings = [0,0,0,0];   // * кушает 0 - растения, 1 - других ботов, 2 - мясо, 3 - минералы
	}
/* Метод генерации рандомного генома */
	generateRandomGenom() {
		this.genom = randomGenomGenerator();
	}
/* Метод отрисовки бота на холсте */
	draw() {
		let s = GRID_SIZE / 10; // scale
		let x = this.x * 10,
			y = this.y * 10;
		drawBot(ctx, x, y, s, this.color);
	}
/* Метод увеличения возраста */
	incAge = incrementAge;
/* Метод перемещения в направлении взгляда */    
	move() {
		let moveSpeed = setMoveSpeed(this);
		checkEnergyForMove(this, moveSpeed) ? botMove(this, moveSpeed) : botSleep(this);
	}
/* Метод изменения направления взгляда */    
	changeDirection(opt) {
		this.direction = chooseNewDirection(this.direction, opt);
	}
/* Метод поедания объекта, находящегося спереди в направлении взгляда */   
	eat() {
		botEatFrontObject(this);
	}
/* Метод получения энергии из окружающего пространства */   
	getGreenEnergy() {
		photosynthesis(this);
	}
/* Метод проверки бота - жив ли он? */   
	isAlive() {
		checkIsAlive(this);
		if (this.flagAlive == 0) {
			worldEnergy += this.energy[0] + 4 * this.minerals[0];
			worldMatrix[this.x][this.y] = new Space(this.x, this.y);
		}
	}
/* Метод обработки сна */
	isSleeping() {
		sleepingMechanics(this);
	}
/* Метод проверки возможности создания нового бота */    
	createChild = botMakeChild;
/* Метод создания нового бота */     
	checkMakeChild = botCheckMakeChild;
/* Метод переводит флаг движения в состояние 0 */
	clearMoveParams() {
		this.flagMoved = 0;
	}
}

function setMoveSpeed(botObj) {
	let eLvl = checkOwnParamLvl(botObj, 'energy'),
		mLvl = checkOwnParamLvl(botObj, 'minerals');
	return (botObj.direction % 2 == 1) ?
		10 - eLvl +  Math.ceil(mLvl / 2) :
		Math.ceil(1.41 * (10 - eLvl +  (mLvl / 2)));   // * шаг по диагонали требует в 1.41 раз больше энергии
}

function botMove(botObj, moveSpeed) {
	let ax = botObj.x,
		ay = botObj.y,
		frontCoords = getFrontCellCoordinates(botObj.direction, ax, ay);
	if ((frontCoords != -1) && (botObj.flagMoved != 1)) {
		let bx = frontCoords[0],
			by = frontCoords[1];
		let frontObj = botCheckDirection(botObj, bx, by);
		if (frontObj == 0) {
			worldMatrix[bx][by] = botObj;
			worldMatrix[bx][by].x = bx;
			worldMatrix[bx][by].y = by;
			worldMatrix[ax][ay] = new Space();
			botDecEnergy(botObj, moveSpeed);
			botObj.flagMoved = 1;
		}
	}
}

function botEatFrontObject(botObj) {
	let ax = botObj.x,
		ay = botObj.y,
		frontCoords = getFrontCellCoordinates(botObj.direction, ax, ay);
	if ((frontCoords != -1) && (botObj.flagMoved != 1)) {
		let bx = frontCoords[0],
			by = frontCoords[1];
		let frontObjType = botCheckDirection(botObj, bx, by);
		// * если пусто = 0, родственник = 1, чужой бот = 2, мясо = 3, дерево = 4, минерал = 5, стена = -1, ошибка 255
		switch (frontObjType) {
			// * группируем кейсы 1-5
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
				eatFromCoords(botObj, bx, by);
				break;
		
			default:
				break;
		}
	}
}

function eatFromCoords(botObj, x, y) {
	let frontObj = worldMatrix[x][y],
		frontType = frontObj.objType,
		energyLvl = checkOwnParamLvl(botObj, 'energy'),
		multiplier = 1;
	if (energyLvl <= 2) {
		botObj.flagHungry = 1;
	}
	if (botObj.flagHungry == 1) {
		multiplier = 2.5;
	}
	switch (frontType) {
		case 'bot':
			botEatBot(botObj, frontObj, multiplier);
			break;
		case 'tree':
			botEatTree(botObj, frontObj, multiplier);
			break;
		case 'mineral':
			botEatMineral(botObj, frontObj, multiplier);
			break;
		default:
			break;
	}
}

// ! ToDo: Дописать эту функцию - случай, когда бот не смог победить
function botEatBot(botObj, frontObj, multiplier) {
	let aMinerals = botObj.minerals[0],
		bMinerals = frontObj.minerals[0],
		chanceToWin = getRandomInt(1, 100);
	if (bMinerals > aMinerals) { // * если атакуемый бот "толще" по минералам
		chanceToWin > 0 ?
			botWin(botObj, frontObj, multiplier) : // * откусили (20% шанс)
			false ; // * не откусили (80% шанс) потратили свою энергию, потратили свои минералы и уменьшили минералы атакуемого
	} else {
		chanceToWin > 0 ?
			botWin(botObj, frontObj, multiplier) : // * откусили (80% шанс)
			false ; // * не откусили (20% шанс)
	}
}

/* Функция победы в бою - бот откусывает часть энергии и минералов */
function botWin(botObj, frontObj, multiplier = 1) {
	let aEnergy = botObj.energy[0],
		aMinerals = botObj.minerals[0],
		bEnergy = frontObj.energy[0],
		bMinerals = frontObj.minerals[0],
		oneBite = 80;
	multiplier * oneBite >= bEnergy ? oneBite = bEnergy : oneBite *= multiplier ; // * не можем съесть больше, чем у бота есть энергии
	oneBite + aEnergy > botObj.energy[1] ? oneBite = botObj.energy[1] - aEnergy : false ; // * не можем съесть больше, чем вмещается
	botObj.energy[0] += oneBite;
	frontObj.energy[0] -= oneBite;
	Math.ceil(oneBite / 5) >= bMinerals ? oneBite = bMinerals : oneBite = Math.ceil(oneBite / 5) ; // * бот отъедает от другого бота в 5 раз меньше минералов, чем энергии 
	oneBite + aMinerals > botObj.minerals[1] ? oneBite = botObj.minerals[1] - aMinerals : false ;
	botObj.minerals[0] += oneBite;
	frontObj.minerals[0] -= oneBite;
	checkIsAlive(frontObj);
	// ! ToDo: переписать на наследование цвета, в зависимости от питания предков
	botObj.color = colors[1]; // * бот краснеет, если питается мясом
}

function checkIsAlive(obj) {
	if (obj.objType == 'bot') {
		if ((obj.energy[0] <= 0) || (obj.minerals[0] <= 0)) { // * бот не может жить, если у него нет энергии или минералов ака костей
			obj.flagAlive = 0;
			obj.color = 'gray';
		}
	}
	obj.age[0] >= obj.age[1] ? obj.flagAlive = 0 : false ; // * если дожили до "предельного" возраста, то умираем
}

/* Если бот спит на протяжении 10 ходов подряд - он теряет 1 ед энергии */
function sleepingMechanics(botObj) {
	botObj.flagSleeping != 0 ? botObj.flagSleeping += 1 : false ;
	if (botObj.flagSleeping >= 10) {
		botDecEnergy(botObj, 1);
		botObj.flagSleeping = 1;
	} 
}

function incParam(param, increment = 1) {
	increment >= 1 ? param += increment : ++param ;
}

function botEatTree(botObj, frontObj, multiplier) {
	let aEnergy = botObj.energy[0],
		aMinerals = botObj.minerals[0],
		bEnergy = frontObj.energy[0],
		bMinerals = frontObj.minerals[0],
		oneBite = 60;
	multiplier * oneBite >= bEnergy ? oneBite = bEnergy : oneBite *= multiplier ; // * не можем съесть больше, чем у бота есть энергии
	oneBite + aEnergy > botObj.energy[1] ? oneBite = botObj.energy[1] - aEnergy : false ; // * не можем съесть больше, чем вмещается
	botObj.energy[0] += oneBite;
	frontObj.energy[0] -= oneBite;
	Math.ceil(oneBite / 4) >= bMinerals ? oneBite = bMinerals : oneBite = Math.ceil(oneBite / 4) ; // * бот отъедает от дерева в 4 раз меньше минералов, чем энергии 
	oneBite + aMinerals > botObj.minerals[1] ? oneBite = botObj.minerals[1] - aMinerals : false ;
	botObj.minerals[0] += oneBite;
	frontObj.minerals[0] -= oneBite;
	checkIsAlive(frontObj);
	// ! ToDo: переписать на наследование цвета, в зависимости от питания предков
	botObj.color = colors[6]; // * бот зеленеет, если питается мясом
}

function botEatMineral(params) {
	
}

function botSleep(botObj) {
	botObj.direction = 0;
	botObj.flagSleeping = 1;
}

function botDecEnergy(botObj, decrement) {
	if (botObj.energy[0] >= decrement) {
		botObj.energy[0] -= decrement;
		worldEnergy += decrement;
	} else {
		checkIsAlive(botObj);
	}
}

/* Фотосинтез - получение энергии из окружающего пространства */
function photosynthesis(obj, increment = 14) {
	if (worldEnergy >= increment) {
		obj.energy[0] += increment;
		worldEnergy -= increment;
	} else if (worldEnergy > 0) {
		obj.energy[0] += worldEnergy;
		worldEnergy = 0;
	}
}

/* Меняем направление взгляда бота - возвращает новое значение direction в зависимости от условий */
function chooseNewDirection(dir, opt = 'random') {
	let newDirection;
	switch (opt) {
		case 'random':
			newDirection = getRandomInt(1, 8);
			break;
		case 'left':
			newDirection = botChangeDirection(dir, 'left');
		break;
		case 'right':
			newDirection = botChangeDirection(dir, 'right');
			break;
		case 'sleep':
			newDirection = 0;
			break;
		default:
			break;
	}
	return newDirection;
}

/* Бот поворачивается на 1 сектор в направлении spin, относительно текущего направления */
function botChangeDirection(...[direction, spin]) {
	if (direction != 0) {
		switch (spin) {
			case 'left':
				if (direction != 1) {
					direction--;
				} else {
					direction = 8;
				}
				break;
			case 'right':
				if (direction != 8) {
					direction++;
				} else {
					direction = 1;
				}
				break;
			default:
				direction = getRandomInt(1, 8);
		}
	} else {
		direction = getRandomInt(1, 8);
	}
	return direction;
}

/* Вычисление координат клетки в направлении взгляда бота */
// Прости меня будущий я, но как это сделать иначе мне не понятно 18.11.20
function getFrontCellCoordinates(viewDirection = 0, botPosX, botPosY) {
	let coordsXY = -1;
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
				if (botPosX < world_width - 1 && botPosY != 0) {
					coordsXY = [botPosX + 1, botPosY - 1];	
				} else {
					return -1;
				}
				break;
			case 3:
				if (botPosX < world_width- 1) {
					coordsXY = [botPosX + 1, botPosY];	
				} else {
					return -1;
				}
				break;
			case 4:
			if (botPosX < world_width- 1 && botPosY < world_heigth - 1) {
				coordsXY = [botPosX + 1, botPosY + 1];	
			} else {
				return -1;
			}
			break;
			case 5:
			if (botPosY < world_heigth- 1) {
				coordsXY = [botPosX, botPosY + 1];	
			} else {
				return -1;
			}
			case 6:
			if (botPosX > 0 && botPosY < world_heigth- 1) {
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
	} else if (viewDirection == 0) {
		coordsXY = -1;
	}
	return coordsXY; //[x,y] || -1
}

/* Функция проверки объекта в указанных координатах */
function botCheckDirection(botObj, x, y) { // * получаем координаты, возвращаем ответ 
	// * если пусто = 0, родственник = 1, чужой бот = 2, мясо = 3, дерево = 4, минерал = 5, стена = -1, ошибка 255
	let objType = worldMatrix[x][y].objType;
	let res;
	switch (objType) {
		case 'space':
			res = 0;
			break;
		case 'bot':
			let frontBot = worldMatrix[x][y];
			isRelative(botObj.genom, frontBot.genom) == 1 ? 
				isRelative(botObj.paramsGenom, frontBot.paramsGenom) == 1 ? res = 1 : res = 2 :
			res = 2;
		case 'meat':
			res = 3;
			break;
		case 'tree':
			res = 4;
			break;
		case 'mineral':
			res = 5;
			break;
		case 'wall':
			res = -1;
			break;
		default:
			res = 255;
			break;
	}
	return res;
}

/* Бот проверяет достаточно ли ему энергии, чтобы двигаться? */
function checkEnergyForMove(obj, moveCost) {
	if (moveCost != undefined) {
		let e = obj['energy'][0];
		return e > moveCost ? true : false;
	} else {
		return false;
	}
}

/* Проверяем количество различий между геномами ботов (проверка на родственность) */
function isRelative(a, b) { // передаем геномы ботов
	let res = -1;
	const MAX_DIFF = 2; // Максимальное отличие, чтобы считаться родственником
	let diff = 0;
	if (a.length == b.length) {
		for (let i = 0; i < a.length; i++) {
			if (a[i] != b[i]) {
				diff++;
			}
			if (diff > MAX_DIFF) {
				res = 0;
				break;
			}
		}
		if (diff <= MAX_DIFF) {
			res = 1;
		}
	}
	return res; // -1 разного размера геномы, 0 не родственники, 1 родственники
}

/* Функция создания потомка в случайной области заданного радиуса */
function botMakeChild() {
	let parentX = this.x,
		parentY = this.y,
		newX,
		newY;
// * пробуем найти место рядом с собой, чтобы отпочковать нового бота
	for (let index = 15; index--; ) {
		let dx = getRandomInt(-1, 1),
			dy = getRandomInt(-1, 1);
		
		while ((dx == 0) && (dy == 0)) {
			dx = getRandomInt(-1, 1),
			dy = getRandomInt(-1, 1);
		}
	
		newX = parentX + dx;
		newY = parentY + dy;
	
		if ((newX > 0 && newX < world_width - 1) && (newY > 0 && newY < world_heigth - 1)) {
			if (worldMatrix[newX][newY].objType == 'space') {
				let temp = Math.round(worldMatrix[parentX][parentY].energy[0] / 2);
// ! ToDo: дописать функцию определения цвета, в зависимости от питания и передавать этот цвет в конструктор нового бота
// ! ToDo: по-мимо цвета, нужно передавать еще геномы новым ботам с шансом мутации одного из параметров
				worldMatrix[newX][newY] = new Bot(newX, newY, colors[5]);
				worldMatrix[newX][newY].energy[0] = temp;
				worldMatrix[parentX][parentY].energy[0] = worldMatrix[parentX][parentY].energy[0] - temp;
				temp = Math.round(worldMatrix[parentX][parentY].minerals[0] / 2);
				worldMatrix[newX][newY].minerals[0] = temp;
				worldMatrix[parentX][parentY].minerals[0] = worldMatrix[parentX][parentY].minerals[0] - temp;
				index = 0;
			} else {
				continue;
			}		
		}
	}
}

/* Функция проверки ботом, а не пора ли создать потомка? */
function botCheckMakeChild() {
	let age = this.age[0],
		e = checkOwnParamLvl(this, 'energy'),
		m = checkOwnParamLvl(this, 'minerals');
	if ((e >= 7) && (m >= 7) && (age >= 30)) {
		this.createChild();
	}
}

class Tree {
	constructor(x, y) {
		this.objType = 'tree';
		this.age = [0,512];
		this.x = x;
		this.y = y;
		this.energy = [0,2048];
		this.minerals = [0,2048];
		this.flagAlive = 1;
		this.genus = 'tree';
	}

	draw() {
		let s = GRID_SIZE / 10; // scale
		let x = this.x * 10,
			y = this.y * 10;
		drawTree(ctx, x, y, s);
	}
}

class Bush {
	constructor(x, y) {
		this.objType = 'tree';
		this.age = [0,256];
		this.x = x;
		this.y = y;
		this.energy = [0,1024];
		this.minerals = [0,1024];
		this.flagAlive = 1;
		this.genus = 'bush';
	}

	draw() {
		let s = GRID_SIZE / 10; // scale
		let x = this.x * 10,
			y = this.y * 10;
		drawBush(ctx, x, y, s);
	}
}

class Grass {
	constructor(x, y) {
		this.objType = 'tree';
		this.age = [0,128];
		this.x = x;
		this.y = y;
		this.energy = [0,256];
		this.minerals = [0,256];
		this.flagAlive = 1;
		this.genus = 'grass';
	}

	draw() {
		let s = GRID_SIZE / 10; // scale
		let x = this.x * 10,
			y = this.y * 10;
		drawGrass(ctx, x, y, s);
	}
}

class TreeFactory {
	static list = {
		tree: Tree,
		bush: Bush,
		grass: Grass
	}

	create(x, y, type = 'tree') {
		const TreeType = TreeFactory.list[type] || TreeFactory.list.tree;
		const newTree = new TreeType(x, y);
		newTree.growth = treeGrowth;
		newTree.incAge = incrementAge;
		newTree.createChild = treeMakeChild;
		newTree.checkMakeChild = treeCheckMakeChild;
		return newTree;
	}
}

/* Функция роста дерева */
function treeGrowth() {
	let e, m;
	let growthSpeed = 1,
		newGrowthSpeed = 0;
	switch (this.genus) {
		/* Tree genus */
		case 'tree':
			growthSpeed = 14;
			break;
		/* Bush genus */
		case 'bush':
			growthSpeed = 16;
			break;
		/* Bush grass */
		case 'grass':
			growthSpeed = 18;
			break;
		default:
			break;
	}
	let x = this.x, 
		y = this.y;
	// ! ToDo: Этот кусок можно явно переписать как-то красивее
	e = worldMatrix[x][y].energy;
	m = worldMatrix[x][y].minerals;
	if ((worldEnergy - growthSpeed * 5) >= 0) {
		if (e[0] < e[1]) {
			if ((e[0] + growthSpeed) <= e[1]) {
				e[0] += growthSpeed;
				worldEnergy -= growthSpeed;
			} else {
				newGrowthSpeed = e[1] - e[0];
				e[0] += newGrowthSpeed;
				worldEnergy -= newGrowthSpeed;
			}
		}
		if (m[0] < m[1]) {
			if ((m[0] + growthSpeed) <= m[1]) {
				m[0] += growthSpeed;
				worldEnergy -= (growthSpeed * 4);
			} else {
				newGrowthSpeed = m[1] - m[0];
				m[0] += newGrowthSpeed;
				worldEnergy -= (newGrowthSpeed * 4);
			}
		}
	} else {
		newGrowthSpeed = Math.floor(worldEnergy / 5);
		if (e[0] < e[1]) {
			if ((e[0] + newGrowthSpeed) <= e[1]) {
				e[0] += newGrowthSpeed;
				worldEnergy -= newGrowthSpeed;
			} else {
				newGrowthSpeed = e[1] - e[0];
				e[0] += newGrowthSpeed;
				worldEnergy -= newGrowthSpeed;
			}
		}
		if (m[0] < m[1]) {
			if ((m[0] + newGrowthSpeed) <= m[1]) {
				m[0] += newGrowthSpeed;
				worldEnergy -= (newGrowthSpeed * 4);
			} else {
				newGrowthSpeed = m[1] - m[0];
				m[0] += newGrowthSpeed;
				worldEnergy -= (newGrowthSpeed * 4);
			}
		}
	}
}

/* Функция создания потомка дерева в случайной области заданного радиуса */
function treeMakeChild() {
	let parentX = this.x,
		parentY = this.y,
		newX,
		newY;
	let genusTypes = ['grass', 'bush', 'tree'];
	let d = genusTypes.indexOf(this.genus) + 2; // d = 2, 3, 4
	for (let index = 15; index--; ) {
		let dx = getRandomInt(-d, d),
			dy = getRandomInt(-d, d);
		
		while ((dx == 0) && (dy == 0)) {
			dx = getRandomInt(-d, d),
			dy = getRandomInt(-d, d);
		}
	
		newX = parentX + dx;
		newY = parentY + dy;
	
		if ((newX > 0 && newX < world_width - 1) && (newY > 0 && newY < world_heigth - 1)) {
			if (worldMatrix[newX][newY].objType == 'space') {
				let temp = Math.round(worldMatrix[parentX][parentY].energy[0] / 2);
				worldMatrix[newX][newY] = treeFactory.create(newX, newY, this.genus);
				worldMatrix[newX][newY].energy[0] = temp;
				worldMatrix[parentX][parentY].energy[0] = worldMatrix[parentX][parentY].energy[0] - temp;
				temp = Math.round(worldMatrix[parentX][parentY].minerals[0] / 2);
				worldMatrix[newX][newY].minerals[0] = temp;
				worldMatrix[parentX][parentY].minerals[0] = worldMatrix[parentX][parentY].minerals[0] - temp;
				index = 0;
			} else {
				continue;
			}		
		}
	}
}

/* Функция проверки деревом, а не пора ли создать потомка? */
function treeCheckMakeChild() {
	let age = this.age[0],
		e = checkOwnParamLvl(this, 'energy'),
		m = checkOwnParamLvl(this, 'minerals');
	if ((e >= 7) && (m >= 7) && (age >= 30)) {
		this.createChild();
	}
}

/* Объект проверяет свой уровень энергии или другого параметра */
function checkOwnParamLvl(obj, paramType = 'energy') {
	if (paramType != undefined) {
		let param = obj[paramType][0],
			maxParam = obj[paramType][1],
			paramLvl = Math.floor(param / maxParam * 10);
		return paramLvl; // возвращаем уровень от 0 - 10
	} else {
		return false;
	}
}

/* Увеличиваем возраст объекта */
function incrementAge() {
	if (this.age[0] < this.age[1]) {
		this.age[0]++;
	}
}

class Space {
	constructor(x, y) {
		this.objType = 'space';
	}
}

class Wall {
	constructor(x, y) {
		this.objType = 'wall';
	}
}

/* Заполняем "мир" пустым пространством */
function emptySpaceGenerator(worldObj) {
	for(let j = worldObj.length; j--;) {
		for(let i = worldObj[j].length; i--;) {
			worldObj[j][i] = new Space();
		}
	}
}

/* Возвращает геном (массив длиной 16 из случайных чисел от 0 до GENS) */
function randomGenomGenerator(genomLength = GENOM_LENGTH, genomLowAdr = 0, genomHighAdr = GENS) {
	let GENOM = [];
	for (let x = genomLength; x--;) {
		GENOM.push(getRandomInt(genomLowAdr, genomHighAdr));
	};
	return GENOM;
}

/* возвращает случайное число в диапазоне [min, max] */
function getRandomInt(min, max) {
	if (min < max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * (min - max + 1)) + max;
	}
}

/* создает 2-мерный массив размерностью (rows * columns) */
function create2DArray(rows = 5, columns = 5) {
	let arr = new Array(rows);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(columns);
	}
	return arr;
}

/* Создаем стену по краю мира */
function buildTheWorldWall(arr) {
	for (let i = arr.length-1; i--;) {
		arr[0][i] = new Wall(); // top border
 		arr[i][arr[0].length-1] = new Wall(); // right border
		arr[arr.length-1][i+1] = new Wall(); // bottom border
		arr[i+1][0] = new Wall(); // left border
		
	}
}

addEventListener('click', (event) => {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left,
		y = event.clientY - rect.top;
	if ((x > CANVAS_HEIGTH) ||
		(x < 0) ||
		(y > CANVAS_WIDTH) ||
		(y < 0)) {
		return ;
	};
	console.clear();
	console.log(`x: ${Math.floor(x / GRID_SIZE)}, y: ${Math.floor(y / GRID_SIZE)}`);
	// const bot = new Bot(x, y, 'red');
	// bot.draw();
	// bot.generateRandomGenom();
	// setTimeout(() => {
	//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);
	//     console.log('clear');
	// }, 1000)
});

function animate() {
	timerId = requestAnimationFrame(animate);
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

	worldMatrix.forEach(i => {
		i.forEach(j => {
			if ((j.objType == 'bot') || (j.objType == 'tree')) {
				j.draw();
			}
			// if (j.objType == 'tree') {
			//     j.growth();
			// }
		});
	});

	drawGrid(ctx);
}

function drawGrid(ctx) {
	ctx.beginPath();
	for (let i = 0; i < CANVAS_WIDTH; i += GRID_SIZE) {
		ctx.moveTo(i + 0.5, 0);
		ctx.lineTo(i + 0.5, CANVAS_HEIGTH);
	}
	for (let i = 0; i < CANVAS_HEIGTH; i += GRID_SIZE) {
		ctx.moveTo(0, i + 0.5);
		ctx.lineTo(CANVAS_WIDTH, i + 0.5);
	}

	ctx.strokeStyle = '#f0f0f0';
	ctx.stroke();
	ctx.closePath();
}

function createTreesAtRandom(count, type = 'tree') {
	for (let index = count; index--;) {
	
		let x, y, e;

		switch (type) {
			case 'tree':
				e = 30;
				break;
			case 'bush':
				e = 25;
				break;
			case 'grass':
				e = 20;
				break;
			default:
				e = 30;
				break;
		}
		if (worldEnergy >= (e * 5)) {
			x = getRandomInt(1, world_width - 2);
			y = getRandomInt(1, world_heigth - 2);
		
			while (worldMatrix[x][y].objType != 'space') {
				x = getRandomInt(1, world_width - 2);
				y = getRandomInt(1, world_heigth - 2);
			}
			worldMatrix[x][y] = treeFactory.create(x, y, type);
			worldMatrix[x][y].energy[0] = e;
			worldMatrix[x][y].minerals[0] = e;
			worldEnergy -= (e  * 5);
		} else {
			console.log(`not enought energy: ${worldEnergy} of ${e * 5} needed`);
			break;
		}
	}
}

function createBotsAtRandom(count, color = 'gray', opt = 'random', genom = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) {
	for (let index = count; index--;) {
	
		let x, y, e, m;

		e = getRandomInt(128, 256);
		m = getRandomInt(32, 64);

		if (worldEnergy >= (e + m * 4)) {
			x = getRandomInt(1, world_width - 2);
			y = getRandomInt(1, world_heigth - 2);
		
			while (worldMatrix[x][y].objType != 'space') {
				x = getRandomInt(1, world_width - 2);
				y = getRandomInt(1, world_heigth - 2);
			}
			worldMatrix[x][y] = new Bot(x, y, color);
			worldMatrix[x][y].energy[0] = e;
			worldMatrix[x][y].minerals[0] = m;
			worldEnergy -= (e + m * 4);
			if (opt == 'random') {
				worldMatrix[x][y].generateRandomGenom();
			} else if (opt == 'define') {
				worldMatrix[x][y].genom = genom;
			}
		} else {
			console.log(`not enought energy: ${worldEnergy} of ${e + m * 4} needed`);
			break;
		}
	}
}

function checkSummEnergy() {
	let sum = 0;
	worldMatrix.forEach(i => {
		i.forEach(j => {
			if ((j.objType == 'bot') || (j.objType == 'tree')) {
				sum += j.energy[0] + j.minerals[0] * 4;
			}
		});
	});
	return sum;
}

timerId = setTimeout(function tick() {
	console.clear();
	// console.log(`*******`);
	console.log(`step ${worldTime}`);
	console.log(`free energy :${worldEnergy}`);
	console.log(`full energy :${checkSummEnergy()}`);
	// console.log(`e = ${worldEnergy} | fe = ${fullWorldEnergy}`);
	// main(worldMatrix);
	// render(worldMatrix);

	worldMatrix.forEach(i => {
		i.forEach(j => {
			if ((j.objType == 'bot') || (j.objType == 'tree')) {
				j.incAge();
			}
			if (j.objType == 'tree') {
				j.growth();
				j.checkMakeChild();
			}
			if (j.objType == 'bot') {
				j.changeDirection();
				j.move();
				j.eat();
				j.checkMakeChild();
				j.isSleeping();
				j.isAlive();
			}
		});
	});

	/* Выставляем флаги перемещения ботов в 0 */
	worldMatrix.forEach(i => {
		i.forEach(j => {
			if (j.objType == 'bot') {
				j.clearMoveParams();
			}
		});
	});

	timerId = setTimeout(tick, 200); // (*)
	worldTime++;
	if (worldTime >= STEPS) {
		clearTimeout(timerId);
	}
}, 500);

const colors = [
	'rgb(255, 32, 32)',// 0 - Красный (светлый)
	'rgb(255, 69,  0)',// 1 - Красно-оранжевый
	'rgb(255,165,  0)',// 2 - Оранжевый
	'rgb(255,255,  0)',// 3 - Желтый
	'rgb(127,255,  0)',// 4 - Желто-зеленый (кислотный зеленый)
	'rgb(  0,255,  0)',// 5 - Лаймовый зеленый
	'rgb(128,128, 64)',// 6 - Оливковый
	'rgb(  0,128,  0)',// 7 - Зеленый
	'rgb(127,255,212)',// 8 - Аквамарин
	'rgb(  0,255,255)',// 9 - Голубой (морская волна)
	'rgb( 30,144,255)',// 10 - Темно-голубой (dodger blue)
	'rgb(  0,  0,255)',// 11 - Синий
	'rgb(255,  0,255)',// 12 - Розовый (magenta)
	'rgb(255, 20,147)',// 13 - Насыщенный розовый
	'rgb(148,  0,211)',// 14 - Фиолетовый
	'rgb(255,255,240)',// 15 - Кость
	'rgb(244,164, 96)',// 16 - Светло-коричневый
	'rgb(139, 69, 19)',// 17 - Темно-коричневый
	'rgb(  0,  0,  0)',// 18 - Черный
	'rgb(255,255,255)',// 19 - Белый
];


const treeFactory = new TreeFactory();
emptySpaceGenerator(worldMatrix);
buildTheWorldWall(worldMatrix);
createTreesAtRandom(5, 'tree');
createTreesAtRandom(6, 'bush');
createTreesAtRandom(3, 'grass');
createBotsAtRandom(50, colors[8], 'random');
createBotsAtRandom(50, colors[10], 'random');
animate();