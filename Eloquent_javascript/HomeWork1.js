// TODO:
// Напишите функцию range, принимающую два аргумента, начало и конец диапазона, 
// и возвращающую массив, который содержит все числа из него, включая начальное 
// и конечное.Затем напишите функцию sum, принимающую массив чисел и 
// возвращающую их сумму.

function range(start, end) {
    let array = [];
    if (isNaN(start) || isNaN(end)) {
        return false;
    } 
    if  (start <= end) {
        for (let i = start; i <= end; i++) {
            array.push(i);
            } 
        } else {
        for (let i = end; i <= start; i++) {
            array.push(i);
            }
    }
    return array;
}

function sum(...array) {
    let sum = 0;
    array.reduce((sum, element) => sum += parseInt(element));
    return sum;
}


// console.log(range(-2, 2));
// console.log(range(5, 1));
// console.log(range(10,'qwerty'));
// console.log(range(undefined,10));
console.log(sum(range(-2, 2)));
console.log(sum(range(5, 1)));
console.log(sum(undefined));
console.log(sum());
