// require('dotenv').config();
// // Import required modules
// const express = require('express');
// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const cors = require('cors');

// // Initialize the express app
// const app = express();
// const port = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse JSON data from requests

// // MySQL database connection
// const db = mysql.createConnection({
//     host: 'localhost', // Your MySQL host
//     user: 'root',      // Your MySQL username
//     password: 'had%CYM3#schcs',  // Your MySQL password
//     database: 'travelagency' // Your MySQL database name
// });

// // Connect to the database
// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err);
//     } else {
//         console.log('Connected to the MySQL database');
//     }
// });

// // POST route for Login
// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;

//     // Check if user exists
//     const query = 'SELECT * FROM Customer WHERE Email = ?';
//     db.query(query, [email], async (err, results) => {
//         if (err) {
//             console.error('Error retrieving customer:', err);
//             return res.json({ success: false });
//         }
//         if (results.length === 0) {
//             return res.json({ success: false, message: 'User not found' });
//         }

//         const customer = results[0];

//         // Compare the hashed password
//         const passwordMatch = await bcrypt.compare(password, customer.Password);

//         if (passwordMatch) {
//             return res.json({ success: true, message: 'Login successful' });
//         } else {
//             return res.json({ success: false, message: 'Invalid credentials' });
//         }
//     });
// });

// // POST route for Sign-Up
// app.post('/api/signup', async (req, res) => {
//     const { firstName, lastName, email, phone, password } = req.body;

//     // Check if email already exists
//     const emailCheckQuery = 'SELECT * FROM Customer WHERE Email = ?';
//     db.query(emailCheckQuery, [email], async (err, results) => {
//         if (err) {
//             console.error('Error checking email:', err);
//             return res.json({ success: false, message: 'Error checking email' });
//         }
//         if (results.length > 0) {
//             return res.json({ success: false, message: 'Email already exists' });
//         }

//         // Hash the password before storing
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert new customer into database
//         const query = 'INSERT INTO Customer (FirstName, LastName, Email, Phone, Password) VALUES (?, ?, ?, ?, ?)';
//         db.query(query, [firstName, lastName, email, phone, hashedPassword], (err, result) => {
//             if (err) {
//                 console.error('Error inserting customer:', err);
//                 return res.json({ success: false, message: 'Sign up failed' });
//             }
//             return res.json({ success: true, message: 'Sign up successful' });
//         });
//     });
// });

// // Fetch available cars based on trip details
// app.post('/api/available-cars', async (req, res) => {
//     const { startLocation, endLocation } = req.body;

//     try {
//         const query = `
//             SELECT v.VehicleID, v.Model, v.LicensePlate, d.FirstName as driverFirstName, d.LastName as driverLastName
//             FROM Vehicle v
//             JOIN Driver d ON v.VehicleID = d.AssignedVehicleID
//             WHERE v.AvailabilityStatus = 'Available' 
//             AND v.VehicleID NOT IN (
//                 SELECT VehicleID FROM Booking 
//                 WHERE StartLocation = ? AND EndLocation = ? AND TripDate >= CURDATE()
//             )
//         `;

//         const [results] = await db.query(query, [startLocation, endLocation]);
//         res.json(results);
//     } catch (error) {
//         console.error('Error fetching available cars:', error);
//         res.status(500).send('Server error');
//     }
// });


// app.post('/api/update-car-availability', (req, res) => {
//     const { carId } = req.body;

//     // Mark the car unavailable on the trip date and available the next day
//     const query = 'UPDATE Cars SET availability = 0 WHERE id = ?';
//     db.query(query, [carId], (err, result) => {
//         if (err) {
//             console.error('Error updating car availability:', err);
//             res.status(500).send('Error updating car availability');
//         } else {
//             // Optionally schedule the car to be available again the next day (handled via cron job or external system)
//             res.json({ success: true });
//         }
//     });
// });

// app.get('/api/customer-details', async (req, res) => {
//     const CustomerID = req.session.CustomerID; // Assuming customer ID is stored in the session
//     try {
//         const query = 'SELECT * FROM Customer WHERE CustomerID = ?';
//         const [results] = await db.query(query, [CustomerID]);
//         res.json(results[0]);
//     } catch (error) {
//         console.error('Error fetching customer details:', error);
//         res.status(500).send('Server error');
//     }
// });


// app.post('/api/confirm-booking', async (req, res) => {
//     const { tripDate, bookingDate, startLocation, endLocation, price, selectedCar, customer } = req.body;

//     try {
//         const query = `
//             INSERT INTO Booking (CustomerID, VehicleID, DriverID, TripDate, BookingDate, StartLocation, EndLocation, TotalCost, PaymentStatus)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
//         `;

//         await db.query(query, [customer.CustomerID, selectedCar.VehicleID, selectedCar.DriverID, tripDate, bookingDate, startLocation, endLocation, price]);
//         res.status(200).send('Booking confirmed');
//     } catch (error) {
//         console.error('Error confirming booking:', error);
//         res.status(500).send('Server error');
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });


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
            return res.json({ success: true, message: 'Login successful', customerID: customer.CustomerID });
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
app.post('/api/available-cars', async (req, res) => {
    const { startLocation, endLocation } = req.body;

    try {
        const query = `
            SELECT v.VehicleID, v.Model, v.LicensePlate, d.FirstName as driverFirstName, d.LastName as driverLastName
            FROM Vehicle v
            JOIN Driver d ON v.VehicleID = d.AssignedVehicleID
            WHERE v.AvailabilityStatus = 'Available' 
            AND v.VehicleID NOT IN (
                SELECT VehicleID FROM Booking 
                WHERE StartLocation = ? AND EndLocation = ? AND TripDate >= CURDATE()
            )
        `;

        const [results] = await db.query(query, [startLocation, endLocation]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching available cars:', error);
        res.status(500).send('Server error');
    }
});

app.post('/api/update-car-availability', (req, res) => {
    const { carId } = req.body;

    // Mark the car unavailable on the trip date and available the next day
    const query = 'UPDATE Cars SET availability = 0 WHERE id = ?';
    db.query(query, [carId], (err, result) => {
        if (err) {
            console.error('Error updating car availability:', err);
            res.status(500).send('Error updating car availability');
        } else {
            // Optionally schedule the car to be available again the next day (handled via cron job or external system)
            res.json({ success: true });
        }
    });
});

// Updated: Get customer details by customerID passed as a route parameter
app.get('/api/customer-details/:customerID', async (req, res) => {
    const customerID = req.params.customerID; // Get the customer ID from the route parameters

    try {
        const query = 'SELECT * FROM Customer WHERE CustomerID = ?';
        const [results] = await db.query(query, [customerID]);
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).send('Server error');
    }
});

app.post('/api/confirm-booking', async (req, res) => {
    const { tripDate, bookingDate, startLocation, endLocation, price, selectedCar, customer } = req.body;

    try {
        const query = `
            INSERT INTO Booking (CustomerID, VehicleID, DriverID, TripDate, BookingDate, StartLocation, EndLocation, TotalCost, PaymentStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        `;

        await db.query(query, [customer.CustomerID, selectedCar.VehicleID, selectedCar.DriverID, tripDate, bookingDate, startLocation, endLocation, price]);
        res.status(200).send('Booking confirmed');
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
