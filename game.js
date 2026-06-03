const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameOverScreen = document.getElementById("game-over-screen");
const scoreElement = document.getElementById("score");

// Configurações do jogo
let score = 0;
let gameOver = false;
let gameSpeed = 5;
let frames = 0;

// Configuração das "pistas" (estilo Midnight Motorist)
const laneWidth = canvas.width / 4; // 4 pistas judiciais

// Jogador (Seu carro)
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 100,
    width: 35,
    height: 60,
    color: #ff007f, // Rosa Neon
    speed: 6,
    movingLeft: false,
    movingRight: false
};

// Lista de carros inimigos
let enemies = [];

// Captura de comandos do teclado
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") player.movingLeft = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") player.movingRight = true;
    
    if (gameOver && e.key === " ") {
        resetGame();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") player.movingLeft = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") player.movingRight = false;
});

// Função para gerar inimigos em pistas aleatórias
function spawnEnemy() {
    // Controla a frequência de spawn baseado nos frames e na velocidade
    if (frames % Math.max(40, 100 - Math.floor(gameSpeed * 2)) === 0) {
        const randomLane = Math.floor(Math.random() * 4);
        const enemyX = randomLane * laneWidth + (laneWidth - 35) / 2;
        
        // Cores retrô aleatórias para os outros carros
        const colors = ["#00fff0", "#7000ff", "#ffb703", "#00ff66"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        enemies.push({
            x: enemyX,
            y: -70,
            width: 35,
            height: 60,
            color: randomColor,
            speed: gameSpeed + (Math.random() * 2 - 1) // variação leve na velocidade
        });
    }
}

// Desenha as linhas da estrada se movendo
function drawRoad() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#fff";
    ctx.setLineDash([20, 20]); // Linhas tracejadas
    ctx.lineWidth = 4;

    // Linha vertical se movendo para dar efeito de velocidade
    let lineOffset = (frames * gameSpeed) % 40;

    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0 + lineOffset - 40);
        ctx.lineTo(i * laneWidth, canvas.height +
