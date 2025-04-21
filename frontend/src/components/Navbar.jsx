import { Link } from "react-router-dom"
import "../Styling/navbar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStopwatch, faHeartCirclePlus, faCalendar, faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import Modal from "./Modal"
import { useState } from "react"
function Navbar() {

    const [openGratitudeModal, setOpenGratitudeModal] = useState(false)

  return (
    <>
    <header>    
        <Link className="nav-link" to="/"><h1>CalmDay</h1></Link>   
        <div className="logo"></div> 
        <nav className="custom-nav navbar navbar-expand-lg navbar-dark ">
        <button className="navbar-toggler toggle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                     <Link className="nav-link" to="/"><FontAwesomeIcon icon={faHouse} /> Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/calendar"><FontAwesomeIcon icon={faCalendar} /> Calendar</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/wellbeing"><FontAwesomeIcon icon={faHeartCirclePlus}/> Wellbeing</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/study"><FontAwesomeIcon icon={faStopwatch} /> Study</Link>
                </li>
                <li className="nav-item">
                    <Link className="btn btn-info logoutButton" to="/logout"><FontAwesomeIcon icon={faRightFromBracket} /> Logout</Link>
                </li>

            </ul>
        </div>
        </nav>
        {openGratitudeModal && (
        <Modal onClose={() => setOpenGratitudeModal(false)} title="Help">
          <p>Welcome to Calm Day!!</p>
        </Modal>
      )}
    </header>

    </>
  )
}

export default Navbar