function onClick(id) {
//  isFinish(data);
  let elem = document.getElementById(id);
  let i = id.charAt(0);
  let j = id.charAt(1);
  let target = event.target; // где был клик?
  if (target.tagName != 'TD') return; // не на TD? тогда не интересует
  if (elem.className == 'w') {
    event.target.innerHTML = 'X';
    elem.classList.remove('w');
    elem.classList.add('x');
    data[i][j] = 'x';
//    randomInput(data, 'o');
    aiPick();
    renderScore(data);
  } else if (elem.className == 'x'){
    event.target.innerHTML = '<b>X</b>';
    wait(target);
  } else {
    return;
  }
//  aiCount(data,'x');
  isFinish(data);
  console.log(finishFlag);
  return data;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

var wait = async (target) => {
  await delay(500);
  target.innerHTML = 'X';
//  console.log("X is already here");
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomInput(array, char) {
  let x, y, id, elem;
    for (let i = 0; i < 1; i++) {
      x = getRandomInt(0, array.length-1);
      y = getRandomInt(0, array[i].length-1);
      id = x.toString() + y.toString();
      elem = document.getElementById(id);
      if (array[x][y] != char && elem.className == 'w') {
        array[x][y] = char;
        elem.classList.remove('w');
        elem.classList.add('o');
        elem.innerHTML = 'O';
      } else if (checkArray(array)) {
//        console.log('else if');
//        console.log('X: ' + x + ' Y: ' + y);
        i--;
        continue;
      } else {
//        console.log('else')
//        console.log('X: ' + x + ' Y: ' + y);
        return;
      }
    }
}

function checkArray(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] == 'w') {
        return true;
      } else if (array[i][j] == 'o') {
        continue;
      } else if (array[i][j] == 'x') {
        continue;
      } else if (array[i][j] == 'b') {
        continue;
      } else {
        return false;
      }
    }
  }
}

function createMatrix(n,m,char) {
  let array = [];
    for (let i = 0; i < m; i++){
      array[i] = [];
      for (let j = 0; j < n; j++){
        if (char == undefined) {
          array[i][j] = 'w';
        } else {
          array[i][j] = char;
        }
      }
    }
  return array
}

function rocks(array, count) {
  if (count != 0) {
    let x, y;
      for (let i = 0; i < count; i++) {
        x = getRandomInt(1, array.length-2);
        y = getRandomInt(1, array[i].length-2);
        if (array[x][y] != 'b') {
          array[x][y] = 'b';
        } else if (array[x][y] == 'b') {
          i--;
          continue;
        }
      }
    return array;
  }
}

function fullScore(array, char) {
  var counter = 0;
  counter += horisontalScore(array, char);
  counter += verticalScore(array, char);
  counter += topToBotDiagScore(array, char);
  counter += botToTopDiagScore(array, char);
  return counter;
}

function horisontalScore(array, char) {
  let counter = 0;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length-2; j++) {
        if (checkValue(array[i][j], char)) {
          if (checkValue(array[i][j+1], char)) {
            if (checkValue(array[i][j+2], char)) {
              counter++;
            } else {
              continue;
            }
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    }
  return counter;
}

function verticalScore(array, char) {
  let counter = 0;
    for (let i = 0; i < array.length-2; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (checkValue(array[i][j], char)) {
          if (checkValue(array[i+1][j], char)) {
            if (checkValue(array[i+2][j], char)) {
              counter++;
            } else {
              continue;
            }
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    }
  return counter;
}

function topToBotDiagScore(array, char) {
  let counter = 0;
    for (let i = 0; i < array.length-2; i++) {
      for (let j = 0; j < array[i].length-2; j++) {
        if (checkValue(array[i][j], char)) {
          if (checkValue(array[i+1][j+1], char)) {
            if (checkValue(array[i+2][j+2], char)) {
              counter++;
            } else {
              continue;
            }
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    }
  return counter;
}

function botToTopDiagScore(array, char) {
  let counter = 0;
    for (let i = 0; i < array.length-2; i++) {
      for (let j = 0; j < array[i].length-2; j++) {
        if (checkValue(array[i+2][j], char)) {
          if (checkValue(array[i+1][j+1], char)) {
            if (checkValue(array[i][j+2], char)) {
              counter++;
            } else {
              continue;
            }
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    }
  return counter;
}

function checkValue(value, char) {
  if (value == char) {
    return true
  } else {
    return false
  }
}

function renderScore(array) {
  let x_id, o_id;
  let x, o = '0';
  x_id = 'x_score';
  o_id = 'o_score';
  elem = document.getElementById(x_id);
  x = fullScore(array, 'x');
  elem.innerHTML = x;
  elem = document.getElementById(o_id);
  o = fullScore(array, 'o');
  elem.innerHTML = o;
}

function start() {
  data = createMatrix(5,5);
  finishFlag = true;
  clearHtml(data);
  startPositionOfO(data, 'o');
  init(data);
  renderScore(data);
  return data;
}

function clearHtml(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      let id = i.toString() + j.toString();
      let elem = document.getElementById(id);
      elem = document.getElementById(id);
      elem.innerHTML = '';
      elem.classList.remove("blck");
      elem.classList.remove("x");
      elem.classList.remove("o");
      elem.classList.add("w");
    }
  }
}

function init(array) {
  let e = document.getElementById("rocks_count");
  let value = e.options[e.selectedIndex].value;
  if (value == NaN || value < 0 || value > 3) {
    value = 0;
  }
  rocks(array, value);
  colorToBlack(array);
}

function colorToBlack(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      let id = i.toString() + j.toString();
      let elem = document.getElementById(id);
      elem.classList.remove("blck");
      if (array[i][j] == 'b') {
        elem.classList.remove("w");
        elem.classList.add("blck");
      }
    }
  }
}

function startPositionOfO(array, char) {
  let corner = getRandomInt(0,3);
  let elem, id;

  switch (corner) {
    case 0:
      array[0][0] = char;
      elem = document.getElementById('00');
      elem.classList.remove('w');
      elem.classList.add('o');
      elem.innerHTML = 'O';
      break;
    case 1:
      array[0][array[0].length-1] = char;
      id = '0' + (array[0].length-1).toString();
      elem = document.getElementById(id);
      elem.classList.remove('w');
      elem.classList.add('o');
      elem.innerHTML = 'O';
      break;
    case 2:
      array[array.length-1][array[0].length-1] = char;
      id = (array.length-1).toString() + (array[0].length-1).toString();
      elem = document.getElementById(id);
      elem.classList.remove('w');
      elem.classList.add('o');
      elem.innerHTML = 'O';
      break;
    case 3:
      array[array.length-1][0] = char;
      id = (array.length-1).toString() + '0';
      elem = document.getElementById(id);
      elem.classList.remove('w');
      elem.classList.add('o');
      elem.innerHTML = 'O';
      break;
  }
}

function languageChange(value) {
  let id, elem;
  if (value == 0) {
    id = 'lang_header';
    elem = document.getElementById(id);
    elem.innerHTML = 'Language';
    id = 'head';
    elem = document.getElementById(id);
    elem.innerHTML = 'X/O Game';
    id = 'x_score_head';
    elem = document.getElementById(id);
    elem.innerHTML = 'Score X';
    id = 'o_score_head';
    elem = document.getElementById(id);
    elem.innerHTML = 'Score O';
    id = 'rocks_count';
    elem = document.getElementById(id);
    elem.innerHTML = '';
    elem.innerHTML += '<option selected disabled value="0">Count of rocks</option>';
    elem.innerHTML += '<option value="0">0</option>';
    elem.innerHTML += '<option value="1">1</option>';
    elem.innerHTML += '<option value="2">2</option>';
    elem.innerHTML += '<option value="3">3</option>';
    id = 'start_button';
    elem = document.getElementById(id);
    elem.innerHTML = 'START';
    langFlag = 'en';
  } else if (value == 1) {
    id = 'lang_header';
    elem = document.getElementById(id);
    elem.innerHTML = 'Язык';
    id = 'head';
    elem = document.getElementById(id);
    elem.innerHTML = 'Крестики-Нолики';
    id = 'x_score_head';
    elem = document.getElementById(id);
    elem.innerHTML = 'Счет X';
    id = 'o_score_head';
    elem = document.getElementById(id);
    elem.innerHTML = 'Счет O';
    id = 'rocks_count';
    elem = document.getElementById(id);
    elem.innerHTML = '';
    elem.innerHTML += '<option selected disabled value="0">Количество камней</option>';
    elem.innerHTML += '<option value="0">0</option>';
    elem.innerHTML += '<option value="1">1</option>';
    elem.innerHTML += '<option value="2">2</option>';
    elem.innerHTML += '<option value="3">3</option>';
    id = 'start_button';
    elem = document.getElementById(id);
    elem.innerHTML = 'СТАРТ';
    langFlag = 'rus';
  } else {
    return;
  }
}

function timer() {

}

function isFinish(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] == 'w') {
        finishFlag = false;
        return;
      } else {
        finishFlag = true;
      }
    }
  }
  if (finishFlag == true){
    let x, o = 0;
    x = fullScore(data, 'x');
    o = fullScore(data, 'o');
    switch (langFlag) {
    case ('en'):
      if (x > o) {
        alert('X is win with score: ' + x + ':' + o);
      } else if (o > x) {
        alert('O is win with score: ' + o + ':' + x);
      } else if (x == o) {
        alert('Where is no winners. \nFinal score is ' + x + ':' + o);
      }
      break;
    case ('rus'):
    if (x > o) {
      alert('X побеждает со счетом: ' + x + ':' + o);
    } else if (o > x) {
      alert('O побеждает со счетом: ' + o + ':' + x);
    } else if (x == o) {
      alert('Победителей нет. \nИгра закончилась со счетом: ' + x + ':' + o);
    }
      break;
    }
  }
}

function xoCount1(char) {
//  console.log(array);
  let obj = {
    coordinates: [],
    power: ''
  }
  let power = 0;
  let coordinates = [0,0];
  let array_of = getArray();
//  console.log(array_of);
  for (let i = 0; i < array_of.length; i++) {
    for (let j = 0; j < array_of[i].length; j++) {
      if (array_of[i][j] == 'w') {
        array_of = getArray();
        array_of[i][j] = char;
//        console.log(array_of);
        if (fullScore(array_of, char) >= power /*&& fullScore(array_of, char) != 0*/) {
          coordinates[0] = i;
          coordinates[1] = j;
//          console.log('coordinates: ' + coordinates);
          power = fullScore(array_of, char);
//          console.log('power: ' + power);
          }
      } else if (array_of[i][j] == 'x' || array_of[i][j] == 'o' || array_of[i][j] == 'b') {
        continue;
      } else {
        continue;
      }
    }
  }
  obj.coordinates = coordinates;
  obj.power = power;
  return obj;
}

function xoCount(char) {
//  console.log(array);
  let obj = {
    coordinates: [],
    power: ''
  }
  let power = 0;
  let coordinates = [0,0];
  let array_of = getArray();
//  console.log(array_of);
  for (let i = 0; i < array_of.length; i++) {
    for (let j = 0; j < array_of[i].length; j++) {
      if (array_of[i][j] == 'w') {
        array_of = getArray();
        array_of[i][j] = char;
//        console.log(array_of);
        if (fullScore(array_of, char) - fullScore(getArray(), char) >= power /*&& fullScore(array_of, char) != 0*/) {
          coordinates[0] = i;
          coordinates[1] = j;
//          console.log('coordinates: ' + coordinates);
          power = fullScore(array_of, char) - fullScore(getArray(), char);
//          console.log('power: ' + power);
          }
      } else if (array_of[i][j] == 'x' || array_of[i][j] == 'o' || array_of[i][j] == 'b') {
        continue;
      } else {
        continue;
      }
    }
  }
  obj.coordinates = coordinates;
  obj.power = power;
  return obj;
}


function aiPick() {
  let x = xoCount('x');
  let o = xoCount('o');
//  console.log(x);
//  console.log(o);
  if (x.power > o.power ) {
    targetInput(data, x.coordinates, 'o');
  } else if ((x.power < o.power)/* || (x.power == o.power && o.power != 0)*/) {
    targetInput(data, o.coordinates, 'o');
  } else if (x.power == o.power && o.power != 0) {
    let a = getRandomInt(1,3);
    if (a == 1) {
      targetInput(data, x.coordinates, 'o');
    } else if (a == 2 || a == 3) {
      targetInput(data, o.coordinates, 'o');
    }
  } else {
    randomInput(data, 'o');
  }
}


function targetInput(array, coords, char) {
  let x, y, id, elem;
  x = coords[0];
  y = coords[1];
  id = x.toString() + y.toString();
  elem = document.getElementById(id);
  if (array[x][y] != char && elem.className == 'w') {
    array[x][y] = char;
    elem.classList.remove('w');
    elem.classList.add(char);
    elem.innerHTML = 'O';
  } else {
    return false;
  }
}

function getArray() {
  let array = createMatrix(5,5);
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      let id = i.toString() + j.toString();
      let elem = document.getElementById(id);
      value = elem.classList.value;
      if (value == 'blck') {
        array[i][j] = 'b';
      } else {
        array[i][j] = value;
      }
    }
  }
  return array;
}
/*
  let new_array = [];
  const old_array = array;
  let power = 0;
  let coordinates = [];
  console.log(new_array);
  console.log(power);
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      new_array = array;
      console.log(new_array);
      if (new_array[i][j] == 'w') {
        new_array[i][j] = 'x';
      } else {
        continue;
      }
    }
  }


  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      new_array = old_array;
      console.log(new_array);
      if (new_array[i][j] == 'w') {
        new_array[i][j] = char;
        coordinates[0] = i;
        coordinates[1] = j;
        console.log('coordinates: ' + coordinates);
        if (fullScore(new_array, char) >= power) {
          power = fullScore(new_array, char);
          console.log('power: ' + power);
        }
      } else if (new_array[i][j] == 'x' || new_array[i][j] == 'o' || new_array[i][j] == 'b') {
        continue;
      } else {
        return;// power;
      }
    }
  }

}
    for (let i = 0; i < 1; i++) {
      x = getRandomInt(0, array.length-1);
      y = getRandomInt(0, array[i].length-1);
      id = x.toString() + y.toString();
      elem = document.getElementById(id);
      if (array[x][y] != char && elem.className == 'w') {
        array[x][y] = char;
        elem.classList.remove('w');
        elem.classList.add('o');
        elem.innerHTML = 'O';
      } else if (checkArray(array)) {
//        console.log('else if');
//        console.log('X: ' + x + ' Y: ' + y);
        i--;
        continue;
      } else {
//        console.log('else')
//        console.log('X: ' + x + ' Y: ' + y);
        return;
      }
    }
*/


var data = createMatrix(5,5);
var finishFlag = false;
var langFlag = 'en';
console.log(data);
