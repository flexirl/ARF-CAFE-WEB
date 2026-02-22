import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('Admin joined:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
