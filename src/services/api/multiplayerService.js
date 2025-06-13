const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MultiplayerService {
  constructor() {
    this.gameStates = new Map();
    this.currentGame = null;
  }

  async createGame(lobbyId, players) {
    await delay(300);

    const gameState = {
      id: `game_${Date.now()}`,
      lobbyId,
      players: [...players],
      currentRound: 1,
      maxRounds: 5,
      currentDrawer: null,
      drawingTime: 60,
      timeRemaining: 60,
      gamePhase: 'setup', // setup, drawing, guessing, results, finished
      currentWord: null,
      scores: {},
      teamScores: { team1: 0, team2: 0 },
      drawingData: null,
      guesses: [],
      createdAt: Date.now()
    };

    // Initialize scores
    players.forEach(player => {
      gameState.scores[player.id] = 0;
    });

    this.gameStates.set(gameState.id, gameState);
    this.currentGame = gameState;

    return { ...gameState };
  }

  async startRound(gameId, word, drawerId) {
    await delay(200);

    const game = this.gameStates.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.currentWord = word;
    game.currentDrawer = drawerId;
    game.gamePhase = 'drawing';
    game.timeRemaining = game.drawingTime;
    game.drawingData = null;
    game.guesses = [];

    this.gameStates.set(gameId, game);
    return { ...game };
  }

  async updateDrawing(gameId, drawingData) {
    await delay(100);

    const game = this.gameStates.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.drawingData = drawingData;
    this.gameStates.set(gameId, game);

    return { ...game };
  }

  async submitGuess(gameId, playerId, guess) {
    await delay(150);

    const game = this.gameStates.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (playerId === game.currentDrawer) {
      throw new Error('Drawer cannot guess');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found in game');
    }

    const isCorrect = guess.toLowerCase().trim() === game.currentWord.toLowerCase().trim();
    
    const guessData = {
      id: Date.now(),
      playerId,
      playerName: player.username,
      guess,
      isCorrect,
      timestamp: Date.now()
    };

    game.guesses.push(guessData);

    if (isCorrect) {
      // Award points
      const points = Math.max(100, game.timeRemaining * 2);
      game.scores[playerId] += points;
      game.scores[game.currentDrawer] += Math.floor(points / 2);

      // Update team scores
      const guesserTeam = player.team;
      const drawerTeam = game.players.find(p => p.id === game.currentDrawer)?.team;
      
      if (guesserTeam) {
        game.teamScores[guesserTeam] += points;
      }
      if (drawerTeam && drawerTeam === guesserTeam) {
        game.teamScores[drawerTeam] += Math.floor(points / 2);
      }

      game.gamePhase = 'results';
    }

    this.gameStates.set(gameId, game);
    return { ...game };
  }

  async updateTimer(gameId, timeRemaining) {
    await delay(50);

    const game = this.gameStates.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.timeRemaining = timeRemaining;

    if (timeRemaining <= 0 && game.gamePhase === 'drawing') {
      game.gamePhase = 'guessing';
    }

    this.gameStates.set(gameId, game);
    return { ...game };
  }

  async nextRound(gameId) {
    await delay(250);

    const game = this.gameStates.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.currentRound += 1;

    if (game.currentRound > game.maxRounds) {
      game.gamePhase = 'finished';
    } else {
      game.gamePhase = 'setup';
      game.currentDrawer = this.getNextDrawer(game);
      game.timeRemaining = game.drawingTime;
    }

    this.gameStates.set(gameId, game);
    return { ...game };
  }

  getNextDrawer(game) {
    const currentDrawerIndex = game.players.findIndex(p => p.id === game.currentDrawer);
    const nextIndex = (currentDrawerIndex + 1) % game.players.length;
    return game.players[nextIndex].id;
  }

  async getGameState(gameId) {
    await delay(100);

    const game = this.gameStates.get(gameId);
    return game ? { ...game } : null;
  }

  async endGame(gameId) {
    await delay(200);

    const game = this.gameStates.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    game.gamePhase = 'finished';
    game.endedAt = Date.now();

    this.gameStates.set(gameId, game);
    return { ...game };
  }

  getCurrentGame() {
    return this.currentGame ? { ...this.currentGame } : null;
  }
}

export default new MultiplayerService();