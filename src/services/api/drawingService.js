import drawings from '../mockData/drawings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DrawingService {
  constructor() {
    this.currentDrawing = null;
  }

  async startDrawing(wordId) {
    await delay(100);
    this.currentDrawing = {
      id: Date.now(),
      strokes: [],
      wordId,
      timestamp: Date.now(),
      completed: false
    };
    return { ...this.currentDrawing };
  }

  async addStroke(stroke) {
    if (!this.currentDrawing) {
      throw new Error('No active drawing');
    }
    
    this.currentDrawing.strokes.push({
      id: Date.now(),
      points: stroke.points,
      color: stroke.color || '#FF6B6B',  
      size: stroke.size || 4,
      timestamp: Date.now()
    });
    
    return { ...this.currentDrawing };
  }

  async undoLastStroke() {
    await delay(50);
    if (!this.currentDrawing || this.currentDrawing.strokes.length === 0) {
      return this.currentDrawing ? { ...this.currentDrawing } : null;
    }
    
    this.currentDrawing.strokes.pop();
    return { ...this.currentDrawing };
  }

  async clearDrawing() {
    await delay(100);
    if (!this.currentDrawing) {
      return null;
    }
    
    this.currentDrawing.strokes = [];
    return { ...this.currentDrawing };
  }

  async completeDrawing() {
    await delay(150);
    if (!this.currentDrawing) {
      throw new Error('No active drawing');
    }
    
    this.currentDrawing.completed = true;
    this.currentDrawing.completedAt = Date.now();
    
    return { ...this.currentDrawing };
  }

  getCurrentDrawing() {
    return this.currentDrawing ? { ...this.currentDrawing } : null;
  }

  async getAll() {
    await delay(200);
    return [...drawings];
  }

  async getById(id) {
    await delay(200);
    const drawing = drawings.find(d => d.id === id);
    return drawing ? { ...drawing } : null;
  }

  async create(drawing) {
    await delay(250);
    const newDrawing = {
      ...drawing,
      id: Date.now(),
      timestamp: Date.now()
    };
    return { ...newDrawing };
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

export default new DrawingService();