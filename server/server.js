// server.js

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const axios = require('axios');
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from the frontend
  })
);

// Configure PostgreSQL connection using environment variables
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// In-memory cache variables
let pokemonCache = null;
let yugiohCache = null;

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // The token is expected to be in the format 'Bearer TOKEN'
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    // If there's no token, return unauthorized
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // If token is invalid or expired
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach user info to request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
}

// Fetch Pokémon cards
app.get('/api/pokemon-cards', async (req, res) => {
  try {
    if (pokemonCache) {
      return res.json(pokemonCache);
    }

    const apiUrl = 'https://api.pokemontcg.io/v2/cards';
    const response = await axios.get(apiUrl, {
      headers: {
        'X-Api-Key': process.env.POKEMON_API_KEY,
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
    pokemonCache = top10PokemonCards; // Cache the data

    res.json(top10PokemonCards);
  } catch (error) {
    console.error('Error fetching Pokémon cards:', error);
    res.status(500).json({ message: 'Failed to fetch Pokémon cards' });
  }
});

// Fetch Yu-Gi-Oh! cards
app.get('/api/yugioh-cards', async (req, res) => {
  try {
    if (yugiohCache) {
      return res.json(yugiohCache);
    }

    const yugiohApiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    const response = await axios.get(yugiohApiUrl);

    const sortedByPrice = response.data.data.sort((a, b) => {
      const priceA = parseFloat(a.card_prices?.[0]?.tcgplayer_price || 0);
      const priceB = parseFloat(b.card_prices?.[0]?.tcgplayer_price || 0);
      return priceB - priceA;
    });

    const top10YugiohCards = sortedByPrice.slice(0, 10);
    yugiohCache = top10YugiohCards; // Cache the data

    res.json(top10YugiohCards);
  } catch (error) {
    console.error('Error fetching Yu-Gi-Oh! cards:', error);
    res.status(500).json({ message: 'Failed to fetch Yu-Gi-Oh! cards' });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Received login request:", req.body); // Debugging

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Query the database to find the user by username
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Password matches, login is successful

        // Generate a JWT token
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Debugging: Check if the token is generated
        console.log("Generated token:", token);

        // Return the token to the client
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token: token,
          username: user.username,
        });
      } else {
        // Incorrect password
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    } else {
      // Username not found
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login query:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// User Signup
app.post("/api/signup", async (req, res) => {
  const { username, password, first_name, last_name, email } = req.body;

  // Check if all required fields are present
  if (!username || !password || !first_name || !last_name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Generate salt and hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const result = await pool.query(
      "INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [username, hashedPassword, first_name, last_name, email]
    );

    // Return success response with the new user's id
    return res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error during signup query:", error);

    // If the username or email is already taken, handle the error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

// Example protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is protected data.", user: req.user });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");

  // Debugging: Ensure ACCESS_TOKEN_SECRET is loaded
  console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
});
