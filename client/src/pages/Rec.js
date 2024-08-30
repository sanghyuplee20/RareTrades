import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Rec.css'; // Ensure you have styles for horizontal scrolling

function Rec() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonCards = async () => {
      try {
        const apiUrl = 'https://api.pokemontcg.io/v2/cards';

        const response = await axios.get(apiUrl, {
          headers: {
            'X-Api-Key': process.env.REACT_APP_POKEMON_API_KEY,
          },
          params: {
            pageSize: 250, // Fetch a large number to ensure we have enough data
          },
        });

        const allCards = response.data.data;

        // Filter cards that have price information
        const cardsWithPrices = allCards.filter(
          (card) => card.tcgplayer && card.tcgplayer.prices && (
            card.tcgplayer.prices.holofoil?.high ||
            card.tcgplayer.prices.normal?.high ||
            card.tcgplayer.prices.reverseHolofoil?.high ||
            card.tcgplayer.prices.firstEditionHolofoil?.high
          )
        );

        // Map cards to include the highest available price
        const cardsWithHighestPrice = cardsWithPrices.map((card) => {
          const prices = card.tcgplayer.prices;
          const highPrices = [
            prices.holofoil?.high || 0,
            prices.normal?.high || 0,
            prices.reverseHolofoil?.high || 0,
            prices.firstEditionHolofoil?.high || 0,
          ];
          const highestPrice = Math.max(...highPrices);
          return { ...card, highestPrice };
        });

        // Sort cards by highestPrice descending
        const sortedCards = cardsWithHighestPrice.sort(
          (a, b) => b.highestPrice - a.highestPrice
        );

        // Shuffle the sorted cards to introduce randomness
        const shuffledCards = sortedCards.sort(() => 0.5 - Math.random());

        // Take a random set of 10 cards from the shuffled array
        const top10Cards = shuffledCards.slice(0, 10);

        setCards(top10Cards);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchPokemonCards();
  }, []);

  if (loading) {
    return (
      <div className="rec-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rec-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="rec-container">
      <h1>Random Pokémon Card Recommendations</h1>
      <div className="cards-row">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            <img
              src={card.images.large || card.images.small}
              alt={card.name}
              className="card-image"
            />
            <h2 className="card-name">{card.name}</h2>
            <p className="card-price">
              Price: ${card.highestPrice.toFixed(2)}
            </p>
            <p className="card-set">
              Set: {card.set.name} ({card.set.series})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rec;
