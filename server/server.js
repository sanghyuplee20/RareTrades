// server.js

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from the frontend
  })
);

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Configure PostgreSQL connection using environment variables
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Initialize cache
const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL of 1 hour

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

// Fetch combined cards sorted by last_updated (most recent)
app.get('/api/cards', async (req, res) => {
  try {
    const cachedCards = cache.get('recentCards');
    if (cachedCards) {
      return res.json(cachedCards);
    }

    const result = await pool.query(`
      SELECT id, name, image_url, price, views, brand
      FROM cards
      ORDER BY last_updated DESC
      LIMIT 20
    `);

    cache.set('recentCards', result.rows); // Cache the data
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recent cards:', error);
    res.status(500).json({ message: 'Failed to fetch recent cards' });
  }
});

// Fetch individual card by ID and brand
app.get('/api/cards/:brand/:id', async (req, res) => {
  const { brand, id } = req.params;
  try {
    // Increment views
    await pool.query('UPDATE cards SET views = views + 1 WHERE id = $1 AND brand = $2', [id, brand]);

    const result = await pool.query('SELECT * FROM cards WHERE id = $1 AND brand = $2', [id, brand]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ message: 'Failed to fetch card' });
  }
});

// Get comments for a card
app.get('/api/cards/:brand/:id/comments', async (req, res) => {
  const { brand, id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.comment_text, c.created_at, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.card_id = $1 AND c.brand = $2 
       ORDER BY c.created_at ASC`,
      [id, brand]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Post a comment for a card (authenticated)
app.post('/api/cards/:brand/:id/comments', authenticateToken, async (req, res) => {
  const { brand, id } = req.params;
  const { comment_text } = req.body;
  const user_id = req.user.userId;

  if (!comment_text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    await pool.query(
      `INSERT INTO comments (card_id, brand, user_id, comment_text, created_at) 
       VALUES ($1, $2, $3, $4, NOW())`,
      [id, brand, user_id, comment_text]
    );
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
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
