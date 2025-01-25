import React, {useState, useEffect} from "react"
import "../styles/Stock.css"
import api from "../api"
import StockEntry from "./StockEntry.jsx"

function Watchlist({watchlist, onDelete}) {
    const [stockEntry, setStockEntry] = useState([])
    const [stockData, setStockData] = useState(null)
   
   useEffect(()=> {
    getStockEntries();
   },[]);

    const getStockEntries = () => { //getstocks
        api.get(`/api/watchlist/${watchlist.id}/stocks/`)
        .then((res) => res.data)
        .then((data)=> {
            setStockEntry(data)
        })
        .catch((err)=> alert(err));
    };

    const deleteStockEntry =(id) => { //delete stock entry 
        api
            .delete(`api/watchlist/${watchlist.id}/stocks/delete/${id}/`)
            .then((res) => { 
                if (res.status === 204) alert("Stock deleted");
                else alert ("Failed to delete stock from watchlist");
                getStockEntries();
        }).catch((error) => alert(error));
    } 


    return <div className = "stock-container">
    <h3>{watchlist.name}</h3>
    {stockEntry && stockEntry.length > 0 ? (
        stockEntry.map((stock) => (
            <div className ="stock-entry" key={stock.symbol}>
                <p className = "stock-content">{stock.name} ({stock.symbol}) - ${stock.current_price}</p>
                <button className = "delete-stock-button" onClick={()=> deleteStockEntry(stock.id)}>Delete</button>
            </div>
        ))
    ) : (
        <p>No stocks in this watchlist.</p>
    )}
    <button className = "delete-button" onClick={() => onDelete(watchlist.id)}>Delete Watchlist</button>
</div>
}

export default Watchlist