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

// // POST route for Login
// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;

//     // Check if user exists by email
//     const query = `
//         SELECT CustomerID, Password FROM Customer WHERE Email = ?;
//     `;

//     db.query(query, [email], async (err, result) => {
//         if (err || result.length === 0) {
//             // If the user doesn't exist or there's a query error, send a 401 response
//             return res.status(401).json({ success: false, message: 'Invalid credentials' });
//         }

//         // Extract the customer data
//         const customer = result[0];
//         const storedHashedPassword = customer.Password; // This is the hashed password stored in the database

//         try {
//             // Compare the provided password with the hashed password
//             const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

//             if (passwordMatch) {
//                 // Password is correct, return success with CustomerID
//                 return res.status(200).json({ success: true, message: 'Login successful', customerID: customer.CustomerID });
//             } else {
//                 // Password doesn't match
//                 return res.status(401).json({ success: false, message: 'Invalid credentials' });
//             }
//         } catch (error) {
//             // Handle any errors that occur during bcrypt comparison
//             return res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
//         }
//     });
// });

// app.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     const query = 'SELECT CustomerID, Password FROM Customer WHERE Email = ?';
//     db.query(query, [email], (err, results) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Database error' });
//         }

//         if (results.length === 0 || results[0].Password !== password) {
//             return res.status(401).json({ success: false, message: 'Invalid credentials' });
//         }

//         // Fetch customerID
//         const customerID = results[0].CustomerID;

//         // Return customerID along with success message
//         res.json({ success: true, customerID });
//     });
// });

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Logic to validate user and fetch customerID from the database
    const query = 'SELECT CustomerID FROM Customer WHERE email = ? AND password = ?';
    
    db.query(query, [email, password], (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving customer data');
        }
        
        if (result.length > 0) {
            const customerID = result[0].CustomerID;
            res.json({ success: true, customerID });
        } else {
            res.status(401).send('Invalid credentials');
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
            return res.status(500).json({ success: false, message: 'Error checking email' });
        }
        if (results.length > 0) {
            // If email exists, return a message indicating that
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        try {
            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new customer into the Customer table
            const query = `
                INSERT INTO Customer (FirstName, LastName, Email, Phone, Password)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(query, [firstName, lastName, email, phone, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting customer:', err);
                    return res.status(500).json({ success: false, message: 'Sign up failed' });
                }

                // If insertion is successful, return success message
                return res.status(201).json({ success: true, message: 'Sign up successful' });
            });
        } catch (error) {
            // Handle any errors that occur during password hashing
            console.error('Error hashing password:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

// Fetch available cars based on trip details
app.post('/api/available-cars', (req, res) => {
    const { startLocation, endLocation, vehicleType } = req.body;

    // Log the incoming request to see if the data is being received correctly
    console.log('Received request with data:', req.body);

    // Validate the request data
    if (!startLocation || !endLocation || !vehicleType) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields: startLocation, endLocation, or vehicleType' });
    }

    // Define the SQL query to fetch available cars based on vehicle type
    const query = `
        SELECT v.VehicleID, v.Model, v.LicensePlate, d.FirstName AS driverFirstName, d.LastName AS driverLastName, v.Capacity
        FROM Vehicle v
        JOIN Driver d ON v.VehicleID = d.AssignedVehicleID
        WHERE v.AvailabilityStatus = 'Available' 
        AND v.VehicleType = ?  -- Filter by the selected VehicleType
    `;

    // Log the query and the values being passed to the database
    console.log('Executing query with vehicleType:', vehicleType);

    // Execute the query and handle the results or any errors
    db.query(query, [vehicleType], (err, results) => {
        if (err) {
            console.error('Error fetching available cars from the database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // If no cars are available, return an appropriate message
        if (results.length === 0) {
            return res.status(404).json({ message: 'No available cars found for the selected vehicle type' });
        }

        // Respond with the results if successful
        res.json(results);
    });
});

app.post('/api/update-car-availability', (req, res) => {
    const { carId } = req.body;

    // Mark the car unavailable on the trip date and available the next day
    const query = `UPDATE Vehicle SET AvailabilityStatus = 'Unavailable' WHERE VehicleID = ?`;
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

app.get('/api/customer-id', async (req, res) => {
    const customerEmail = req.query.customerEmail;
    if (!customerEmail) {
        return res.status(400).json({ error: 'Customer email is required' });
    }
    try {
        const customer = await db.query('SELECT CustomerID FROM Customer WHERE Email = ?', [customerEmail]);
        if (customer.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ customerID: customer[0].CustomerID });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching customer ID' });
    }
});

// Updated: Get customer details by customerID passed as a route parameter
app.get('/api/customer-details/:customerID', async (req, res) => {
    const customerID = req.params.customerID;
    try {
        const customer = await db.query('SELECT * FROM Customer WHERE CustomerID = ?', [customerID]);
        res.json(customer[0]); // Return the first result
    } catch (error) {
        res.status(500).json({ error: 'Error fetching customer details' });
    }
});

app.post('/api/confirm-booking', async (req, res) => {
    const { tripDate, bookingDate, startLocation, endLocation, selectedCar, customer, price } = req.body;

    if (!price) {
        return res.status(400).json({ success: false, message: 'Price is required' });
    }

    try {
        // Insert the booking into the database
        const query = `
            INSERT INTO Booking (CustomerID, VehicleID, DriverID, TripDate, BookingDate, StartLocation, EndLocation, TotalCost, PaymentStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        `;
        const bookingResult = await db.query(query, [
            customer.CustomerID, 
            selectedCar.VehicleID, 
            selectedCar.DriverID, 
            tripDate, 
            bookingDate, 
            startLocation, 
            endLocation, 
            price
        ]);

        // Fetch the newly created booking details
        const bookingDetailsQuery = `
            SELECT 
                b.BookingID, b.TripDate, b.BookingDate, b.StartLocation, b.EndLocation, b.TotalCost, b.PaymentStatus,
                v.VehicleType, v.LicensePlate, v.Model, 
                d.FirstName AS DriverFirstName, d.LastName AS DriverLastName, d.Phone AS DriverPhone,
                c.FirstName AS CustomerFirstName, c.LastName AS CustomerLastName, c.Email AS CustomerEmail, c.Phone AS CustomerPhone
            FROM Booking b
            JOIN Vehicle v ON b.VehicleID = v.VehicleID
            JOIN Driver d ON b.DriverID = d.DriverID
            JOIN Customer c ON b.CustomerID = c.CustomerID
            WHERE b.BookingID = ?
        `;
        const [bookingDetails] = await db.query(bookingDetailsQuery, [bookingResult.insertId]);

        res.status(200).json({
            success: true,
            message: 'Booking confirmed',
            bookingID: bookingResult.insertId,
            vehicleDetails: bookingDetails
        });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
