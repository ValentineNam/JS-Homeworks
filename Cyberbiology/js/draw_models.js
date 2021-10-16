/* Рисуем дерево */
function drawTree(ctx, x, y, s) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo((3 + x) * s, (3 + y) * s);
    ctx.quadraticCurveTo((3+x)*s, (1+y)*s, (5+x)*s, (1+y)*s);
    ctx.quadraticCurveTo((7+x)*s, (1+y)*s, (7+x)*s, (3+y)*s);
    ctx.quadraticCurveTo((9+x)*s, (3+y)*s, (9+x)*s, (5+y)*s);
    ctx.quadraticCurveTo((9+x)*s, (7+y)*s, (7+x)*s, (7+y)*s);
    ctx.lineTo((3 + x) * s, (7 + y) * s);
    ctx.quadraticCurveTo((1+x)*s, (7+y)*s, (1+x)*s, (5+y)*s);
    ctx.quadraticCurveTo((1+x)*s, (3+y)*s, (3+x)*s, (3+y)*s);
    ctx.fill();
    /* Добавим немного объема за счет "света" слева-наверху */
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo((1 + x) * s, (5 + y) * s);
    ctx.quadraticCurveTo((1+x)*s, (3+y)*s, (3+x)*s, (3+y)*s);
    ctx.lineTo((4 + x) * s, (3 + y) * s);
    ctx.quadraticCurveTo((5+x)*s, (3+y)*s, (5+x)*s, (4+y)*s);
    ctx.lineTo((5 + x) * s, (5 + y) * s);
    ctx.quadraticCurveTo((5+x)*s, (6+y)*s, (4+x)*s, (6+y)*s);
    ctx.lineTo((2 + x) * s, (6 + y) * s);
    ctx.quadraticCurveTo((1+x)*s, (6+y)*s, (1+x)*s, (5+y)*s);
    ctx.fill();
    /* Добавим немного объема за счет "тени" справа-снизу */
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.moveTo((6 + x) * s, (5 + y) * s);
    ctx.quadraticCurveTo((6+x)*s, (4+y)*s, (7+x)*s, (4+y)*s);
    ctx.lineTo((8 + x) * s, (4 + y) * s);
    ctx.quadraticCurveTo((9+x)*s, (4+y)*s, (9+x)*s, (5+y)*s);
    ctx.quadraticCurveTo((9+x)*s, (7+y)*s, (7+x)*s, (7+y)*s);
    ctx.quadraticCurveTo((6+x)*s, (7+y)*s, (6+x)*s, (6+y)*s);
    ctx.lineTo((6 + x) * s, (5 + y) * s);
    ctx.fill();

    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.moveTo((4 + x) * s, (7 + y) * s);
    ctx.quadraticCurveTo((4+x)*s, (6+y)*s, (5+x)*s, (6+y)*s);
    ctx.quadraticCurveTo((6+x)*s, (6+y)*s, (6+x)*s, (7+y)*s);
    ctx.lineTo((6 + x) * s, (8 + y) * s);
    ctx.quadraticCurveTo((6+x)*s, (9+y)*s, (5+x)*s, (9+y)*s);
    ctx.quadraticCurveTo((4+x)*s, (9+y)*s, (4+x)*s, (8+y)*s);
    ctx.lineTo((4 + x) * s, (6 + y) * s);
    ctx.fill();
}

/* Рисуем куст */
function drawBush(ctx, x, y, s) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo((2 + x) * s, (4 + y) * s);
    ctx.quadraticCurveTo((2+x)*s, (2+y)*s, (4+x)*s, (2+y)*s);
    ctx.lineTo((6 + x) * s, (2 + y) * s);
    ctx.quadraticCurveTo((8+x)*s, (2+y)*s, (8+x)*s, (4+y)*s);
    ctx.lineTo((8 + x) * s, (6 + y) * s);
    ctx.quadraticCurveTo((8+x)*s, (8+y)*s, (6+x)*s, (8+y)*s);
    ctx.lineTo((4 + x) * s, (8 + y) * s);
    ctx.quadraticCurveTo((2+x)*s, (8+y)*s, (2+x)*s, (6+y)*s);
    ctx.fill();
    /* Добавим немного объема за счет "света" слева-наверху */
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo((2 + x) * s, (4 + y) * s);
    ctx.quadraticCurveTo((2+x)*s, (2+y)*s, (4+x)*s, (2+y)*s);
    ctx.quadraticCurveTo((6+x)*s, (2+y)*s, (6+x)*s, (4+y)*s);
    ctx.quadraticCurveTo((6+x)*s, (6+y)*s, (4+x)*s, (6+y)*s);
    ctx.quadraticCurveTo((2+x)*s, (6+y)*s, (2+x)*s, (4+y)*s);
    ctx.fill();

    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.moveTo((4 + x) * s, (8 + y) * s);
    ctx.quadraticCurveTo((4+x)*s, (7+y)*s, (5+x)*s, (7+y)*s);
    ctx.quadraticCurveTo((6+x)*s, (7+y)*s, (6+x)*s, (8+y)*s);
    ctx.quadraticCurveTo((6+x)*s, (9+y)*s, (5+x)*s, (9+y)*s);
    ctx.quadraticCurveTo((4+x)*s, (9+y)*s, (4+x)*s, (8+y)*s);
    ctx.fill();
}

/* Рисуем траву */
function drawGrass(ctx, x, y, s) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo((2 + x) * s, (6 + y) * s);
    ctx.quadraticCurveTo((5+x)*s, (6+y)*s, (5+x)*s, (9+y)*s);
    ctx.quadraticCurveTo((3.5+x)*s, (6.5+y)*s, (2+x)*s, (6+y)*s);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo((5 + x) * s, (9 + y) * s);
    ctx.quadraticCurveTo((5+x)*s, (5+y)*s, (8+x)*s, (5+y)*s);
    ctx.quadraticCurveTo((6+x)*s, (6+y)*s, (5+x)*s, (9+y)*s);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo((5 + x) * s, (9 + y) * s);
    ctx.quadraticCurveTo((5.5+x)*s, (4+y)*s, (2+x)*s, (3+y)*s);
    ctx.quadraticCurveTo((5+x)*s, (5+y)*s, (5+x)*s, (9+y)*s);
    ctx.fill();
    ctx.moveTo((5 + x) * s, (9 + y) * s);
    ctx.quadraticCurveTo((4.5+x)*s, (4+y)*s, (6+x)*s, (4+y)*s);
    ctx.quadraticCurveTo((5+x)*s, (5+y)*s, (5+x)*s, (9+y)*s);
    ctx.fill();
}

/* Рисуем бота */
function drawBot(ctx, x, y, s, color = 'gray') {
    /* Тело бота */
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo((2.5 + x) * s, (5 + y) * s);
    ctx.quadraticCurveTo((2.5+x)*s, (2.5+y)*s, (5+x)*s, (2.5+y)*s);
    ctx.quadraticCurveTo((7.5+x)*s, (2.5+y)*s, (7.5+x)*s, (5+y)*s);
    ctx.lineTo((7.5 + x) * s, (7.5 + y) * s);
    ctx.quadraticCurveTo((6.875+x)*s, (8.75+y)*s, (6.25+x)*s, (7.5+y)*s);
    ctx.quadraticCurveTo((5.625+x)*s, (8.75+y)*s, (5+x)*s, (7.5+y)*s);
    ctx.quadraticCurveTo((4.375+x)*s, (8.75+y)*s, (3.75+x)*s, (7.5+y)*s);
    ctx.quadraticCurveTo((3.125+x)*s, (8.75+y)*s, (2.5+x)*s, (7.5+y)*s);
    ctx.lineTo((2.5 + x) * s, (5 + y) * s);
    ctx.fill();
    /* Рисуем глаза */
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc((4.125+x)*s, (4.25+y)*s, s/1.5, 0, Math.PI*2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((5.875+x)*s, (4.25+y)*s, s/1.5, 0, Math.PI*2, true);
    ctx.fill();
    /* Рисуем зрачки */
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc((4.125+x)*s, (4+y)*s, s/3, 0, Math.PI*2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((5.875+x)*s, (4+y)*s, s/3, 0, Math.PI*2, true);
    ctx.fill();
}

export { drawTree, drawBush, drawGrass, drawBot };