import express from 'express';
import { DesignerService } from '../services/designerService.js';
import { ApiResponse } from '../types/index.js';
import Designer from '../models/Designer.js';

const router = express.Router();
const designerService = new DesignerService();

router.post('/match', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Description is required and must be a string'
      };
      return res.status(400).json(response);
    }

    const matches = await designerService.findMatchingDesigners(description, 3);

    const formattedMatches = matches.map(match => ({
      designer: {
        name: match.designer.name,
        bio: match.designer.bio,
        profileImage: match.designer.profileImage,
        styles: match.designer.styles
      },
      similarity: Math.round(match.similarity * 100)
    }));

    const response: ApiResponse<typeof formattedMatches> = {
      success: true,
      data: formattedMatches
    };

    res.json(response);
  } catch (error) {
    console.error('Error in designer matching:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

router.get('/designers', async (req, res) => {
  try {
    const designers = await Designer.find({}, { embedding: 0 }).exec();

    const response: ApiResponse<typeof designers> = {
      success: true,
      data: designers
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching designers:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

export default router;