'use strict'

const CANVAS_WIDTH = 800;
const CANVAS_HEIGTH = 600;
const GENOM_LENGTH = 16;
const WORLD_X = 7;
const WORLD_Y = 7;

let worldTime = 0;

function Bot(coordX, coordY) {
        this.objType = 'bot';
        this.energy = [100,1024];
        this.age = [0,1024];
        this.minerals = [128,256];
        this.posX = coordX;
        this.posY = coordY;
        this.direction = 5;
        this.speed = 100;
        this.flagAttacked = 0;
        this.flagSleeping = 0;
        this.flagHungry = 0;
        this.flagAlive = 1;
        this.genom = [];//[0,1,2,3,4,5]
		// this.genom = [  4, 5, 2, 4, 1, 4,
		// 	4, 3, 2, 5, 4, 4,
		// 	3, 5, 2, 4];//[0,1,2,3,4,5]
}

function Space() {
	this.objType = 'space';
}

function Tree(coordX, coordY) {
    this.objType = 'tree';
    this.energy = [200,2048];
    this.age = [0,2048];
    this.minerals = [200,2048];
    this.posX = coordX;
	this.posY = coordY;
	this.flagAlive = 1;  
}

function Mineral(coordX, coordY) {
    this.objType = 'mineral';
    this.energy = [20,256];
    this.age = [0,4096];
    this.minerals = [2048,2048];
    this.posX = coordX;
	this.posY = coordY;
	this.flagAlive = 1;  
}

function Wall(coordX, coordY) {
    this.objType = 'wall';
}

function create2DArray(rows = 5, columns = 5) {
	let arr = new Array(rows);
	for (let i = 0; i < rows; i++) {
		arr[i] = new Array(columns);
	}
	return arr;
}

function emptySpaceGenerator(worldObj) {
	for(let j = 0; j < worldObj.length; j++) {
		for(let i = 0; i < worldObj[j].length; i++) {
			worldObj[j][i] = new Space();
		}
	}
}

function randomGenomGenerator(genomLength = 16, genomLowAdr = 0, genomHighAdr = 5) {
	let GENOM = [];
	for (let x = genomLength; x > 0; x--) {
		GENOM.push(getRandomInt(genomLowAdr, genomHighAdr));
	};
	return GENOM;
}

function getRandomInt(min, max) {
	if (min < max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * (min - max + 1)) + max;
	}
}

let worldMatrix = create2DArray(WORLD_X, WORLD_Y);

emptySpaceGenerator(worldMatrix);

buildTheWorldWall(worldMatrix);

worldMatrix[2][2] = new Bot(2, 2);

worldMatrix[2][2]['genom'] = randomGenomGenerator();

// worldMatrix[2][5] = new Bot(2, 5);

// worldMatrix[2][5]['genom'] = randomGenomGenerator();

worldMatrix[2][3] = new Tree(2, 3);

worldMatrix[3][3] = new Mineral(3, 3);

// console.log(`Объект в клетке 2-2: ${worldMatrix[2][2]['objType']} ${worldMatrix[2][2]['posX']}:${worldMatrix[2][2]['posY']} до перемещения`);

// worldMatrix[3][2] = new Space();
botMove(2, 2, 4, 1);

// console.log(`Объект в клетке 2-2: ${worldMatrix[2][2]['objType']} после перемещения`);

// console.log(`Объект в клетке 1-1: ${worldMatrix[1][1]['objType']} ${worldMatrix[1][1]['posX']}:${worldMatrix[1][1]['posY']}`);

// console.log(`Объект в клетке 4-1: ${worldMatrix[4][1].objType}`);
// console.log(`${worldMatrix[4][1].genom}`);

// main(worldMatrix);

function main(worldObj) {
	for(let j = 0; j < worldObj.length; j++) {
		for(let i = 0; i < worldObj[j].length; i++) {
			let elem = worldObj[j][i];
            if (elem.objType == 'bot') {
                // console.log(`x: ${elem.posX}, y: ${elem.posY}`);
                // console.log(`${elem.genom}`);
                GenomVM(elem, worldObj);
            } else if (elem.objType == 'tree') {
                // console.log(`x: ${elem.posX}, y: ${elem.posY}`);
                // console.log(`This tree has age is ${elem.age[0]}`);
            } else if (elem.objType == 'mineral') {
                // console.log(`x: ${elem.posX}, y: ${elem.posY}`);
                // console.log(`This is a mineral with strength ${elem.minerals[0]}`);
            } else if (elem.objType == 'space') {
                // console.log(`x: ${j}, y: ${i} is empty`);
            }
		}
	}
}

function GenomVM(botObject, worldObj) {
	let breakFlag = 0;
	let actCounter = 16;
	let adr = 0;

	let energy = botObject.energy;
	let direction = botObject.direction; // * направление взгляда бота 1 сев, 2 сев-вос, 3 восток ... 8 сев-зап, 0 - никуда
	let posX = botObject.posX;
	let posY = botObject.posY;

	let botGenom = botObject.genom;

	while ((breakFlag != 1) && (actCounter > 0)) {
		console.log(`Action counter: ${actCounter}`);
		console.log(`BreakFlag : ${breakFlag}`);
		switch (botGenom[adr]) {
			case 0: // Mutate random gen
				// console.log(`case 0`);
				adr = incAdr(adr);
				genomMutate(botGenom);
				actCounter--;
				// console.log("Mutate and Go To: " + adr);
				console.log(botGenom);
				break;
			case 1: // Move front
			// Понять, что за координаты спереди (по линии взгляда)
			// Если не смотрит никуда (спит), то переходим к команде в адресе +1
			// Если спереди есть стена, то переходим к команде в адресе +2
			// Если спереди не пустое пространство и не стена, то переходим к команде в адресе +3
			// Если спереди пустое пространство, то шагаем на клетку вперед переходим к команде +4
				let frontCoordinates = getFrontCellCoordinates(direction, posX, posY);
				// console.log(`case 1`);
				// console.log(`front coords: ${frontCoordinates}`);
				let frontObjectType;
				let frontX;
				let frontY;
				if (frontCoordinates != -1) {
					frontX = frontCoordinates[0];
					frontY = frontCoordinates[1];
					frontObjectType = worldObj[frontX][frontY].objType;
					// console.log(`if working`);
				console.log(`front object at coords [${frontX},${frontY}] is ${worldObj[frontX][frontY].objType}`);				
				}
				console.log(`direction is ${direction}`);
                if (direction == 0) {
                    adr = incAdr(adr);
					console.log(`case 1 go if 1`);
                } else {
					if (frontObjectType == 'wall') {
						adr = jumpAdr(adr, 2);
						console.log(`case 1 go if 2`);
					} else if ((frontObjectType == 'bot') || (frontObjectType == 'tree') || (frontObjectType == 'mineral')) {
						adr = jumpAdr(adr, 3);
						console.log(`case 1 go if 3`);
					} else if (frontObjectType == 'space') {
						console.log(`bot see in direction ${direction}`);
						console.log(`bot move to the front coords ${frontX},${frontY}`);
						botMove(posX, posY, frontX, frontY);
						adr = jumpAdr(adr, 4);
						console.log(`case 1 go if 4`);
						breakFlag = 1; // Перемещение это прерывающая активность операция //! ToDo: не понятно, почему не меняет флаг
						console.log(`break from case 1 4 is: ${breakFlag}`);
					};
				};
				console.log(botGenom);
				actCounter--;
				console.log("1 Go To adr: " + adr);
				break;
			case 2: // Bot change direction right
				console.log(`case 2`);
				adr = incAdr(adr);
				direction = botObject.direction = botChangeDirection(direction, 'rigth');
				console.log(`new direction is ${botObject.direction}`);
				// console.log(`world object direction is ${worldObj[posX][posY].direction}`);
				// console.log(`direction is ${direction}`);
				actCounter--;
				console.log("2 Go To adr: " + adr);
				break;
			case 3: // Bot change direction left
				console.log(`case 3`);
				adr = incAdr(adr);
				direction = botObject.direction = botChangeDirection(direction, 'left');
				console.log(`new direction is ${botObject.direction}`);
				// console.log(`world object direction is ${worldObj[posX][posY].direction}`);
				// console.log(`direction is ${direction}`);
				actCounter--;
				console.log("3 Go To adr: " + adr);
				break;
			case 4:
				console.log(`case 4`);
				adr = jumpAdr(adr, 4);
				actCounter--;
				console.log("4 Go To adr: " + adr);
				break;
			case 5:
				console.log(`case 5`);
				adr = jumpAdr(adr, 5);
				actCounter--;
				console.log("5 Go To adr: " + adr);
				break;
			default:
				console.log(`default`);
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

function genomMutate(botGenom) {
	let pos = getRandomInt(0, botGenom.length - 1);
	let oldGen = botGenom[pos];
	while (oldGen == botGenom[pos]) {
		botGenom[pos] = getRandomInt(0, 5);
	}
	return botGenom;
}

function botMove(coordX, coordY, newX, newY) {
    if ((worldMatrix[coordX][coordY].objType == 'bot') && (worldMatrix[newX][newY].objType == 'space')) {
        let temp = worldMatrix[coordX][coordY];
        temp['posX'] = newX;
        temp['posY'] = newY;
        worldMatrix[newX][newY] = temp;
        worldMatrix[coordX][coordY] = new Space();
    } else {
        return false;
    }
}

// Вычисление координат клетки в направлении взгляда бота
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
	} else if (viewDirection == 0) {
		coordsXY = -1;
	}
	return coordsXY; //[x,y] || -1
}

function botChangeDirection(direction, spin) {
	if (direction != 0) {
		switch (spin) {
			case 'left':
				if (direction != 1) {
					direction--;
				} else {
					direction = 8;
				}
				break;
			case 'rigth':
				if (direction != 8) {
					direction++;
				} else {
					direction = 1;
				}
				break;
			default:
				break;
		}
	}
	return direction;
}

// TODO: функция проверки объекта в указанных координатах
function botCheckDirection(botGenom, worldArray, coordX, coordY) { //получаем координаты, возвращаем ответ 
	// если пусто = 0, родственник = 1, чужой бот = 2, дерево = 3, минерал = 4, стена = -1, ошибка 255
	// TODO: дописать передачу координат и определение типа объекта
	let objType = worldArray[coordX][coordY].objType;
	let x;
	switch (objType) {
		case 'space':
			x = 0;
			break;
		case 'bot':
			let frontBotGenom = worldArray[coordX][coordY].genom;
			isRelative(botGenom, frontBotGenom) == 1 ? x = 1 : x = 2;
			// console.log(`is relative ${isRelative(botGenom, frontBotGenom)}`);
		// case 'relative':
		// 	x = 1;
		// 	break;
		// case 'stranger':
		// 	x = 2;
		// 	break;
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

// TODO: отрисовка канваса - должна вызываться каждый тик. Пока что рисуем просто в консольку
function render(arr) {
	for(let j = 0; j < arr.length; j++) {
		let line = '';
		for(let i = 0; i < arr[j].length; i++) {
			if (arr[j][i] != undefined && arr[j][i].objType == 'bot') {
				line += 'x';
			} else if (arr[j][i] != undefined && arr[j][i].objType == 'tree') {
				line += '*';
			} else if (arr[j][i] != undefined && arr[j][i].objType == 'mineral') {
				line += 'o';
			} else if (arr[j][i] != undefined && arr[j][i].objType == 'wall') {
				line += '#';
			} else {
				line += ' ';
			}
		}
		console.log(line);
	}
}


// * Создаем стену по краю мира
function buildTheWorldWall(arr) {
	for (let i = 0; i < arr.length-1; i++) {
		arr[0][i] = new Wall(); // top border
 		arr[i][arr[0].length-1] = new Wall(); // right border
		arr[arr.length-1][i+1] = new Wall(); // bottom border
		arr[i+1][0] = new Wall(); // left border
		
	}
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

// TODO: Check flags
function checkFlags(params) {
	return
}

// TODO: Set hungry flag to
function setHungryFlag(params) {
	return
}

// TODO: Change direction
function changeDirection(params) {
	return
}

// TODO: Check genom diffs
function isRelative(a, b) { //передаем геномы ботов
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

let timerId = setTimeout(function tick() {
	// console.clear();
	console.log(`*******`);
	console.log(`step ${worldTime}`);
	main(worldMatrix);
	render(worldMatrix);
	timerId = setTimeout(tick, 500); // (*)
	worldTime++;
	if (worldTime >= 20) {
		clearTimeout(timerId);
	}
}, 500);