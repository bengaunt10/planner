
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Calendar from './pages/calendar'

import WellBeing from './pages/WellBeing'
import Study from './pages/Study'
import Login from "./pages/Login"
import Register from "./pages/Register"
import UnFound from './pages/UnFound'
import ProtectRoute from './components/ProtectRoute'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
// library.add(fab)
import './App.css'

// this is where / route will go so the initial... could do login here? then a redirect
//when they head back to / when they already logged in ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}

function App() {
  
  return (
    <>
        <Routes>
          <Route path = "/" element = {<ProtectRoute> <Home /> </ProtectRoute>} /> {/*Can't accesss home component unless have access token and it's valid .. cos this is only for those authenticated  */}
          <Route path = "/login" element = {<Login />} />
          <Route path = "/register" element = {<RegisterAndLogout />} />
          <Route path = "/logout" element = {<Logout />} />
          <Route path = "/calendar" element ={<ProtectRoute><Calendar /></ProtectRoute>} />
          <Route path = "/WellBeing" element = {<ProtectRoute><WellBeing/></ProtectRoute>} />
          <Route path = "/study" element = {<ProtectRoute><Study/></ProtectRoute>} />
          <Route path ="*" element = {<UnFound />} />
        </Routes>
 
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}

    </>
  )
}

export default App
