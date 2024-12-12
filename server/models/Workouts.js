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
        required: true 
    },
    weight: { 
        type: Number, 
        required: false,
        default: 0 // Default weight if not provided
    },
    personalRecord: { 
        type: Number, 
        default: 0 
    }
});

// Define a schema for a workout that includes multiple exercises
const WorkoutSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    exercises: [ExerciseSchema], // Array of exercises
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