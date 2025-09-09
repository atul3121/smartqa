require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const roomRoutes = require('./src/routes/roomRoutes');
// import { GoogleGenAI } from "@google/genai";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));

// CORS configuration
const corsConfig = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsConfig));

// Create HTTP server and attach Socket.IO
const ourServer = http.createServer(app);
const io = new Server(ourServer, {
  cors: corsConfig,
});

// Register socket events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User joined room: ${roomCode}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible in routes/controllers
app.set('io', io);

// Use API routes
app.use('/rooms', roomRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
ourServer.listen(PORT, (error) => {
  if (error) {
    console.error('Server not started due to:', error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});




