// ToDo:
// Используйте метод reduce в комбинации с concat для свёртки массива массивов в один массив, 
// у которого есть все элементы входных массивов.

let arrays = [[1, 2, 3], [4, 5], [6]];

function clottingArray(arr) {
    function concatination(a, b) { return a.concat(b); }
    return arr.reduce(concatination);
}

console.log(clottingArray(arrays));

// ToDo: 
// Every и some
// У массивов есть ещё стандартные методы every и some. Они принимают как аргумент некую функцию, 
// которая, будучи вызванной с элементом массива в качестве аргумента, возвращает true или false. 
// Так же, как && возвращает true, только если выражения с обеих сторон оператора возвращают true, 
// метод every возвращает true, когда функция возвращает true для всех элементов массива. 
// Соответственно, some возвращает true, когда заданная функция возвращает true при работе хотя бы 
// с одним из элементов массива. Они не обрабатывают больше элементов, чем необходимо – например, 
// если some получает true для первого элемента, он не обрабатывает оставшиеся.
// Напишите функции every и some, которые работают так же, как эти методы, только принимают 
// массив в качестве аргумента.

// Ваш код тут

function every(arr, test) {
    function testing(arr) {
        let flag = true;
        arr.forEach(element => {
            if (!test(element)) {
                flag = false;
                return;
            }
        });
        return flag;
    }
    return testing(arr);
}

function some(arr, test) {
    
}

console.log(every([NaN, NaN, NaN], isNaN));
// → true
console.log(every([NaN, NaN, 4], isNaN));
// → false
// console.log(some([NaN, 3, 4], isNaN));
// // → true
// console.log(some([2, 3, 4], isNaN));
// // → false