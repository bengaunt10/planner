import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Calendar from './pages/calendar'
import Navbar from './components/Navbar'

import './App.css'
// this is where / route will go so the initial... could do login here? then a redirect
//when they head back to / when they already logged in ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
function App() {
  // const [count, setCount] = useState(0)
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test/") // Match this with your Django endpoint
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching:", error));
  }, []);

  
  return (

    <>
      <Navbar />
      <p>Backend on: {message ? message : "No"} </p>
        <Routes>
          <Route path = "/home" element = {<Home />} />
          <Route path = "/calendar" element ={<Calendar />} />
        </Routes>
 
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}

    </>
  )
}

export default App
