// js/game.js

let score = 0;
let gameRunning = false;

function startGame() {
    score = 0;
    gameRunning = true;
    console.log('Juego iniciado.');
    updateGame();
}

function updateGame() {
    if (gameRunning) {
        console.log('Actualizando...');
        requestAnimationFrame(updateGame);
    }
}

export { startGame };
