const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del Canvas
canvas.width = 1000;
canvas.height = 800;

// Variables del Juego
let player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 100,
    width: 40,
    height: 40,
    speed: 5,
    bullets: []
};

let zombies = [];
let boss = null;
let score = 0;
let gameRunning = false;
let gameOver = false;

// Escenarios y Dificultades
const scenarios = [
    { name: 'easy', zombieSpeed: 1, spawnRate: 2000 },
    { name: 'medium', zombieSpeed: 2, spawnRate: 1500 },
    { name: 'hard', zombieSpeed: 3, spawnRate: 1000, boss: true }
];
let currentScenarioIndex = 0;

// Imágenes
const images = {
    player: new Image(),
    zombie: new Image(),
    boss: new Image()
};
images.player.src = 'player.png'; // Imagen del jugador
images.zombie.src = 'zombie.png'; // Imagen de los zombies
images.boss.src = 'boss.png';     // Imagen del boss

// Teclas
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// Eventos del Teclado
document.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
});

// Crear Zombie
function createZombie() {
    const zombie = {
        x: Math.random() * canvas.width,
        y: -40,
        width: 40,
        height: 40,
        speed: scenarios[currentScenarioIndex].zombieSpeed
    };
    zombies.push(zombie);
}

// Disparar Bala
function shootBullet() {
    const bullet = {
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 7
    };
    player.bullets.push(bullet);
}

// Dibujar Jugador
function drawPlayer() {
    ctx.drawImage(images.player, player.x, player.y, player.width, player.height);
}

// Dibujar Zombies
function drawZombies() {
    zombies.forEach(zombie => {
        ctx.drawImage(images.zombie, zombie.x, zombie.y, zombie.width, zombie.height);
    });
}

// Dibujar Balas
function drawBullets() {
    player.bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Dibujar Boss
function drawBoss() {
    if (boss) {
        ctx.drawImage(images.boss, boss.x, boss.y, boss.width, boss.height);
    }
}

// Actualizar Juego
function updateGame() {
    if (gameOver) {
        endGame();
        return;
    }

    // Mover Jugador
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;

    // Disparar
    if (keys.Space) shootBullet();

    // Mover Balas
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // Mover Zombies
    zombies.forEach((zombie, index) => {
        zombie.y += zombie.speed;

        // Colisión con el Jugador
        if (
            zombie.x < player.x + player.width &&
            zombie.x + zombie.width > player.x &&
            zombie.y < player.y + player.height &&
            zombie.y + zombie.height > player.y
        ) {
            gameOver = true;
        }

        // Eliminar Zombies Fuera del Canvas
        if (zombie.y > canvas.height) zombies.splice(index, 1);

        // Colisión con Balas
        player.bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.y + bullet.height > zombie.y
            ) {
                zombies.splice(index, 1);
                player.bullets.splice(bIndex, 1);
                score += 10;
            }
        });
    });

    // Mover Boss
    if (boss) {
        let dx = player.x - boss.x;
        let dy = player.y - boss.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        boss.x += (dx / distance) * boss.speed;
        boss.y += (dy / distance) * boss.speed;

        // Disparos Dañan al Boss
        player.bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < boss.x + boss.width &&
                bullet.x + bullet.width > boss.x &&
                bullet.y < boss.y + boss.height &&
                bullet.y + bullet.height > boss.y
            ) {
                boss.health -= 1;
                player.bullets.splice(bIndex, 1);

                if (boss.health <= 0) {
                    boss = null;
                    alert('¡Derrotaste al boss final! ¡Ganaste!');
                    gameOver = true;
                }
            }
        });
    }

    // Cambiar Escenario
    if (score >= 50 && currentScenarioIndex === 0) {
        currentScenarioIndex = 1;
        changeScenario();
    } else if (score >= 100 && currentScenarioIndex === 1) {
        currentScenarioIndex = 2;
        changeScenario();
    }

    drawGame();
    if (gameRunning) requestAnimationFrame(updateGame);
}

// Dibujar Juego
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawZombies();
    drawBoss();
}

// Cambiar Escenario
function changeScenario() {
    const scenario = scenarios[currentScenarioIndex];
    document.getElementById('gameContainer').className = scenario.name;

    // Aumentar Dificultad
    clearInterval(zombieSpawner);
    zombieSpawner = setInterval(createZombie, scenario.spawnRate);

    // Agregar Boss en el Escenario Difícil
    if (scenario.boss) {
        boss = {
            x: canvas.width / 2 - 50,
            y: 50,
            width: 100,
            height: 100,
            speed: 2,
            health: 50
        };
    }
}

// Iniciar Juego
function startGame() {
    score = 0;
    gameRunning = true;
    gameOver = false;
    zombies = [];
    player.bullets = [];
    currentScenarioIndex = 0;
    changeScenario();

    updateGame();
    zombieSpawner = setInterval(createZombie, scenarios[0].spawnRate);
}

// Terminar Juego
function endGame() {
    gameRunning = false;
    clearInterval(zombieSpawner);
    alert('Juego Terminado. Tu puntuación: ' + score);
}

export { startGame };
