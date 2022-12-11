'use strict'
/*
Task 1
а) Найти все вхождения буквы в строку
б) Тоже самое, но без чувствительности к регистру
*/

function charsCountA(str, char) {
  let counter = 0;
    for (let i = 0; i < str.length; i++) {
      str[i] === char ? counter++ : false;
    }
  return counter;
}

function charsCountB(str, char) {
  let counter = 0,
      lowCaseStr = str.toLowerCase(),
      lowCaseChar = char.toLowerCase();
    for (let i = 0; i < lowCaseStr.length; i++) {
      lowCaseStr[i] === lowCaseChar ? counter++ : false;
    }
  return counter;
}

let t1 = 'С другой стороны, высокотехнологичная концепция общественного уклада играет важную роль в формировании благоприятных перспектив.';

console.log('Test task 1');
console.log(charsCountA(t1, 'С'));
console.log(charsCountA(t1, ' '));
console.log(charsCountA(t1, ','));
console.log(charsCountB(t1, 'С'));
console.log('-----------');
/*
Task 2
Найти медиану неотсортированного массива

Медиана:
Число которое будет посередине если массив отсортировать или если в нем четное количество элементов, то сумма двух в центре делить попалам
*/

function returnMedian(arr) {
  let med = null;
    if (Array.isArray(arr)) {
      console.log(`Arr before sorting: \n ${arr}`);
      arr = bubbleSorter(arr);
      console.log(`Arr after sorting: \n ${arr}`);
      if (arr.length >= 2) {
        if (arr.length % 2 == 0) {
          let pos = arr.length / 2;
          med = (arr[pos - 1] + arr[pos]) / 2;
        } else {
          let pos = Math.floor(arr.length / 2);
          med = arr[pos];
        }
      } else if (arr.length == 1) {
        med = arr[0];
      }
    }
  return med;
}

/* Сортировка пузырьком */
function bubbleSorter(arr) {
  let changes = false;
  do {
    changes = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i + 1]) {
        if (arr[i] > arr[i + 1]) {
          let buffer = arr[i + 1];
          arr[i + 1] = arr[i];
          arr[i] = buffer;
          changes = true;
        }
      }
    }
  } while (changes == true);
  return arr;
}

/* Вспомогательные функции */
/* Возвращает массив случайных чисел в диапазоне [low, high] заданного размера (count) */
function randomArrayGenerator(count = 10, low = 0, high = 100) {
  let arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(getRandomInt(low, high));
  }
  return arr;
}

/* возвращает случайное число в диапазоне [min, max] */
function getRandomInt(min, max) {
	return (min < max) ?
		Math.floor(Math.random() * (max - min + 1)) + min :
    Math.floor(Math.random() * (min - max + 1)) + max ;
}

console.log('Test task 2');
let t2 = randomArrayGenerator();
// console.log(t2);
// console.log(bubbleSorter(t2));
console.log(`Median is: ${returnMedian(t2)}`);
console.log('-----------');

/*
Task 3
Дан массив вернуть true если есть включение из 3х и более последовательных элементов отличающихся на +1
*/

function isTripleLine(arr) {
  if (Array.isArray(arr) && (arr.length >= 3)) {
    console.log(`Arr before sorting: \n ${arr}`);
    arr = bubbleSorter(arr);
    let counter = 0;
      console.log(`Arr after sorting: \n ${arr}`);
      for (let i = 0; i < arr.length; i++) {
        arr[i] - arr[i + 1] == -1 ? counter++ : counter = 0;
        if (counter >= 3) {
          return true;
        }
      }
  }
  return false;
}

console.log('Test task 3');
let t3 = randomArrayGenerator(10, 1 , 10);
console.log(isTripleLine(t3));
console.log('-----------');