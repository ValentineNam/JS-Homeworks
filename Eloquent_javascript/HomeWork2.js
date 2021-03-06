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
    function testing(arr) {
        let flag = false;
        arr.forEach(element => {
            if (test(element)) {
                flag = true;
                return;
            }
        });
        return flag;
    }
    return testing(arr);
}

console.log(every([NaN, NaN, NaN], isNaN));
// → true
console.log(every([NaN, NaN, 4], isNaN));
// → false
console.log(some([NaN, 3, 4], isNaN));
// → true
console.log(some([2, 3, 4], isNaN));
// → false

// ToDo: Векторный тип
// Напишите конструктор Vector, представляющий вектор в двумерном пространстве. 
// Он принимает параметры x и y (числа), которые хранятся в одноимённых свойствах.
// Дайте прототипу Vector два метода, plus и minus, которые принимают другой вектор 
// в качестве параметра и возвращают новый вектор, который хранит в x и y сумму или разность 
// двух векторов (один this, второй – аргумент).
// Добавьте геттер length в прототип, подсчитывающий длину вектора – расстояние от (0, 0) до (x, y).

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
}

Vector.prototype.minus = function(other) {
    return new Vector(this.x - other.x, this.y - other.y);
}

Object.defineProperty(Vector.prototype, "length", {
    get: function() { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); }
});

console.log(new Vector(1, 2).plus(new Vector(2, 3)));
// → Vector{x: 3, y: 5}
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
// → Vector{x: -1, y: -1}
console.log(new Vector(3, 4).length);
// → 5