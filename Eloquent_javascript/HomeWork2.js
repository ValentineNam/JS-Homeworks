// ToDo: Свертка
// Используйте метод reduce в комбинации с concat для свёртки массива массивов в один массив, 
// у которого есть все элементы входных массивов.

let arrays = [[1, 2, 3], [4, 5], [6]];

function clottingArray(arr) {
    function concatination(a, b) { return a.concat(b); }
    return arr.reduce(concatination);
}

console.log(clottingArray(arrays));

// ToDo: Every и some
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

// ToDo: Ваш собственный цикл
// Напишите функцию высшего порядка loop, которая представляет собой аналог цикла for. 
// Она принимает значение, функцию условия, функцию обновления и функцию тела. На каждой итерации сначала
// выполняется функция условия текущего значения цикла. Если эта функция возвращает false, то выполение цикла прекращается.
// Затем вызыванкция обновления для создания нового значения, и цикл запускается сначала.
// При определении функции вы можете использовать обычный цикл для перебора значений.

const loop = (start, condition, iter, cb, data) => {
    // console.log('loop started');
    if (!condition(start, data)) {
        console.log('loop finished');
        return;
    }
    let count = start;
    cb(data[count]);
    count = iter(start);

    loop(count,condition,iter,cb, data);
}

function count(counter) {
    return ++counter;
}

function cond(v, data) {
    return v < data.length;
}

loop(0, cond, count, (i) => { console.log('current value => ', i)}, [1,2,3,4])

// ToDo: Regexp-гольф...
// Для каждого из следующих элементов напишите регулярное выражение, позволяющее проверить,
// встречается ли в строке какая-либо из указанных подстрок.

function testRegexp(r, v) {
    console.log(r.test(v));
}

// * 1. car, cat
let reg1 = /\bca(t|r)\b/;
// * 2. pop, prop
let reg2 = /\bpr?op\b/;
// * 3. ferret, ferry, ferrari
let reg3 = /\bferr(et|y|ari)\b/;
// * 4. Любое слово, оканчивающиеся на ious
let reg4 = /\b[a-zA-Z]*ious\b/;
// * 5. Пробельный символ, за которым следует точка, запятая, двоеточие или точка с запятой
let reg5 = /\s(\.|\,|\:|\;)/;
// * 6. Слово, длиннее шести букв
let reg6 = /\b[a-zA-Z]{6,}\b/;
// * 7. Слово, без буквы e (или E)
let reg7 = /\b[a-df-zA-DF-Z]+\b/;

// testRegexp(reg1, 'cat');
// testRegexp(reg1, 'car');
// testRegexp(reg1, 'acat');
// testRegexp(reg2, 'por');
// testRegexp(reg2, 'pop');
// testRegexp(reg2, 'props');
// testRegexp(reg2, 'prop');
// testRegexp(reg3, 'ferrari');
// testRegexp(reg3, 'ferret');
// testRegexp(reg3, 'ferry');
// testRegexp(reg3, 'ferretyari');
// testRegexp(reg4, 'delisious');
// testRegexp(reg4, 'ious');
// testRegexp(reg4, '5ious');
// testRegexp(reg5, ' .');
// testRegexp(reg5, ' ,');
// testRegexp(reg5, ' :');
// testRegexp(reg5, ' ;');
// testRegexp(reg5, '  .');
// testRegexp(reg5, ' . '); // test => true?
// testRegexp(reg6, 'abcdef');
// testRegexp(reg6, 'abc1def');
// testRegexp(reg6, 'abcde');
// testRegexp(reg6, 'abcdef1');
// testRegexp(reg7, 'abcdgQkZnfk');
// testRegexp(reg7, 'abcdef');
// testRegexp(reg7, 'abcdf1');

