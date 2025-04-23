import { Link } from "react-router-dom"
function UnFound() {
  return (
    <>
    <h1>OH NO!</h1>
    <h3>The page you have navigated to does not exist! OOPS!</h3>
    <button type="button" className="btn btn-info"><Link className="nav-link" to="/">Back to CalmDay</Link></button>
    </>
  )
}

export default UnFound