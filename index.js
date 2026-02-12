import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDatabase from './config/database.js';
import electionRoutes from './routes/electionRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import nidRoutes from './routes/nidRoutes.js';
import { startVoteAutoIncrement, getVotes } from './services/voteService.js';
import { getCountdown } from './services/countdownService.js';
import { requestLogger, errorLogger } from './middleware/logger.js';
import { setIO } from './services/socketService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Initialize socket service
setIO(io);

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware - MUST be after body parsers
app.use(requestLogger);

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/nid', nidRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bangladesh Election Server API',
    version: '1.0.0',
    endpoints: {
      elections: '/api/elections',
      votes: '/api/votes',
      nid: '/api/nid'
    }
  });
});

// Socket.io connection with detailed logging
io.on('connection', async (socket) => {
  const timestamp = new Date().toISOString();
  console.log('\n' + '🔌'.repeat(40));
  console.log(`✅ [${timestamp}] WebSocket Connected`);
  console.log(`🆔 Socket ID: ${socket.id}`);
  console.log(`🌐 IP: ${socket.handshake.address}`);
  console.log('🔌'.repeat(40) + '\n');

  // Send initial data
  const votes = await getVotes();
  socket.emit('votes', votes);
  socket.emit('countdown', getCountdown());

  console.log(`📤 Sent initial data to ${socket.id}\n`);

  socket.on('disconnect', () => {
    const disconnectTime = new Date().toISOString();
    console.log('\n' + '🔌'.repeat(40));
    console.log(`❌ [${disconnectTime}] WebSocket Disconnected`);
    console.log(`🆔 Socket ID: ${socket.id}`);
    console.log('🔌'.repeat(40) + '\n');
  });
});

// Start vote auto-increment service (only if enabled)
if (process.env.ENABLE_AUTO_INCREMENT === 'true') {
  console.log('🤖 Auto-increment enabled (Demo mode)');
  startVoteAutoIncrement((votes) => {
    console.log(`📊 Auto-increment: Votes updated - Total: ${votes.total}`);
    io.emit('votes', votes);
  });
} else {
  console.log('💾 Auto-increment disabled (Production mode - Database only)');
}

// Send countdown updates every second
const countdownInterval = setInterval(() => {
  io.emit('countdown', getCountdown());
}, 1000);

// Error handling middleware with logging
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log('\n' + '⚠️ '.repeat(40));
  console.log('🛑 Shutting down gracefully...');

  // Close server
  httpServer.close(() => {
    console.log('✅ Server closed');

    // Close socket.io connections
    io.close(() => {
      console.log('✅ WebSocket connections closed');

      // Clear intervals
      clearInterval(countdownInterval);

      console.log('✅ Cleanup complete');
      console.log('⚠️ '.repeat(40) + '\n');
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server with MongoDB connection
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDatabase();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log('\n' + '🚀'.repeat(40));
      console.log('🇧🇩  Bangladesh Election 2026 Server');
      console.log('='.repeat(80));
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🔌 WebSocket ready for real-time updates`);
      console.log(`⏰ Countdown timer active`);
      console.log(`📊 Vote counting in progress`);
      console.log(`📝 API Request logging enabled`);
      console.log(`💾 MongoDB connected and ready`);
      console.log('='.repeat(80));
      console.log('🚀'.repeat(40) + '\n');
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error('\n' + '🔴'.repeat(40));
        console.error(`❌ ERROR: Port ${PORT} is already in use!`);
        console.error('');
        console.error('💡 Solutions:');
        console.error(`   1. Kill the process using port ${PORT}:`);
        console.error(`      Windows: netstat -ano | findstr :${PORT}`);
        console.error(`               taskkill /PID <PID> /F`);
        console.error('');
        console.error(`   2. Change the port in .env file`);
        console.error('');
        console.error('🔴'.repeat(40) + '\n');
        process.exit(1);
      } else {
        console.error('❌ Server Error:', err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
