import mongoose from 'mongoose';

const referendumSchema = new mongoose.Schema({
  question: {
    type: String,
    default: 'Do you support digital voting for future elections?'
  },
  vote: {
    type: String,
    required: true,
    enum: ['yes', 'no']
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
referendumSchema.index({ vote: 1 });
referendumSchema.index({ nidNumber: 1 });
referendumSchema.index({ timestamp: -1 });

export const Referendum = mongoose.model('Referendum', referendumSchema);
