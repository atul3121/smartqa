const Room = require('../models/Rooms');
const Question = require('../models/Questions');
const { callGemini } = require('../services/geminiService'); 

const roomController = {
  // Create a new room with a unique code
  createRoom: async (request, response) => {
    try {
      const { createdBy } = request.body;
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const room = await Room.create({
        roomCode: code,
        createdBy,
      });

      response.json(room);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Retrieve a room using its code
  getByRoomCode: async (request, response) => {
    try {
      const code = request.params.code;
      const room = await Room.findOne({ roomCode: code });

      if (!room) {
        return response.status(404).json({ message: 'Room not found' });
      }

      response.json(room);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Create a new question and emit it via socket
  createQuestion: async (request, response) => {
    try {
      const { content, createdBy } = request.body;
      const { code } = request.params;

      const question = await Question.create({
        roomCode: code,
        content,
        createdBy,
      });

      const io = request.app.get('io');
      io.to(code).emit('new-question', question);

      response.json(question);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get all questions for a specific room
  getQuestions: async (request, response) => {
    try {
      const code = request.params.code;
      const questions = await Question.find({ roomCode: code }).sort({ createdAt: -1 });

      response.json(questions);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // ✅ Generate summarized top questions using Gemini API
  generateTopQuestions: async (request, response) => {
    try {
      const code = request.params.code;

      const questions = await Question.find({ roomCode: code });

      if (!questions || questions.length === 0) {
        return response.status(404).json({ message: 'No questions found in this room' });
      }

      const summarized = await callGemini(questions);

      response.json({ topQuestions: summarized });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Failed to generate top questions' });
    }
  }
};

module.exports = roomController;
