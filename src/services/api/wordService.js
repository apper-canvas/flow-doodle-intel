import words from '../mockData/words.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WordService {
  constructor() {
    this.usedWords = [];
    this.dailyWords = [];
  }

  async getRandomWord(difficulty = 1) {
    await delay(150);
    const availableWords = words.filter(w => 
      w.difficulty === difficulty && !this.usedWords.includes(w.id)
    );
    
    if (availableWords.length === 0) {
      // Reset used words if we've used them all
      this.usedWords = [];
      return this.getRandomWord(difficulty);
    }
    
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    this.usedWords.push(randomWord.id);
    
    return { ...randomWord };
  }

  async getWordsByDifficulty(difficulty) {
    await delay(200);
    return words.filter(w => w.difficulty === difficulty).map(w => ({ ...w }));
  }

  async getDailyChallenge() {
    await delay(250);
    // Use date as seed for daily word
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const wordIndex = seed % words.length;
    
    const dailyWord = { ...words[wordIndex] };
    dailyWord.isDaily = true;
    dailyWord.date = today;
    
    return dailyWord;
  }

  async markWordUsed(wordId) {
    await delay(100);
    if (!this.usedWords.includes(wordId)) {
      this.usedWords.push(wordId);
    }
    return { success: true };
  }

  async resetUsedWords() {
    await delay(100);
    this.usedWords = [];
    return { success: true };
  }

  getUsedWordsCount() {
    return this.usedWords.length;
  }

  async getAll() {
    await delay(200);
    return [...words];
  }

  async getById(id) {
    await delay(200);
    const word = words.find(w => w.id === id);
    return word ? { ...word } : null;
  }

  async create(word) {
    await delay(250);
    const newWord = {
      ...word,
      id: Date.now()
    };
    return { ...newWord };
  }

  async update(id, data) {
    await delay(200);
    const updated = {
      ...data,
      id
    };
    return { ...updated };
  }

  async delete(id) {
    await delay(200);
    return { success: true };
  }
}

export default new WordService();