import React, {useState} from "react"

function StockEntry ({stock, onDelete}) { 
    
    return <div>
        <p> Name: {stock.name}, Symbol: {stock.symbol}, Current price: {stock.current_price} </p>


        <button onClick={() => onDelete(stock.id)}>Delete</button>
    </div>


}

export default StockEntry