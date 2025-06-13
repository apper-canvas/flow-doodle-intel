import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const WordDisplay = ({ word, timeRemaining, gamePhase }) => {
  const getTimerColor = () => {
    if (timeRemaining > 20) return 'bg-success';
    if (timeRemaining > 10) return 'bg-warning';
    return 'bg-error';
  };

  const getDifficultyColor = () => {
    switch (word.difficulty) {
      case 1: return 'text-success';
      case 2: return 'text-warning';
      case 3: return 'text-error';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyLabel = () => {
    switch (word.difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 bg-surface/80 backdrop-blur-sm border-b border-white/10 p-4"
    >
      <div className="flex items-center justify-between">
        {/* Word Information */}
        <div className="flex items-center space-x-4">
          <div>
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-display text-white"
            >
              Draw: <span className="text-primary">{word.word}</span>
            </motion.h2>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`text-sm font-medium ${getDifficultyColor()}`}>
                {getDifficultyLabel()}
              </span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm capitalize">{word.category}</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center space-x-3">
          {gamePhase === 'drawing' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-right"
              >
                <div className="text-2xl font-bold text-white">
                  {timeRemaining}
                </div>
                <div className="text-xs text-gray-400">seconds</div>
              </motion.div>
              
              <motion.div
                animate={timeRemaining <= 10 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: timeRemaining <= 10 ? Infinity : 0 }}
              >
                <ApperIcon 
                  name="Clock" 
                  className={`w-8 h-8 ${
                    timeRemaining <= 10 ? 'text-error' : 'text-gray-400'
                  }`} 
                />
              </motion.div>
            </>
          )}
          
          {gamePhase === 'guessing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="Brain" className="w-6 h-6 text-secondary" />
              </motion.div>
              <span className="text-secondary font-medium">AI Guessing...</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Timer Progress Bar */}
      {gamePhase === 'drawing' && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ scaleX: timeRemaining / 30 }}
            transition={{ duration: 0.3 }}
            className={`h-full ${getTimerColor()} origin-left rounded-full`}
          />
        </motion.div>
      )}

      {/* Hints (for harder difficulties) */}
      {word.difficulty > 1 && word.hints && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
          className="mt-3 p-3 bg-info/10 border border-info/20 rounded-lg"
        >
          <div className="flex items-start space-x-2">
            <ApperIcon name="Lightbulb" className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-info text-xs font-medium mb-1">Hints:</div>
              <div className="text-gray-300 text-sm">
                {word.hints.slice(0, Math.min(2, word.hints.length)).join(' • ')}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WordDisplay;