'use strict'

import { drawTree, drawBush, drawGrass, drawBot } from './draw_models.js';

const
    CANVAS_WIDTH = 601,
    CANVAS_HEIGTH = 601,
    GRID_SIZE = 30,
    GENOM_LENGTH = 16,
	MUTATION_FACTOR = 15,
	GENS = 11, // количество разных генов
	STEPS = 1000;

let 
    render_speed = 1,
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

class Bot {
    constructor(x, y, color) {
        this.objType = 'bot';
		this.age = [0,1024];
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = 1;
		this.flagAttacked = [0,0]; // позиция 0 - в текущем ходе, 1я - в предыдущем; 1-8 - направление, откуда атакаван 0 - не атакован
		this.flagSleeping = 0;
		this.flagHungry = 0;
		this.flagMoved = 0;
		this.flagAlive = 1;
		this.energy = [512,1024];
		this.minerals = [8,256];
		this.speed = 100;
		this.genom = [];
		this.eat = [0,0,0,0]; // кушает 0 - растения, 1 - других ботов, 2 - мясо, 3 - минералы
    }

    generateRandomGenom() {
        this.genom = randomGenomGenerator();
        // console.log(this.genom);
    }

    draw() {
        let s = GRID_SIZE / 10; // scale
        let x = this.x * 10,
            y = this.y * 10;
        drawBot(ctx, x, y, s, this.color);
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
        newTree.draw = function() {
            let s = GRID_SIZE / 10; // scale
            let x = this.x * 10,
                y = this.y * 10;
            switch (this.genus) {
                /* Tree genus */
                case 'tree':
                    drawTree(ctx, x, y, s);
                    break;
                /* Bush genus */
                case 'bush':
                    drawBush(ctx, x, y, s);
                    break;
                /* Bush grass */
                case 'grass':
                    drawGrass(ctx, x, y, s);
                    break;
                default:
                    break;
            }
        }
        return newTree;
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
	for(let j = worldObj.length - 1; j--;) {
		for(let i = worldObj[j].length - 1; i--;) {
			worldObj[j][i] = new Space();
		}
	}
}

// * возвращает геном (массив длиной 16 из случайных чисел от 0 до GENS)
function randomGenomGenerator(genomLength = 16, genomLowAdr = 0, genomHighAdr = GENS) {
	let GENOM = [];
	for (let x = genomLength; x--;) {
		GENOM.push(getRandomInt(genomLowAdr, genomHighAdr));
	};
	return GENOM;
}

// * возвращает случайное число в диапазоне [min, max]
function getRandomInt(min, max) {
	if (min < max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * (min - max + 1)) + max;
	}
}

// * создает 2-мерный массив размерностью rows * columns
function create2DArray(rows = 5, columns = 5) {
	let arr = new Array(rows);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(columns);
	}
	return arr;
}

addEventListener('click', (event) => {
    let rect = canvas.getBoundingClientRect();
    let
        x = event.clientX - rect.left,
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
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);
    // bot.update();
    // console.log('hello');
    
    // new Bot(1, 1, 'blue').draw();
    // new Bot(1, 0, 'green').draw();
    // treeFactory.create(2, 2).draw();
    // treeFactory.create(4, 4, 'bush').draw();
    // treeFactory.create(5, 6, 'grass').draw();
    // treeFactory.create(6, 6, 'grass').draw();

    worldMatrix.forEach(i => {
        i.forEach(j => {
            if ((j.objType == 'bot') || (j.objType == 'tree')) {
                j.draw();
            }
        });
    });

    drawGrid();
}

function drawGrid() {
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
            worldEnergy -= (worldMatrix[x][y].energy[0] + worldMatrix[x][y].minerals[0]  * 4);
        }
    }
}

const treeFactory = new TreeFactory();
emptySpaceGenerator(worldMatrix);
createTreesAtRandom(3, 'tree');
createTreesAtRandom(4, 'bush');
createTreesAtRandom(5, 'grass');
console.log(worldEnergy);
animate();