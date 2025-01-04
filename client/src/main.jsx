import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import Home from './components/Home';
import About from './components/About.jsx';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import CreateWorkout from './components/CreateWorkout.jsx';
import MyWorkouts from './components/MyWorkouts.jsx';
import StartWorkout from './components/StartWorkout.jsx';
import './css/index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/createWorkout',
        element: <CreateWorkout />
      },
      {
        path: '/myworkouts',
        element: <MyWorkouts />
      },
      {
        path: '/workout/:id',
        element: <StartWorkout />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
