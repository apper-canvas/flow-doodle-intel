import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import DrawingCanvas from '@/components/organisms/DrawingCanvas';
import GameHeader from '@/components/organisms/GameHeader';
import WordDisplay from '@/components/molecules/WordDisplay';
import AIGuessStream from '@/components/organisms/AIGuessStream';
import GameControls from '@/components/organisms/GameControls';
import ResultsScreen from '@/components/organisms/ResultsScreen';
import CountdownOverlay from '@/components/molecules/CountdownOverlay';
import { gameStateService, drawingService, aiGuessService, playerService, wordService } from '@/services';

const GamePage = () => {
  const [gameState, setGameState] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [aiGuesses, setAiGuesses] = useState([]);
  const [brushSettings, setBrushSettings] = useState({
    color: '#FF6B6B',
    size: 4,
    tool: 'brush'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const timerRef = useRef(null);
  const guessSequenceRef = useRef(null);

  // Initialize game and player data
  useEffect(() => {
    const initializeGame = async () => {
      setLoading(true);
      setError(null);
      try {
        const [gameData, player] = await Promise.all([
          gameStateService.initializeGame(),
          playerService.getPlayerData()
        ]);
        
        setGameState(gameData);
        setPlayerData(player);
      } catch (err) {
        setError(err.message || 'Failed to initialize game');
        toast.error('Failed to start game');
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, []);

  // Start new round
  const startNewRound = async (difficulty = 1) => {
    try {
      const word = await wordService.getRandomWord(difficulty);
      setCurrentWord(word);
      
      const updatedGameState = await gameStateService.startRound(word.word, difficulty);
      setGameState(updatedGameState);
      
      // Start drawing after countdown
      setTimeout(async () => {
        const drawingState = await gameStateService.startDrawing();
        setGameState(drawingState);
        
        const newDrawing = await drawingService.startDrawing(word.id);
        setDrawing(newDrawing);
        
        startGameTimer();
      }, 3000); // 3 second countdown
      
    } catch (err) {
      setError(err.message);
      toast.error('Failed to start round');
    }
  };

  // Game timer
  const startGameTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(async () => {
      const currentState = gameStateService.getCurrentState();
      if (!currentState || currentState.gamePhase !== 'drawing') {
        clearInterval(timerRef.current);
        return;
      }
      
      const newTime = currentState.timeRemaining - 1;
      const updatedState = await gameStateService.updateTimer(newTime);
      setGameState(updatedState);
      
      if (newTime <= 0) {
        clearInterval(timerRef.current);
        startAIGuessing();
      }
    }, 1000);
  };

  // Start AI guessing sequence
  const startAIGuessing = async () => {
    try {
      const currentDrawing = drawingService.getCurrentDrawing();
      if (!currentDrawing || !currentWord) return;
      
      await drawingService.completeDrawing();
      
      const guessSequence = await aiGuessService.startGuessing(currentDrawing, currentWord.word);
      setAiGuesses([]);
      
      // Process each guess in sequence
      let currentGuess = 0;
      let correctGuess = false;
      let totalTime = 0;
      
      const processNextGuess = async () => {
        if (currentGuess >= guessSequence.length || correctGuess) {
          finishRound(correctGuess, totalTime);
          return;
        }
        
        const guess = guessSequence[currentGuess];
        totalTime += guess.delay;
        
        setTimeout(async () => {
          const processedGuess = await aiGuessService.processGuess(guess.guess, guess.confidence);
          setAiGuesses(prev => [...prev, processedGuess]);
          
          if (processedGuess.isCorrect) {
            correctGuess = true;
            setTimeout(() => finishRound(true, totalTime), 1500);
          } else {
            currentGuess++;
            processNextGuess();
          }
        }, guess.delay);
      };
      
      processNextGuess();
      
    } catch (err) {
      setError(err.message);
      toast.error('AI guessing failed');
    }
  };

  // Finish round and show results
  const finishRound = async (wasCorrect, timeUsed) => {
    try {
      const timeToGuess = wasCorrect ? Math.floor(timeUsed / 1000) : 30;
      const results = await gameStateService.completeGuess(wasCorrect, timeToGuess);
      setGameState(results);
      
      if (wasCorrect) {
        await playerService.updateCoins(results.lastRoundCoins);
        toast.success(`+${results.lastRoundPoints} points! +${results.lastRoundCoins} coins!`);
      } else {
        toast.error('AI couldn\'t guess it! No points this round.');
      }
      
      const updatedPlayer = await playerService.getPlayerData();
      setPlayerData(updatedPlayer);
      
    } catch (err) {
      setError(err.message);
      toast.error('Failed to finish round');
    }
  };

  // Continue to next round
  const nextRound = async () => {
    try {
      const nextState = await gameStateService.nextRound();
      setGameState(nextState);
      setAiGuesses([]);
      setDrawing(null);
      
      if (nextState.gamePhase === 'gameOver') {
        const finalResults = await playerService.completeGame(nextState.totalScore, nextState.round);
        setPlayerData(finalResults);
        
        if (finalResults.newHighScore) {
          toast.success('🎉 New High Score!');
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to continue');
    }
  };

  // Reset game
  const resetGame = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const newGameState = await gameStateService.resetGame();
      setGameState(newGameState);
      setCurrentWord(null);
      setDrawing(null);
      setAiGuesses([]);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to reset game');
    }
  };

  // Drawing handlers
  const handleDrawingUpdate = (updatedDrawing) => {
    setDrawing(updatedDrawing);
  };

  const handleUndo = async () => {
    try {
      const updatedDrawing = await drawingService.undoLastStroke();
      setDrawing(updatedDrawing);
    } catch (err) {
      toast.error('Failed to undo');
    }
  };

  const handleClear = async () => {
    try {
      const clearedDrawing = await drawingService.clearDrawing();
      setDrawing(clearedDrawing);
    } catch (err) {
      toast.error('Failed to clear canvas');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (guessSequenceRef.current) {
        clearTimeout(guessSequenceRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-white p-6">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mb-4" />
        <h2 className="text-2xl font-display mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-6 text-center">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white rounded-full font-medium"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <GameHeader 
        gameState={gameState}
        playerData={playerData}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Menu Screen */}
          {gameState?.gamePhase === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-center mb-12"
              >
                <h1 className="text-6xl font-display text-white mb-4">
                  Doodle<span className="text-primary">AI</span>
                </h1>
                <p className="text-xl text-gray-400">
                  Draw fast, let AI guess faster!
                </p>
</motion.div>
              
              <div className="flex flex-col space-y-4 w-full max-w-xs">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startNewRound(1)}
                  className="py-4 px-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xl font-bold shadow-lg"
                >
                  <ApperIcon name="Play" className="w-6 h-6 inline mr-2" />
                  Start Game
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/multiplayer'}
                  className="py-4 px-8 bg-gradient-to-r from-accent to-info text-white rounded-full text-xl font-bold shadow-lg"
                >
                  <ApperIcon name="Users" className="w-6 h-6 inline mr-2" />
                  Multiplayer
                </motion.button>
                
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startNewRound(1)}
                    className="py-3 px-4 bg-success/20 text-success rounded-lg font-medium border border-success/30"
                  >
                    Easy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startNewRound(2)}
                    className="py-3 px-4 bg-warning/20 text-warning rounded-lg font-medium border border-warning/30"
                  >
                    Medium
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startNewRound(3)}
                    className="py-3 px-4 bg-error/20 text-error rounded-lg font-medium border border-error/30"
                  >
                    Hard
                  </motion.button>
                </div>
              </div>
              
              {playerData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 text-center"
                >
                  <p className="text-gray-400 mb-2">Your Stats</p>
                  <div className="flex space-x-6 text-white">
                    <div>
                      <div className="text-2xl font-bold text-accent">{playerData.totalCoins}</div>
                      <div className="text-sm text-gray-400">Coins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">{playerData.highScore}</div>
                      <div className="text-sm text-gray-400">Best Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{playerData.level}</div>
                      <div className="text-sm text-gray-400">Level</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Countdown Phase */}
          {gameState?.gamePhase === 'countdown' && currentWord && (
            <CountdownOverlay 
              word={currentWord}
              onComplete={() => {/* handled by timer */}}
            />
          )}

          {/* Drawing Phase */}
          {(gameState?.gamePhase === 'drawing' || gameState?.gamePhase === 'guessing') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {currentWord && (
                <WordDisplay 
                  word={currentWord}
                  timeRemaining={gameState.timeRemaining}
                  gamePhase={gameState.gamePhase}
                />
              )}
              
              <div className="flex-1 relative">
                <DrawingCanvas
                  drawing={drawing}
                  brushSettings={brushSettings}
                  onDrawingUpdate={handleDrawingUpdate}
                  disabled={gameState.gamePhase === 'guessing'}
                />
                
                <AIGuessStream 
                  guesses={aiGuesses}
                  isActive={gameState.gamePhase === 'guessing'}
                />
              </div>
              
              <GameControls
                brushSettings={brushSettings}
                onBrushChange={setBrushSettings}
                onUndo={handleUndo}
                onClear={handleClear}
                disabled={gameState.gamePhase === 'guessing'}
              />
            </motion.div>
          )}

          {/* Results Phase */}
          {gameState?.gamePhase === 'results' && (
            <ResultsScreen
              gameState={gameState}
              currentWord={currentWord}
              onNextRound={nextRound}
              onMainMenu={resetGame}
            />
          )}

          {/* Game Over Phase */}
          {gameState?.gamePhase === 'gameOver' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ApperIcon name="Trophy" className="w-24 h-24 text-accent mx-auto mb-6" />
                <h2 className="text-4xl font-display text-white mb-4">Game Complete!</h2>
                <div className="space-y-4 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{gameState.totalScore}</div>
                    <div className="text-gray-400">Final Score</div>
                  </div>
                  <div className="flex space-x-8 justify-center">
                    <div>
                      <div className="text-xl font-bold text-secondary">{gameState.coins}</div>
                      <div className="text-sm text-gray-400">Coins Earned</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-accent">{gameState.round - 1}</div>
                      <div className="text-sm text-gray-400">Rounds Played</div>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="py-4 px-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xl font-bold shadow-lg"
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default GamePage;