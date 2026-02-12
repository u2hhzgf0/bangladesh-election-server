import express from 'express';
import { getInsights, getAllCandidates, getCandidateById } from '../controllers/electionController.js';

const router = express.Router();

// Get election insights
router.get('/insights', getInsights);

// Get all candidates
router.get('/candidates', getAllCandidates);

// Get candidate by ID
router.get('/candidates/:id', getCandidateById);

export default router;
