import 'dotenv/config';
import mongoose from 'mongoose';
import { Vote } from '../models/Vote.js';
import { Referendum } from '../models/Referendum.js';
import { Voter } from '../models/Voter.js';

const clearDatabase = async () => {
  try {
    console.log('🗑️  Connecting to MongoDB...');

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bangladesh-election';
    await mongoose.connect(mongoURI);

    console.log('✅ Connected to MongoDB');
    console.log('');

    // Count before deletion
    const votesCount = await Vote.countDocuments();
    const referendumsCount = await Referendum.countDocuments();
    const votersCount = await Voter.countDocuments();

    console.log('📊 Current Database Status:');
    console.log(`   Votes: ${votesCount}`);
    console.log(`   Referendums: ${referendumsCount}`);
    console.log(`   Voters: ${votersCount}`);
    console.log('');

    if (votesCount === 0 && referendumsCount === 0 && votersCount === 0) {
      console.log('✨ Database is already empty!');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('🗑️  Clearing all collections...');
    console.log('');

    // Delete all data
    await Vote.deleteMany({});
    console.log('✅ Cleared votes collection');

    await Referendum.deleteMany({});
    console.log('✅ Cleared referendums collection');

    await Voter.deleteMany({});
    console.log('✅ Cleared voters collection');

    console.log('');
    console.log('✨ Database cleared successfully!');
    console.log('');
    console.log('📊 Final Status:');
    console.log(`   Votes: 0`);
    console.log(`   Referendums: 0`);
    console.log(`   Voters: 0`);
    console.log('');
    console.log('🎯 Database is now empty and ready for fresh data!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
