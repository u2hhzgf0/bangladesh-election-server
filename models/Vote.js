import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    required: true,
    enum: ['candidate1', 'candidate2', 'candidate3']
  },
  candidateName: {
    type: String,
    required: true
  },
  party: {
    type: String,
    required: true,
    enum: ['rice', 'scale']
  },
  nidNumber: {
    type: String,
    required: true
  },
  voterName: {
    type: String
  },
  ipAddress: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
voteSchema.index({ candidateId: 1 });
voteSchema.index({ party: 1 });
voteSchema.index({ nidNumber: 1 });
voteSchema.index({ timestamp: -1 });

export const Vote = mongoose.model('Vote', voteSchema);
