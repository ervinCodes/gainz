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

    function handleSubmit(e) {

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
                                    <div className='font-thin'>Top Set: {exercise.personalRecord}</div>
                                </div>
                                
                                <div className='flex flex-row justify-center items-center gap-20'>
                                    <div className='flex flex-col gap-5'>
                                    {exercise.sets.map((set, setIndex) => (
                                        <div key={setIndex} className='flex flex-row gap-28'>
                                            <div className="flex flex-col items-center gap-2">
                                                <div>Set</div>
                                                <div className='border px-2 rounded-md'>{set.setNumber}</div>
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