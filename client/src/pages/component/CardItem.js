// components/CardItem.js

import React from 'react';
import './CardItem.css';

function CardItem({ card }) {
  return (
    <div className="card-item">
      <img
        src={card.image_url || '/default-image.png'}
        alt={card.name}
        className="card-thumbnail"
      />
      <h4 className="card-name">{card.name}</h4>
      <p className="card-price">Price: ${card.price}</p>
      <p className="card-views">Views: {card.views}</p>
    </div>
  );
}

export default CardItem;
