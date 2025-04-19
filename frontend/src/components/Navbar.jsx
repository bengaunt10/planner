import { Link } from "react-router-dom"
import "../Styling/navbar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStopwatch, faHeartCirclePlus, faCalendar, faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"


function Navbar() {
  return (
    <>
    <header>    
        <Link className="nav-link" to="/"><h1>CalmDay</h1></Link>   
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
    </header>

    </>
  )
}

export default Navbar