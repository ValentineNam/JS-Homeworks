'use strict'
/*
Task 1
В некоторых странах Дальнего Востока (Китае, Японии
и др.) использовался (и неофициально используется в настоящее
время) календарь, отличающийся от применяемого нами. Этот
календарь представляет собой 60-летнюю циклическую систему.
Каждый 60-летний цикл состоит из пяти 12-летних подциклов.
В  каждом подцикле года носят названия животных: Крыса, Ко-
рова, Тигр, Заяц, Дракон, Змея, Лошадь, Овца, Обезьяна, Петух,
Собака и Свинья. Кроме того, в названии года фигурируют цвета
животных, которые связаны с  пятью элементами природы – Де-
ревом (зеленый), Огнем (красный), Землей (желтый), Металлом
(белый) и  Водой (черный). В  результате каждое животное (и его
год) имеет символический цвет, причем цвет этот часто совер-
шенно не совпадает с его «естественной» окраской – Тигр может
быть черным, Свинья – красной, а Лошадь – зеленой. Например,
1984 год – год начала очередного цикла – назывался годом Зеле-
ной Крысы. Каждый цвет в цикле (начиная с зеленого) «действует»
два года, поэтому через каждые 60 лет имя года (животное и его
цвет) повторяется.
Составить программу, которая по заданному номеру года на-
шей эры n печатает его название по описанному календарю в ви-
де: «Крыса, Зеленый».
*/

let years = ['Крыса', 'Корова', 'Тигр', 'Заяц', 'Дракон', 'Змея', 'Лошадь', 'Овца', 'Обезьяна', 'Петух', 'Собака', 'Свинья'],
    colors = ['Зеленый', 'Красный', 'Желтый', 'Белый', 'Черный'],
    start = 1984;

function calculateIndexes(year = start) {
  let obj = {
    y: 0,
    c: 0
  }
  let diff = 0,
      y = 0,
      c = 0;
  diff = year - start;
  y = diff % 12;
  for (; y >= 12; y -= 12) {}
  c = Math.floor(diff / 2);
  for (; c >= 5; c -= 5) {}
  obj.y = y;
  obj.c = c;
  return obj;
}

function returnEasternYear(year = 1984) {
  let indexes = calculateIndexes(year);
  console.log(`${year} - ${decorateString(indexes)}`);
}

function decorateString(indexes) {
  let femY = ['а', 'я', 'ь'],
      femW = ['ая'],
      decoratedStr = '',
      yStr = years[indexes.y];
  if (yStr.endsWith(femY[0]) || yStr.endsWith(femY[1]) || yStr.endsWith(femY[2])){
    decoratedStr = `${(colors[indexes.c]).slice(0, -2)}${femW} ${years[indexes.y]}`;
  } else {
    decoratedStr = `${colors[indexes.c]} ${years[indexes.y]}`;
  }
  return decoratedStr;
}

for (let i = 1984; i < 2000; i++) {
  returnEasternYear(i);
}