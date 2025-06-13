const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LobbyService {
  constructor() {
    this.lobbies = new Map();
    this.currentLobby = null;
  }

  async createLobby(hostId, lobbyName, maxPlayers = 4) {
    await delay(300);

    const lobby = {
      id: `lobby_${Date.now()}`,
      name: lobbyName || `${hostId}'s Game`,
      hostId,
      maxPlayers,
      players: [],
      teams: { team1: [], team2: [] },
      status: 'waiting',
      gameSettings: {
        maxRounds: 5,
        drawingTime: 60,
        difficulty: 1
      },
      createdAt: Date.now()
    };

    this.lobbies.set(lobby.id, lobby);
    return { ...lobby };
  }

  async joinLobby(lobbyId, player) {
    await delay(250);

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      throw new Error('Lobby is full');
    }

    if (lobby.players.find(p => p.id === player.id)) {
      throw new Error('Player already in lobby');
    }

    // Add player to lobby
    const playerData = {
      ...player,
      team: null,
      isReady: false,
      joinedAt: Date.now()
    };

    lobby.players.push(playerData);
    
    // Auto-assign to team
    this.autoAssignTeam(lobby, playerData);

    this.lobbies.set(lobbyId, lobby);
    this.currentLobby = lobby;
    
    return { ...lobby };
  }

  autoAssignTeam(lobby, player) {
    const team1Count = lobby.teams.team1.length;
    const team2Count = lobby.teams.team2.length;
    
    if (team1Count <= team2Count) {
      lobby.teams.team1.push(player.id);
      player.team = 'team1';
    } else {
      lobby.teams.team2.push(player.id);
      player.team = 'team2';
    }
  }

  async leaveLobby(lobbyId, playerId) {
    await delay(200);

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
    }

    // Remove player from lobby
    lobby.players = lobby.players.filter(p => p.id !== playerId);
    
    // Remove from teams
    lobby.teams.team1 = lobby.teams.team1.filter(id => id !== playerId);
    lobby.teams.team2 = lobby.teams.team2.filter(id => id !== playerId);

    // If host left, assign new host
    if (lobby.hostId === playerId && lobby.players.length > 0) {
      lobby.hostId = lobby.players[0].id;
    }

    // If lobby is empty, delete it
    if (lobby.players.length === 0) {
      this.lobbies.delete(lobbyId);
      return { deleted: true };
    }

    this.lobbies.set(lobbyId, lobby);
    
    if (this.currentLobby?.id === lobbyId) {
      this.currentLobby = null;
    }

    return { ...lobby };
  }

  async getAvailableLobbies() {
    await delay(200);
    
    const availableLobbies = Array.from(this.lobbies.values())
      .filter(lobby => 
        lobby.status === 'waiting' && 
        lobby.players.length < lobby.maxPlayers
      )
      .map(lobby => ({
        ...lobby,
        playerCount: lobby.players.length
      }));

    return availableLobbies;
  }

  async getLobby(lobbyId) {
    await delay(150);
    
    const lobby = this.lobbies.get(lobbyId);
    return lobby ? { ...lobby } : null;
  }

  async updatePlayerReady(lobbyId, playerId, isReady) {
    await delay(150);

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
    }

    const player = lobby.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found in lobby');
    }

    player.isReady = isReady;

    // Check if all players are ready
    const allReady = lobby.players.length >= 2 && 
                    lobby.players.every(p => p.isReady);

    if (allReady) {
      lobby.status = 'starting';
    }

    this.lobbies.set(lobbyId, lobby);
    return { ...lobby };
  }

  async startGame(lobbyId) {
    await delay(300);

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
    }

    if (lobby.players.length < 2) {
      throw new Error('Need at least 2 players to start');
    }

    lobby.status = 'playing';
    this.lobbies.set(lobbyId, lobby);

    return { ...lobby };
  }

  getCurrentLobby() {
    return this.currentLobby ? { ...this.currentLobby } : null;
  }
}

export default new LobbyService();