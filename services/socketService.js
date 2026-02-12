let io = null;

export const setIO = (socketIO) => {
  io = socketIO;
  console.log('✅ Socket.io service initialized');
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitVoteUpdate = async (votes) => {
  try {
    console.log('📡 emitVoteUpdate called with:', votes);
    if (io) {
      io.emit('votes', votes);
      console.log('📡 Vote update emitted successfully');
    } else {
      console.warn('⚠️  Socket.io not initialized, cannot emit vote update');
    }
  } catch (error) {
    console.error('❌ Error in emitVoteUpdate:', error);
    throw error;
  }
};

export const emitCountdownUpdate = (countdown) => {
  if (io) {
    io.emit('countdown', countdown);
  }
};

export const emitReferendumUpdate = (referendum) => {
  if (io) {
    io.emit('referendum', referendum);
  }
};
