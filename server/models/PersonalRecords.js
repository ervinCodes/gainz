const mongoose = require('mongoose');

const PersonalRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exerciseName: {
        type: String,
        required: true
    },
    topSet: {
        type: Number,
        required: true,
    },
    dateAchieved: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PersonalRecord', PersonalRecordSchema)