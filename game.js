import Snake from './snake.js';
import Fruit from './fruit.js';
import Scoreboard from './scoreboard.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const snake = new Snake(ctx);
const fruit = new Fruit(ctx, canvas.width, canvas.height);
const scoreboard = new Scoreboard();

let speed = 1;
let intervalID = null;
let isGameRunning = false;
let currentScore = 0;
let currentPlayer = null;
let isGameStarted = false;

function updateSpeedDisplay() {
    const speedDisplay = document.getElementById('currentSpeed');
    speedDisplay.textContent = speed;
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('currentScore');
    scoreDisplay.textContent = currentScore;
}

function updateGameStatusDisplay(status) {
    const gameStatusDisplay = document.getElementById('gameStatus');
    if (gameStatusDisplay) {
        if (status) {
            gameStatusDisplay.textContent = status;
            gameStatusDisplay.classList.remove('hidden');
        } else {
            gameStatusDisplay.classList.add('hidden');
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    if (snake.eat(fruit)) {
        fruit.reposition();
        currentScore += 10;
        updateScoreDisplay();
    }
    snake.draw();
    fruit.draw();
    if (snake.checkCollision()) {
        endGame();
    }
}

function startGameLoop() {
    clearInterval(intervalID);
    intervalID = setInterval(gameLoop, 1000 / speed);
    isGameRunning = true;
    isGameStarted = true;
    updateGameStatusDisplay("");  // Effacer le statut quand le jeu est démarré
}

function pauseGameLoop() {
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
        isGameRunning = false;
        updateGameStatusDisplay("Pause");
    }
}

function endGame() {
    pauseGameLoop();
    scoreboard.display(currentPlayer ? currentPlayer : null);
    if (scoreboard.isTopScore(currentScore)) {
        showPseudoModal();
    } else {
        showRestartButton();
    }
}

function showPseudoModal() {
    const pseudoModal = document.getElementById('pseudoModal');
    pseudoModal.classList.remove('hidden');

    const submitPseudoButton = document.getElementById('submitPseudo');
    submitPseudoButton.onclick = () => {
        const playerPseudo = document.getElementById('playerPseudo').value;
        const pseudoRegex = /^[a-zA-Z0-9_-]{6,20}$/; // Regular expression for validating the pseudo

        if (pseudoRegex.test(playerPseudo)) {
            scoreboard.addNewScore(playerPseudo, currentScore);
            currentPlayer = playerPseudo;
            pseudoModal.classList.add('hidden');
            showRestartButton();
        } else {
            alert("Le pseudo doit contenir entre 6 et 20 caractères et ne peut contenir que des lettres, des chiffres, des tirets (-) et des underscores (_).");
        }
    };
}

function showRestartButton() {
    const restartGameButton = document.getElementById('restartGame');
    restartGameButton.classList.remove('hidden');
    
    const startGameButton = document.getElementById('startGame');
    startGameButton.classList.add('hidden');
}

function resetGame() {
    snake.reset();
    fruit.reposition();
    currentScore = 0;
    updateScoreDisplay();

    const restartGameButton = document.getElementById('restartGame');
    restartGameButton.classList.add('hidden');

    const startGameButton = document.getElementById('startGame');
    startGameButton.classList.remove('hidden');

    scoreboard.display(currentPlayer ? currentPlayer : null);

    isGameStarted = false;
    isGameRunning = false;
    updateGameStatusDisplay("");
}

// Gestion des événements pour contrôler la direction du serpent et pour alterner entre pause et jeu avec la touche espace
document.addEventListener('keydown', (event) => {
    const { key } = event;

    // Empêche les touches fléchées de faire défiler la page
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
    }

    // Gestion de la direction du serpent
    if (isGameRunning) {
        snake.changeDirection(key);
    }
});

// Gestion des événements pour les boutons de contrôle de la vitesse
document.getElementById('increaseSpeed').addEventListener('click', () => {
    speed++;
    updateSpeedDisplay();
    if (isGameRunning) {
        startGameLoop();
    }
});

document.getElementById('decreaseSpeed').addEventListener('click', () => {
    if (speed > 1) {
        speed--;
    }
    updateSpeedDisplay();
    if (isGameRunning) {
        startGameLoop();
    }
});

// Gestion des événements pour le bouton Start
document.getElementById('startGame').addEventListener('click', () => {
    startGameLoop();
    // Cache le bouton Start après le démarrage du jeu
    const startGameButton = document.getElementById('startGame');
    startGameButton.classList.add('hidden');
});

// Assurer que l'événement est ajouté une seule fois pour le bouton Recommencer
document.getElementById('restartGame').addEventListener('click', resetGame);

fruit.reposition();
updateSpeedDisplay();
updateScoreDisplay();