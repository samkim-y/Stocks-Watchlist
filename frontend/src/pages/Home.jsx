import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import api from "../api"
import SearchBar from "../components/SearchBar"


function Home(){
    const navigate = useNavigate();
    const handleLoginClick = ()=> {
        navigate("/login");
    };

    const handleWatchlistClick = () => {
        navigate("/watchlist")
    }

    const fetchStockData = async (ticker) => {
        try {
            const res = await api.get(`/api/getstock/?ticker=${ticker}`);
            return res.data; // Return data to SearchBar
        } catch (error) {
            console.error(error);
            return { error: "Failed to fetch stock data" };
        }
    
        return data
    };

    return <div>
        <h1>Welcome to Stock Search</h1>
        
        <p> To search stock info use the searchbar</p>
        <p> To create a watchlist login or register a new account</p>

            <button className = "login-button" onClick ={handleLoginClick}>Login/Register</button>
            
        <SearchBar onSearch = {fetchStockData} />


</div> 
};

export default Home 