// const cloudinary = require("../middleware/cloudinary");
const { ObjectId } = require("mongodb");
const Workouts = require('../models/Workouts');
const PersonalRecord = require('../models/PersonalRecords');
const ExerciseList = require('../models/ExerciseList');

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
        // console.log("Request Body", req.body)
        // console.log("User:", req.user)

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

            const updatedExercises = [];

            // Check and create personal records for each exercise
            for(const exercise of exercises) {
                const { name, sets } = exercise;

                // Initialize personalRecord to 0
                let personalRecord = 0;

                // Check if a personal record for this exercise already exists
                const existingRecord = await PersonalRecord.findOne({
                    userId,
                    exerciseName: name,
                })

                if(existingRecord) {
                    // If an existing record is found, set personalRecord to the existing topSet
                    personalRecord = existingRecord.topSet
                } else {
                    // Create a new personal record with the default top set
                    await PersonalRecord.create({
                        userId,
                        exerciseName: name,
                        topSet: 0
                    });
                }

                // Create the exercise object with the personalRecord
                const exerciseData = {
                    name,
                    sets,
                    personalRecord,
                };

                updatedExercises.push(exerciseData)
            }

            // Create the workout
            const newWorkout = await Workouts.create({
                userId: userId, // Associates workout with logged-in user
                title,
                exercises: updatedExercises,
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
        console.log("Executing getSingleWorkout");  // Debugging
        try {

            // Ensure user is authenticated
            const userId = req.user.id;
            const workoutId = req.params.id;

            // Find singular workout associated with the logged-in user
            const userSingleWorkout = await Workouts.findById({
                _id: workoutId,
                userId: userId
            })

            if(!userSingleWorkout) {
                console.log("Workout not found");  // Debugging
                return res.status(404).json({ message: 'Workout not found' })
            }

            // Ensure exercise exists in the workout
            const exerciseNames = userSingleWorkout.exercises.map(exercise => exercise.name);

            // Find the last workout for the same exericise in the workout
            const lastWorkoutRecords = await PersonalRecord.find({
                userId: userId,
                exerciseName: { $in: exerciseNames } // Filter by exercise names
            })

            // Filter to only include relevant exercises
            const lastWorkoutLookup = lastWorkoutRecords.reduce((acc, record) => {
                acc[record.exerciseName] = record.lastWorkout || null;
                return acc;
            }, {});

            // Attach last workout data to response
            const enrichedExercises = userSingleWorkout.exercises.map(exercise => ({
                ...exercise.toObject(), // Convert Mongoose document to plain object
                lastWorkout: lastWorkoutLookup[exercise.name] || null // Attach last workout data
            }));

            res.status(200).json({ workout: { ...userSingleWorkout.toObject(), lastWorkout: enrichedExercises } })

        } catch (err) {
            console.error('Error fetching workouts', err)
            res.status(500).json({ message: 'Server Error' })
        }
    },
    deleteWorkout: async(req, res) => {
        try {

            const workoutId = req.params.id

            // Find workout associated with the logged-in user and delete
            await Workouts.findByIdAndDelete(workoutId)

            res.status(200).json({ message: "Workout deleted successfully" })
 
        } catch (err) {
            console.error('Error deleting workout', err)
            res.status(500).json({ message: 'Server Error' })
        }
    },
    updateExercises: async (req, res) => {
        try {
            const userId = req.user?.id;
            const workoutId = req.params.id;
            const exercises = req.body.exercises;
            const lastWorkout = req.body.lastWorkout || {};
    
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
    
            const updatedExercises = [];

            console.log("Received request data:", req.body)
    
            // Check and edit personal record for each exercise
            for (const exercise of exercises) {
                const { name, sets } = exercise;
    
                // Find the max weight lifted in the sets
                const maxWeight = Math.max(...sets.map(set => set.weight || 0))

                console.log('Max Weight:', maxWeight)

                const lastWorkoutSets = lastWorkout[name] || [];

                // Check if a personal record for this exercise exists
                let existingRecord = await PersonalRecord.findOne({ userId, exerciseName: name });
    
                if (existingRecord) {
                    if (maxWeight > existingRecord.topSet) {
                        // Update the PR only if the new weight is higher
                        existingRecord = await PersonalRecord.findOneAndUpdate(
                            { userId, exerciseName: name },
                            { 
                                $set: { 
                                    topSet: maxWeight,
                                    dateAchieved: new Date(),
                                    lastWorkout: {
                                        sets: lastWorkoutSets,
                                        date: new Date()
                                    }
                                } 
                            },
                            { new: true, returnDocument: "after" }
                        );
                } else {
                    // No new PR, but update lastWorkout only
                    existingRecord = await PersonalRecord.findOneAndUpdate(
                        { userId, exerciseName: name },
                        { 
                            $set: { 
                                lastWorkout: {
                                    sets: lastWorkoutSets,
                                    date: new Date()
                                }
                            } 
                        },
                        { new: true, returnDocument: "after" }
                        );
                    }
                } else {
                    // Create a new personal record if none exists
                    existingRecord = await PersonalRecord.create({
                        userId,
                        exerciseName: name,
                        topSet: maxWeight,
                        dateAchieved: new Date(),
                        lastWorkout: {
                            sets: lastWorkoutSets,
                            date: new Date()
                        }
                    });
                }
    
                // Push updated exercise with correct personal record
                updatedExercises.push({
                    name,
                    sets,
                    personalRecord: existingRecord.topSet, // Ensure it's the updated value
                });
            }
    
            // Find workout associated with the workout ID and update 
            const updatedWorkout = await Workouts.findByIdAndUpdate(
                workoutId,
                { $set: { exercises: updatedExercises } },
                { new: true }
            );
    
            if (!updatedWorkout) {
                return res.status(404).json({ message: "Workout not found" });
            }
    
            res.status(200).json({ message: "Workout updated successfully!", updatedWorkout });
    
        } catch (err) {
            console.error("Error updating workout", err);
            res.status(500).json({ message: "Server Error" });
        }
    },
    postCustomExercise: async (req, res) => {
        try {
            console.log(req.body)

            const { name, category } = req.body

            // Check if the exercise exists already in the exercise list
            let existingExercise = await ExerciseList.findOne({ name })

            if(existingExercise) {
                return res.status(400).json({ message: 'This exercise already exists'})
            }

            const newExercise = await ExerciseList.create({ name, category })
            

            res.status(200).json({ message: "Exercise added successfully", newExercise });


        } catch (err) {
            console.error("Error adding exercise", err);
            res.status(500).json({ message: "Server Error" })
        }
    },
};



// TODO
// Now I need to pull the lastWorkout for each exercise in the workout and add it to the response.
// This will be used to display the last workout data in the front-end.
