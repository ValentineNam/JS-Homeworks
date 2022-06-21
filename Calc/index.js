'use strict'
// Массив текстов кнопок и их стилей
const btns = [
	['AC', 'clear', 'bg-grey'], ['+/-', 'plus-minus', 'bg-grey'], ['%', 'percent', 'bg-grey'], ['/', 'division', 'bg-orange'],
	['7', 'seven'], ['8', 'eight'], ['9', 'nine'], ['x', 'multi', 'bg-orange'],
	['4', 'four'], ['5', 'five'], ['6', 'six'], ['-', 'minus', 'bg-orange'],
	['1', 'one'], ['2', 'two'], ['3', 'three'], ['+', 'plus', 'bg-orange'],
	['0', 'zero'], ['.', 'dot'], ['=', 'equal', 'bg-orange']
];
// Переменные, которые используются для расчетов
let a = '', 
	b = '',
	action = '',
	result = false;
	;
// Константы
const
	digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'], // Массив символов цифрового ввода
	operactions = ['+', '-', 'x', '/'], // Массив символов операций
	additionalOps = ['+/-', '%'], // Массив символов доп. операций
	output = document.querySelector('.calc-display p') // Ссылка на элемент (с классом calc-display) для вывода результатов
	;

function addElement(parentElem, type, childElemText, ...classNames) {
// Создаем новый div
	let newElem = document.createElement(type);
// Добавляем классы  'btn' 'bg-grey' 'bg-orange' и тп через пробел
	newElem.className = `btn ${classNames.join(' ')}`;
// Вставляем текстовое содержимое дочернего элемента
	newElem.appendChild(document.createTextNode(`${childElemText}`));
// Добавляем только что созданный элемент в дерево DOM
	document.getElementsByClassName(parentElem)[0].appendChild(newElem);
}

function addButtons() {
// Обходим массив и создаем дивы кнопок с соответствующими классами
	btns.forEach(element => {
		addElement('buttons', 'div', element[0], element[1], element[2]);
	});
}
// Функция добавления обработчиков событий на кнопки
function addEvents() {
// Собираем массив кнопок с классом btn
	const btnsArray = document.querySelectorAll('.btn');
// Обходим массив кнопок и навешиваем на него обработчики нажатий
	btnsArray.forEach(el => el.addEventListener('click', event => {
		let res = event.target.textContent;
		// output.textContent = res;
		checkClickType(res);
	}));
}
// Функция проверки - какое событие было вызвано
function checkClickType(eventText) {
// Очистки
	if (eventText == 'AC') {
		clearAll();
// Ввод цифры/десятичной точки
	} else if (digits.includes(eventText)) {
		insertData(eventText);
		output.textContent = `${decorateString(a)}${action}${decorateString(b)}`;
// Ввод операции над числами
	} else if (operactions.includes(eventText)) {
		insertAction(eventText);
		output.textContent = `${decorateString(a)}${action}${decorateString(b)}`;
// Ввод дополнительных операций (инверсия знака, перевод в проценты второго операнда)
	} else if (additionalOps.includes(eventText)) {
		useModifiers(eventText);
// Вычисление результата
	} else if (eventText == '=') {
		calculate();
	}
	// Раскоментировать для дебага
	// console.log(`a = ${a}\nb = ${b}\naction = ${action}\nresult = ${result}`);
}
// Функция очистки - возвращает к начальному состоянию переменные (a, b, action, result) и текст окна вывода (='0')
function clearAll() {
	a = '';
	b = '';
	action = '';
	result = false;
	output.textContent = '0';
}
// Функция ввода цифр/точки в одну из переменных
function insertData(eventText) {
	if ((b != '') && (action != '') && (result == true)) {
		b = '';
		result = false;
	}
	if ((a != '') && (action != '')) {
		b += eventText;
		b = checkDots(b);
	} else {
		a += eventText;
		a = checkDots(a);
	}
}
// Функция ввода операции над числами
function insertAction(eventText) {
// Если b не пустое, то:
	if ((a != '') && (b != '') && (action != '') && (result == false)) {
// вычисляем промежуточный результат
		calculate();
	}
// Если перед этим нажали кнопку '=', то прерываем цепочку последовательных вычислений, переводя result в false
	if (result == true) {
		result = false;
	}
// и обнуляем b, чтобы продолжать вычисления над текущим результатом
	b = '';
	if (a != '') {
		action = eventText;
	}
}
// Модификаторы ввода
function useModifiers(eventText) {
	switch (eventText) {
// Инвертируем знак текущего операнда
		case '+/-':
			if ((a != '') && (b == '') && (action == '')) {
				a = a * (-1);
			} else if (b != '') {
				b = b * (-1);
			} else if (a == '') {
				a = 0;
			}
			output.textContent = `${decorateString(a)}${action}${decorateString(b)}`;
			break;
// Добавляем, отнимаем, умножаем или делим число 'a' на 'b' процентов
		case '%':
			percentCalculate();
			break;
			
		default:
			break;
	}
}
// Основная функция вычисления
function calculate() {
	if ((a != '') && (action != '') && b) {
		switch (action) {
			case '+':
			a = (a * 1) + (b * 1);
				break;
			case '-':
			a = (a * 1) - (b * 1);            
				break;
			case 'x':
			a = (a * 1) * (b * 1);
				break;
			case '/':
			a = (a * 1) / (b * 1);
				break;
		
			default:
				break;
		}
	a = parseFloat(a.toPrecision(10)).toString();
	}
// Костыль, убирающий баг со стиранием 0, при нажатии на =,
	if (a == '') {
//  если не было введено ни одной цифры
		output.textContent = '0'; // Если a = пустой строке, отрисовываем 0
	} else {
		output.textContent = `${decorateString(a)}`;
		result = true;
	}
}
// Функция вычисления с процентами
function percentCalculate() {
	if ((a != '') && (action != '') && (b != '')) {
		switch (action) {
			case '+':
			b = (a * b / 100);
			a = (a * 1) + b;
				break;
			case '-':
			b = (a * b / 100);
			a = (a * 1) - b;            
				break;
			case 'x':
			b = b / 100;
			a = (a * 1) * b;
				break;
			case '/':
			b = b / 100;
			a = (a * 1) / b;
				break;
		
			default:
				break;
		}
		a = parseFloat(a.toPrecision(10)).toString();
	}
	if (a == '') {
		output.textContent = '0';
	} else {
		output.textContent = `${decorateString(a)}`;
		result = true;
	}
}
// Функция проверки количества десятичных точек в вводе
function checkDots(str) {
// Если вводим точку, то в начало строки добавляем '0'
	let re = /\./g; // Reg-exp шаблон поиска точек в числе
	if (str[0] == '.') {
		str = '0' + str;
	}
// Если вводим еще одну точку, то удаляем последнюю
	if(str.match(re) && str.match(re).length >= 2){
		str = str.slice(0, -1);
	}
	return str;
}
// Функция добавления скобок вокруг отрицательного числа
function decorateString(str) {
	let out = '';
// Если получаем строку, обозначающую отрицательное число, 
	if (parseInt(str) < 0) {
		out = '(' + str + ')';  // то добавляем вокруг него скобки
	} else {
		out = str;
	}
// Возвращаем 'декорированную строку'
	return out;
}
// Основная функция, которая:
function main() {
// добавляет кнопки
	addButtons();
// вешает обработчики на добавленные кнопки
	addEvents();
}
// Запускаем основную функцию
main();