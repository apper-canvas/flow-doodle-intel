import players from '../mockData/players.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlayerService {
  constructor() {
    this.currentPlayer = null;
    this.loadPlayerData();
  }

  loadPlayerData() {
    const savedData = localStorage.getItem('doodleai_player');
    if (savedData) {
      try {
        this.currentPlayer = JSON.parse(savedData);
      } catch (error) {
        console.warn('Failed to load player data:', error);
        this.initializePlayer();
      }
    } else {
      this.initializePlayer();
    }
  }

  initializePlayer() {
    this.currentPlayer = {
      id: Date.now(),
      totalCoins: 0,
      highScore: 0,
      unlockedBrushes: ['default'],
      level: 1,
      experience: 0,
      gamesPlayed: 0,
      totalDrawings: 0,
      bestStreak: 0,
      achievements: [],
      createdAt: Date.now()
    };
    this.savePlayerData();
  }

  savePlayerData() {
    if (this.currentPlayer) {
      localStorage.setItem('doodleai_player', JSON.stringify(this.currentPlayer));
    }
  }

  async getPlayerData() {
    await delay(150);
    return this.currentPlayer ? { ...this.currentPlayer } : null;
  }

  async updateCoins(amount) {
    await delay(200);
    if (!this.currentPlayer) {
      this.initializePlayer();
    }
    
    this.currentPlayer.totalCoins += amount;
    this.savePlayerData();
    return { ...this.currentPlayer };
  }

  async updateHighScore(score) {
    await delay(150);
    if (!this.currentPlayer) {
      this.initializePlayer();
    }
    
    if (score > this.currentPlayer.highScore) {
      this.currentPlayer.highScore = score;
      this.savePlayerData();
      return { newHighScore: true, ...this.currentPlayer };
    }
    
    return { newHighScore: false, ...this.currentPlayer };
  }

  async updateStreak(streak) {
    await delay(100);
    if (!this.currentPlayer) {
      this.initializePlayer();
    }
    
    if (streak > this.currentPlayer.bestStreak) {
      this.currentPlayer.bestStreak = streak;
      this.savePlayerData();
    }
    
    return { ...this.currentPlayer };
  }

  async addExperience(amount) {
    await delay(150);
    if (!this.currentPlayer) {
      this.initializePlayer();
    }
    
    this.currentPlayer.experience += amount;
    
    // Level up calculation (every 1000 XP)
    const newLevel = Math.floor(this.currentPlayer.experience / 1000) + 1;
    const leveledUp = newLevel > this.currentPlayer.level;
    
    if (leveledUp) {
      this.currentPlayer.level = newLevel;
      // Unlock new brushes every few levels
      if (newLevel % 3 === 0) {
        const brushes = ['neon', 'pixel', 'watercolor', 'crayon', 'marker'];
        const nextBrush = brushes.find(b => !this.currentPlayer.unlockedBrushes.includes(b));
        if (nextBrush) {
          this.currentPlayer.unlockedBrushes.push(nextBrush);
        }
      }
    }
    
    this.savePlayerData();
    return { leveledUp, ...this.currentPlayer };
  }

  async completeGame(score, drawings) {
    await delay(200);
    if (!this.currentPlayer) {
      this.initializePlayer();
    }
    
    this.currentPlayer.gamesPlayed += 1;
    this.currentPlayer.totalDrawings += drawings;
    
    const results = await Promise.all([
      this.updateHighScore(score),
      this.addExperience(score / 10) // 1 XP per 10 points
    ]);
    
    return results[0]; // Return the high score result
  }

  async unlockBrush(brushName) {
    await delay(200);
    if (!this.currentPlayer) {
      this.initializePlayer();
    }
    
    if (!this.currentPlayer.unlockedBrushes.includes(brushName)) {
      this.currentPlayer.unlockedBrushes.push(brushName);
      this.savePlayerData();
    }
    
    return { ...this.currentPlayer };
  }

  async resetPlayerData() {
    await delay(300);
    localStorage.removeItem('doodleai_player');
    this.initializePlayer();
    return { ...this.currentPlayer };
  }

  async getAll() {
    await delay(200);
    return [...players];
  }

  async getById(id) {
    await delay(200);
    const player = players.find(p => p.id === id);
    return player ? { ...player } : null;
  }

  async create(player) {
    await delay(250);
    const newPlayer = {
      ...player,
      id: Date.now(),
      createdAt: Date.now()
    };
    return { ...newPlayer };
  }

  async update(id, data) {
    await delay(200);
    const updated = {
      ...data,
      id,
      updatedAt: Date.now()
    };
    return { ...updated };
  }

  async delete(id) {
    await delay(200);
    return { success: true };
  }
}

export default new PlayerService();