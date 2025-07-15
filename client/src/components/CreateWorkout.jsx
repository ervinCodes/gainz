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
  const [customExercise, setCustomExercise] = useState([
    {name: "", category: ""}
  ])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exerciseList, setExerciseList] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

        // console.log("Server Data", data);

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

  // console.log("Exercise List:", exerciseList);

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

  const handleCustomExercise = (field, value) => {
    const newCustom = [...customExercise] // Copy the customeExercise array
    newCustom[0][field] = value; // Update the value of the selected field (name, category)
    setCustomExercise(newCustom); // Updates state w/modified array
  }

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
        console.error("Error saving workout:", err);
      });
  };

  // Function to add custom exercise
  async function addCustomExercise() {
    try {

      // Validate input before sending request
      if(!Array.isArray(customExercise) || customExercise.some((ex) => ex.name === '' || ex.category === '')) {
        setError('A custom exercise must have a valid name and/or category must be selected.')
        return
      }

      setError(null)

      // Payload
      const customExerciseData = {
        name: customExercise[0].name,
        category: customExercise[0].category,
      }

      console.log('Custom Exercise Data', customExerciseData)

      // Send data to API
      const response = await fetch(`${appUrl}/addCustomExercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customExerciseData),
        credentials: 'include',
      })

      console.log('API Response', response)

      if(!response.ok) {
        throw new Error('Failed to save custom exercise.')
      }

      const result = await response.json();

      console.log("Custom exercise saved successfully!", result)

      setTimeout(() => {
        setSuccessMessage('Custom exercise added successfully!')
      }, 5000)

      setExerciseList((prev) => [...prev, customExerciseData]) // Update exercise list with new custom exercise

      // Reset form
      setCustomExercise([{ name: '', category: ''}])

    } catch(error) {
      console.error('Error:', error)
    }
  }

  console.log('Custom Exercise', customExercise)

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center space-y-4 relative">
        {/* Displays error if one exists */}
        {error && <div className="text-red-600 font-bold">{error}</div>}

        <input
          type="text"
          value={workoutTitle}
          onChange={handleWorkoutTitleChange}
          className="border border-gray-400 px-3 py-2 rounded text-center"
          placeholder="Name this workout..."
        />

        {exercises.map((exercise, index) => (
          <div key={index} className="flex flex-col">
            <div
              className="flex md:flex-row flex-col items-center gap-5"
            >
              {/* Category Selection */}
              <div className="flex flex-col">
                <div className="text-white md:text-left text-center">
                  Select Category
                </div>
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
                <button
                  onClick={() => setToggleModal(true)}
                  className="text-alloy-orange self-start hover:font-semibold md:hidden block"
                >
                  + add custom exercise
                </button>
              </div>
              {/* Exercise Selection/Title */}
              <div className="flex flex-col">
                <div className="text-white md:text-left text-center">
                  Exercise Name
                </div>
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
                <div className="text-white md:text-left text-center">Sets</div>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) =>
                    handleExerciseChange(index, "sets", e.target.value)
                  }
                  className="border border-gray-400 px-2 py-1 rounded md:text-left text-center"
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
            <button onClick={() => setToggleModal(true)} className="text-alloy-orange self-start hover:font-semibold md:block hidden">
              + add custom exercise
            </button>
          </div>
        ))}

        <button onClick={handleAddExercise} className="mt-4 text-alloy-orange ">
          + add exercise
        </button>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Workout
        </button>

        {/* Modal */}
        {toggleModal && (
          <div className="flex flex-col items-center border bg-space-cadet border-black w-96 h-auto rounded-lg p-3 gap-1 absolute shadow-2xl">
                {/* Close Button */}
            <button
              onClick={() => setToggleModal(false)}
              className="absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              x
            </button>
            {successMessage && <div className="text-green-600 font-bold">{successMessage}</div>}
            <div className="text-2xl font-semibold text-white mb-3">
              Add Custom Exercise
            </div>
            <div className="flex flex-row gap-4 w-full justify-between">
              <label htmlFor="exercise-name" className="text-white">
                Exercise Name
              </label>
              <input
                type="text"
                className="border border-black rounded text-center"
                placeholder="e.g squats"
                id="exercise-name"
                onChange={(e) => handleCustomExercise("name", e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 w-full justify-between">
              <label htmlFor="exercise-name" className="text-white">
                Category
              </label>
              <select
                type="text"
                className="border border-black rounded w-44 text-center"
                id="exercise-name"
                onChange={(e) => handleCustomExercise('category', e.target.value)}
              >
                <option value="quads">quads</option>
                <option value="hamstrings">hamstrings</option>
                <option value="calves">calves</option>
                <option value="glutes">glutes</option>
                <option value="biceps">biceps</option>
                <option value="triceps">triceps</option>
                <option value="forearms">forearms</option>
                <option value="chest">chest</option>
                <option value="shoulders">shoulders</option>
                <option value="upper-back">upper Back</option>
                <option value="lower-back">lower Back</option>
                <option value="lats">lats</option>
                <option value="abs">abs</option>
              </select>
            </div>
            <div className="flex flex-row gap-3 mt-5">
              <button
                onClick={addCustomExercise}
                className="px-2 py-1 border border-black rounded-lg bg-alloy-orange"
                type="submit"
              >
                Submit
              </button>
              <button
                onClick={() => setToggleModal(false)}
                className="px-2 py-1 border border-black rounded-lg bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
