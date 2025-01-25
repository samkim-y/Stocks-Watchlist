import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import api from "../api"
import "../styles/Form.css"
import Watchlist from "../components/Watchlist"
import SearchBarMain from "../components/SearchBarMain"


function Main(){
    const [watchlists, setWatchlists] = useState([]);
    const [watchlistName, setWatchlistName ]= useState("");
    const [stockData, setStockData] = useState(null)
    const [selectedWatchlist, setSelectedWatchlist] = useState(null)
    
    //home button
    const navigate = useNavigate(); 
    const handleHomeClick = ()=> {
        navigate("/logout");
    };

    //Watchlist
    useEffect(()=> {
        getWatchlists();
    },[]);

    const getWatchlists= () => { //get list of Watchlists 
        api.get("/api/watchlist/")
        .then((res) => res.data)
        .then((data) => {
            setWatchlists(data)
        })
        .catch((err)=> alert(err));
    };

    const createWatchlist = (e) => { //create watchlist
        e.preventDefault()
        api.post("/api/watchlist/", {name: watchlistName}).then((res) => {
            if (res.status === 201) alert ("Watchlist Created")
                else alert("Failed to create Watchlist")
            getWatchlists();
        }).catch((err)=> alert(err))
    };

    const deleteWatchlist = (id) => { //delete Watchlist
        api.delete(`/api/watchlist/delete/${id}/`).then ((res) => {
            if (res.status ===204) alert("Watchlist Deleted")
                else alert("Failed to delete Watchlist")
            getWatchlists();
        }).catch((error)=> alert(error));
    };

    //Stock Entries
    const fetchStockData = async (ticker) => { //searchbar 
        const data = await api
        .get(`/api/getstock/?ticker=${ticker}`)
        .then((res)=> res.data)
        .catch((err) => {
            console.error(err)
            return {error: "Invalid Ticker"}
        }); //check this *********
        
        return data
    };

    const handleAddStock = (data) => {
        setStockData(data);
    };


    const handleAddToWatchlist = () => {
        api.get(`/api/watchlist/${selectedWatchlist}/stocks/`)
        .then((res)=> {
            const existingStocks = res.data;
            const stockExists = existingStocks.some(stock => stock.symbol === stockData.ticker);
            if (stockExists){
                alert("This stock is already in the watchlist");
                return;
            }
            // Add the stock to the selected watchlist
            api.post(`/api/watchlist/${selectedWatchlist}/stocks/`, {
                symbol: stockData.ticker,
                name: stockData.name,
                current_price: stockData.price,
            })
            .then(() => {
                alert(`${stockData.name} successfully added!`);      
                getWatchlists();
                setStockData(null); 
                setSelectedWatchlist(null); // Optionally reset selected watchlist
            })
            .catch((err) => alert("Failed to add stock to watchlist."));
        })
    };


    return <div>

        <div>
            <button className = "login-button" onClick ={handleHomeClick}>Logout</button>
        </div>
        
        <SearchBarMain onSearch = {fetchStockData} onAddStock={handleAddStock}/>
       
        {stockData && (
                <div className = "select-container">
                    <select
                        className="select-input"
                        value={selectedWatchlist || ""}
                        onChange={(e) => setSelectedWatchlist(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a watchlist
                        </option>
                        {watchlists.map((watchlist) => (
                            <option key={watchlist.id} value={watchlist.id}>
                                {watchlist.name}
                            </option>
                        ))}
                    </select>
                    <button className ="add2-button" onClick={handleAddToWatchlist}>Add Stock</button>
                </div>
            )}

         {/*create Watchlist*/}
         <div>
        <h2>Watchlists</h2>    
        <form onSubmit = {createWatchlist}>
            <label htmlFor ="watchlistName"></label>
            <br/>
            <input
                className = "createWatchlist-input"
                type = "text"
                id="watchlistName"
                name = "watchlistName"
                placeholder = "Create New Watchlist"
                required
                onChange ={(e) => setWatchlistName(e.target.value)}
                value = {watchlistName}
            />
            <input className = "createWatchlist-button" type ="submit" value ="Create"></input>
        </form>
        </div>
        
        {/*Display Watchlists*/}
        <div>
            
            {watchlists.map((watchlist) =>(
                <Watchlist key={watchlist.id} 
                watchlist={watchlist} 
                onDelete={deleteWatchlist}
                />
            ))}
        </div>
</div> 
};

export default Main 