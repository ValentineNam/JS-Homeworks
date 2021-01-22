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
    } else {
        return `Массив НЕ передан!`;
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
console.log(modifiedRange(1, 10, 2));
console.log(modifiedRange(5, 2, -1));
console.log(modifiedRange(1, 5, -1));
console.log(modifiedRange(5, 1, 1));
console.log(modifiedRange(undefined, 2, -1));
console.log(modifiedRange(4, 'text', 1));

// ToDo: Массив в обратном порядке
// У массивов есть метод reverse, который изменяет порядок следования элементов в массиве. 
// Для выполнения этого упражнения напишите две функции: reverseArray и reverseArrayInPlace. 
// Первая функция, reverseArray, принимает массив в качестве аргумента и создает новый массив, 
// содержащий те же элементы в обратном порядке. Вторая, reverseArrayInPlace, делает то же, 
// что и метод reverse: преобразовывает массив, заданный в качестве аргумента, меняя порядок 
// следования его элементов на обратный. Не используйте для этого стандартный метод reverse.
// Вспомните, что мы говорили о побочных эффектах и чистых функциях в предыдущей главе, и 
// ответьте на вопрос: какой из этих вариантов, по вашему мнению, будет полезен в большинстве случаев? 
// Какой из них быстрее работает?

function reverseArray(arr) {
    if (Array.isArray(arr)) {
        let newArr = [];
        arr.forEach((element) => {
            newArr.unshift(element);
        });
        return newArr;
    } else {
        return `Массив НЕ передан`;
    }
}

function reverseArrayInPlace(arr) {
    if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
            let temp = arr.splice(i, 1);    
            arr.unshift(temp[0]); //temp[0] просто метод slice разрезает массив на части (массивы, а не вырезает конкретный элемент)
        }
        return arr;
    } else {
        return `Массив НЕ передан`;
    }
}

console.log(reverseArray(['zero', 1, 2, 3, 4]));
console.log(reverseArray(NaN));
console.log(reverseArray(undefined));
console.log(reverseArrayInPlace(['zero', 1, 2, 3, 4]));
console.log(reverseArrayInPlace(NaN));
console.log(reverseArrayInPlace(undefined));

// ToDo:
// Напишите функцию arrayToList, которая строит список, чья структура подобна показанной, 
// если передать функции массив [1, 2, 3] в качестве аргумента. Напишите также функцию listToArray, 
// создающую массив из списка. Затем добавьте вспомогательную функцию prepend, принимающую элемент 
// и список и создающую новый список, в котором заданный элемент добавлен в начало исходного списка. 
// Кроме того, создайте функцию nth, принимающую список и число и возвращающую элемент, находящийся 
// в заданной позиции в этом списке (где ноль соответствует первому элементу), или undefined, 
// если элемента в заданной позиции не существует.
// Если вам этого все еще недостаточно, напишите рекурсивную версию функции nth.

function arrayToList(arr) {
    if (Array.isArray(arr)) {
        let list;
        // arr.forEach(
            
        // );
        if (arr.length > 1) {
            return {value: arr.shift(), rest: arrayToList(arr)};
        } else {
            return {value: arr.shift(), rest: null};
        }
    } else {
        return `Массив НЕ передан`;
    }
}

function listToArray(list) {
    let arr = [];
    for (; list; ) {
        arr.push(list.value);
        list = list.rest;
    }
    return arr;
}

console.log(arrayToList([0, 1, 2]));
console.log(arrayToList(`0, 1, 2`));

let myList = {value: 1, rest: {value: 2, rest: {value: 3, rest: {value: `end`, rest: null}}}};
console.log(listToArray(myList));