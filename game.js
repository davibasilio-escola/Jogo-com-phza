const gameContainer = document.getElementById("gameContainer");
const playerCar = document.getElementById("playerCar");
const scoreDisplay = document.getElementById("score");

let playerPos = { x: 125, y: 380 }; // posição inicial
const gameWidth = 300;
const gameHeight = 500;
const carWidth = 50;
let score = 0;
let gameOver = false;

const enemies = [];

// Controle do carro
document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    const step = 20;
    if (e.key === "ArrowLeft" && playerPos.x > 0) playerPos.x -= step;
    if (e.key === "ArrowRight" && playerPos.x < gameWidth - carWidth) playerPos.x += step;
    if (e.key === "ArrowUp" && playerPos.y > 0) playerPos.y -= step;
    if (e.key === "ArrowDown" && playerPos.y < gameHeight - carWidth) playerPos.y += step;

    playerCar.style.left = playerPos.x + "px";
    playerCar.style.top = playerPos.y + "px";
});

// Criar inimigos
function spawnEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemyCar");
    enemy.style.left = Math.floor(Math.random() * (gameWidth - carWidth)) + "px";
    enemy.style.top = "-100px";
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
}

// Atualizar inimigos
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        let enemyY = parseInt(enemy.style.top);
        enemyY += 5; // velocidade do carro inimigo
        enemy.style.top = enemyY + "px";

        // Checar colisão
        if (
            playerPos.x < parseInt(enemy.style.left) + carWidth &&
            playerPos.x + carWidth > parseInt(enemy.style.left) &&
            playerPos.y < enemyY + 100 &&
            playerPos.y + 100 > enemyY
        ) {
            endGame();
        }

        // Remover inimigos que saíram da tela
        if (enemyY > gameHeight) {
            gameContainer.removeChild(enemy);
            enemies.splice(i, 1);
            score += 1;
            scoreDisplay.textContent = "Pontuação: " + score;
        }
    }
}

// Encerrar jogo
function endGame() {
    gameOver = true;
    alert("Game Over! Sua pontuação: " + score);
    location.reload();
}

// Loop do jogo
function gameLoop() {
    if (!gameOver) {
        updateEnemies();
        requestAnimationFrame(gameLoop);
    }
}

// Spawn de inimigos a cada 1 segundo
setInterval(() => {
    if (!gameOver) spawnEnemy();
}, 1000);

// Iniciar o jogo
gameLoop();
