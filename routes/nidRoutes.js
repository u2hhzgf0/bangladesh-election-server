import express from 'express';
import {
  verifyNidWithBase64,
  verifyNidWithUpload,
  getAllVotersController,
  getVoterStatsController
} from '../controllers/nidController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Verify NID with base64 image (for camera capture)
router.post('/verify', verifyNidWithBase64);

// Verify NID with file upload (Multer)
router.post('/upload', upload.single('nidImage'), verifyNidWithUpload);

// Get all voters
router.get('/voters', getAllVotersController);

// Get voter statistics
router.get('/voters/stats', getVoterStatsController);

export default router;
