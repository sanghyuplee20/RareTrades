import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap around your app
export function AuthProvider({ children }) {
  // Initialize state from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  // Derive authentication status
  const isAuthenticated = !!token;

  // Effect to synchronize state with localStorage
  useEffect(() => {
    console.log('Auth state updated:', { token, username }); // Debugging

    if (token && username) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [token, username]);

  // Function to handle login
  const login = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  // Function to handle logout
  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
