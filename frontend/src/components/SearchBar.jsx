import React, {useState} from "react";

function SearchBar({ onSearch }) {
    const [ticker, setTicker] = useState("");
    const [stockData, setStockData] = useState(null)

    const handleSearch = async () => {
        const data = await onSearch(ticker); //calls parent's fetchStockData 
        setStockData(data); //saves result 
    };

    return (
        <div className = "form-container">
            <input className="form-input"
                type = "text"
                placeholder = "Search Stocks"
                value = {ticker}
                onChange = {(e) => setTicker(e.target.value)}
            /> 
            <button className = "form-button" onClick = {handleSearch}>Search</button> {/*search button*/    }

            {stockData && ( 
                <div>
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




/*import React, { useState } from "react";

function SearchBar({ onSearch }) {
    const [ticker, setTicker] = useState("");
    const [stockData, setStockData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        const input = e.target.value;
        setTicker(input);

        if (input.length > 0) {
            try {
                const res = await onSearch(input); // Use parent's fetch function for autocomplete
                if (res.matches) {
                    setSuggestions(res.matches); // Display suggestions from backend
                } else {
                    setSuggestions([]);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = async () => {
        setSuggestions([]); // Clear suggestions on search
        const data = await onSearch(ticker); // Fetch full stock data
        setStockData(data); // Save result to display
    };

    const handleSuggestionClick = (suggestion) => {
        setTicker(suggestion); // Set the clicked suggestion as the ticker
        setSuggestions([]); // Clear suggestions
    };

    return (
        <div className="form-container">
            <input
                className="form-input"
                type="text"
                placeholder="Search Stocks"
                value={ticker}
                onChange={handleInputChange}
            />
            <button className="form-button" onClick={handleSearch}>
                Search
            </button>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="suggestion-item"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            {stockData && (
                <div>
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

export default SearchBar;*/
