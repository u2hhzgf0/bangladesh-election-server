// Request logging middleware

/**
 * Logger middleware to track all API requests
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;

  // Log request
  console.log('\n' + '='.repeat(80));
  console.log(`📥 [${timestamp}] ${method} ${url}`);
  console.log(`🌐 IP: ${ip}`);

  // Log request body for POST/PUT requests
  if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && req.body) {
    console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  }

  // Log query parameters
  if (Object.keys(req.query).length > 0) {
    console.log('🔍 Query Params:', req.query);
  }

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    console.log(`📤 Response Status: ${res.statusCode}`);

    // Log response data (truncate if too long)
    if (data) {
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
      if (dataStr.length > 500) {
        console.log(`📋 Response: ${dataStr.substring(0, 500)}... (truncated)`);
      } else {
        console.log(`📋 Response:`, dataStr);
      }
    }

    console.log('='.repeat(80) + '\n');

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Error logging middleware
 */
export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log('\n' + '🔴'.repeat(40));
  console.log(`❌ [${timestamp}] ERROR`);
  console.log(`🌐 ${req.method} ${req.originalUrl || req.url}`);
  console.log(`💥 Error: ${err.message}`);
  console.log(`📍 Stack:`, err.stack);
  console.log('🔴'.repeat(40) + '\n');

  next(err);
};

/**
 * Custom log helpers
 */
export const log = {
  info: (message, data = null) => {
    console.log(`ℹ️  ${message}`, data || '');
  },

  success: (message, data = null) => {
    console.log(`✅ ${message}`, data || '');
  },

  warning: (message, data = null) => {
    console.log(`⚠️  ${message}`, data || '');
  },

  error: (message, error = null) => {
    console.log(`❌ ${message}`, error || '');
  },

  api: (endpoint, method = 'GET') => {
    console.log(`🔌 API: ${method} ${endpoint}`);
  }
};
