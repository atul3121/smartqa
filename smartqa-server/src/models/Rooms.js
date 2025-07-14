const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomCode: { type: String, required: true, unique: true },
    // this should be the user ID  from the user table
    createdBy: { type: String},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Room", roomSchema);