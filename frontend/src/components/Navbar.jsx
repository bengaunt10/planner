import { Link } from "react-router-dom"


function Navbar() {
  return (
    <>
    <header>    
        <Link className="nav-link" to="/home"><h1>DayCalmWeb</h1></Link>   
        <nav className="custom-nav navbar navbar-expand-lg navbar-dark ">
        <button className="navbar-toggler toggle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                     <Link className="nav-link" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/calendar">Calendar</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/breathing">Breathing</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/mentalhealth">Mental Health</Link>
                </li>
            </ul>
        </div>
        </nav>
    </header>

    </>
  )
}

export default Navbar