import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Calendar from './pages/calendar'
import WellBeing from "./pages/Wellbeing"
import Study from './pages/Study'
import Login from "./pages/Login"
import Register from "./pages/Register"
import UnFound from './pages/UnFound'
import ProtectRoute from './components/ProtectRoute'

import './App.css'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndClear(){
  localStorage.clear()
  return <Register />
}

function App() {
  
  return (
    <>
        <Routes>
          <Route path = "/" element = {<ProtectRoute> <Home /> </ProtectRoute>} />
          <Route path = "/login" element = {<Login />} />
          <Route path = "/register" element = {<RegisterAndClear />} />
          <Route path = "/logout" element = {<Logout />} />
          <Route path = "/calendar" element ={<ProtectRoute><Calendar /></ProtectRoute>} />
          <Route path = "/WellBeing" element = {<ProtectRoute><WellBeing/></ProtectRoute>} />
          <Route path = "/study" element = {<ProtectRoute><Study/></ProtectRoute>} />
          <Route path ="*" element = {<UnFound />} />
        </Routes>
    </>
  )
}

export default App
