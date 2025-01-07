import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';   

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function StartWorkout() {
    const { id } = useParams(); // Extract the ID from the URL

    const [workout, setWorkout] = useState(null);
    const [setCount, setSetCount] = useState(0)
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
        
                console.log('User workout', data); // Log the retreved workouts

                setWorkout(data.workout)

            } catch (err) {
                console.error('Error fetching workouts', err)
                setError('Unable to load workout')
            }
            setError(null)
        }

        fetchWorkout()

    }, [id])

    console.log('workout', workout)
    

    return (
        <>
            <div className='h-full flex flex-col justify-center items-center space-y-4'>
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
                                    {Array.from({ length: exercise.sets }).map((set, setIndex) => (
                                        <div key={setIndex} className='flex flex-row gap-28'>
                                            <div className="flex flex-col items-center gap-2">
                                                <div>Set</div>
                                                <div className='border px-2'>{setIndex + 1}</div>
                                            </div>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <div>Reps</div>
                                                <input type="text" placeholder={exercise.reps} className='rounded-md w-16 text-center'/>
                                            </div>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <div>Weight</div>
                                                <input type="text" className='rounded-md w-16'/>
                                            </div>
                                        </div> 
                                    ))}
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}