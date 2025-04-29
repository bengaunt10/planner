/* eslint-disable react/prop-types */
// Authentication system understood and adapted from https://www.youtube.com/watch?v=WuyKxdLcw3w&list=WL&index=3&t=2233s
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../Styling/Form.css"
import { Link } from "react-router-dom";
import Loading from "./Loading"

function Form({route, result}) {
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, isLoading] = useState(false)
  const [errorReason, setErrorReason] = useState("");
  const navigate = useNavigate()

  const handleSubmission = async (e) => {
    isLoading(true)
    e.preventDefault() 
    try {
      const inputs = result === "register" ? { username: userName, password: userPassword, confirmPassword: confirmPassword }: { username: userName, password: userPassword };
      const response = await fetch(route, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify(inputs)
      });
      const data = await response.json()
      if(response.ok){
      if(result ==="login"){
        localStorage.setItem("access", data.access )
        localStorage.setItem("refresh", data.refresh)
        localStorage.setItem("username", userName);

        navigate("/")
      }
      else{
         navigate("/login")
      }
    }
      else{
        if (response.status === 401) {
          setErrorReason("Login Failed.");
        } else {
          setErrorReason(data.reason || "Unknown error occurred");
        }
    }
    // eslint-disable-next-line no-unused-vars
    }catch(error){
      setErrorReason("Can't connect to server")

    }finally{
      isLoading(false)
    }


  }

  const what = result === "login" ? "Login" : "Register"
  const text = what === "Login" ? " Register " : " Login "
  const link = what === "Login" ? "/register" : "/login"

  return (
    <div className="loginForm form-group">
    <form onSubmit={handleSubmission}>
        <h1 className="formTitle">{what}</h1>
        <input className="form-control auth-form-control"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="UserName"
          required
        />
        <input className="form-control auth-form-control"
          type="password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {result === "register" && (
          <input className="form-control auth-form-control"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        )}
        <div className="loadingComponent">{loading && <Loading />}</div>
        <button  className="formButton btn btn-success" type = "submit"> {what} </button>

        {errorReason && (
          <>
            <div className="errorReason">{errorReason}</div>
              {errorReason === "Login Failed." && (
                <div className="reminder">Reminder: Username and Password are case sensitive</div>
              )}
          </>
        )}

        <p className="otherFormMessage">Click to <Link className="nav-link" to={link}>{text} </Link> here</p>
    </form>
    </div>
  )
}

export default Form