import gameStates from '../mockData/gameStates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameStateService {
  constructor() {
    this.currentState = null;
    this.gamePhases = ['menu', 'countdown', 'drawing', 'guessing', 'results', 'gameOver'];
  }

  async initializeGame() {
    await delay(200);
    this.currentState = {
      id: Date.now(),
      currentWord: '',
      timeRemaining: 30,
      score: 0,
      coins: 0,
      gamePhase: 'menu',
      difficulty: 1,
      round: 1,
      maxRounds: 5,
      totalScore: 0,
      streak: 0
    };
    return { ...this.currentState };
  }

  async startRound(word, difficulty = 1) {
    await delay(150);
    if (!this.currentState) {
      throw new Error('Game not initialized');
    }
    
    this.currentState = {
      ...this.currentState,
      currentWord: word,
      timeRemaining: 30,
      gamePhase: 'countdown',
      difficulty
    };
    return { ...this.currentState };
  }

  async startDrawing() {
    await delay(100);
    this.currentState = {
      ...this.currentState,
      gamePhase: 'drawing',
      timeRemaining: 30
    };
    return { ...this.currentState };
  }

  async updateTimer(timeRemaining) {
    this.currentState = {
      ...this.currentState,
      timeRemaining: Math.max(0, timeRemaining)
    };
    
    if (timeRemaining <= 0 && this.currentState.gamePhase === 'drawing') {
      this.currentState.gamePhase = 'guessing';
    }
    
    return { ...this.currentState };
  }

  async completeGuess(correct, timeUsed) {
    await delay(200);
    let points = 0;
    let coins = 0;
    
    if (correct) {
      // More points for faster guesses
      points = Math.max(100, Math.floor(500 - (timeUsed * 10)));
      coins = Math.floor(points / 50);
      this.currentState.streak += 1;
    } else {
      this.currentState.streak = 0;
    }
    
    // Streak bonus
    if (this.currentState.streak > 2) {
      const bonus = this.currentState.streak * 50;
      points += bonus;
      coins += Math.floor(bonus / 50);
    }
    
    this.currentState = {
      ...this.currentState,
      score: this.currentState.score + points,
      coins: this.currentState.coins + coins,
      totalScore: this.currentState.totalScore + points,
      gamePhase: 'results'
    };
    
    return { 
      ...this.currentState, 
      lastRoundPoints: points,
      lastRoundCoins: coins,
      wasCorrect: correct
    };
  }

  async nextRound() {
    await delay(300);
    if (this.currentState.round >= this.currentState.maxRounds) {
      this.currentState.gamePhase = 'gameOver';
    } else {
      this.currentState = {
        ...this.currentState,
        round: this.currentState.round + 1,
        gamePhase: 'menu',
        currentWord: '',
        timeRemaining: 30
      };
    }
    return { ...this.currentState };
  }

  async resetGame() {
    await delay(200);
    return this.initializeGame();
  }

  getCurrentState() {
    return this.currentState ? { ...this.currentState } : null;
  }

  async getAll() {
    await delay(200);
    return [...gameStates];
  }

  async getById(id) {
    await delay(200);
    const state = gameStates.find(s => s.id === id);
    return state ? { ...state } : null;
  }

  async create(state) {
    await delay(250);
    const newState = {
      ...state,
      id: Date.now()
    };
    return { ...newState };
  }

  async update(id, data) {
    await delay(200);
    const updated = {
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };
    return { ...updated };
  }

  async delete(id) {
    await delay(200);
    return { success: true };
  }
}

export default new GameStateService();