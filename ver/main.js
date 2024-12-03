// js/main.js

import { startGame } from './game.js';

document.getElementById('startGame').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    startGame();
});
