import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Rec.css';
import CardItem from './component/CardItem';

function Rec() {
    const [cards, setCards] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const banners = [require('../ui/rec1.png'), require('../ui/rec2.png')];

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/cards');
                setCards(response.data);
            } catch (err) {
                console.error('Error fetching cards:', err);
                setError('Failed to fetch cards. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    // Banner rotation logic remains the same
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000); // Change banner every 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="rec-container">
            <div className="banner">
                <img src={banners[currentBanner]} alt="Banner" />
            </div>

            <section className="card-section">
                <h2>Recent Cards</h2>
                <div className="card-grid">
                    {cards.map((card) => (
                        <Link key={`${card.brand}-${card.id}`} to={`/cards/${card.brand}/${card.id}`} className="card-link">
                            <CardItem card={card} />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Rec;
