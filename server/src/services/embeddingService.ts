import axios from 'axios';

const STYLE_VECTORS: { [key: string]: number } = {
  'sustainable': 0.9, 'eco-friendly': 0.9, 'upcycled': 0.85,
  'bohemian': 0.8, 'boho': 0.8, 'flowy': 0.7,
  'minimalist': 0.7, 'minimal': 0.7, 'clean': 0.65, 'simple': 0.6,
  'avant-garde': 0.9, 'futuristic': 0.85, 'architectural': 0.8, 'bold': 0.75,
  'romantic': 0.8, 'feminine': 0.75, 'delicate': 0.7, 'vintage': 0.8,
  'streetwear': 0.9, 'urban': 0.85, 'contemporary': 0.7, 'casual': 0.6,
  'luxury': 0.9, 'elegant': 0.8, 'formal': 0.85, 'evening': 0.8,
  'pastel': 0.7, 'neutral': 0.6, 'timeless': 0.65
};

export class EmbeddingService {
  private jinaApiUrl: string;
  private jinaApiKey: string;
  private readonly EMBEDDING_DIMENSION = 50;

  constructor() {
    this.jinaApiUrl = process.env.JINA_API_URL || 'https://api.jina.ai/v1/embeddings';
    this.jinaApiKey = process.env.JINA_API_KEY || '';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.jinaApiKey) {
        return this.generateSemanticEmbedding(text.toLowerCase());
      }

      const response = await axios.post(
        this.jinaApiUrl,
        {
          input: [text],
          model: 'jina-embeddings-v2-base-en'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.jinaApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const embedding = response.data.data[0].embedding;
      return this.normalizeEmbeddingDimension(embedding);
    } catch (error) {
      console.warn('Jina AI API failed, using semantic mock embedding:', error);
      return this.generateSemanticEmbedding(text.toLowerCase());
    }
  }


  private generateSemanticEmbedding(text: string): number[] {
    const embedding: number[] = new Array(this.EMBEDDING_DIMENSION).fill(0.1); // Base noise
    
    const styleScores: { [key: string]: number } = {};
    
    Object.keys(STYLE_VECTORS).forEach(style => {
      if (text.includes(style)) {
        // Increase score based on how central the keyword is
        const baseScore = STYLE_VECTORS[style];
        const count = (text.match(new RegExp(style, 'g')) || []).length;
        //@ts-ignore
        styleScores[style] = baseScore * (1 + count * 0.2);
      }
    });

    this.applyStyleToEmbedding(embedding, styleScores, text);

    this.addTextBasedNoise(embedding, text);
    
    return this.normalizeVector(embedding);
  }

  private applyStyleToEmbedding(
    embedding: number[], 
    styleScores: { [key: string]: number },
    text: string
  ): void {
    // Sustainable/Minimalist cluster (dimensions 0-9)
    if (styleScores['sustainable'] || styleScores['minimalist'] || text.includes('eco')) {
      const base = (styleScores['sustainable'] || 0) + (styleScores['minimalist'] || 0);
      for (let i = 0; i < 10; i++) {
        //@ts-ignore
        embedding[i] += base * 0.8;
      }
    }

    // Bohemian/Romantic cluster (dimensions 10-19)
    if (styleScores['bohemian'] || styleScores['romantic'] || styleScores['feminine']) {
      const base = (styleScores['bohemian'] || 0) + (styleScores['romantic'] || 0);
      for (let i = 10; i < 20; i++) {
        //@ts-ignore
        embedding[i] += base * 0.7;
      }
    }

    // Avant-garde/Futuristic cluster (dimensions 20-29)
    if (styleScores['avant-garde'] || styleScores['futuristic'] || text.includes('bold')) {
      const base = (styleScores['avant-garde'] || 0) + (styleScores['futuristic'] || 0);
      for (let i = 20; i < 30; i++) {
        //@ts-ignore
        embedding[i] += base * 0.9;
      }
    }

    // Streetwear/Urban cluster (dimensions 30-39)
    if (styleScores['streetwear'] || styleScores['urban'] || text.includes('casual')) {
      const base = (styleScores['streetwear'] || 0) + (styleScores['urban'] || 0);
      for (let i = 30; i < 40; i++) {
        //@ts-ignore
        embedding[i] += base * 0.8;
      }
    }

    // Luxury/Formal cluster (dimensions 40-49)
    if (styleScores['luxury'] || styleScores['formal'] || styleScores['elegant']) {
      const base = (styleScores['luxury'] || 0) + (styleScores['formal'] || 0);
      for (let i = 40; i < 50; i++) {
        //@ts-ignore
        embedding[i] += base * 0.85;
      }
    }
  }

  private addTextBasedNoise(embedding: number[], text: string): void {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }

    for (let i = 0; i < embedding.length; i++) {
      const seed = (hash + i) * 9301 + 49297;
      const noise = (Math.sin(seed) * 0.1);
      //@ts-ignore
      embedding[i] += noise;
    }
  }

  private normalizeVector(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;
    return vector.map(val => val / norm);
  }

  private normalizeEmbeddingDimension(embedding: number[]): number[] {
    const normalized = [...embedding];
    
    if (normalized.length > this.EMBEDDING_DIMENSION) {
      return normalized.slice(0, this.EMBEDDING_DIMENSION);
    }
    
    while (normalized.length < this.EMBEDDING_DIMENSION) {
      normalized.push(0);
    }
    
    return this.normalizeVector(normalized);
  }

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    const normalizedVecA = this.normalizeEmbeddingDimension(vecA);
    const normalizedVecB = this.normalizeEmbeddingDimension(vecB);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < this.EMBEDDING_DIMENSION; i++) {
      //@ts-ignore
      dotProduct += normalizedVecA[i] * normalizedVecB[i];
      //@ts-ignore
      normA += normalizedVecA[i] * normalizedVecA[i];
      //@ts-ignore
      normB += normalizedVecB[i] * normalizedVecB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    
    return Math.max(0, Math.min(1, similarity * 1.2));
  }
}