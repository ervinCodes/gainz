const mongoose = require('mongoose');
const { SetSchema } = require('./Workouts');

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
    },
    lastWorkout: {
        sets: { type: [SetSchema], default: [] },
        date: { type: Date, default: null }
    }
});

module.exports = mongoose.model('PersonalRecord', PersonalRecordSchema)