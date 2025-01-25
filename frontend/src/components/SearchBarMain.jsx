import React, {useState} from "react";

function SearchBar({ onSearch, onAddStock }) {
    const [ticker, setTicker] = useState("");
    const [stockData, setStockData] = useState(null)

    const handleSearch = async () => {
        const data = await onSearch(ticker); //calls parent's fetchStockData 
        setStockData(data); //saves result 
    };

    const handleAdd = () => {
        if (stockData && !stockData.error) {
            onAddStock(stockData); // Pass stockData to the parent component
        } else {
            alert("Please search for a valid stock before adding to the watchlist.");
        }
    };

    return (
        <div className = "form-container">
            <input className="form-input"
                type = "text"
                placeholder = "Search Stocks"
                value = {ticker}
                onChange = {(e) => setTicker(e.target.value)}
            /> 

            {/*search button*/}
            <button className = "form-button" onClick = {handleSearch}>Search</button> 

            {stockData && ( 
                <div>
                    <button className = "add-button" onClick = {handleAdd} >Add to Watchlist</button>
                    {stockData.error ? (
                        <p style={{ color: "red" }}>{stockData.error}</p>
                    ) : (
                        <div>
                            <p>Name: {stockData.name}</p>
                            <p>Ticker: {stockData.ticker}</p>
                            <p>Price: ${stockData.price}</p>
                            <p>Market Cap: {stockData.marketCap}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default SearchBar; 


