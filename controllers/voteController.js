import { getVotes, castVote, getReferendum, submitReferendum } from '../services/voteService.js';
import { getCountdown } from '../services/countdownService.js';
import { io } from '../index.js';

export const getCurrentVotes = async (req, res) => {
  try {
    const votes = await getVotes();
    res.json({
      success: true,
      data: votes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const submitVote = async (req, res) => {
  try {
    const { party } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!party) {
      return res.status(400).json({
        success: false,
        message: 'Party is required'
      });
    }

    // Map party to candidateId
    const partyToCandidateMap = {
      'rice': 'candidate1',
      'scale': 'candidate2'
    };

    const candidateId = partyToCandidateMap[party.toLowerCase()];

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid party. Must be "rice" or "scale"'
      });
    }

    // Generate random NID for demo (in real app, this would come from NID verification)
    const nidNumber = `VOTE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const result = await castVote(candidateId, nidNumber, ipAddress);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Emit vote update via Socket.io
    const votes = await getVotes();
    io.emit('votes', votes);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getReferendumStatus = async (req, res) => {
  try {
    const referendum = await getReferendum();
    res.json({
      success: true,
      data: referendum
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const submitReferendumVote = async (req, res) => {
  try {
    const { vote } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!vote) {
      return res.status(400).json({
        success: false,
        message: 'Vote is required'
      });
    }

    if (!['yes', 'no'].includes(vote.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Vote must be either "yes" or "no"'
      });
    }

    // Generate random NID for demo
    const nidNumber = `REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const result = await submitReferendum(vote.toLowerCase(), nidNumber, ipAddress);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getElectionCountdown = (req, res) => {
  try {
    const countdown = getCountdown();
    res.json({
      success: true,
      data: countdown
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
