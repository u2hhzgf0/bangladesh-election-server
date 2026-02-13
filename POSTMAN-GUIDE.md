# 📮 Postman API Testing Guide

Complete guide for testing Bangladesh Election 2026 API with Postman.

## 🚀 Quick Start

### 1. Import Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select `Bangladesh-Election-API.postman_collection.json`
4. Collection will appear in your sidebar

### 2. Start the Server
```bash
cd bangladesh-election-server
npm run dev
```

Server should be running on: `https://votapi.wixford.com`

## 📋 API Endpoints

### 🗳️ **Voting Endpoints** (Most Important!)

#### Cast Vote for Rice (ধানের শীষ)
```http
POST https://votapi.wixford.com/api/votes/cast
Content-Type: application/json

{
  "party": "rice"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote cast successfully",
  "data": {
    "candidate1": 152,
    "candidate2": 120,
    "candidate3": 95,
    "total": 367
  }
}
```

#### Cast Vote for Scale (দাঁড়িপাল্লা)
```http
POST https://votapi.wixford.com/api/votes/cast
Content-Type: application/json

{
  "party": "scale"
}
```

#### Get Current Vote Results
```http
GET https://votapi.wixford.com/api/votes
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate1": 152,
    "candidate2": 120,
    "candidate3": 95,
    "total": 367
  }
}
```

### 📊 Referendum Endpoints

#### Submit Referendum Vote (YES)
```http
POST https://votapi.wixford.com/api/votes/referendum
Content-Type: application/json

{
  "vote": "yes"
}
```

#### Submit Referendum Vote (NO)
```http
POST https://votapi.wixford.com/api/votes/referendum
Content-Type: application/json

{
  "vote": "no"
}
```

#### Get Referendum Results
```http
GET https://votapi.wixford.com/api/votes/referendum
```

### 🪪 NID Verification Endpoints

#### Verify NID with Base64 Image
```http
POST https://votapi.wixford.com/api/nid/verify
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "name": "মো: আব্দুল করিম",
    "nidNumber": "1234567890"
  }
}
```

#### Verify NID with File Upload
```http
POST https://votapi.wixford.com/api/nid/upload
Content-Type: multipart/form-data

Key: nidImage
Value: [Select Image File]
```

### 📈 Election Data Endpoints

#### Get Election Insights
```http
GET https://votapi.wixford.com/api/elections/insights
```

#### Get Candidates List
```http
GET https://votapi.wixford.com/api/elections/candidates
```

#### Get Countdown Timer
```http
GET https://votapi.wixford.com/api/elections/countdown
```

## 🧪 Testing Workflow

### Test Voting Flow (Complete)

1. **Check Server Health**
   - Request: `GET /`
   - Should return server info

2. **Get Initial Vote Counts**
   - Request: `GET /api/votes`
   - Note the current totals

3. **Cast Vote for Rice**
   - Request: `POST /api/votes/cast`
   - Body: `{"party": "rice"}`
   - Response should show increased rice votes

4. **Verify Vote Counted**
   - Request: `GET /api/votes`
   - Check that rice votes increased

5. **Cast Vote for Scale**
   - Request: `POST /api/votes/cast`
   - Body: `{"party": "scale"}`
   - Response should show increased scale votes

6. **Get Final Results**
   - Request: `GET /api/votes`
   - Confirm both votes were counted

### Test NID Verification

1. **Using File Upload** (Easier)
   - Open: `POST /api/nid/upload`
   - Body: Form-data
   - Key: `nidImage`
   - Value: Select any image file
   - Send request

2. **Check Response**
   - Should return mock NID data with random name

## 📝 What You'll See in Server Console

When you send requests, the server logs will show:

```
================================================================================
📥 [2026-02-12T10:32:20.789Z] POST /api/votes/cast
🌐 IP: ::1
📦 Request Body: {
  "party": "rice"
}
📤 Response Status: 200
📋 Response: {"success":true,"data":{...}}
================================================================================
```

## 🎯 Testing Checklist

- [ ] Server starts without errors
- [ ] GET `/` returns server info
- [ ] GET `/api/votes` returns vote counts
- [ ] POST `/api/votes/cast` with "rice" works
- [ ] POST `/api/votes/cast` with "scale" works
- [ ] GET `/api/votes/referendum` returns referendum data
- [ ] POST `/api/votes/referendum` with "yes" works
- [ ] POST `/api/votes/referendum` with "no" works
- [ ] POST `/api/nid/upload` with image file works
- [ ] GET `/api/elections/insights` returns insights
- [ ] GET `/api/elections/candidates` returns candidates
- [ ] GET `/api/elections/countdown` returns countdown

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :5002

# Kill it
taskkill /PID <PID> /F
```

### Server Not Running
```bash
cd bangladesh-election-server
npm run dev
```

### 404 Not Found
- Check server is running on port 5002
- Verify URL: `https://votapi.wixford.com`
- Check endpoint path is correct

### CORS Error
- Server should accept requests from any origin
- If issues persist, check `.env` file

## 📊 Expected Responses

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🎉 You're Ready!

Import the collection and start testing your Bangladesh Election 2026 API!

---

**Collection File:** `Bangladesh-Election-API.postman_collection.json`
**Server URL:** `https://votapi.wixford.com`
**Documentation:** See `LOGGING-GUIDE.md` for server logs
