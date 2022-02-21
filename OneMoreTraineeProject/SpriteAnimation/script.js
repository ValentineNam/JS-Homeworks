'use strict'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// load images
const images = {};
images.player = new Image();
images.player.src = '/characters/cuphead.png';

const characterActions = [
  ['up', 5, 16],
  ['top_right', 4, 15],
  // ['idle_1', 1, 4],
  ['right', 1, 14],
  ['down_right', 5, 14],
  // ['idle_2', 1, 9],
  ['down', 13],
  // ['jump', 1, 10]
];

const characters = [];

class Character {
  constructor() {
    this.width = 103.0625;
    this.height = 113.125;
    this.frameX = 3;
    this.x = getRandomNumber(0, canvas.width - this.width);
    this.y = getRandomNumber(0, canvas.height - this.height);
    this.speed = getRandomNumber(1.5, 3.5);
    this.action = characterActions[getRandomInt(0, characterActions.length-1)][0];
    this.frameY = returnRowFrameOfAction(this.action);
    this.endFrame = 0;
  }
  draw() {
    drawSprite(
      images.player, this.width * this.frameX, this.height * this.frameY, 
      this.width, this.height, this.x, this.y, this.width, this.height);
      
      this.endFrame = characterActions[characterActions.map((innerArr) => innerArr[0]).indexOf(this.action)][2];
      if (this.frameX < this.endFrame - 1) this.frameX++;
      else this.frameX = characterActions[characterActions.map((innerArr) => innerArr[0]).indexOf(this.action)][1];;
  };
  update() {
    if (this.action === 'up') {
      if (this.y < 0 - this.height) {
        this.x = getRandomInt(this.width, canvas.width - this.width);
        this.y = canvas.height + this.height;
      }
      else {
        this.y -= this.speed;
      }
    }
    if (this.action === 'right') {
      if (this.x > canvas.width + this.width) {
        this.x = 0 - this.width;
        this.y = getRandomInt(this.height, canvas.height - this.height);
      }
      else {
        this.x += this.speed;
      }
    }
    if (this.action === 'top_right') {
      if ((this.x > canvas.width + this.width) || (this.y > canvas.height + this.height)) {
        this.x = getRandomInt(this.width, canvas.width - this.width);
        this.y = canvas.height + this.height;
      }
      else {
        this.x += this.speed;
        this.y -= this.speed;
      }
    }
    if (this.action === 'idle1') {
      return true;
    }
    if (this.action === 'down_right') {
      if ((this.x > canvas.width + this.width) || (this.y > canvas.height + this.height)) {
        this.x = 0 - this.width;
        this.y = getRandomInt(this.height, canvas.height - this.height);
      }
      else {
        this.x += this.speed;
        this.y += this.speed;
      }
    }
    if (this.action === 'idle2') {
      return true;
    }
    if (this.action === 'down') {
      if (this.y > canvas.height + this.height) {
        this.x = getRandomInt(this.width, canvas.width - this.width);
        this.y = 0 - this.height;
      }
      else {
        this.y += this.speed;
      }
    }
  }
}

function returnRowFrameOfAction(action) {
  switch (action) {
    case 'up':
      return 0;
      break;
    case 'top_right':
      return 1;
      break;
    case 'idle_1':
      return 2;
      break;
    case 'right':
      return 3;
      break;
    case 'down_right':
      return 4;
      break;
    case 'dle_2':
      return 5;
      break;
    case 'down':
      return 6;
      break;
    case 'jump':
      return 7;
      break;
    default:
      break;
  }
}

for (let index = 0; index < 15; index++) {
  characters.push(new Character());
}


/* возвращает случайное целое число в диапазоне [min, max] */
function getRandomInt(min, max) {
	if (min < max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * (min - max + 1)) + max;
	}
}

/* возвращает случайное число в диапазоне [min, max] */
function getRandomNumber(min, max) {
	if (min < max) {
		return (Math.random() * (max - min + 1)) + min;
	} else {
		return (Math.random() * (min - max + 1)) + max;
	}
}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  characters.forEach(element => {
    element.draw();
    element.update();
  });

}

window.onload = setInterval(animate, 1000/30);

window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});