import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';    

const appUrl = import.meta.env.VITE_APP_API_URL;

export default function MyWorkouts() {
    const navigate = useNavigate();




    // create state variables
    const [title, setTitle] = useState('');
    const [exercises, setExercises] = useState([
        {
            name: '',
            sets: 0,
            reps: 0,
            weight: 0
        }
    ])



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
    
                console.log('User workouts', data.workouts); // Log the retreved workouts
                setExercises(data.workouts)

            } catch (err) {
                console.error('Error fetching workouts', err)
            }
            
        }
        getWorkouts();
    }, [])


    return (
        <>
            <div className="h-full flex flex-col justify-center items-center space-y-4">
                <div className="text-white">Hello!</div>
            </div>
        </>
    )
}