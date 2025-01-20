import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';   

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function StartWorkout() {
    const { id } = useParams(); // Extract the ID from the URL

    const [workout, setWorkout] = useState(null);
    const [completed, setCompleted] = useState(false)
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchWorkout() {
            try {
                const response = await fetch(`${appUrl}/${id}`, {
                    credentials: 'include',
                })
        
                if(!response.ok) {
                    throw new Error('HTTP error! status:', response.status)
                }
        
                const data = await response.json()
        
                // console.log('User workout', data); 

                setWorkout(data.workout)

            } catch (err) {
                console.error('Error fetching workouts', err)
                setError('Unable to load workout')
            }
            setError(null)
        }

        fetchWorkout()

    }, [id])


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

    function handleSubmit() {
        // Check if all sets have been checked, if not, notify the user that all sets must be checked 
    }

    // console.log('workout', workout)
    console.log('Workout', workout)
    

    return (
        <>
            <div className='flex flex-col justify-center items-center space-y-4'>
                {error && <div className='text-red-600 font-bold'>{error}</div>}
                
                {workout && (
                    <div className='text-white flex flex-col justify-center items-center space-y-10'>
                        <div className='text-5xl font-bold text-alloy-orange mb-5'>{workout.title}</div>
                        {workout.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className='flex flex-col justify-center items-center space-y-8'>
                                <div className="flex flex-row items-end gap-5">
                                    <div className='text-2xl font-semibold'>{exercise.name}</div>
                                    <div className='font-thin'>top set: {exercise.personalRecord}</div>
                                </div>
                                
                                <div className='flex flex-row justify-center items-center gap-20'>
                                    <div className='flex flex-col gap-5'>
                                    {exercise.sets.map((set, setIndex) => (
                                        <div key={setIndex} className='flex flex-row gap-28'>
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
                                            <div className='flex flex-col gap-2 items-center'>
                                                <div>Reps</div>
                                                <input 
                                                    type="number" 
                                                    value={exercise.reps}
                                                    onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                                    placeholder='10' 
                                                    className='rounded-md w-16 text-center text-black'/>
                                            </div>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <div>Weight</div>
                                                <input 
                                                    type="number" 
                                                    value={exercise.weight}
                                                    onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                                    className='rounded-md w-16 text-black text-center'/>
                                            </div>
                                        </div> 
                                    ))}
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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