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

    // validate user and retrieve workout data
    useEffect(() => {
        async function validateUser() {
            try {
                const response = await fetch(`${appUrl}/profile`, {
                credentials: 'include' // Ensures cookies are sent with the request
                })

                if(!response.ok || response.redirect) {
                    throw new Error('Unauthorized Access ');
                }

                await response.json() // Parse the response if needed

            } catch (error) {
            console.error('Error validating user:', error)
            navigate('/login') // Redirect to login on failure
            } 
        }

        validateUser();

    }, [navigate]);

    // Retrieves users workouts from the server
    useEffect(() => {
        async function getWorkouts() {
            try {
                const response = await fetch(`${appUrl}/getWorkouts`, {
                    credentials: 'include',
                })

                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json();
    
                console.log('User workouts', data.workouts);
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