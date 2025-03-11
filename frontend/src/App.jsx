
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import Navbar from './components/Navbar'
import Breathing from './pages/Breathing'
import MentalHealth from './pages/MentalHealth'

import './App.css'
// this is where / route will go so the initial... could do login here? then a redirect
//when they head back to / when they already logged in ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
function App() {
  // const [count, setCount] = useState(0)

  
  return (

    <>
      <Navbar />
        <Routes>
          <Route path = "/home" element = {<Home />} />
          <Route path = "/calendar" element ={<Calendar />} />
          <Route path = "/breathing" element = {<Breathing/>} />
          <Route path = "/mentalhealth" element = {<MentalHealth/>} />
        </Routes>
 
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}

    </>
  )
}

export default App
