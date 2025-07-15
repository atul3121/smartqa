require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./src/routes/roomRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));

const corsConfig = {
  origin: process.env.CLIENT_URL,
  Credentials: true
};
app.use(cors(corsConfig));

app.use('/rooms', roomRoutes);

// start the server

const PORT = process.env.PORT;
app.listen(PORT, (error) =>{
    if (error) {
        console.error('Server not started due to: ',error);
    } else {
        console.log(`Server is running on port ${PORT}`)
    }
});