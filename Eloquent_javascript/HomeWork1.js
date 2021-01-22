// TODO:
// Напишите функцию range, принимающую два аргумента, начало и конец диапазона, 
// и возвращающую массив, который содержит все числа из него, включая начальное 
// и конечное.Затем напишите функцию sum, принимающую массив чисел и 
// возвращающую их сумму.

function range(start, end) {
    let arr = [];
    if (isNaN(start) || isNaN(end)) {
        return false;
    }
    if  (start <= end) {
        for (let i = start; i <= end; i++) {
            arr.push(i);
            } 
        } else {
        for (let i = end; i <= start; i++) {
            arr.push(i);
            }
    }
    return arr;
}

function sum(arr) {
    let s = 0;
    if (Array.isArray(arr)) {
        arr.forEach(element => {
            s = parseInt(s) + parseInt(element);
        });
    }
    return s;
}


console.log(range(-2, 3));
console.log(range(5, 1));
console.log(range(10,'qwerty'));
console.log(range(undefined,10));
console.log(sum(range(-2, 3)));
console.log(sum(range(5, 1)));
console.log(sum(undefined));
console.log(sum());

// ToDo:
// В качестве дополнительного задания: измените функцию range так, чтобы она принимала 
// необязательный третий аргумент, который указывал бы значение шага, используемое при 
// построении массива. Если шаг не задан, элементы увеличиваются на единицу, что соответствует 
// старому поведению. Вызов функции range(1, 10, 2) должен возвращать [1, 3, 5, 7, 9]. 
// Убедитесь, что функция также работает и с отрицательными значениями шага, так что 
// результатом range(5, 2, -1) является [5, 4, 3, 2].

function modifiedRange(start, end, step) {
    let arr = [];
    if (isNaN(start) || isNaN(end)) {
        return false;
    }
    if (!step || step == 0) {
        start <= end ? step = 1: step = -1;
    }
    if  (start <= end) {
        if (step > 0) {
            for (let i = start; i <= end; i += step) {
                arr.push(i);
            }
            return arr;
        } else {
            return `У возрастающего диапазона шаг должен быть положительным!`;
        }
    }
    if  (start > end) {
        if (step < 0) {
            for (let i = start; i >= end; i += step) {
                arr.push(i);
            }
            return arr;
        } else {
            return `У низсходящего диапазона шаг должен быть отрицательным!`;
        }
    }
    // return arr;
}

console.log(modifiedRange(-5, 1));
console.log(modifiedRange(2, -3, 0));
console.log(modifiedRange(4, 6, 1));
console.log(modifiedRange(5, 2, -1));
console.log(modifiedRange(1, 5, -1));
console.log(modifiedRange(5, 1, 1));
console.log(modifiedRange(undefined, 2, -1));
console.log(modifiedRange(4, 'text', 1));