import express from 'express';
import {
  getCurrentVotes,
  submitVote,
  getReferendumStatus,
  submitReferendumVote,
  getElectionCountdown
} from '../controllers/voteController.js';

const router = express.Router();

// Get current vote counts
router.get('/', getCurrentVotes);

// Cast a vote
router.post('/', submitVote);

// Get referendum status
router.get('/referendum', getReferendumStatus);

// Submit referendum vote
router.post('/referendum', submitReferendumVote);

// Get election countdown
router.get('/countdown', getElectionCountdown);

export default router;
