const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  constructor() {
    this.currentUser = null;
    this.loadUserData();
  }

  loadUserData() {
    const savedUser = localStorage.getItem('doodleai_auth_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.warn('Failed to load user data:', error);
        this.currentUser = null;
      }
    }
  }

  saveUserData() {
    if (this.currentUser) {
      localStorage.setItem('doodleai_auth_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('doodleai_auth_user');
    }
  }

  async login(username) {
    await delay(300);
    
    if (!username || username.trim().length < 2) {
      throw new Error('Username must be at least 2 characters long');
    }

    const user = {
      id: Date.now(),
      username: username.trim(),
      isOnline: true,
      joinedAt: Date.now(),
      gamesPlayed: 0,
      wins: 0
    };

    this.currentUser = user;
    this.saveUserData();
    return { ...user };
  }

  async logout() {
    await delay(200);
    this.currentUser = null;
    this.saveUserData();
    return { success: true };
  }

  async getCurrentUser() {
    await delay(100);
    return this.currentUser ? { ...this.currentUser } : null;
  }

  async updateUserStatus(isOnline) {
    await delay(150);
    if (this.currentUser) {
      this.currentUser.isOnline = isOnline;
      this.saveUserData();
      return { ...this.currentUser };
    }
    return null;
  }

  async updateStats(gameResult) {
    await delay(200);
    if (this.currentUser) {
      this.currentUser.gamesPlayed += 1;
      if (gameResult.won) {
        this.currentUser.wins += 1;
      }
      this.saveUserData();
      return { ...this.currentUser };
    }
    return null;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

export default new AuthService();