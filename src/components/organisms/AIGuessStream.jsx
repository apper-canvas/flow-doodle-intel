import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const AIGuessStream = ({ guesses, isActive }) => {
  if (!isActive && guesses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute top-4 right-4 max-w-xs z-20"
    >
      {/* AI Brain Icon */}
      <motion.div
        animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        className="flex items-center justify-center mb-4"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-info rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon 
            name="Brain" 
            className={`w-6 h-6 text-white ${isActive ? 'animate-pulse' : ''}`} 
          />
        </div>
      </motion.div>

      {/* AI Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <p className="text-secondary text-sm font-medium">
          {isActive ? "AI is guessing..." : "AI finished guessing"}
        </p>
      </motion.div>

      {/* Guess Stream */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {guesses.map((guess, index) => (
            <motion.div
              key={guess.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg shadow-md ${
                guess.isCorrect 
                  ? 'bg-success/20 border border-success/30' 
                  : 'bg-surface/80 border border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  guess.isCorrect ? 'text-success' : 'text-white'
                }`}>
                  {guess.guess}
                </span>
                
                {guess.isCorrect ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
                  </motion.div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(guess.confidence * 3) 
                              ? 'bg-accent' 
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-2">
                      {Math.floor(guess.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Thinking Animation */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-surface/60 rounded-lg border border-white/10"
        >
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-secondary rounded-full"
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">Thinking...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIGuessStream;