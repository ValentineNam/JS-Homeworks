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

console.log(charsCountA(t1, 'С'));
console.log(charsCountA(t1, ' '));
console.log(charsCountA(t1, ','));
console.log(charsCountB(t1, 'С'));

/*
Task 2
Найти медиану неотсортированного массива

Медиана:
Число которое будет посередине если массив отсортировать или если в нем четноеколичество элементов, 
то сумма двух в центре делить попалам
*/

/*
Task 3
Дан массив вернуть true если есть включение из 3х и более последовательных элементов отличающихся на +1
*/
