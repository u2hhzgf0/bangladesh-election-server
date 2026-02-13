# Server Logging Guide

Complete console logging for all API requests and WebSocket connections.

## 🎯 What You'll See in Console

### 1. **Server Startup**
```
🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
🇧🇩  Bangladesh Election 2026 Server
================================================================================
📡 Server running on https://votapi.wixford.com
🔌 WebSocket ready for real-time updates
⏰ Countdown timer active
📊 Vote counting in progress
📝 API Request logging enabled
================================================================================
🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
```

### 2. **WebSocket Connection**
```
🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌
✅ [2026-02-12T10:30:45.123Z] WebSocket Connected
🆔 Socket ID: abc123xyz456
🌐 IP: ::1
🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌

📤 Sent initial data to abc123xyz456
```

### 3. **GET Request** (Fetching Data)
```
================================================================================
📥 [2026-02-12T10:31:15.456Z] GET /api/elections/insights
🌐 IP: ::1
📤 Response Status: 200
📋 Response: {"success":true,"data":[...]}
================================================================================
```

### 4. **POST Request** (Casting Vote)
```
================================================================================
📥 [2026-02-12T10:32:20.789Z] POST /api/votes/cast
🌐 IP: ::1
📦 Request Body: {
  "party": "rice"
}
📤 Response Status: 200
📋 Response: {"success":true,"data":{"partyA":42351670,"partyB":39882140}}
================================================================================
```

### 5. **File Upload** (NID Verification)
```
================================================================================
📥 [2026-02-12T10:33:45.012Z] POST /api/nid/verify-upload
🌐 IP: ::1
📤 Response Status: 200
📋 Response: {"success":true,"data":{"isValid":true,"name":"মো: আব্দুল করিম"}}
================================================================================
```

### 6. **Auto Vote Increment**
```
📊 Auto-increment: Votes updated - Total: 82234567
```

### 7. **WebSocket Disconnect**
```
🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌
❌ [2026-02-12T10:35:00.345Z] WebSocket Disconnected
🆔 Socket ID: abc123xyz456
🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌🔌
```

### 8. **Error Logging**
```
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
❌ [2026-02-12T10:36:10.678Z] ERROR
🌐 POST /api/vote/cast
💥 Error: Invalid party
📍 Stack: Error: Invalid party at ...
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
```

## 📊 Information Logged

### For Each API Request:
- ⏰ **Timestamp** - Exact time of request
- 📥 **Method & URL** - GET/POST and endpoint
- 🌐 **IP Address** - Who made the request
- 📦 **Request Body** - Data sent (for POST/PUT)
- 🔍 **Query Parameters** - URL parameters
- 📤 **Response Status** - 200, 404, 500, etc.
- 📋 **Response Data** - What was returned

### For WebSocket:
- ✅ **Connection** - When client connects
- 🆔 **Socket ID** - Unique identifier
- 🌐 **IP Address** - Client location
- 📤 **Data Sent** - Initial data transmission
- ❌ **Disconnection** - When client leaves

### For Auto-Updates:
- 📊 **Vote Increments** - Every 5 seconds
- ⏰ **Countdown Updates** - Every second (silent)

## 🎨 Icon Legend

| Icon | Meaning |
|------|---------|
| 📥 | Incoming Request |
| 📤 | Outgoing Response |
| 📦 | Request Body/Data |
| 🔍 | Query Parameters |
| 🌐 | IP Address/Network |
| ✅ | Success/Connected |
| ❌ | Error/Disconnected |
| 🔌 | WebSocket |
| 📊 | Data/Statistics |
| ⏰ | Timestamp |
| 🆔 | Identifier |
| 💥 | Error Details |
| 📍 | Stack Trace |

## 🧪 Test the Logging

### 1. Start Server
```bash
cd bangladesh-election-server
npm run dev
```

### 2. Watch Console
You'll immediately see:
- Server startup banner
- Port information
- Features enabled

### 3. Open Frontend
```bash
# In another terminal
cd bangladesh-election-2026-tracker
npm run dev
```

### 4. Open Browser
Go to `http://localhost:5173`

Watch server console for:
- ✅ WebSocket connection
- 📥 GET requests for insights/candidates
- 📊 Auto vote increments

### 5. Cast a Vote
Click "ভোট দিন" and complete voting

Watch console for:
- 📥 POST /api/nid/verify
- 📥 POST /api/votes/cast
- 📤 Response data

## 📝 Example Full Flow

```
🚀 [Server Started]

🔌 [Client Opens Website]
✅ WebSocket Connected
📤 Sent initial data

📥 GET /api/elections/insights
📤 Status: 200

📥 GET /api/elections/candidates
📤 Status: 200

📊 Auto-increment: Votes updated

📥 POST /api/nid/verify
📦 Body: { "image": "base64..." }
📤 Status: 200

📥 POST /api/votes/cast
📦 Body: { "party": "rice" }
📤 Status: 200

❌ WebSocket Disconnected
```

## 🎯 Benefits

✅ **Track User Actions** - See exactly what users are doing
✅ **Debug Issues** - Full request/response data
✅ **Monitor Performance** - Response times visible
✅ **Security** - IP addresses logged
✅ **Error Detection** - Detailed error logs
✅ **Real-time Monitoring** - Live server activity

---

**Now restart your server to see the new detailed logs!** 🎉
