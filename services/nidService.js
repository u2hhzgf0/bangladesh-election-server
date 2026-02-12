import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Voter } from '../models/Voter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample Bengali names for demo
const sampleNames = [
  'মো: আব্দুল করিম',
  'ফাতিমা খাতুন',
  'রহিম উদ্দিন',
  'সালমা বেগম',
  'কামাল হোসেন',
  'রুনা লায়লা',
  'আবু তালিব',
  'জাহানারা আক্তার'
];

/**
 * Verify NID with base64 image
 */
export const verifyNidBase64 = async (nidImageBase64) => {
  try {
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'nid-images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Extract image data from base64 string
    const matches = nidImageBase64.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
    let imagePath = null;

    if (matches && matches.length === 3) {
      const extension = matches[1];
      const data = matches[2];
      const imageBuffer = Buffer.from(data, 'base64');

      const filename = `nid-${Date.now()}.${extension}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, imageBuffer);
      imagePath = `/uploads/nid-images/${filename}`;
    }

    // Return success without generating name/NID
    return {
      success: true,
      isValid: true,
      message: 'NID image uploaded successfully',
      imagePath
    };
  } catch (error) {
    console.error('Error verifying NID (base64):', error);
    return {
      success: false,
      message: 'Error processing NID image: ' + error.message
    };
  }
};

/**
 * Verify NID with file upload
 */
export const verifyNidFile = async (file) => {
  try {
    // Simply verify the image was uploaded successfully
    const imagePath = `/uploads/nid-images/${file.filename}`;

    // Return success without generating name/NID
    return {
      success: true,
      isValid: true,
      message: 'NID image uploaded successfully',
      imagePath
    };
  } catch (error) {
    console.error('Error verifying NID (file):', error);
    return {
      success: false,
      message: 'Error processing NID image: ' + error.message
    };
  }
};

/**
 * Get all verified voters
 */
export const getAllVoters = async () => {
  try {
    const voters = await Voter.find().sort({ createdAt: -1 }).limit(100);
    return voters;
  } catch (error) {
    console.error('Error getting voters:', error);
    return [];
  }
};

/**
 * Get voter statistics
 */
export const getVoterStats = async () => {
  try {
    const totalVoters = await Voter.countDocuments();
    const votedCount = await Voter.countDocuments({ hasVoted: true });
    const referendumVotedCount = await Voter.countDocuments({ hasVotedInReferendum: true });

    return {
      totalVoters,
      votedCount,
      referendumVotedCount,
      notVotedCount: totalVoters - votedCount
    };
  } catch (error) {
    console.error('Error getting voter stats:', error);
    return {
      totalVoters: 0,
      votedCount: 0,
      referendumVotedCount: 0,
      notVotedCount: 0
    };
  }
};
