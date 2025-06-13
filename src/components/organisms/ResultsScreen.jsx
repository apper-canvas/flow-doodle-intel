import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ResultsScreen = ({ gameState, currentWord, onNextRound, onMainMenu }) => {
  const wasCorrect = gameState?.wasCorrect;
  const points = gameState?.lastRoundPoints || 0;
  const coins = gameState?.lastRoundCoins || 0;
  const streak = gameState?.streak || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-1 flex flex-col items-center justify-center p-6 text-center"
    >
      {/* Success/Failure Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="mb-6"
      >
        {wasCorrect ? (
          <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center">
            <ApperIcon name="CheckCircle" className="w-12 h-12 text-success" />
          </div>
        ) : (
          <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center">
            <ApperIcon name="XCircle" className="w-12 h-12 text-error" />
          </div>
        )}
      </motion.div>

      {/* Result Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-display text-white mb-2">
          {wasCorrect ? "Nailed it!" : "So close!"}
        </h2>
        <p className="text-xl text-gray-400">
          The word was: <span className="text-primary font-bold">{currentWord?.word}</span>
        </p>
      </motion.div>

      {/* Score Display */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 space-y-4"
      >
        {/* Points */}
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-4xl font-bold text-primary mb-1"
            >
              +{points}
            </motion.div>
            <div className="text-gray-400 text-sm">Points</div>
          </div>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-4xl font-bold text-accent mb-1"
            >
              +{coins}
            </motion.div>
            <div className="text-gray-400 text-sm">Coins</div>
          </div>
        </div>

        {/* Streak */}
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 1, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full"
          >
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            <span className="text-white font-bold">{streak} Streak!</span>
          </motion.div>
        )}

        {/* Total Score */}
        <div className="text-center">
          <div className="text-lg text-gray-300">
            Total Score: <span className="text-secondary font-bold">{gameState.totalScore}</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNextRound}
          className="py-3 px-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-lg"
        >
          <ApperIcon name="ArrowRight" className="w-5 h-5 inline mr-2" />
          Next Round
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMainMenu}
          className="py-3 px-8 bg-surface hover:bg-surface/80 text-white border border-white/20 rounded-full font-medium"
        >
          <ApperIcon name="Home" className="w-5 h-5 inline mr-2" />
          Main Menu
        </motion.button>
      </motion.div>

      {/* Round Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-8 text-center"
      >
        <div className="text-gray-400 text-sm mb-2">Round Progress</div>
        <div className="flex space-x-2 justify-center">
          {[...Array(gameState.maxRounds)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < gameState.round - 1
                  ? 'bg-success'
                  : i === gameState.round - 1
                  ? 'bg-primary'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsScreen;