import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';   

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function StartWorkout() {
    const { id } = useParams(); // Extract the ID from the URL

    const [workout, setWorkout] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchWorkout() {
            try {
                const response = await fetch(`${appUrl}/getSingleWorkout/${id}`, {
                    credentials: 'include',
                })
        
                if(!response.ok) {
                    throw new Error('HTTP error! status:', response.status)
                }
        
                const data = await response.json()
        
                console.log('User workout', data.workout); // Log the retreved workouts

                // Ensure workouts exists
                if(Array.isArray(data.workout) && data.workout.length > 0) {
                    setWorkout(data.workout)

                } else {
                    setError('No workouts found...')
                }
                setError(null)
            } catch (err) {
                console.error('Error fetching workouts', err)
            }
        }

        fetchWorkout()

    }, [])
    

    return (
        <>
        <div>Hello!</div>
        </>
    )
}