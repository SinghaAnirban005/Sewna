import Designer from '../models/Designer.js';
import { EmbeddingService } from './embeddingService.js';
import { MatchResult } from '../types/index.js';

export class DesignerService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  async findMatchingDesigners(userDescription: string, limit: number = 3): Promise<MatchResult[]> {
    try {
      console.log('Generating embedding for user description:', userDescription);
      
      const userEmbedding = await this.embeddingService.generateEmbedding(userDescription);
      console.log(`User embedding dimension: ${userEmbedding.length}`);

      const designers = await Designer.find({}).exec();
      console.log(`Found ${designers.length} designers in database`);

      const matches: MatchResult[] = [];
      
      for (const designer of designers) {
        const similarity = this.embeddingService.cosineSimilarity(userEmbedding, designer.embedding);
        console.log(`Similarity with ${designer.name}: ${(similarity * 100).toFixed(1)}%`);
        
        matches.push({
          designer,
          similarity
        });
      }

      const sortedMatches = matches.sort((a, b) => b.similarity - a.similarity);
      const topMatches = sortedMatches.slice(0, limit);

      console.log('Top matches:');
      topMatches.forEach((match, index) => {
        console.log(`${index + 1}. ${match.designer.name}: ${(match.similarity * 100).toFixed(1)}%`);
      });

      return topMatches;
    } catch (error) {
      console.error('Error in findMatchingDesigners:', error);
      throw error;
    }
  }

  async initializeSampleDesigners(): Promise<void> {
    const sampleDesigners = [
      {
        name: "Emma Richardson",
        bio: "Sustainable fashion designer with 8 years of experience creating eco-friendly clothing lines. Specializes in upcycled materials and zero-waste patterns.",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        styles: ["Sustainable", "Bohemian", "Minimalist"],
        // Pre-computed semantic focus: Strong sustainable, moderate bohemian, moderate minimalist
        embeddingWeights: { sustainable: 0.9, bohemian: 0.6, minimalist: 0.7 }
      },
      {
        name: "Marcus Chen",
        bio: "Avant-garde designer pushing boundaries with futuristic silhouettes and innovative textiles. Known for bold statements and architectural designs.",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        styles: ["Avant-garde", "Futuristic", "Architectural"],
        embeddingWeights: { 'avant-garde': 0.9, futuristic: 0.8, architectural: 0.7 }
      },
      {
        name: "Sophie Laurent",
        bio: "Parisian-inspired designer creating romantic, feminine pieces with delicate details and vintage influences.",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        styles: ["Romantic", "Vintage", "Feminine", "Pastel"],
        embeddingWeights: { romantic: 0.8, vintage: 0.7, feminine: 0.8, pastel: 0.6 }
      },
      {
        name: "David Park",
        bio: "Streetwear specialist blending urban aesthetics with high fashion elements. Focus on comfort, functionality, and cultural relevance.",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        styles: ["Streetwear", "Urban", "Contemporary"],
        embeddingWeights: { streetwear: 0.9, urban: 0.8, contemporary: 0.6 }
      },
      {
        name: "Isabella Rossi",
        bio: "Luxury evening wear designer creating exquisite gowns and formal attire with Italian craftsmanship and attention to detail.",
        profileImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
        styles: ["Luxury", "Evening Wear", "Formal", "Elegant"],
        embeddingWeights: { luxury: 0.9, formal: 0.8, elegant: 0.7 }
      },
      {
        name: "Alex Thompson",
        bio: "Minimalist designer focused on clean lines, neutral palettes, and timeless pieces that transcend seasonal trends.",
        profileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
        styles: ["Minimalist", "Sustainable", "Neutral", "Timeless"],
        embeddingWeights: { minimalist: 0.8, sustainable: 0.7, neutral: 0.6, timeless: 0.5 }
      }
    ];

    const existingCount = await Designer.countDocuments();
    if (existingCount === 0) {
      console.log('Initializing sample designers with semantic embeddings...');
      
      for (const designerData of sampleDesigners) {
        try {
          const embedding = this.generateDesignerEmbedding(designerData);
          
          await Designer.create({
            name: designerData.name,
            bio: designerData.bio,
            profileImage: designerData.profileImage,
            styles: designerData.styles,
            embedding
          });
          
          console.log(`Created designer: ${designerData.name}`);
        } catch (error) {
          console.error(`Failed to create designer ${designerData.name}:`, error);
        }
      }
      console.log('Sample designers creation completed!');
    } else {
      console.log(`Database already contains ${existingCount} designers. Skipping initialization.`);
    }
  }

  private generateDesignerEmbedding(designerData: any): number[] {
    const embedding: number[] = new Array(50).fill(0.1); // Base noise
    
    if (designerData.embeddingWeights) {
      const weights = designerData.embeddingWeights;
      
      // Sustainable/Minimalist cluster
      if (weights.sustainable || weights.minimalist) {
        const base = (weights.sustainable || 0) + (weights.minimalist || 0);
        for (let i = 0; i < 10; i++) {
          //@ts-ignore
          embedding[i] += base * 0.8;
        }
      }

      // Bohemian/Romantic cluster
      if (weights.bohemian || weights.romantic || weights.feminine) {
        const base = (weights.bohemian || 0) + (weights.romantic || 0) + (weights.feminine || 0);
        for (let i = 10; i < 20; i++) {
          //@ts-ignore
          embedding[i] += base * 0.7;
        }
      }

      // Avant-garde/Futuristic cluster
      if (weights['avant-garde'] || weights.futuristic) {
        const base = (weights['avant-garde'] || 0) + (weights.futuristic || 0);
        for (let i = 20; i < 30; i++) {
          //@ts-ignore
          embedding[i] += base * 0.9;
        }
      }

      // Streetwear/Urban cluster
      if (weights.streetwear || weights.urban) {
        const base = (weights.streetwear || 0) + (weights.urban || 0);
        for (let i = 30; i < 40; i++) {
          //@ts-ignore
          embedding[i] += base * 0.8;
        }
      }

      // Luxury/Formal cluster
      if (weights.luxury || weights.formal || weights.elegant) {
        const base = (weights.luxury || 0) + (weights.formal || 0) + (weights.elegant || 0);
        for (let i = 40; i < 50; i++) {
          //@ts-ignore
          embedding[i] += base * 0.85;
        }
      }
    }

    let hash = 0;
    for (let i = 0; i < designerData.name.length; i++) {
      hash = ((hash << 5) - hash) + designerData.name.charCodeAt(i);
      hash = hash & hash;
    }

    for (let i = 0; i < embedding.length; i++) {
      const seed = (hash + i) * 9301 + 49297;
      const noise = (Math.sin(seed) * 0.05);
      //@ts-ignore
      embedding[i] += noise;
    }

    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / norm);
  }

  async resetDesigners(): Promise<void> {
    await Designer.deleteMany({});
    console.log('All designers deleted. Reinitializing...');
    await this.initializeSampleDesigners();
  }
}