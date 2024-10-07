// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const ConfirmBooking = () => {
//     const location = useLocation();
//     const { bookingData } = location.state;
//     const navigate = useNavigate();

//     // Mocked customer and car data for demonstration
//     const customer = {
//         firstName: 'John',
//         lastName: 'Doe',
//         phone: '123-456-7890',
//         email: 'john@example.com',
//         address: '123 Main St, Bangalore',
//     };

//     const selectedCar = {
//         model: 'Mini Cooper',
//         capacity: '4 seats',
//         type: 'Hatchback',
//         licensePlate: 'KA-05-1234',
//         driverName: 'Jane Doe',
//         driverPhone: '987-654-3210',
//     };

//     const handleConfirmBooking = () => {
//         // Redirect to available cars page
//         navigate('/available-cars', { state: { bookingData, customer, selectedCar } });
//     };

//     return (
//         <div className="confirm-booking-container">
//             <h1>Confirm Your Booking</h1>
//             <h2>Customer Details</h2>
//             <p>Name: {customer.firstName} {customer.lastName}</p>
//             <p>Phone: {customer.phone}</p>
//             <p>Email: {customer.email}</p>
//             <p>Address: {customer.address}</p>

//             <h2>Car Details</h2>
//             <p>Model: {selectedCar.model}</p>
//             <p>Capacity: {selectedCar.capacity}</p>
//             <p>Type: {selectedCar.type}</p>
//             <p>License Plate: {selectedCar.licensePlate}</p>

//             <h2>Driver Details</h2>
//             <p>Driver: {selectedCar.driverName}</p>
//             <p>Phone: {selectedCar.driverPhone}</p>

//             <button onClick={handleConfirmBooking}>Confirm Booking</button>
//             <button onClick={() => navigate(-1)}>Go Back</button>
//         </div>
//     );
// };

// export default ConfirmBooking;



import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmBooking = () => {
    const location = useLocation();
    const { bookingData, selectedCar, customerID } = location.state || {}; // Ensure location.state exists
    const [customer, setCustomer] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch customer details if customerID exists
        const fetchCustomerDetails = async () => {
            if (customerID) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/customer-details/${customerID}`);
                    setCustomer(response.data);
                } catch (error) {
                    console.error('Error fetching customer details:', error);
                }
            }
        };

        fetchCustomerDetails(); // Call the async function
    }, [customerID]); // Only re-run the effect if customerID changes

    // Handle the case when bookingData, selectedCar, or customerID is missing
    if (!bookingData || !selectedCar || !customerID) {
        return <div>Error: Booking data, Car data, or Customer ID is missing.</div>;
    }

    const handleConfirmBooking = () => {
        const bookingPayload = {
            ...bookingData,
            selectedCar,
            customer,
        };

        axios.post('http://localhost:5000/api/confirm-booking', bookingPayload)
            .then(() => {
                navigate('/payment', { state: { bookingData, selectedCar, customer } });
            })
            .catch(error => {
                console.error('Error confirming booking:', error);
            });
    };

    return (
        <div className="confirm-booking-container">
            <h1>Confirm Your Booking</h1>
            {customer && (
                <>
                    <h2>Customer Details</h2>
                    <p>Name: {customer.FirstName} {customer.LastName}</p>
                    <p>Phone: {customer.Phone}</p>
                    <p>Email: {customer.Email}</p>
                </>
            )}
            <h2>Car Details</h2>
            <p>Model: {selectedCar.Model}</p>
            <p>License Plate: {selectedCar.LicensePlate}</p>

            <h2>Driver Details</h2>
            <p>Driver: {selectedCar.driverFirstName} {selectedCar.driverLastName}</p>

            <button onClick={handleConfirmBooking}>Confirm Booking</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
};

export default ConfirmBooking;
