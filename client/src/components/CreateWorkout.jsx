import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function CreateWorkout() {
  let navigate = useNavigate();

  const [workoutTitle, setWorkoutTitle] = useState(""); // State to store the title of the workout
  const [exercises, setExercises] = useState([
    // State to hold a list of exercises; each exercise includes name, sets, reps, and weight
    { name: "", sets: 0, category: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exerciseList, setExerciseList] = useState([]);

  // Fetches data from the server with credentials and retrieves username and email
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

  // Fetches the exercise list from the server
  useEffect(() => {
    async function fetchExerciseList() {
      try {
        const response = await fetch(`${appUrl}/exerciseList`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch exercise list");
        }

        const data = await response.json();

        console.log("Server Data", data);

        setExerciseList(data.exerciseList);
      } catch (error) {
        setError(`Error: ${error.message}`);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExerciseList();
  }, []);

  const categories = [...new Set(exerciseList.map((ex) => ex.category))]; // Extracting unique categories

  console.log("Exercise List:", exerciseList);

  // Function to add a new exercise row with default values (empty name, 0 sets)
  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: 0, category: "" }]);
  };

  // Function to update the value of a specific field (e.g., name, sets)
  // for a specific exercise identified by its index
  const handleExerciseChange = (index, field, value) => {
    const newExercise = [...exercises]; // Create a copy of the exercises array
    newExercise[index][field] = value; // Update the specific field of the selected exercise
    setExercises(newExercise); // Update the exercises state with the modified array
  };

  // Function to handle changes to the workout title input field
  const handleWorkoutTitleChange = (e) => {
    setWorkoutTitle(e.target.value); // Update the state with the new workout title
  };

  // Function to delete an exercise
  const handleDeleteExercise = (index) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  // Handles Submit
  const handleSubmit = () => {
    if (workoutTitle === "") {
      setError("Workout name is required");
      return;
    }

    if (
      !Array.isArray(exercises) ||
      exercises.some((exercises) => !exercises.name || exercises.sets <= 0)
    ) {
      setError("All exercises must have a valid name, sets, and reps");
      return;
    }

    setError(null); // Clears any previous errors

    const workoutData = {
      // Create an object with the workout title and exercises
      title: workoutTitle,
      exercises: exercises.map((exercise) => ({
        name: exercise.name,
        sets: Array.from({ length: exercise.sets }, (_, index) => ({
          setNumber: index + 1,
          reps: 0,
          weight: 0,
        })),
      })),
    };

    console.log("Workout Submitted:", workoutData); // Log for debugging

    // Send data to backend
    fetch(`${appUrl}/createWorkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workoutData), // Convert the workout data to JSON
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save workout");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Workout saved succesfully:", result);
        navigate("/myworkouts"); // redirect to profile, but after workout is saved redirect to new page
      })
      .catch((err) => {
        console.error("Error saving workout:", error);
      });
  };

  // Function to add custom exercise
  // useEffect(() => {
  //   async function addCustomExercise() {
  //     try {
  //       const response = await fetch(`{${appUrl}/addCustomExercise}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       })
  //     } catch(error) {

  //     }
  //   }
  // })

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <>
      <div className="h-full flex flex-col justify-center items-center space-y-4">
        {/* Displays error if one exists */}
        {error && <div className="text-red-600 font-bold">{error}</div>}
        <input
          type="text"
          value={workoutTitle}
          onChange={handleWorkoutTitleChange}
          className="border border-gray-400 px-3 py-2 rounded"
          placeholder="Name this workout..."
        />

        {exercises.map((exercise, index) => (
          <div className="flex flex-col">
            <div key={index} className="flex flex-row items-center gap-5">
              {/* Category Selection */}
              <div className="flex flex-col">
                <div className="text-white">Select Category</div>
                <select
                  value={exercise.category}
                  onChange={(e) =>
                    handleExerciseChange(index, "category", e.target.value)
                  }
                  className="border border-gray-400 px-2 py-1 rounded"
                >
                  <option>Select a Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {/* Exercise Selection/Title */}
              <div className="flex flex-col">
                <div className="text-white">Exercise Name</div>
                <select
                  type="text"
                  value={exercise.name}
                  onChange={(e) =>
                    handleExerciseChange(index, "name", e.target.value)
                  }
                  className="border border-gray-400 px-2 py-1 rounded"
                >
                  <option>Select Exercise</option>
                  {exerciseList
                    .filter((ex) => ex.category === exercise.category)
                    .map((ex, index) => (
                      <option key={index} value={ex.name}>
                        {ex.name}
                      </option>
                    ))}
                </select>
              </div>
              {/* Sets */}
              <div className="flex flex-col">
                <div className="text-white">Sets</div>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) =>
                    handleExerciseChange(index, "sets", e.target.value)
                  }
                  className="border border-gray-400 px-2 py-1 rounded"
                />
              </div>
              {/* Delete Workout */}
              <button
                onClick={() => handleDeleteExercise(index)}
                className="text-red-500 mt-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
            <button className="text-alloy-orange self-start hover:font-semibold">+ add custom exercise</button>
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
  );
}
