import { initializeScores } from './api.js';

const LOCAL_STORAGE_KEY = 'snake_scores';

export default class Scoreboard {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        if (this.scores.length === 0) {
            this.initializeScores();
        }
        this.currentScore = 0;
        this.currentPlayer = null;
    }

    async initializeScores() {
        const initialScores = await initializeScores();
        this.scores = initialScores;
        this.saveScores();
    }

    incrementScore() {
        this.currentScore += 10;
    }

    saveScores() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.scores));
    }

    display(playerName = null) {
        const scoreList = document.getElementById('score-list');
        scoreList.innerHTML = '';
        this.scores.slice(0, 20).forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.name} : ${score.score} points`;
            if (score.name === playerName) {
                const span = document.createElement('span');
                span.textContent = ' (Vous)';
                span.classList.add('text-yellow-500');
                li.appendChild(span);
            }
            scoreList.appendChild(li);
        });
    }

    isTopScore(score) {
        return this.scores.length < 20 || score > this.scores[this.scores.length - 1].score;
    }

    addNewScore(name, score) {
        // Vérifier si le nom existe déjà
        const existingScoreIndex = this.scores.findIndex(s => s.name === name);
        
        if (existingScoreIndex !== -1) {
            this.scores[existingScoreIndex].score = score;
        } else {
            this.scores.push({ name, score });
        }
        
        this.scores.sort((a, b) => b.score - a.score);
        if (this.scores.length > 20) {
            this.scores.pop();
        }
        this.saveScores();
        this.display(name);
    }
}