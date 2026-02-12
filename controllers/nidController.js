import { verifyNidBase64, verifyNidFile, getAllVoters, getVoterStats } from '../services/nidService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyNidWithBase64 = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const result = await verifyNidBase64(image);

    // Wrap result in data property for consistency with other endpoints
    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyNidWithUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'NID image file is required'
      });
    }

    const result = await verifyNidFile(req.file);

    // Wrap result in data property for consistency with other endpoints
    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllVotersController = async (req, res) => {
  try {
    const voters = await getAllVoters();
    res.json({
      success: true,
      data: voters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getVoterStatsController = async (req, res) => {
  try {
    const stats = await getVoterStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
