// LoginForm.js

import React, { useState, useContext } from 'react';
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Adjust the path based on your directory structure

function LoginForm() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const { setAuth } = useContext(AuthContext);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

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

      if (response.ok) {
        // Successful login
        console.log(result.message); // e.g., "Login successful"
        console.log(`Welcome ${result.username}`);

        // Store the token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.username);

        // Update the auth context
        setAuth({
          token: result.token,
          username: result.username,
        });

        // Redirect to a protected route or homepage
        navigate('/dashboard'); // Adjust the path as needed
      } else {
        // Handle login failure (invalid credentials or other errors)
        console.log(result.message); // e.g., "Invalid credentials"
        alert(result.message); // Display error message to the user
      }
    } catch (error) {
      console.error('Error during login:', error.message || error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="loginform">
      <form onSubmit={handleSubmit}>
        <h1 className="logo">RareTrades</h1>

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
          <a href="#">Forgot password?</a>
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