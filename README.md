# Bangladesh Election Server API

A comprehensive Node.js/Express server for the Bangladesh Election system with real-time vote updates, countdown functionality, and NID verification.

## Features

- **Real-time Vote Updates**: Socket.io integration for live vote counting
- **Countdown Timer**: Real-time countdown to January 5, 2026 election date
- **NID Verification**: Support for both base64 and file upload (Multer)
- **Auto-increment Votes**: Votes automatically increment every 5 seconds for simulation
- **Referendum System**: Digital voting referendum with yes/no votes
- **Election Insights**: Comprehensive election statistics and candidate information
- **REST API**: Complete RESTful API with organized routes

## Tech Stack

- Node.js with ES6 modules
- Express.js
- Socket.io for real-time updates
- Multer for file uploads
- CORS enabled

## Installation

```bash
npm install
```

### Dependencies

```bash
npm install express cors socket.io multer
```

## Project Structure

```
bangladesh-election-server/
├── index.js                          # Main server file
├── controllers/
│   ├── electionController.js         # Election insights & candidates
│   ├── voteController.js             # Vote casting & referendum
│   └── nidController.js              # NID verification
├── routes/
│   ├── electionRoutes.js             # Election API routes
│   ├── voteRoutes.js                 # Vote API routes
│   └── nidRoutes.js                  # NID API routes
├── services/
│   ├── electionService.js            # Election data logic
│   ├── voteService.js                # Vote counting logic
│   ├── countdownService.js           # Countdown calculation
│   └── nidService.js                 # NID verification logic
├── middleware/
│   └── upload.js                     # Multer configuration
├── uploads/
│   └── nid-images/                   # Uploaded NID images
└── README.md
```

## Running the Server

```bash
node index.js
```

Server will start on port 5000 (or PORT from environment variables).

## API Endpoints

### Election Endpoints

#### Get Election Insights
```http
GET /api/elections/insights
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVoters": 120000000,
    "registeredVoters": 95000000,
    "pollingStations": 42000,
    "candidates": 15,
    "politicalParties": 8,
    "electionDate": "2026-01-05",
    "votingStartTime": "08:00",
    "votingEndTime": "16:00"
  }
}
```

#### Get All Candidates
```http
GET /api/elections/candidates
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dr. Mohammed Rahman",
      "party": "Bangladesh Progressive Alliance",
      "symbol": "boat",
      "age": 58,
      "education": "PhD in Economics",
      "experience": "25 years in public service",
      "manifesto": "Economic growth, education reform, healthcare accessibility"
    }
  ]
}
```

#### Get Candidate by ID
```http
GET /api/elections/candidates/:id
```

### Vote Endpoints

#### Get Current Votes
```http
GET /api/votes
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate1": 150,
    "candidate2": 120,
    "candidate3": 95,
    "total": 365
  }
}
```

#### Cast Vote
```http
POST /api/votes
Content-Type: application/json

{
  "candidateId": "candidate1",
  "nidNumber": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote cast successfully",
  "data": {
    "candidate1": 151,
    "candidate2": 120,
    "candidate3": 95,
    "total": 366
  }
}
```

#### Get Referendum Status
```http
GET /api/votes/referendum
```

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "Do you support digital voting for future elections?",
    "yes": 180,
    "no": 95,
    "total": 275
  }
}
```

#### Submit Referendum Vote
```http
POST /api/votes/referendum
Content-Type: application/json

{
  "vote": "yes",
  "nidNumber": "1234567890"
}
```

#### Get Election Countdown
```http
GET /api/votes/countdown
```

**Response:**
```json
{
  "success": true,
  "data": {
    "days": 327,
    "hours": 15,
    "minutes": 42,
    "seconds": 30,
    "message": "Time until election: 327d 15h 42m 30s",
    "isElectionDay": false,
    "electionDate": "2026-01-05T00:00:00.000Z"
  }
}
```

### NID Verification Endpoints

#### Verify NID with Base64 Image
```http
POST /api/nid/verify
Content-Type: application/json

{
  "nidNumber": "1234567890",
  "nidImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "NID verified successfully",
  "data": {
    "nidNumber": "1234567890",
    "imagePath": "/uploads/nid-images/nid-1234567890-1234567890.jpeg",
    "verifiedAt": "2026-02-12T10:30:00.000Z",
    "method": "base64"
  }
}
```

#### Verify NID with File Upload
```http
POST /api/nid/verify-upload
Content-Type: multipart/form-data

nidNumber: 1234567890
nidImage: [binary file data]
```

**Response:**
```json
{
  "success": true,
  "message": "NID verified successfully",
  "data": {
    "nidNumber": "1234567890",
    "imagePath": "/uploads/nid-images/nid-1234567890-1234567890.jpeg",
    "verifiedAt": "2026-02-12T10:30:00.000Z",
    "method": "upload",
    "fileSize": 245678,
    "mimeType": "image/jpeg"
  }
}
```

#### Get All NID Images
```http
GET /api/nid/images
```

#### Get NID Image by Number
```http
GET /api/nid/images/:nidNumber
```

## Socket.io Real-time Events

### Connect to Socket.io

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5002');
```

### Events

#### Votes Update
```javascript
socket.on('votes', (data) => {
  console.log('Vote update:', data);
  // { candidate1: 150, candidate2: 120, candidate3: 95, total: 365 }
});
```

#### Countdown Update
```javascript
socket.on('countdown', (data) => {
  console.log('Countdown update:', data);
  // { days: 327, hours: 15, minutes: 42, seconds: 30, ... }
});
```

## File Upload Configuration

- **Max file size**: 10MB
- **Allowed formats**: JPEG, PNG, GIF, WebP
- **Upload directory**: `uploads/nid-images/`
- **File naming**: `nid-{timestamp}-{random}.{ext}`

## Valid NID Numbers (Demo)

For testing purposes, use these NID numbers:
- 1234567890
- 9876543210
- 1111111111
- 2222222222
- 3333333333

## Auto-increment Feature

Votes automatically increment every 5 seconds for simulation:
- Random candidate gets 1-3 votes
- Referendum gets 1-2 votes randomly for yes or no
- Real-time updates sent via Socket.io

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## CORS Configuration

CORS is enabled for all origins. In production, configure specific origins:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## Production Considerations

1. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Authentication**: Add JWT authentication for secure endpoints
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Validation**: Add comprehensive input validation
5. **Logging**: Implement structured logging (Winston, Morgan)
6. **Environment Variables**: Use .env file for configuration
7. **Image Optimization**: Compress and optimize uploaded images
8. **Security**: Add helmet.js for security headers
9. **File Storage**: Use cloud storage (AWS S3, Cloudinary) for images
10. **Clustering**: Use PM2 for process management

## License

MIT

## Author

Bangladesh Election System Team
