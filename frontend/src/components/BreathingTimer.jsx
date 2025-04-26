
import "../Styling/breathing.css"
// Timer Adapted from https://vmar76.medium.com/using-css-animations-to-visualize-breathing-techniques-7a20ee0aed5a 
function BreathingTimer() {
  return (
   
    <div className="breathingContainer">
        <h2 className="breathingTitle">Breathing Timer</h2>
        <p className="breathingInstructions">
        Follow along with the circle to breathe in and out
        </p>
        <p className="anim-circle"></p>
     <div className="breathing-logo"></div>   
    </div>
  
  )
}

export default BreathingTimer