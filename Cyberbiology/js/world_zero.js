'use strict'

const CANVAS_WIDTH = 800,
	CANVAS_HEIGTH = 600,
	GENOM_LENGTH = 16,
	WORLD_X = 7,
	WORLD_Y = 7;

let worldTime = 0;

function Bot(coordX, coordY) {
		this.objType = 'bot';
		this.age = [0,1024];
		this.posX = coordX;
		this.posY = coordY;
		this.direction = 1;
		this.flagAttacked = 0;
		this.flagSleeping = 0;
		this.flagHungry = 0;
		this.flagMoved = 0;
		this.flagAlive = 1;
		this.energy = [512,1024];
		this.minerals = [8,256];
		this.speed = 100;
		this.genom = [];
}

function Space() {
	this.objType = 'space';
	this.energy = [271,8192];
	// TODO: добавить рассеивание энергии в пространстве, поглошение ее деревьями
	// TODO: и превращение минералов в энергию после "смерти". Также, добавить
	// TODO: прямое получение энергии пространства из клетки пустого пространства
	// TODO: при переходе ботом в нее. Бот "сгорает", если энергия в клетке слишком большая.
	// TODO: Добавить ген проверки температуры в клетке по направлению взгляда.
}

function Tree(coordX, coordY) {
	this.objType = 'tree';
	this.age = [0,2048];
	this.posX = coordX;
	this.posY = coordY;
	this.energy = [300,2048];
	this.minerals = [200,2048];
	this.flagAlive = 1;
	this.genus = 'tree';
}

function Meat(coordX, coordY) {
	this.objType = 'meat';
	this.age = [0,128];
	this.posX = coordX;
	this.posY = coordY;
	this.energy = [20,256];
	this.minerals = [2048,2048];
	this.flagAlive = 1;  
}

function Mineral(coordX, coordY) {
	this.objType = 'mineral';
	this.age = [0,4096];
	this.posX = coordX;
	this.posY = coordY;
	this.energy = [20,256];
	this.minerals = [2048,4096];
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
	for(let j = worldObj.length; j--;) {
		for(let i = worldObj[j].length; i--;) {
			worldObj[j][i] = new Space();
		}
	}
}

// * возвращает геном (массив длиной 16 из случайных чисел от 0 до 5)
function randomGenomGenerator(genomLength = 16, genomLowAdr = 0, genomHighAdr = 5) {
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

// * возвращает целый показатель степени, в которую нужно возвести 2 для получения числа x
function powerOfTwo(x) {
	let pow = 1;
	for (;2 <= x / 2; pow++) {
		x /= 2;
	}
	return pow;
}

let worldMatrix = create2DArray(WORLD_X, WORLD_Y);

emptySpaceGenerator(worldMatrix);

buildTheWorldWall(worldMatrix);

worldMatrix[2][5] = new Bot(2, 5);

worldMatrix[2][5]['genom'] = randomGenomGenerator();

createNewTree(2, 3);

worldMatrix[3][3] = new Mineral(3, 3);

botMove(2, 2, 4, 1);

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
				elem.age[0] += 1;
            } else if (elem.objType == 'tree') {
				treeVM(elem, worldObj);
				elem.age[0] += 1;
            } else if (elem.objType == 'mineral') {
				elem.age[0] += 1;
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

	let energy,
	direction = botObject.direction, // * направление взгляда бота 1 сев, 2 сев-вос, 3 восток ... 8 сев-зап, 0 - никуда
	posX = botObject.posX,
	posY = botObject.posY,
	botGenom = botObject.genom,
	botMoved = botObject.flagMoved,
	botSpeed;

	for (;((breakFlag == 0) && (actCounter >= 0) && (botMoved != 1));) {
		energy = botObject.energy[0];
		botSpeed = setSpeed(botObject);
		let frontCoordinates = getFrontCellCoordinates(direction, posX, posY);
		let frontObjectType;
		let frontX;
		let frontY;
		if (frontCoordinates != -1) {
			frontX = frontCoordinates[0];
			frontY = frontCoordinates[1];
			frontObjectType = worldObj[frontX][frontY].objType;		
		}
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
				if  (energy > botSpeed) {
					if (direction == 0) {
						adr = incAdr(adr);
						energy = decEnergy(energy, 1); //спим - тратим 1 ед энергии
					} else {
						if (frontObjectType == 'wall') {
							adr = jumpAdr(adr, 2);
							energy = decEnergy(energy, 1);
						} else if ((frontObjectType == 'bot') || (frontObjectType == 'tree') || (frontObjectType == 'mineral')) {
							adr = jumpAdr(adr, 3);
							energy = decEnergy(energy, 1);
						} else if (frontObjectType == 'space') {
							botMove(posX, posY, frontX, frontY);
							adr = jumpAdr(adr, 4);
							breakFlag = 1; // Перемещение это прерывающая активность операция 
							botObject.flagMoved = 1;
							energy = decEnergy(energy, botSpeed); //при перемещении уменьшаем энергию на величину botSpeed
						};
					};
				} else {
					breakFlag = 1;
					break;
				}
				actCounter--;
				break;
			case 2: // Bot change direction right
				adr = incAdr(adr);
				direction = botObject.direction = botChangeDirection(direction, 'rigth');
				energy = decEnergy(energy, Math.ceil(botSpeed/8));
				actCounter--;
				break;
			case 3: // Bot change direction left
				adr = incAdr(adr);
				direction = botObject.direction = botChangeDirection(direction, 'left');
				energy = decEnergy(energy, Math.ceil(botSpeed/8));
				actCounter--;
				break;
			case 4: // Bot checks his energy lvl
			// Если энергия от 0 до 9% то переходим к команде в адресе +1, 10-59% => +2, 60-99% => +3, 100% => +4
				let eLvl = botCheckOwnEnergy(botObject);
				if (eLvl = 0) {
					adr = incAdr(adr);
				} else if ((eLvl >= 1) && (eLvl <= 5)) {
					adr = jumpAdr(adr, 1);
				} else if ((eLvl >= 6) && (eLvl <= 9)) {
					adr = jumpAdr(adr, 2);
				} else if (eLvl = 10) {
					adr = jumpAdr(adr, 3);
				}
				energy = decEnergy(energy, 1);
				actCounter--;
				break;
			case 5:
				if (frontObjectType == 'tree') {
					energy = botEatTree(botObject, frontX, frontY);
					energy = decEnergy(energy, 1);
					breakFlag = 1;
				}
				adr = incAdr(adr);
				actCounter--;
				break;
			default:
				adr = 0;
				breakFlag = 1;
				break;
		}
		botObject.energy[0] = energy;
		if (botObject.energy[0] == 0) {
			revertAliveFlag(botObject);
		}
	}
	checkBotAge(botObject);
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

// * Вычисление координат клетки в направлении взгляда бота
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
function botCheckDirection(botGenom, worldArray, coordX, coordY) { // * получаем координаты, возвращаем ответ 
	// * если пусто = 0, родственник = 1, чужой бот = 2, дерево = 3, минерал = 4, стена = -1, ошибка 255
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
			} else if (arr[j][i] != undefined && arr[j][i].objType == 'meat') {
				line += '+';
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
	for (let i = arr.length-1; i--;) {
		arr[0][i] = new Wall(); // top border
 		arr[i][arr[0].length-1] = new Wall(); // right border
		arr[arr.length-1][i+1] = new Wall(); // bottom border
		arr[i+1][0] = new Wall(); // left border
		
	}
}

// TODO: Tree VM
//дерево  приращивает каждый ход энергию и минералы, по достижению определенного возраста умирает
//и оставляет всю накопленную энергию в минерале, которая "остывая" превращается в минеральную составляющую
//дерева energy -> minerals
//Если у дерева возраст > определенного значения и достаточно энергии и минералов, создает еще одно дерево
//в определенном радиусе
function treeVM(treeObject, worldObj) {

	return false;
}

function createNewTree(coordX, coordY, genusType = 'tree') {
	worldMatrix[coordX][coordY] = new Tree(coordX, coordY);
	if ((genusType == 'grass') || (genusType == 'bush')) {
		worldMatrix[coordX][coordY] .genus = genusType;
	}
}

// TODO: Minerals VM
function mineralsVM(params) {
	return false;
}

// TODO: Meat VM
function meatVM(params) {
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

// * Сменить флаг объекта с жив на мертв
function revertAliveFlag(targetObject) {
	targetObject.flagAlive = 0;
	return false;
}

// TODO: Give resources in some direction
function giveResources(params) {
	return false;
}

// TODO: Attack another bot in some direction
function botAttack(params) {
	return false;
}

// TODO: Eat tree
function botEatTree(botObject, coordX, coordY) {
	if (worldMatrix[coordX][coordY].objType == 'tree') {
		let treeObj = worldMatrix[coordX][coordY],
		treeEnergy = treeObj.energy[0],
		treeMinerals = treeObj.minerals[0],
		botHungry = botObject.flagHungry,
		botEnergy = botObject.energy[0],
		botMinerals = botObject.minerals[0],
		botEnergyDiff = botObject.energy[1] - botObject.energy[0],
		botMineralsDiff = botObject.energy[1] - botObject.energy[0],
		botPosX = botObject.posX,
		botPosY = botObject.posY,
		multiplier = 1,
		oneBiteValue = 100,
		temp;

		if (botHungry == 1) {
			multiplier = 2.5;
		}

		if ((treeEnergy <= multiplier * oneBiteValue) && (botEnergyDiff <= treeEnergy)) {
			temp = botEnergyDiff;
		} else if ((treeEnergy <= multiplier * oneBiteValue) && (botEnergyDiff > treeEnergy)) {
			temp = treeEnergy;
		} else if ((treeEnergy > multiplier * oneBiteValue) && (botEnergyDiff <= treeEnergy)) {
			temp = botEnergyDiff; 
		} else if ((treeEnergy > multiplier * oneBiteValue) && (botEnergyDiff > treeEnergy)) {
			temp = oneBiteValue;
		}

		botEnergy += multiplier * temp;
		treeEnergy -= multiplier * temp;

		if ((treeMinerals <= multiplier * oneBiteValue) && (botMineralsDiff <= treeMinerals)) {
			temp = botMineralsDiff;
		} else if ((treeMinerals <= multiplier * oneBiteValue) && (botMineralsDiff > treeMinerals)) {
			temp = treeMinerals;
		} else if ((treeMinerals > multiplier * oneBiteValue) && (botMineralsDiff <= treeMinerals)) {
			temp = botMineralsDiff; 
		} else if ((treeMinerals > multiplier * oneBiteValue) && (botMineralsDiff > treeMinerals)) {
			temp = oneBiteValue;
		}

		botMinerals += multiplier * temp;

		treeMinerals -= multiplier * temp;

		worldMatrix[coordX][coordY].energy[0] = treeEnergy;
		worldMatrix[coordX][coordY].minerals[0] = treeMinerals;
		worldMatrix[botPosX][botPosY].minerals[0] = botMinerals;
		return botEnergy; 
	}
}

// TODO: Bot eat meat
function botEatMeat(params) {
	return false;
}

// TODO: Bot eat mineral
function botEatMineral(params) {
	return false;
}

// * Бот проверяет свой уровень энергии
function botCheckOwnEnergy(botObject) {
	let energy = botObject.energy[0],
	maxEnergy = botObject.energy[1],
	energyLvl = Math.floor(energy / maxEnergy * 10);
	return energyLvl; // возвращаем уровень от 0 - 10
}

// TODO: Bot to meat
function botToMeat(botObject) {
	let x = botObject.posX,
	y = botObject.posY,
	energy = botObject.energy[0],
	minerals = botObject.minerals[0],
	meat = new Meat();

	meat.energy[0] = energy;
	meat.minerals[0] = minerals;
	worldMatrix[x][y] = meat;
}

// TODO: Meat to mineral
function meatToMineral(params) {
	return false;
}

// TODO: Tree to mineral
function treeToMineral(params) {
	return false;
}

// TODO: Mineral to energy
function mineralToEnergy(params) {
	return false;
}

// * Проверяем возраст бота
function checkBotAge(botObject) {
	let age = botObject.age[0],
	maxAge = botObject.age[1];
	if (age >= maxAge) {
		botToMeat(botObject);
	}
}

// * Set speed of bot
function setSpeed(botObject) {
	let e = botObject.energy[0],
	eMax = botObject.energy[1],
	m = botObject.minerals[0],
	mMax = botObject.minerals[1],
	speed;
	speed = Math.ceil((95 + powerOfTwo(m) * powerOfTwo(mMax)) / (5 + powerOfTwo(e))) + Math.round(powerOfTwo(m) / powerOfTwo(e)) + Math.floor(powerOfTwo(mMax) / powerOfTwo(eMax));
	return speed;
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