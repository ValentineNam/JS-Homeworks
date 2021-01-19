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
    };
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
