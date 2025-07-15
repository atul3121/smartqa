const Room = require('../models/Rooms');
const Question = require('../models/Questions');


const roomController = {
    createRoom: async (request, response) => {
        try {
            const { createdBy } = request.body;

            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            const room = await Room.create({
                roomCode: code,
                createdBy: createdBy,
            });

            response.json(room);

        }catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getByRoomCode: async (request, response) => {
        try {
            const code = request.params.code;

            const room = await Room.findOne({ roomCode: code });
            if (!room) {
                return response.status(404).json({ message: 'Room not found' });
            }

            response.json(room);
        }catch (error) {
            console.error(error);
        }
    },


    // POST /rooms/:code/questions
    createQuestion: async (request, response) => {
        try {
            const { content, createdBy } = request.body;
            const { code } = request.params;

            const questions = await Question.create({
                roomCode: code,
                content: content,
                createdBy: createdBy,
            });

            response.json(questions);
        }catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },


    // GET /rooms/:code/questions
    getQuestions: async (request, response) => {
        try {
            const code = request.params.code;

            const questions = await Question.find({ roomCode: code }).sort({ createdAt: -1 });

            response.json(questions);
        }catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

module.exports = roomController;