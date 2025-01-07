// const cloudinary = require("../middleware/cloudinary");
const { ObjectId } = require("mongodb");
const Workouts = require('../models/Workouts');
const User = require("../models/User");

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
        console.log("User:", req.user)

        try {

            //Ensure the user is logged in and retrieve their ID
            const userId = req.user?.id;

            if(!userId) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const user = req.user._id;

            // Validate incoming data
            const { title, exercises } = req.body;
            if(!title || !Array.isArray(exercises)) {
                return res.status(400).json({ message: "Invalid data provided" })
            }

            // Create the workout
            const newWorkout = await Workouts.create({
                userId: userId, // Associates workout with logged-in user
                title,
                exercises: exercises,
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
            const userWorkout = await Workouts.find({
                userId: userId
            })
            
            // Send the workouts to the client
            res.status(200).json({ workout: userWorkout })

        } catch (err) {
            console.error('Error fetching workouts', err)
            res.status(500).json({ message: 'Server Error' })
        }
    },
    getSingleWorkout: async (req, res) => {
        try {

            // Ensure user is authenticated
            const userId = req.user.id;
            const workoutId = req.params.id;

            // Find singular workout associated with the logged-in user
            const userSingleWorkout = await Workouts.findById({
                _id: workoutId,
                userId: userId
            })

            console.log(userSingleWorkout);

            if(!userSingleWorkout) {
                return res.status(404).json({ message: 'Workout not found' })
            }

            res.status(200).json({ workout: userSingleWorkout })

        } catch (err) {
            console.error('Error fetching workouts', err)
            res.status(500).json({ message: 'Server Error' })
        }
    }
};


// TODO
// On MyWorkouts.jsx: test pages for mobile and on StartWorkout.jsx, continue to orginize how the data is displayed and add input fields for the user to input their workout data. From there we can start figuring out how to edit the data on the database.