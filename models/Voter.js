import mongoose from 'mongoose';

const voterSchema = new mongoose.Schema({
  nidNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  hasVotedInReferendum: {
    type: Boolean,
    default: false
  },
  voteTimestamp: {
    type: Date
  },
  referendumTimestamp: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  nidImagePath: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for faster lookups (nidNumber already has unique index)
voterSchema.index({ hasVoted: 1 });
voterSchema.index({ hasVotedInReferendum: 1 });

export const Voter = mongoose.model('Voter', voterSchema);
