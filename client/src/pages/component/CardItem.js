// components/CardItem.js

import React from 'react';
import './CardItem.css';

function CardItem({ card }) {
  return (
    <div className="card-item">
      <img src={card.image_url || '/default-image.png'} alt={card.name} />
      <h4>{card.name}</h4>
      <p>Price: ${card.price}</p>
      <p>Views: {card.views}</p>
    </div>
  );
}

export default CardItem;
