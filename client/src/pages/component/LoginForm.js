import React, { useState, useContext } from 'react';
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Adjust the path based on your directory structure

function LoginForm() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const { login } = useContext(AuthContext); // Use 'login' function from context

  // State for handling errors
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setError(null); // Reset previous errors

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      console.log('Server response:', result); // Debugging

      if (response.ok && result.success) {
        // Successful login
        console.log(result.message); // e.g., "Login successful"
        console.log(`Welcome ${result.username}`);

        // Use the login function from AuthContext to update authentication state
        login(result.token, result.username);

        // Redirect to a protected route or homepage
        navigate('/dashboard'); // Adjust the path as needed
      } else {
        // Handle login failure (invalid credentials or other errors)
        console.log(result.message); // e.g., "Invalid credentials"
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error.message || error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="loginform">
      <form onSubmit={handleSubmit}>
        <h1 className="logo">RareTrades</h1>

        {error && <div className="error-message">{error}</div>} {/* Display error message */}

        <div className="login--input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
          />
        </div>

        <div className="login--input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>

        <button type="submit">Submit</button>

        <div className="login--remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          {/* Replace <a> with <Link> */}
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
        </div>

        <div className="login--register">
          <p>
            Don't have an account? <Link to="/join">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
