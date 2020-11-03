<meta charset="utf-8">
<script>

// Возвращает случайное число между min и max (включая оба)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCard() {
  var cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return cards[getRandomInt(0, cards.length -1)];
}

function cardsSumm(array) {
  summ = 0;
//считаем сумму без тузов
  for (var i = 0; i < array.length; i++) {
    if (parseInt(array[i]) >=2 && parseInt(array[i]) <=10) {
      summ += parseInt(array[i]);
    } else if (array[i] == 'J' || array[i] == 'Q' || array[i] == 'K') {
      summ += 10;
    }
  }
//отдельно проходим по тузам и прибавляем 11 или 1 в зависимости от суммы
  for (var i = 0; i < array.length; i++) {
    if (array[i] == 'A' && summ < 11) {
      summ+= 11;
    } else if (array[i] == 'A' && summ >= 11) {
      summ+= 1;
    }
  }
  return summ;
}

function getStatus() {
    return 'Дилер: ' + dealer.join(' ') + '\n Очков у дилера: ' + /
    cardsSumm(dealer) + '\nИгрок: ' + player.join(' ') + /
    '\n Очков у игрока: ' + cardsSumm(player);
}

function game() {
  var answer = '';
    do {
      if (cardsSumm(player) == 21) {
      alert(getStatus() + '\nBLACKJACK!!! Ты выиграл!');
      break;
    } else if (cardsSumm(player) > 21) {
      alert('Ты проиграл! Перебор со счетом: ' + cardsSumm(player));
      break;
    } else {
      answer = prompt(getStatus() + '\nХотите взять еще карту? 1 - да, иначе - нет');
//сдаем карты или прекращаем игру
      if (answer == '1') {
      player.push(getCard());
    }
    alert(getStatus());
   }
  } while (answer == '1');
//Если игрок проиграл, то ничего не происходит
   if (cardsSumm(player) < 21 && cardsSumm(dealer) < cardsSumm(player)) {
    alert('Очередь дилера!');
//Если у дилера меньше очков, чем у игрока - он добирает карту
    do {
     dealer.push(getCard());
      alert(getStatus());
    } while (cardsSumm(dealer) < cardsSumm(player));
      if (cardsSumm(dealer) > 21) {
      alert(getStatus() + '\nТы выиграл! Поздравляем!');
    } else if (cardsSumm(dealer) == cardsSumm(player)) {
      alert(getStatus() + '\nНичья - победителей нет! Такое иногда случается...');
    } else {
     alert(getStatus() + '\nНе повезло! Ничего не поделаешь - это казино!');
    }
  }
}

var dealer = [getCard()];
var player = [getCard(),getCard()];
game();

</script>
