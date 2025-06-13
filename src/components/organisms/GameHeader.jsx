import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GameHeader = ({ gameState, playerData }) => {
  return (
    <header className="flex-shrink-0 h-16 bg-surface/50 backdrop-blur-sm border-b border-white/10 z-40">
      <div className="h-full flex items-center justify-between px-4">
        {/* Logo/Title */}
        <div className="flex items-center space-x-3">
          <ApperIcon name="Brush" className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-display text-white">
            Doodle<span className="text-primary">AI</span>
          </h1>
        </div>

        {/* Game Stats */}
        <div className="flex items-center space-x-6">
          {/* Score */}
          {gameState && gameState.gamePhase !== 'menu' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Target" className="w-5 h-5 text-secondary" />
              <span className="text-white font-bold">{gameState.totalScore || gameState.score}</span>
            </motion.div>
          )}

          {/* Coins */}
          {playerData && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Coins" className="w-5 h-5 text-accent" />
              <span className="text-white font-bold">{playerData.totalCoins}</span>
            </motion.div>
          )}

          {/* Round Indicator */}
          {gameState && gameState.gamePhase !== 'menu' && gameState.gamePhase !== 'gameOver' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Circle" className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">
                {gameState.round}/{gameState.maxRounds}
              </span>
            </motion.div>
          )}

          {/* Level */}
          {playerData && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{playerData.level}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GameHeader;