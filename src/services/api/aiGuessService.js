import aiGuesses from '../mockData/aiGuesses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AIGuessService {
  constructor() {
    this.guessHistory = [];
    this.isGuessing = false;
  }

  async startGuessing(drawing, targetWord) {
    await delay(200);
    this.guessHistory = [];
    this.isGuessing = true;
    this.targetWord = targetWord.toLowerCase();
    
    // Generate realistic guessing sequence
    return this.generateGuessingSequence(drawing);
  }

  async generateGuessingSequence(drawing) {
    const relatedWords = this.getRelatedWords(this.targetWord);
    const wrongGuesses = this.getWrongGuesses();
    
    // Create a realistic guessing pattern
    const sequence = [];
    const totalGuesses = Math.floor(Math.random() * 4) + 3; // 3-6 guesses
    
    // Add some wrong guesses first
    for (let i = 0; i < totalGuesses - 1; i++) {
      const isRelated = Math.random() > 0.6;
      const guess = isRelated && relatedWords.length > 0 
        ? relatedWords[Math.floor(Math.random() * relatedWords.length)]
        : wrongGuesses[Math.floor(Math.random() * wrongGuesses.length)];
      
      sequence.push({
        guess,
        confidence: Math.random() * 0.4 + 0.2, // Low confidence for wrong guesses
        delay: Math.random() * 2000 + 1000 // 1-3 seconds between guesses
      });
    }
    
    // Sometimes get it right, sometimes not
    const willGuessCorrectly = Math.random() > 0.3; // 70% success rate
    
    if (willGuessCorrectly) {
      sequence.push({
        guess: this.targetWord,
        confidence: Math.random() * 0.3 + 0.7, // High confidence for correct guess
        delay: Math.random() * 2000 + 1500
      });
    } else {
      // Add one more wrong guess
      sequence.push({
        guess: wrongGuesses[Math.floor(Math.random() * wrongGuesses.length)],
        confidence: Math.random() * 0.4 + 0.3,
        delay: Math.random() * 2000 + 1500
      });
    }
    
    return sequence;
  }

  getRelatedWords(targetWord) {
    const wordRelations = {
      'cat': ['dog', 'animal', 'pet', 'kitten', 'mouse'],
      'house': ['home', 'building', 'roof', 'door', 'window'],
      'car': ['vehicle', 'truck', 'bike', 'wheel', 'road'],
      'tree': ['plant', 'leaf', 'branch', 'forest', 'flower'],
      'sun': ['star', 'moon', 'light', 'sky', 'bright'],
      'fish': ['water', 'ocean', 'swimming', 'whale', 'shark'],
      'pizza': ['food', 'cheese', 'bread', 'slice', 'italian'],
      'guitar': ['music', 'instrument', 'string', 'sound', 'band'],
      'rainbow': ['colors', 'sky', 'rain', 'arc', 'bright'],
      'butterfly': ['insect', 'wings', 'flower', 'colorful', 'flying']
    };
    
    return wordRelations[targetWord] || [];
  }

  getWrongGuesses() {
    return [
      'circle', 'square', 'line', 'shape', 'blob', 'scribble',
      'drawing', 'art', 'sketch', 'doodle', 'mark', 'curve',
      'pattern', 'design', 'abstract', 'random', 'messy', 'unclear'
    ];
  }

  async processGuess(guess, confidence) {
    await delay(100);
    const newGuess = {
      id: Date.now(),
      guess: guess.toLowerCase(),
      confidence,
      timestamp: Date.now(),
      isCorrect: guess.toLowerCase() === this.targetWord
    };
    
    this.guessHistory.push(newGuess);
    return { ...newGuess };
  }

  async stopGuessing() {
    await delay(100);
    this.isGuessing = false;
    const finalResult = {
      guesses: [...this.guessHistory],
      success: this.guessHistory.some(g => g.isCorrect),
      totalTime: this.guessHistory.length > 0 
        ? this.guessHistory[this.guessHistory.length - 1].timestamp - this.guessHistory[0].timestamp
        : 0
    };
    return finalResult;
  }

  getGuessHistory() {
    return [...this.guessHistory];
  }

  async getAll() {
    await delay(200);
    return [...aiGuesses];
  }

  async getById(id) {
    await delay(200);
    const guess = aiGuesses.find(g => g.id === id);
    return guess ? { ...guess } : null;
  }

  async create(guess) {
    await delay(250);
    const newGuess = {
      ...guess,
      id: Date.now(),
      timestamp: Date.now()
    };
    return { ...newGuess };
  }

  async update(id, data) {
    await delay(200);
    const updated = {
      ...data,
      id,
      updatedAt: Date.now()
    };
    return { ...updated };
  }

  async delete(id) {
    await delay(200);
    return { success: true };
  }
}

export default new AIGuessService();