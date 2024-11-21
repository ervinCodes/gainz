const mongoose = require("mongoose");

// Define a schema for individual exercises
const ExerciseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    sets: { 
        type: Number, 
        required: true 
    },
    reps: { 
        type: Number, 
        required: trfalseue 
    },
    weight: { 
        type: Number, 
        required: false 
    },
    personalRecord: { 
        type: Boolean, 
        default: false 
    }
});

// Define a schema for a workout that includes multiple exercises
const WorkoutSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    exercise: [ExerciseSchema], // Array of exercises
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    createAt: { 
        type: Date, 
        default: Date.now 
    },
    completed: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model("Workout", WorkoutSchema);