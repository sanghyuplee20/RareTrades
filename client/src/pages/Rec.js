import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Rec.css';
import CardItem from './component/CardItem'; // Import the CardItem component

function Rec() {
    const [pokemonCards, setPokemonCards] = useState([]);
    const [yugiohCards, setYugiohCards] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const banners = [require('../ui/rec1.png'), require('../ui/rec2.png')];

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

                const sortedByPrice = response.data.data.sort((a, b) => {
                    const priceA = a.tcgplayer?.prices?.normal?.high || 0;
                    const priceB = b.tcgplayer?.prices?.normal?.high || 0;
                    return priceB - priceA;
                });

                const top10PokemonCards = sortedByPrice.slice(0, 10);
                setPokemonCards(top10PokemonCards);
            } catch (err) {
                console.error('Error fetching Pokémon cards:', err);
                setError('Failed to fetch Pokémon cards. Please try again later.');
            }
        };

        const fetchYugiohCards = async () => {
            try {
                const yugiohApiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
                const response = await axios.get(yugiohApiUrl);

                const sortedByPrice = response.data.data.sort((a, b) => {
                    const priceA = parseFloat(a.card_prices?.[0]?.tcgplayer_price || 0);
                    const priceB = parseFloat(b.card_prices?.[0]?.tcgplayer_price || 0);
                    return priceB - priceA;
                });

                const top10YugiohCards = sortedByPrice.slice(0, 10);
                setYugiohCards(top10YugiohCards);
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

    const handleNextBanner = () => {
        setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
    };

    const handlePrevBanner = () => {
        setCurrentBanner((prevBanner) => (prevBanner - 1 + banners.length) % banners.length);
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
                <button className="banner-button left" onClick={handlePrevBanner}></button>
                <img src={banners[currentBanner]} alt="Banner" className="banner-image" />
                <button className="banner-button right" onClick={handleNextBanner}></button>
                <div className="banner-dots">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentBanner ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(index)}
                        ></button>
                    ))}
                </div>
            </div>
            <div className="yugioh-section">
                <h1>Top 10 Most Expensive Yu-Gi-Oh! Cards</h1>
                <div className="cards-row">
                    {yugiohCards.map((card, index) => (
                        <CardItem
                            key={card.id}
                            imageUrl={card.card_images[0].image_url_small}
                            name={card.name}
                            price={parseFloat(card.card_prices?.[0]?.tcgplayer_price || 0).toFixed(2)}
                        />
                    ))}
                </div>
            </div>
            <div className="pokemon-section">
                <h1>Top 10 Most Expensive Pokémon Cards</h1>
                <div className="cards-row">
                    {pokemonCards.map((card, index) => (
                        <CardItem
                            key={card.id}
                            imageUrl={card.images.small}
                            name={card.name}
                            price={card.tcgplayer?.prices?.normal?.high?.toFixed(2) || 'N/A'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Rec;
