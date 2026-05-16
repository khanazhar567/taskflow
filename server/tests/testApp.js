/**
 * Standalone Express app for testing.
 * Does NOT call connectDB() or start httpServer.listen().
 * Tests manage their own MongoDB connection via mongodb-memory-server.
 */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const createApp = () => {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  app.use(express.json());

  // Attach io so broadcastTask in taskController doesn't throw
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.use('/api/auth', require('../routes/auth'));
  app.use('/api/projects', require('../routes/projects'));
  app.use('/api/tasks', require('../routes/tasks'));
  app.use('/api/users', require('../routes/users'));
  app.use('/api/notifications', require('../routes/notifications'));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  return app;
};

module.exports = createApp;
