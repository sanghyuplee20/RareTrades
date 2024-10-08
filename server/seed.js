// seed.js
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config(); 

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});

const addUserWithHashedPassword = async () => {
    const password = 'adminpassword'; // The password to hash
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error(err);
            return;
        }

        // Insert the user with the hashed password into the database
        try {
            const result = await pool.query(
                "INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5)",
                ['admin', hash, 'Sanghyup', 'Lee', 'slee548@jh.edu']
            );
            console.log('User added successfully');
        } catch (error) {
            console.error('Error inserting user:', error);
        } finally {
            pool.end(); // Close the pool connection when done
        }
    });
};

// Run the function to seed the user
addUserWithHashedPassword();
