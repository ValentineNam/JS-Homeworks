'use strict'

const CANVAS_WIDTH = 800,
	CANVAS_HEIGTH = 600,
	GENOM_LENGTH = 16,
	WORLD_X = 7,
	WORLD_Y = 7;

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
		this.flagMoved = 0;
        this.flagAlive = 1;
        this.genom = [];
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

worldMatrix[4][4] = new Bot(4, 4);

worldMatrix[4][4]['genom'] = randomGenomGenerator();

worldMatrix[2][3] = new Tree(2, 3);

worldMatrix[3][3] = new Mineral(3, 3);

function main(worldObj) {
	clearMoveParams(worldObj);
	vmsFunc(worldObj);
}

function vmsFunc(worldObj) {
	for(let j = 0; j < worldObj.length; j++) {
		for(let i = 0; i < worldObj[j].length; i++) {
			let elem = worldObj[j][i];
            if (elem.objType == 'bot') {
                if (elem.flagMoved == 0) { 
					genomVM(elem, worldObj);
				}
            } else if (elem.objType == 'tree') {
				treeVM(elem, worldObj);
            } else if (elem.objType == 'mineral') {

            } else if (elem.objType == 'space') {

            }
		}
	}
}

function clearMoveParams(worldObj) {
	for(let j = 0; j < worldObj.length; j++) {
		for(let i = 0; i < worldObj[j].length; i++) {
			let elem = worldObj[j][i];
            if (elem.objType == 'bot') {
                elem.flagMoved = 0;
            }
		}
	}
}

function genomVM(botObject, worldObj) {
	let breakFlag = 0,
	actCounter = 16,
	adr = 0;

	let energy = botObject.energy,
	direction = botObject.direction, // * направление взгляда бота 1 сев, 2 сев-вос, 3 восток ... 8 сев-зап, 0 - никуда
	posX = botObject.posX,
	posY = botObject.posY,
	botGenom = botObject.genom,
	botMoved = botObject.flagMoved;

	for (;((breakFlag == 0) && (actCounter >= 0) && (botMoved != 1));) {
		switch (botGenom[adr]) {
			case 0: // Mutate random gen
				adr = incAdr(adr);
				genomMutate(botGenom);
				actCounter--;
				break;
			case 1: // Move front
			// Понять, что за координаты спереди (по линии взгляда)
			// Если не смотрит никуда (спит), то переходим к команде в адресе +1
			// Если спереди есть стена, то переходим к команде в адресе +2
			// Если спереди не пустое пространство и не стена, то переходим к команде в адресе +3
			// Если спереди пустое пространство, то шагаем на клетку вперед переходим к команде +4
				let frontCoordinates = getFrontCellCoordinates(direction, posX, posY);
				let frontObjectType;
				let frontX;
				let frontY;
				if (frontCoordinates != -1) {
					frontX = frontCoordinates[0];
					frontY = frontCoordinates[1];
					frontObjectType = worldObj[frontX][frontY].objType;			
				}
                if (direction == 0) {
                    adr = incAdr(adr);
                } else {
					if (frontObjectType == 'wall') {
						adr = jumpAdr(adr, 2);
					} else if ((frontObjectType == 'bot') || (frontObjectType == 'tree') || (frontObjectType == 'mineral')) {
						adr = jumpAdr(adr, 3);
					} else if (frontObjectType == 'space') {
						botMove(posX, posY, frontX, frontY);
						adr = jumpAdr(adr, 4);
						breakFlag = 1; // Перемещение это прерывающая активность операция 
						botObject.flagMoved = 1;
					};
				};
				actCounter--;
				break;
			case 2: // Bot change direction right
				adr = incAdr(adr);
				direction = botObject.direction = botChangeDirection(direction, 'rigth');
				actCounter--;
				break;
			case 3: // Bot change direction left
				adr = incAdr(adr);
				direction = botObject.direction = botChangeDirection(direction, 'left');
				actCounter--;
				break;
			case 4:
				adr = jumpAdr(adr, 4);
				actCounter--;
				break;
			case 5:
				adr = jumpAdr(adr, 5);
				actCounter--;
				break;
			default:
				adr = 0;
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

function genomRecombinate(botGenom) {
	let pos1 = getRandomInt(0, botGenom.length - 1);
	let pos2, temp;
	pos2 = getRandomInt(0, botGenom.length - 1);
	while (pos2 == pos1) {
		pos2 = getRandomInt(0, botGenom.length - 1);
	}
	temp = botGenom[pos1] ;
	botGenom[pos1] = botGenom[pos2];
	botGenom[pos2] = temp;
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
	return false;
}

// TODO: Minerals VM
function mineralsVM(params) {
	return false;
}

// TODO: Create new bot
function createBot(params) {
	return false;
}

// TODO: Create new child
function createChild(params) {
	return false;
}

// TODO: Check flags
function checkFlags(params) {
	return false;
}

// TODO: Set hungry flag to
function setHungryFlag(params) {
	return false;
}

// TODO: Change direction
function changeDirection(params) {
	return false;
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
	console.clear();
	// console.log(`*******`);
	console.log(`step ${worldTime}`);
	main(worldMatrix);
	render(worldMatrix);
	timerId = setTimeout(tick, 500); // (*)
	worldTime++;
	if (worldTime >= 20) {
		clearTimeout(timerId);
	}
}, 500); 