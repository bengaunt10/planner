import { Link } from "react-router-dom"
function UnFound() {
  return (
    <>
    <h1>404 NOT FOUND</h1>
    <p>The page you have navigated to does not exist! OOPS!</p>
    <button type="button" className="btn btn-info"><Link className="nav-link" to="/">Back to Website</Link></button>
    </>
  )
}

export default UnFound