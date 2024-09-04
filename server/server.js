const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt"); // Import bcrypt
require("dotenv").config(); // Load environment variables from .env file

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000" // Allow requests from the frontend
}));

// Configure PostgreSQL connection using environment variables
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Query the database to find the user by username
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            
            // Compare the provided password with the hashed password stored in the database
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (passwordMatch) {
                // Password matches, login is successful
                return res.status(200).json({ 
                    success: true, 
                    message: "Login successful", 
                    username: user.username 
                });
            } else {
                // Incorrect password
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } else {
            // Username not found
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login query:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
