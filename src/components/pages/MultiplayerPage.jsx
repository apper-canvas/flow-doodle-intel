import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { authService, lobbyService } from '@/services';
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import { setCurrentLobby, setAvailableLobbies, setLoading } from '@/store/slices/lobbySlice';

const MultiplayerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { currentLobby, availableLobbies } = useSelector(state => state.lobby);
  
  const [username, setUsername] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const [showCreateLobby, setShowCreateLobby] = useState(false);
  const [loading, setLoadingState] = useState(false);

  // Load available lobbies
  useEffect(() => {
    if (isAuthenticated) {
      loadAvailableLobbies();
    }
  }, [isAuthenticated]);

  const loadAvailableLobbies = async () => {
    try {
      const lobbies = await lobbyService.getAvailableLobbies();
      dispatch(setAvailableLobbies(lobbies));
    } catch (error) {
      toast.error('Failed to load lobbies');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      dispatch(loginStart());
      const userData = await authService.login(username);
      dispatch(loginSuccess(userData));
      toast.success(`Welcome, ${userData.username}!`);
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      dispatch(setCurrentLobby(null));
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleCreateLobby = async (e) => {
    e.preventDefault();
    if (!lobbyName.trim()) return;

    try {
      setLoadingState(true);
      const lobby = await lobbyService.createLobby(user.id, lobbyName);
      const joinedLobby = await lobbyService.joinLobby(lobby.id, user);
      dispatch(setCurrentLobby(joinedLobby));
      setShowCreateLobby(false);
      setLobbyName('');
      toast.success('Lobby created successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingState(false);
    }
  };

  const handleJoinLobby = async (lobbyId) => {
    try {
      setLoadingState(true);
      const joinedLobby = await lobbyService.joinLobby(lobbyId, user);
      dispatch(setCurrentLobby(joinedLobby));
      toast.success('Joined lobby successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingState(false);
    }
  };

  const handleLeaveLobby = async () => {
    if (!currentLobby) return;

    try {
      await lobbyService.leaveLobby(currentLobby.id, user.id);
      dispatch(setCurrentLobby(null));
      loadAvailableLobbies();
      toast.success('Left lobby');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStartGame = async () => {
    if (!currentLobby) return;

    try {
      await lobbyService.startGame(currentLobby.id);
      toast.success('Starting game...');
      // Navigate to multiplayer game view
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display text-white mb-2">
              Join <span className="text-primary">Multiplayer</span>
            </h1>
            <p className="text-gray-400">Enter your username to start playing with friends</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none"
                maxLength={20}
                required
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!username.trim()}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium disabled:opacity-50"
            >
              Join Game
            </motion.button>
          </form>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mt-6 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Single Player
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          </motion.button>
          <h1 className="text-2xl font-display text-white">
            Multiplayer Lobby
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Welcome, {user?.username}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-error text-white rounded-lg font-medium"
          >
            Logout
          </motion.button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Lobby List */}
        {!currentLobby && (
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Available Lobbies</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateLobby(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
              >
                <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
                Create Lobby
              </motion.button>
            </div>

            <div className="grid gap-4">
              {availableLobbies.map(lobby => (
                <motion.div
                  key={lobby.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-surface border border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{lobby.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {lobby.playerCount}/{lobby.maxPlayers} players
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinLobby(lobby.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-secondary text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      Join
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              
              {availableLobbies.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <ApperIcon name="Users" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No available lobbies. Create one to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Lobby */}
        {currentLobby && (
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{currentLobby.name}</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLeaveLobby}
                className="px-4 py-2 bg-error text-white rounded-lg font-medium"
              >
                Leave Lobby
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Team 1 */}
              <div className="bg-surface border border-gray-700 rounded-lg p-4">
                <h3 className="text-primary font-semibold mb-3">Team 1</h3>
                <div className="space-y-2">
                  {currentLobby.players
                    .filter(p => p.team === 'team1')
                    .map(player => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-background rounded">
                        <span className="text-white">{player.username}</span>
                        {player.id === currentLobby.hostId && (
                          <span className="text-accent text-xs">HOST</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Team 2 */}
              <div className="bg-surface border border-gray-700 rounded-lg p-4">
                <h3 className="text-secondary font-semibold mb-3">Team 2</h3>
                <div className="space-y-2">
                  {currentLobby.players
                    .filter(p => p.team === 'team2')
                    .map(player => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-background rounded">
                        <span className="text-white">{player.username}</span>
                        {player.id === currentLobby.hostId && (
                          <span className="text-accent text-xs">HOST</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {user.id === currentLobby.hostId && currentLobby.players.length >= 2 && (
              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartGame}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-lg"
                >
                  Start Game
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Lobby Modal */}
      <AnimatePresence>
        {showCreateLobby && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateLobby(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-gray-700 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Create Lobby</h3>
              
              <form onSubmit={handleCreateLobby} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Lobby Name</label>
                  <input
                    type="text"
                    value={lobbyName}
                    onChange={(e) => setLobbyName(e.target.value)}
                    placeholder="Enter lobby name"
                    className="w-full px-4 py-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowCreateLobby(false)}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!lobbyName.trim() || loading}
                    className="flex-1 py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    Create
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiplayerPage;