import { getElectionInsights, getCandidates } from '../services/electionService.js';

export const getInsights = async (req, res) => {
  try {
    const insights = await getElectionInsights();
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await getCandidates();
    res.json({
      success: true,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidates = await getCandidates();
    const candidate = candidates.find(c => c.id === id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
