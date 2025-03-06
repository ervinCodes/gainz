const ExerciseList = require('../models/ExerciseList');

module.exports = {
    getIndex: (req, res) => {
        res.send("this is the index");
    },
    getExerciseList: async (req, res) => {
        try {
            const exerciseList = await ExerciseList.find({});
            
            if (!exerciseList || exerciseList.length === 0) {  // Added length check
                return res.status(404).json({ message: 'Exercise list not found' });
            }
    
            console.log('Exercise List:', exerciseList);
            res.status(200).json({ exerciseList });
        } catch (err) {
            console.error('Error fetching exercise list:', err);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};
