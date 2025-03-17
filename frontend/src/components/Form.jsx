/* eslint-disable react/prop-types */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../Styling/Form.css"

import Loading from "./Loading"

function Form({route, result}) {
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [loading, isLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmission = async (e) => {
    isLoading(true)
    e.preventDefault() 
    try {
      const response = await fetch(route, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify({username: userName, password: userPassword})
      });
      const data = await response.json()
      if(result ==="login"){
        localStorage.setItem("access", data.access )
        localStorage.setItem("refresh", data.refresh)
        navigate("/")

      }
      else{
        navigate("/login")
        }
    }catch(error){
      alert(error)

    }finally{
      isLoading(false)
    }


  }

  const what = result === "login" ? "Login" : "Register"

  return (
    <form onSubmit={handleSubmission}>
        <h1>{what}</h1>
        <label> username: </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="UserName"
          required
        />
        <label> Password: </label>
        <input
          type="password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {loading && <Loading />}
        <button  className="btn btn-primary" type = "submit"> {what} </button>
    </form>
  )
}

export default Form