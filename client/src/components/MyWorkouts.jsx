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

            } catch (error) {
                console.error('Error fetching workouts', error)
            }
            
        }
        getWorkouts();
    }, [])

    async function handleDeleteWorkout(workoutId) {
        try {
            const response = await fetch(`${appUrl}/${workoutId}`, {
                method: "DELETE",
                credentials: 'include'
            })

            if(!response.ok) {
                throw new Error('HTTP Error!', response.status)
            }

            console.log('Workout deleted successfully.')

            setWorkout((prevWorkout) => prevWorkout.filter((workout) => workout._id !== workoutId))

        }
        catch (error) {
            console.error('Error deleting workout', error)
            setError('Unable to delete workout')
        }
        setError(null)
    }
  
    

    return (
        <>
            <div className="flex flex-col justify-center items-center space-y-4">
                {error && <div className="text-red-600 font-bold">{error}</div>}
                <div className="text-white py-5 text-4xl">
                    my <span className="text-alloy-orange">workouts</span>
                </div>

                {workout && (
                    <div className="text-white w-full space-y-8">
                        {workout.map((workout, workoutIndex) => (
                                <div key={workoutIndex} className="w-full">
                                    <div className="lg:px-96 px-3 py-6 flex flex-row justify-between items-center">

                                        {/* Workout title */}
                                        <div className='flex flex-row lg:gap-4 gap-2 flex-1'>
                                        <div className="lg:text-2xl text-base font-bold mb-4">{workout.title}</div> 
                                            {/* Delete Workout */}
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteWorkout(workout._id)
                                                }} 
                                                className='text-red-500 mb-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="lg:size-6 size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Start Workout Button */}
                                        <Link to={`/${workout._id}`} className="self-end hover:text-alloy-orange border border-alloy-orange rounded-2xl px-4 py-2 lg:text-base text-xs">Start Workout</Link>

                                        {/* Workout exercises */}
                                        <div className="flex flex-col gap-2 flex-1">
                                            {workout.exercises.map((exercise, exerciseIndex) => (
                                                <div key={exerciseIndex} className="flex flex-col text-right">
                                                    <div className="font-semibold lg:text-lg text-sm">{exercise.name}</div>
                                                    <div className='lg:text-base text-xs'>top set: {exercise.personalRecord}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Horizontal line to separate workouts */}
                                    <hr className="border-gray-600" />
                                </div>
                        ))}
                    </div>
                )}
                <Link to={'/profile'} className='text-alloy-orange hover:underline hover:pointer'>home</Link>
            </div>
        </>
    )
}