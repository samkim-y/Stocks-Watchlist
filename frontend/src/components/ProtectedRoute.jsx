import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api" //imports api we created
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants"
import {useState, useEffect} from "react"



function ProtectedRoute ({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => { //everytime component loads, runs auth()
        auth().catch(()=> setIsAuthorized(false))
    }, [])


    //function1
    const refreshToken = async() => { 
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200){ //if refresh successful, set new accessToken 
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)    
            }else { //if refresh unsuccessful
                setIsAuthorized(false)
            }
        }catch (error){ //if error occurs
            console.log(error)
            setIsAuthorized(false)
        }
    }


    const auth = async() => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp //expiration date
        const now = Date.now() / 1000 //current time, in seconds instead of ms

        if (tokenExpiration < now){ //if token has expired, call refreshToken
            await refreshToken()
        } else{ //if token is still valid
            setIsAuthorized(true)
        }
    }

    //conditional rendering
    if (isAuthorized === null) { 
        return <div>Loading...</div>
    }

    //if user is authorized, renders children component (protected route content)
    return isAuthorized ? children : <Navigate to ="/home"/>
 }

 export default ProtectedRoute