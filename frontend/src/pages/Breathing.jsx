import "../styling/breathing.css"
import Navbar from '../components/Navbar'
function Breathing() {
  return (
    <>
      <Navbar />
      <h2 className="breathingTitle">Breathing Timer</h2>
      <p className="breathingInstructions">Follow along with the circle to breathe in and out</p>
      <p className='anim-circle'></p>
    </>
  )
}

export default Breathing