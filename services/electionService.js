import { Vote } from '../models/Vote.js';
import { Referendum } from '../models/Referendum.js';
import { Voter } from '../models/Voter.js';

/**
 * Get real election insights from database
 */
export const getElectionInsights = async () => {
  try {
    const totalVotes = await Vote.countDocuments();
    const totalVoters = await Voter.countDocuments();
    const votedCount = await Voter.countDocuments({ hasVoted: true });
    const referendumVoted = await Voter.countDocuments({ hasVotedInReferendum: true });

    // Count unique candidates who received votes
    const candidatesWithVotes = await Vote.distinct('candidateId');

    return {
      totalVoters,
      votedCount,
      notVotedCount: totalVoters - votedCount,
      totalVotes,
      candidatesCount: candidatesWithVotes.length,
      referendumParticipation: referendumVoted,
      turnoutPercentage: totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(2) : 0
    };
  } catch (error) {
    console.error('Error getting election insights:', error);
    return {
      totalVoters: 0,
      votedCount: 0,
      notVotedCount: 0,
      totalVotes: 0,
      candidatesCount: 0,
      referendumParticipation: 0,
      turnoutPercentage: 0
    };
  }
};

/**
 * Get candidates with their vote counts from database
 */
export const getCandidates = async () => {
  try {
    // Aggregate votes by candidate
    const voteCounts = await Vote.aggregate([
      {
        $group: {
          _id: '$candidateId',
          name: { $first: '$candidateName' },
          party: { $first: '$party' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Define candidate symbols (static mapping)
    const symbolMap = {
      'candidate1': 'ধানের শীষ',
      'candidate2': 'দাঁড়িপাল্লা',
      'candidate3': 'ধানের শীষ'
    };

    return voteCounts.map(candidate => ({
      id: candidate._id,
      name: candidate.name || 'Unknown',
      party: candidate.party,
      symbol: symbolMap[candidate._id] || 'Unknown',
      votes: candidate.count,
      percentage: 0 // Calculate after getting total
    }));
  } catch (error) {
    console.error('Error getting candidates:', error);
    return [];
  }
};
