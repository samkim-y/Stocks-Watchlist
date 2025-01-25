import api from "../api"
import { useNavigate ,Link} from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN} from "../constants"
import { useState } from "react"
import "../styles/Form.css"

function Form ({route, method}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState (false)
    const navigate = useNavigate()
    const name = method === "login"? "Login": "Register"

    const handleSubmit = async (e) => {
        setLoading(true); 
        e.preventDefault(); //prevents refreshing (default)

        try{
            const res = await api.post(route,{username,password})
            if (method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login") 
            }

        } catch(error){
            alert(error) //alert message 
        } finally{ 
            setLoading(false)
        }

    
    };

    const handleHomeClick = ()=> {
        navigate("/home");
    };



    return <div>
    <button className = "home-button" onClick={handleHomeClick}>Home</button>
    
    <form onSubmit ={handleSubmit} className = "form-container">
        <h1>{name} </h1>
        <input 
            className = "form-input"
            type = "text"
            value = {username}
            onChange = {(e) => setUsername(e.target.value)}
            placeholder = "Username" 
        />

        <input 
            className = "form-input"
            type = "password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            placeholder = "Password"
        />

        <button className = "form-button" type = "submit">
            {name}
        </button>
        {/* Show Register link only if the method is "login" */}
        {method === "login" && (
                <p className="form-text">
                    New user?{" "}
                    <Link to="/register" className="form-link">
                        Register here
                    </Link>
                </p>
            )}
    </form>
    
    </div>
    
}

export default Form 


