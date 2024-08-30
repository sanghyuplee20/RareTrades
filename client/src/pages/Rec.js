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
            pageSize: 250, // Fetch a large number of cards to ensure we get the latest ones
          },
        });

        // Sort the cards by release date in descending order
        const sortedByReleaseDate = response.data.data.sort(
          (a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate)
        );

        // Take the most recent 10 cards
        const recentCards = sortedByReleaseDate.slice(0, 10);

        setCards(recentCards);
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
      <div className="banner-container">
        <img src={require('../ui/rec1.png')} alt="Banner" className="banner-image" />
      </div>
      <h1>Recently Released Pokémon Cards</h1>
      <div className="cards-row">
        {cards.map((card, index) => (
          <div key={card.id} className="card-item">
            <span className="badge">{index + 1}</span>
            <img
              src={card.images.large || card.images.small}
              alt={card.name}
              className="card-image"
            />
            <h2 className="card-name">{card.name}</h2>
            <p className="card-set">
              Set: {card.set.name} ({card.set.series})
            </p>
            <p className="card-release">Release Date: {new Date(card.set.releaseDate).toLocaleDateString()}</p>
            <span className="quick-buy">Quick Buy</span>
            <span className="bookmark">🔖</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rec;
