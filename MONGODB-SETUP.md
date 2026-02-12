# 🍃 MongoDB Integration Guide

Complete guide for setting up MongoDB with Bangladesh Election Server.

## 📋 Prerequisites

### 1. Install MongoDB

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. Install MongoDB Compass (GUI tool) - optional but recommended

**Or use MongoDB Atlas (Cloud):**
- Free tier available at https://www.mongodb.com/cloud/atlas
- No installation required
- Get connection string from Atlas dashboard

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd bangladesh-election-server
npm install
```

This will install `mongoose` package for MongoDB.

### 2. Configure Environment

Your `.env` file already has:
```env
PORT=5002
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/bangladesh-election
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bangladesh-election
```

### 3. Start MongoDB (Local Only)

**Windows:**
```bash
# MongoDB should auto-start as a service
# Check if running:
netstat -ano | findstr :27017

# Or start manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Using MongoDB Compass:**
- Open MongoDB Compass
- Connect to: `mongodb://localhost:27017`

### 4. Start the Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
📊 Database: bangladesh-election
🌐 Host: localhost
🚀 Server running on http://localhost:5002
💾 MongoDB connected and ready
```

## 📊 Database Structure

### Collections Created

#### 1. **votes** - Stores all cast votes
```javascript
{
  candidateId: "candidate1",
  candidateName: "ধানের শীষ - আওয়ামী লীগ",
  party: "rice",
  nidNumber: "1234567890",
  voterName: "মো: আব্দুল করিম",
  ipAddress: "127.0.0.1",
  timestamp: "2026-02-12T10:30:45.123Z"
}
```

#### 2. **referendums** - Stores referendum votes
```javascript
{
  question: "Do you support digital voting for future elections?",
  vote: "yes",
  nidNumber: "1234567890",
  voterName: "মো: আব্দুল করিম",
  ipAddress: "127.0.0.1",
  timestamp: "2026-02-12T10:30:45.123Z"
}
```

#### 3. **voters** - Stores voter information
```javascript
{
  nidNumber: "1234567890",
  name: "মো: আব্দুল করিম",
  hasVoted: true,
  hasVotedInReferendum: false,
  voteTimestamp: "2026-02-12T10:30:45.123Z",
  referendumTimestamp: null,
  ipAddress: "127.0.0.1",
  nidImagePath: "/uploads/nid-images/nid-123.jpg"
}
```

## 🔍 MongoDB Queries (Using Compass or Mongo Shell)

### View All Votes
```javascript
db.votes.find()
```

### Count Votes by Party
```javascript
db.votes.aggregate([
  { $group: { _id: "$party", count: { $sum: 1 } } }
])
```

### Get Total Vote Count
```javascript
db.votes.countDocuments()
```

### Find All Voters Who Voted
```javascript
db.voters.find({ hasVoted: true })
```

### Referendum Results
```javascript
db.referendums.aggregate([
  { $group: { _id: "$vote", count: { $sum: 1 } } }
])
```

### Clear All Data (Reset)
```javascript
db.votes.deleteMany({})
db.referendums.deleteMany({})
db.voters.deleteMany({})
```

## 🛠️ Troubleshooting

### Error: "MongoDB connection error"

**Solution 1: Check if MongoDB is running**
```bash
# Windows
netstat -ano | findstr :27017

# If not running, start MongoDB service:
net start MongoDB
```

**Solution 2: Check connection string**
- Verify MONGODB_URI in .env file
- For local: `mongodb://localhost:27017/bangladesh-election`
- For Atlas: Get correct string from Atlas dashboard

**Solution 3: Create data directory**
```bash
# Windows
mkdir C:\data\db
```

### Error: "Failed to start server"

Check the console logs for specific error. Common issues:
- MongoDB not running
- Wrong connection string
- Firewall blocking port 27017
- Missing mongoose package (run `npm install`)

### MongoDB Compass Connection Failed

- URL: `mongodb://localhost:27017`
- Make sure MongoDB service is running
- Check Windows Services (services.msc) for "MongoDB"

## 📱 API Endpoints (MongoDB Enabled)

All existing endpoints now use MongoDB:

### POST /api/votes/cast
Stores vote in database, prevents duplicate voting by NID.

### GET /api/votes
Returns real-time vote counts from database.

### POST /api/votes/referendum
Stores referendum vote in database.

### POST /api/nid/verify
Creates voter record in database.

### POST /api/nid/upload
Creates voter record with image path.

## 🎯 Features with MongoDB

✅ **Persistent Data** - All votes saved to database
✅ **Duplicate Prevention** - NID tracking prevents double voting
✅ **Vote History** - Track when each vote was cast
✅ **Analytics** - Aggregate queries for insights
✅ **Backup & Restore** - Easy database backup
✅ **Scalability** - Can handle millions of records

## 💾 Database Backup

### Export Data
```bash
# Export all collections
mongodump --db bangladesh-election --out ./backup

# Export specific collection
mongoexport --db bangladesh-election --collection votes --out votes.json
```

### Import Data
```bash
# Restore from backup
mongorestore --db bangladesh-election ./backup/bangladesh-election

# Import specific collection
mongoimport --db bangladesh-election --collection votes --file votes.json
```

## 🔐 Security (Production)

For production deployment:

1. **Enable Authentication:**
```javascript
MONGODB_URI=mongodb://username:password@localhost:27017/bangladesh-election
```

2. **Use MongoDB Atlas** (Recommended for production)
3. **Enable SSL/TLS**
4. **Whitelist IP addresses**
5. **Use strong passwords**

## 📊 Monitoring

### Check Database Size
```javascript
db.stats()
```

### Index Performance
```javascript
db.votes.getIndexes()
```

### Query Performance
```javascript
db.votes.find({ party: "rice" }).explain("executionStats")
```

---

**MongoDB is now integrated!** All data is stored persistently in the database. 🎉
