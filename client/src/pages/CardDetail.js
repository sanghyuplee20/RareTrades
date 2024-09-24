import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../pages/AuthContext'; // Adjust the path as necessary
import './CardDetail.css';

function CardDetail() {
  const [card, setCard] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { brand, id } = useParams();
  const navigate = useNavigate();

  // Get authentication status and user info from AuthContext
  const { isAuthenticated, token } = useContext(AuthContext);

  // Fetch card details and comments
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/cards/${brand}/${id}`);
        setCard(response.data);
      } catch (err) {
        console.error('Error fetching card details:', err);
        setError('Failed to fetch card details.');
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/cards/${brand}/${id}/comments`);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        // Optionally set an error state for comments
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCard(), fetchComments()]);
      setLoading(false);
    };

    fetchData();
  }, [brand, id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      setError('Comment text cannot be empty.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:4000/api/cards/${brand}/${id}/comments`,
        { comment_text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      setError(null); // Clear any previous errors

      // Refresh comments
      const response = await axios.get(`http://localhost:4000/api/cards/${brand}/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment. Please try again.');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error && !card) return <div className="error">{error}</div>;
  if (!card) return <div className="no-data">No card data available.</div>;

  return (
    <div className="card-detail-container">
      <h2>{card.name}</h2>
      <img
        src={card.image_url || '/default-image.png'}
        alt={card.name}
        className="card-image"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if default image fails
          e.target.src = '/default-image.png'; // Fallback image
        }}
      />
      <p><strong>Price:</strong> ${card.price}</p>
      <p><strong>Description:</strong> {card.description}</p>
      <div className="card-stats">
        <h3>Statistics</h3>
        {card.stats && (
          <div className="stats">
            {Object.entries(card.stats).map(([key, value]) => (
              <div key={key} className="stat-item">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {Array.isArray(value) ? value.join(', ') : value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Button */}
      <button className="buy-button">Buy Now</button>

      {/* Commenting Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.username}</strong> ({new Date(comment.created_at).toLocaleString()}):</p>
            <p>{comment.comment_text}</p>
          </div>
        ))}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your comment..."
              required
            ></textarea>
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <p>
            Please <Link to="/login">login</Link> to post a comment.
          </p>
        )}
      </div>
    </div>
  );
}

export default CardDetail;
