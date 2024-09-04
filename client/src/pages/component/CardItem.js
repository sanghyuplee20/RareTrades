import React from 'react';
import './CardItem.css'; 

function CardItem({ imageUrl, name, price }) {
    return (
        <div className="card-item">
            <img
                src={imageUrl}
                alt={name}
                className="card-image"
            />
            <h2 className="card-name">{name}</h2>
            <p className="card-price">Price: ${price}</p>
        </div>
    );
}

export default CardItem;
