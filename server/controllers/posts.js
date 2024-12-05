// const cloudinary = require("../middleware/cloudinary");
const { ObjectId } = require("mongodb");
const Workouts = require('../models/Workouts')

module.exports = {
    getProfile: async (req, res) => {
        try {
            if(req.user) {
                res.status(200).json({ userName: req.user.userName, email: req.user.email })
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    postWorkout: async (req, res) => {
        console.log("Request Body", req.body)

        try {
            // Validate incoming data
            const { title, workoutData } = req.body;
            if(!title || !Array.isArray(workoutData)) {
                return res.status(400).json({ message: "Invalid data provided" })
            }

            // Create the workout
            const newWorkout = await Workouts.create({
                userId: req.user.id,
                title,
                exercises: workoutData,
            });

            console.log('New Workout Created', newWorkout)

            // Respond with success and created workout
            res.status(201).json({ message: "Workout created successfully", newWorkout })

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Server Error" })
        }
    },
    getWorkouts: async (req, res) => {
        try {
            // Ensures the user is authenticated
            const userId = req.user.id

            // Find workouts associated with the logged-in user
            const userWorkouts = await Workouts.find({
                userId
            })

            // Send the workouts to the client
            res.status(200).json({ workouts: userWorkouts })

        } catch (err) {
            console.error('Error fetching workouts', err)
            res.status(500).json({ message: 'Server Error' })
        }
    }
};


