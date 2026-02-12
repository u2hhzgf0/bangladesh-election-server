import { Vote } from '../models/Vote.js';
import { Referendum } from '../models/Referendum.js';
import { Voter } from '../models/Voter.js';

/**
 * Get current vote counts from database
 */
export const getVotes = async () => {
  try {
    const votes = await Vote.aggregate([
      {
        $group: {
          _id: '$candidateId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object format
    const voteData = {
      candidate1: 0,
      candidate2: 0,
      candidate3: 0
    };

    votes.forEach(vote => {
      voteData[vote._id] = vote.count;
    });

    voteData.total = voteData.candidate1 + voteData.candidate2 + voteData.candidate3;

    return voteData;
  } catch (error) {
    console.error('Error getting votes:', error);
    return { candidate1: 0, candidate2: 0, candidate3: 0, total: 0 };
  }
};

/**
 * Cast a vote
 */
export const castVote = async (candidateId, nidNumber = null, ipAddress = null) => {
  try {
    // Check if this IP address has already voted
    if (ipAddress) {
      const existingVote = await Vote.findOne({ ipAddress });
      if (existingVote) {
        return {
          success: false,
          message: 'আপনি ইতিমধ্যে ভোট দিয়েছেন'
        };
      }
    }

    // Map candidateId to party
    const candidatePartyMap = {
      'candidate1': 'rice',
      'candidate2': 'scale',
      'candidate3': 'rice'
    };

    const candidateNameMap = {
      'candidate1': 'ধানের শীষ - আওয়ামী লীগ',
      'candidate2': 'দাঁড়িপাল্লা - বিএনপি',
      'candidate3': 'ধানের শীষ - জাতীয় পার্টি'
    };

    if (!candidatePartyMap[candidateId]) {
      return {
        success: false,
        message: 'Invalid candidate ID'
      };
    }

    // Create vote record (nidNumber is now optional)
    const vote = new Vote({
      candidateId,
      candidateName: candidateNameMap[candidateId],
      party: candidatePartyMap[candidateId],
      nidNumber: nidNumber || `IP-${Date.now()}`,
      ipAddress
    });

    await vote.save();

    return {
      success: true,
      message: 'Vote cast successfully',
      data: await getVotes()
    };
  } catch (error) {
    console.error('Error casting vote:', error);
    return {
      success: false,
      message: 'Failed to cast vote'
    };
  }
};

/**
 * Get referendum results
 */
export const getReferendum = async () => {
  try {
    const results = await Referendum.aggregate([
      {
        $group: {
          _id: '$vote',
          count: { $sum: 1 }
        }
      }
    ]);

    const referendumData = {
      question: 'Do you support digital voting for future elections?',
      yes: 0,
      no: 0
    };

    results.forEach(result => {
      referendumData[result._id] = result.count;
    });

    referendumData.total = referendumData.yes + referendumData.no;

    return referendumData;
  } catch (error) {
    console.error('Error getting referendum:', error);
    return {
      question: 'Do you support digital voting for future elections?',
      yes: 0,
      no: 0,
      total: 0
    };
  }
};

/**
 * Submit referendum vote
 */
export const submitReferendum = async (vote, nidNumber, ipAddress = null) => {
  try {
    // Check if voter exists and has already voted in referendum
    let voter = await Voter.findOne({ nidNumber });

    if (voter && voter.hasVotedInReferendum) {
      return {
        success: false,
        message: 'This NID has already voted in the referendum'
      };
    }

    // Validate vote
    if (vote !== 'yes' && vote !== 'no') {
      return {
        success: false,
        message: 'Invalid vote. Must be "yes" or "no"'
      };
    }

    // Create referendum record
    const referendum = new Referendum({
      vote,
      nidNumber,
      voterName: voter?.name,
      ipAddress
    });

    await referendum.save();

    // Update voter record
    if (voter) {
      voter.hasVotedInReferendum = true;
      voter.referendumTimestamp = new Date();
      await voter.save();
    } else {
      // Create new voter record
      voter = new Voter({
        nidNumber,
        name: 'Anonymous Voter',
        hasVotedInReferendum: true,
        referendumTimestamp: new Date(),
        ipAddress
      });
      await voter.save();
    }

    return {
      success: true,
      message: 'Referendum vote submitted successfully',
      data: await getReferendum()
    };
  } catch (error) {
    console.error('Error submitting referendum:', error);
    return {
      success: false,
      message: 'Failed to submit referendum vote'
    };
  }
};

/**
 * Auto-increment votes (for demo purposes)
 * This simulates real-time voting activity
 */
export const startVoteAutoIncrement = (callback) => {
  setInterval(async () => {
    try {
      // Generate random vote
      const candidates = ['candidate1', 'candidate2', 'candidate3'];
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      const randomNID = `AUTO-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      // Cast auto vote
      await castVote(randomCandidate, randomNID, '127.0.0.1');

      // Also submit random referendum vote
      if (Math.random() > 0.5) {
        const randomReferendumNID = `REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const randomVote = Math.random() > 0.5 ? 'yes' : 'no';
        await submitReferendum(randomVote, randomReferendumNID, '127.0.0.1');
      }

      // Get updated vote counts
      const votes = await getVotes();

      if (callback) {
        callback(votes);
      }
    } catch (error) {
      console.error('Auto-increment error:', error);
    }
  }, 5000); // Every 5 seconds
};
