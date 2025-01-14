import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';    

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function MyWorkouts() {
    const navigate = useNavigate();


    // State variables
    const [workout, setWorkout] = useState([]);
    const [error, setError] = useState('');



    // Retrieves users workouts from the server
    useEffect(() => {
        async function getWorkouts() {
            try {
                const response = await fetch(`${appUrl}/getWorkouts`, {
                    credentials: 'include', // Send credentials to validate the user
                })

                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json();
    
                console.log('User workout', data.workout); // Log the retreved workouts

                // Ensure workouts exist before accessing them
                if(Array.isArray(data.workout) && data.workout.length > 0){
                    setWorkout(data.workout)
                } else {
                    setError("No workouts found...");
                }

                setError(null);

            } catch (err) {
                console.error('Error fetching workouts', err)
            }
            
        }
        getWorkouts();
    }, [])

    return (
        <>
        <div className="h-full flex flex-col justify-center items-center space-y-4">
            {error && <div className="text-red-600 font-bold">{error}</div>}
            <div className="text-white py-5 text-4xl">
                my <span className="text-alloy-orange">workouts</span>
            </div>

            {workout && (
                <div className="text-white w-full space-y-8">
                    {workout.map((workout, workoutIndex) => (
                        <Link key={workoutIndex} to={`/workout/${workout._id}`}>
                            <div className="w-full">
                                <div className="lg:px-96 px-10 py-6 flex flex-row justify-between items-center cursor-pointer hover:bg-space-cadet">
                                    {/* Workout title */}
                                    <div className="text-2xl font-bold mb-4">{workout.title}</div>

                                    {/* Workout exercises */}
                                    <div className="flex flex-col gap-2">
                                        {workout.exercises.map((exercise, exerciseIndex) => (
                                            <div key={exerciseIndex} className="flex flex-col text-right">
                                                <div className="font-semibold text-lg">{exercise.name}</div>
                                                <div>top set: {exercise.personalRecord}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Horizontal line to separate workouts */}
                                <hr className="border-gray-600" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    </>
    )
}