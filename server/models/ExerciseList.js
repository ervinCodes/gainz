const mongoose = require("mongoose");

const ExerciseListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true // e.g., 'Legs', 'Chest', 'Back'
    }
})

module.exports = mongoose.model('exerciselists', ExerciseListSchema)