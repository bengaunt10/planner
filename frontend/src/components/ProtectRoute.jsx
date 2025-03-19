import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import { useState, useEffect} from "react"
import Loading from "./Loading"


// eslint-disable-next-line react/prop-types
function ProtectRoute({children}) {

    const baseUrl = import.meta.env.BASE_URL;
    const [isAuth, setIsAuth] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuth(false))
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refresh')
        try {
            const response = await fetch(`${baseUrl}/token/refresh`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                //   'Authorization': `Bearer ${Token}`
                },
                body: JSON.stringify({refreshToken})
            });
            if(response.ok){
                const data = await response.json()
                localStorage.setItem("access", data.access)
                setIsAuth(true)
            }
            else{
                setIsAuth(false)
            }
        }catch (error){
            console.log(error)
            setIsAuth(false)
        }   
    };

    

    const auth =async () => {
        const Token = localStorage.getItem("access")
        if (!Token){
            setIsAuth(false)
            return
        }
        const decoded = jwtDecode(Token)
        const expiry = decoded.exp
        const now = Date.now() / 1000

        if (expiry < now ){
            await refreshToken()
        }else{
            setIsAuth(true)
        }
    }

    if (isAuth === null) {
        // return <div>Loading...</div>
        return <div className="refreshLoader"><Loading /></div>
    }

    return isAuth ? children : <Navigate to="/login" />
}

export default ProtectRoute