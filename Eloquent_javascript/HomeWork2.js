// ToDo:
// Используйте метод reduce в комбинации с concat для свёртки массива массивов в один массив, 
// у которого есть все элементы входных массивов.

let arrays = [[1, 2, 3], [4, 5], [6]];

function clottingArray(arr) {
    function concatination(a, b) { return a.concat(b); }
    return arr.reduce(concatination);
}

console.log(clottingArray(arrays));