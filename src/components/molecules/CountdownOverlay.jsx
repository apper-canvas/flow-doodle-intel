import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CountdownOverlay = ({ word, onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      {/* Word Preview */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-display text-white mb-4">Get Ready!</h2>
        <div className="p-6 bg-surface/50 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-lg mb-2">Draw this word:</p>
          <h3 className="text-5xl font-display text-primary">{word.word}</h3>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="text-gray-400 text-sm capitalize">{word.category}</span>
            <span className="text-gray-400">•</span>
            <span className={`text-sm font-medium ${
              word.difficulty === 1 ? 'text-success' :
              word.difficulty === 2 ? 'text-warning' : 'text-error'
            }`}>
              {word.difficulty === 1 ? 'Easy' : word.difficulty === 2 ? 'Medium' : 'Hard'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Countdown */}
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center"
      >
        {count > 0 ? (
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl font-display text-white">{count}</span>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center shadow-2xl mb-4">
              <ApperIcon name="Brush" className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-3xl font-display text-accent">START DRAWING!</h3>
          </motion.div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center max-w-md"
      >
        <p className="text-gray-400 text-lg">
          You have <span className="text-white font-bold">30 seconds</span> to draw
        </p>
        <p className="text-gray-500 text-sm mt-2">
          The faster the AI guesses, the more points you earn!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CountdownOverlay;