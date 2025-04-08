import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';   

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function StartWorkout() {
    let navigate = useNavigate();
    const { id } = useParams(); // Extract the ID from the URL

    const [workout, setWorkout] = useState(null);
    const [error, setError] = useState('');
    const [lastWorkout, setLastWorkout] = useState(null); // State to store the last exercise

    useEffect(() => {
        async function fetchWorkout() {
            try {
                const response = await fetch(`${appUrl}/getWorkout/${id}`, {
                    credentials: 'include',
                })
        
                if(!response.ok) {
                    throw new Error('HTTP error! status:', response.status)
                }
        
                const data = await response.json()
        
                // console.log('User workout', data); 

                setWorkout(data.workout)

                console.log('Workout data:', data) // Log the last workout data

            } catch (err) {
                console.error('Error fetching workouts', err)
                setError('Unable to load workout')
            }
            setError(null)
        }

        fetchWorkout()

    }, [id])

    // Function that handles changes to each set
    function handleSetChange(exerciseIndex, setIndex, field, value) {
        setWorkout((prevWorkout) => {
            const updatedExercises = prevWorkout.exercises.map((exercise, eIndex) => {
                if(eIndex === exerciseIndex) {
                    const updatedSets = exercise.sets.map((set, sIndex) => {
                        if(sIndex === setIndex) {
                            return { ...set, [field]: value }
                        }
                        return set;
                    });
                    return { ...exercise, sets: updatedSets }
                };
                return exercise;
            });
            return { ...prevWorkout, exercises: updatedExercises };
        });
    };

    // Function to handle submitting a workout
    async function handleSubmit() {
        // CEnsure we're working with the latest state
        const allChecked = workout.exercises.every(exercise => exercise.sets.every(set => set.isChecked))

        if(!allChecked) {
            alert('Please complete all sets before submitting the workout.')
            return; // Prevents submission
        }

        const exerciseData = workout.exercises.map(exercise => ({
            name: exercise.name,
            sets: exercise.sets.map(set => ({
                setNumber: set.setNumber,
                reps: set.reps,
                weight: set.weight,
                isChecked: false, // Reset for next time
            }))
        }));

        // Generate last recorded workout data
        const lastWorkoutData = workout.exercises.reduce((acc, exercise) => {
            const completedSets = exercise.sets.filter(set => set.isChecked);
            if(completedSets.length > 0) {
                acc[exercise.name] = completedSets.map(set => ({
                    setNumber: set.setNumber,
                    reps: set.reps,
                    weight: set.weight,
                }));
            }
            return acc;
        }, {});

        const workoutData = {
            exercises: exerciseData,
            lastWorkout: lastWorkoutData,
        }
        

        console.log('Workout Data being sent to server:', workoutData)
            
        try {
            const response = await fetch(`${appUrl}/updateExercises/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData), // convert data to JSON 
                credentials: 'include',
            })

            if(!response.ok) {
                throw new Error('Failed to save data.')
            }

            

            navigate('/myworkouts')

        } catch (error) {
                console.error('Error saving workout:', error)
                alert('An error occurred while saving the workout. Please try again.');
        }
    }

    // Function to add a set
    function handleAddSet(exerciseIndex) {
        setWorkout((prevWorkout) => {
            const updatedExercises = prevWorkout.exercises.map((exercise, eIndex) => {
                if(eIndex === exerciseIndex) {
                    return {
                        ...exercise,
                        sets: [
                            ...exercise.sets,
                            {
                                _id: crypto.randomUUID(), // Generate a temporary unique ID
                                setNumber: exercise.sets.length + 1, // Increment set number
                                reps: 0,
                                weight: 0,
                                isChecked: false
                            }
                        ]
                    };
                }
                return exercise;
            });

            return { ...prevWorkout, exercises: updatedExercises };
        })
    }

    // Function to delete single set
    function handleDeleteSet(exerciseIndex, setId) {
        setWorkout(prevWorkout => {
            const updatedExercises = prevWorkout.exercises.map((exercise, eIndex) => {
                if(eIndex === exerciseIndex) {
                    return {
                        ...exercise,
                        sets: exercise.sets.filter(set => set._id !== setId) // Remove the set from state
                    };
                }
                return exercise
            });

            return { ...prevWorkout, exercises: updatedExercises };
        })
    }

    console.log(workout)
    

    return (
        <>
            <div className='flex flex-col justify-center items-center space-y-8'>
                {error && <div className='text-red-600 font-bold'>{error}</div>}
                
                {workout && (
                    <div className='text-white flex flex-col justify-center items-center space-y-10'>
                        {/* Workout Title */}
                        <div className='text-5xl font-bold text-alloy-orange mb-5'>{workout.title}</div>
                        {workout.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className='flex flex-col justify-center items-center space-y-8'>
                                <div className="flex flex-row items-end gap-5">
                                    {/* Exercise Name */}
                                    <div className='text-2xl font-semibold'>{exercise.name}</div>
                                    {/* Personal Record */}
                                    <div className='font-thin'>top set: {exercise.personalRecord}</div>
                                    {/* Last Workout */}
                                    {(() => {
                                        const matchedLast = workout.lastExercise?.find(last => last.name === exercise.name);
                                        return matchedLast && (
                                            <div className="relative group">
                                                <div className="text-sm text-gray-400 cursor-pointer">
                                                    🕒 last recorded
                                                </div>
                                                <div className='absolute left-0 mt-2 w-40 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
                                                    {matchedLast.sets.map((set, i) => (
                                                        <div key={i}>
                                                            Set {set.setNumber}: {set.reps} reps x {set.weight} lbs
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                        )
                                    })()}
                                    <div className="relative group">

                                    </div>
                                </div>
                                
                                <div className='flex flex-row justify-center items-center gap-20'>
                                    <div className='flex flex-col gap-5'>
                                    {exercise.sets.map((set, setIndex) => (
                                        // Set Container
                                        <div key={setIndex} className='flex flex-row lg:gap-28 gap-20 mx-10'>
                                            
                                            {/* Sets */}
                                            <div className="flex flex-col items-center gap-2">
                                                <div>Set</div>
                                                <div className='flex flex-row gap-2 items-center'>
                                                    <label htmlFor={`setCount-${exerciseIndex}-${setIndex}`} className="flex items-center justify-center cursor-pointer relative">
                                                        <input 
                                                            type='checkbox' 
                                                            id={`setCount-${exerciseIndex}-${setIndex}`} 
                                                            checked={set.isChecked || false}
                                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'isChecked', e.target.checked)}
                                                            className='peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-alloy-orange checked:border-slate-800 bg-white' 
                                                        />
                                                        <span className="absolute text-white peer-checked:text-slate-800 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                                                stroke="currentColor" strokeWidth="1">
                                                                <path fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"></path>
                                                            </svg>
                                                        </span>
                                                    </label>
                                                    <div>{set.setNumber}</div>
                                                </div>
                                            </div>

                                            {/* Reps */}
                                            <div className='flex flex-col gap-2 items-center'>
                                                <div>Reps</div>
                                                <input 
                                                    type="number" 
                                                    value={exercise.reps}
                                                    onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                                    placeholder='10' 
                                                    className='rounded-md w-16 text-center text-black'/>
                                            </div>

                                            {/* Weight */}
                                            <div className="flex flex-row justify-center gap-3">
                                                <div className='flex flex-col gap-2 items-center'>
                                                    <div>Weight</div>
                                                    <input 
                                                        type="number" 
                                                        value={exercise.weight}
                                                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                                        className='rounded-md w-16 text-black text-center'/>
                                                </div>
                                                {/* Delete Workout Icon*/}
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeleteSet(exerciseIndex, set._id)
                                                    }} 
                                                    className='text-red-500 self-end'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="lg:size-4 size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div> 
                                    ))}
                                    </div>
                                </div>
                                <button onClick={() => handleAddSet(exerciseIndex)} className='text-alloy-orange hover:cursor hover:underline'>
                                    + add set
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
                >
                Finish Workout
                </button>
                <Link to={'/myworkouts'} className='text-alloy-orange hover:underline'>back</Link>
            </div>
            
        </>
    );
}