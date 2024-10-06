require('dotenv').config();
// Import required modules
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

// Initialize the express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON data from requests

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost', // Your MySQL host
    user: 'root',      // Your MySQL username
    password: 'had%CYM3#schcs',  // Your MySQL password
    database: 'travelagency' // Your MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

// POST route for Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const query = 'SELECT * FROM Customer WHERE Email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error retrieving customer:', err);
            return res.json({ success: false });
        }
        if (results.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        const customer = results[0];

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, customer.Password);

        if (passwordMatch) {
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// POST route for Sign-Up
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if email already exists
    const emailCheckQuery = 'SELECT * FROM Customer WHERE Email = ?';
    db.query(emailCheckQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.json({ success: false, message: 'Error checking email' });
        }
        if (results.length > 0) {
            return res.json({ success: false, message: 'Email already exists' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new customer into database
        const query = 'INSERT INTO Customer (FirstName, LastName, Email, Phone, Password) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [firstName, lastName, email, phone, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting customer:', err);
                return res.json({ success: false, message: 'Sign up failed' });
            }
            return res.json({ success: true, message: 'Sign up successful' });
        });
    });
});

// Fetch available cars based on trip details
app.post('/api/available-cars', (req, res) => {
    const { tripDate, startLocation, endLocation } = req.body;
    // Query your database to find cars available for the specified trip details
    const query = 'SELECT * FROM Cars WHERE availability = 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching cars:', err);
            res.status(500).send('Error fetching cars');
        } else {
            res.json(results);
        }
    });
});

// Update car availability after successful payment
app.post('/api/update-car-availability', (req, res) => {
    const { carId } = req.body;
    const query = 'UPDATE Cars SET availability = 0 WHERE id = ?';
    db.query(query, [carId], (err, result) => {
        if (err) {
            console.error('Error updating car availability:', err);
            res.status(500).send('Error updating car availability');
        } else {
            res.json({ success: true });
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});