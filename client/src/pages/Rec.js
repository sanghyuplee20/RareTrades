import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Rec.css'; // Ensure you have styles for horizontal scrolling

function Rec() {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [yugiohCards, setYugiohCards] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0); // State to manage the current banner image
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const banners = [require('../ui/rec1.png'), require('../ui/rec2.png')]; // Array of banner images

  useEffect(() => {
    const fetchPokemonCards = async () => {
      try {
        const apiUrl = 'https://api.pokemontcg.io/v2/cards';
        const response = await axios.get(apiUrl, {
          headers: {
            'X-Api-Key': process.env.REACT_APP_POKEMON_API_KEY,
          },
          params: {
            pageSize: 250,
          },
        });

        const sortedByReleaseDate = response.data.data.sort(
          (a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate)
        );

        const recentPokemonCards = sortedByReleaseDate.slice(0, 10);
        setPokemonCards(recentPokemonCards);
      } catch (err) {
        console.error('Error fetching Pokémon cards:', err);
        setError('Failed to fetch Pokémon cards. Please try again later.');
      }
    };

    const fetchYugiohCards = async () => {
      try {
        const yugiohApiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
        const response = await axios.get(yugiohApiUrl);

        const randomYugiohCards = response.data.data
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);

        setYugiohCards(randomYugiohCards);
      } catch (err) {
        console.error('Error fetching Yu-Gi-Oh! cards:', err);
        setError('Failed to fetch Yu-Gi-Oh! cards. Please try again later.');
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchPokemonCards();
      await fetchYugiohCards();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleNextBanner = (index) => {
    setCurrentBanner(index);
  };

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
        <img src={banners[currentBanner]} alt="Banner" className="banner-image" />
        <div className="banner-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => handleNextBanner(index)}
            >
              {/* Empty content since we're styling the dots */}
            </button>
          ))}
        </div>
      </div>

      <div className="pokemon-section">
        <h1>Recently Released Pokémon Cards</h1>
        <div className="cards-row">
          {pokemonCards.map((card, index) => (
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

      <div className="yugioh-section">
        <h1>Random Yu-Gi-Oh! Card Recommendations</h1>
        <div className="cards-row">
          {yugiohCards.map((card, index) => (
            <div key={card.id} className="card-item">
              <span className="badge">{index + 1}</span>
              <img
                src={card.card_images[0].image_url}
                alt={card.name}
                className="card-image"
              />
              <h2 className="card-name">{card.name}</h2>
              <p className="card-type">
                Type: {card.type}
              </p>
              <p className="card-race">
                Race: {card.race}
              </p>
              <span className="quick-buy">Quick Buy</span>
              <span className="bookmark">🔖</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rec;
