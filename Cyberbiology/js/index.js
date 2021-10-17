'use strict'

import { drawTree, drawBush, drawGrass, drawBot } from './draw_models.js';

const
    CANVAS_WIDTH = 601,
    CANVAS_HEIGTH = 601,
    GRID_SIZE = 40,
    GENOM_LENGTH = 16,
	MUTATION_FACTOR = 15,
	GENS = 11, // количество разных генов
	STEPS = 1000;

let render_speed = 1,
    timerId,
    world_width = Math.floor(CANVAS_WIDTH / GRID_SIZE),
    world_heigth = Math.floor(CANVAS_HEIGTH / GRID_SIZE);

let worldTime = 0;
let worldEnergy = 100000;
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
        this.color = color;
        this.direction = 1;
		this.flagAttacked = [0,0]; // позиция 0 - в текущем ходе, 1я - в предыдущем; 1-8 - направление, откуда атакаван или 0 - не атакован
		this.flagSleeping = 0;
		this.flagHungry = 0;
		this.flagMoved = 0;
		this.flagAlive = 1;
		this.energy = [0,1024];
		this.minerals = [0,256];
		this.speed = 100;
		this.genom = [];
		this.eat = [0,0,0,0]; // кушает 0 - растения, 1 - других ботов, 2 - мясо, 3 - минералы
    }
/* Метод генерации рандомного генома */
    generateRandomGenom() {
        this.genom = randomGenomGenerator();
        // console.log(this.genom);
    }
/* Метод отрисовки бота на холсте */
    draw() {
        let s = GRID_SIZE / 10; // scale
        let x = this.x * 10,
            y = this.y * 10;
        drawBot(ctx, x, y, s, this.color);
    }
/* Метод увеличвения возраста */
    incAge = incrementAge;
/* Метод перемещения в направлении взгляда */    
    move() {
        // ! ToDo: Двигатся в направлении взгляда
        this.flagMoved = 1;
    }
/* Метод переводит флаг движения в состояние 0 */
    clearMoveParams() {
    this.flagMoved = 0;
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
    // console.log(`${this.genus} at ${x}:${y} has grow speed: ${growthSpeed}`);
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
    // console.log(`${this.genus} at ${x}:${y} has now m: ${worldMatrix[x][y].minerals}`);
}

/* Функция создания потомка дерева в случайной области заданного радиуса */
function treeMakeChild() {
    let parentX = this.x,
        parentY = this.y,
        newX,
        newY;
    let genusTypes = ['grass', 'bush', 'tree'];
    let d = genusTypes.indexOf(this.genus) + 2;
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
            // console.log(worldMatrix[newX][newY]);
            if (worldMatrix[newX][newY].objType == 'space') {
                let temp = Math.round(worldMatrix[parentX][parentY].energy[0] / 2);
                // createnew(newX, newY, treeGenusType);
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
    // console.log(`${this.objType} at ${this.x}:${this.y} has age ${this.age}`);
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
	for(let j = worldObj.length - 1; j--;) {
		for(let i = worldObj[j].length - 1; i--;) {
			worldObj[j][i] = new Space();
		}
	}
}

/* Возвращает геном (массив длиной 16 из случайных чисел от 0 до GENS) */
function randomGenomGenerator(genomLength = 16, genomLowAdr = 0, genomHighAdr = GENS) {
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
    // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

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

        e = 256;
        m = 64;

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
            // console.log(worldMatrix[x][y].genom);
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

const treeFactory = new TreeFactory();
emptySpaceGenerator(worldMatrix);
createTreesAtRandom(5, 'tree');
createTreesAtRandom(6, 'bush');
createTreesAtRandom(1, 'grass');
createBotsAtRandom(5, 'blue', 'random');
createBotsAtRandom(5, 'red', 'random');
// console.log(worldEnergy);
animate();