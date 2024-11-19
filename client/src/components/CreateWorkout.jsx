import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function CreateWorkout() {
    let navigate = useNavigate();

    const [workoutTitle, setWorkoutTitle] = useState(''); // State to store the title of the workout
    const [exercises, setExercises] = useState([ // State to hold a list of exercises; each exercise includes name, sets, reps, and weight
        { name: '', sets: 0, reps: 0, weight: 0 },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

      // fetches data from the server with credentials and retrieves username and email
    useEffect(() => {
        fetch(`${appUrl}/profile`, {
        credentials: "include", // Ensures cookies are sent with the request
        })
        .then((res) => {
            if (res.redirected) {
            throw new Error("Redirected");
            }
            if (!res.ok) {
            throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            setLoading(false); // fetching data completed
        })
        .catch((error) => {
            setError(error.message);
            console.error("Error fetching profile data:", error);
            navigate("/login");
        });
    }, [navigate]);

    // Function to add a new exercise row with default values (empty name, 0 sets, reps, and weight)
    const handleAddExercise = () => {
        setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0 }])
    }

    // Function to update the value of a specific field (e.g., name, sets, reps, weight)
    // for a specific exercise identified by its index
    const handleExerciseChange = (index, field, value) => {
        const newExercise = [...exercises]; // Create a copy of the exercises array
        newExercise[index][field] = value; // Update the specific field of the selected exercise
        setExercises(newExercise) // Update the exercises state with the modified array
    };

    // Function to handle changes to the workout title input field
    const handleWorkoutTitleChange = (e) => {
        setWorkoutTitle(e.target.value) // Update the state with the new workout title
    }

    const handleSubmit = () => {
        const workoutData = { title: workoutTitle, exercises }; // Create an object with the workout title and exercises

        console.log('Workout Submitted:', workoutData)
        // sent data to backend here
    }

      // Error messages
    if (error) {
        return <div className="text-white">Error: {error}</div>;
    }

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <>
            <div className="h-full flex flex-col justify-center items-center space-y-4">
            <input
                type="text"
                value={workoutTitle}
                onChange={handleWorkoutTitleChange}
                className="border border-gray-400 px-3 py-2 rounded"
                placeholder="Name this workout..."
            />

            {exercises.map((exercise, index) => (
                <div key={index} className="space-y-2">
                <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                    handleExerciseChange(index, "name", e.target.value)
                    }
                    placeholder="Exercise Name"
                    className="border border-gray-400 px-2 py-1 rounded"
                />
                <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                    placeholder="Sets"
                    className="border border-gray-400 px-2 py-1 rounded"
                />
                <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                    placeholder="Reps"
                    className="border border-gray-400 px-2 py-1 rounded"
                />
                <input
                    type="number"
                    value={exercise.weight}
                    onChange={(e) =>
                    handleExerciseChange(index, "weight", e.target.value)
                    }
                    placeholder="Weight"
                    className="border border-gray-400 px-2 py-1 rounded"
                />
                </div>
            ))}

            <button
                onClick={handleAddExercise}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Add Exercise
            </button>

            <button
                onClick={handleSubmit}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                Save Workout
            </button>
            </div>
        </>
    )
}