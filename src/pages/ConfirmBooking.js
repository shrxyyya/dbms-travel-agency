import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/confirmBooking.css'

const ConfirmBooking = () => {
    const location = useLocation();
    const { bookingData, selectedCar, customerID } = location.state || {};  // Safely destructuring location.state
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Received customerID:', customerID);

        // Fetch customer details when component mounts
        const fetchCustomerDetails = async () => {
            if (customerID) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/customer-details/${customerID}`);
                    if (response.data) {
                        setCustomer(response.data);  // Set fetched customer data
                    } else {
                        console.error('No customer data received');
                    }
                } catch (error) {
                    console.error('Error fetching customer details:', error);
                }
            } else {
                console.error('Customer ID is missing');
            }
        };
    
        fetchCustomerDetails();
    }, [customerID]);      

    if (!bookingData || !selectedCar || !customerID || !customer) {
        return <div>Error: Booking data, Car data, or Customer information is missing.</div>;
    }

    const handleConfirmBooking = async () => {
        if (!customer) {
            console.error('Customer data is not loaded yet');
            return;
        }
    
        const bookingPayload = {
            ...bookingData,
            selectedCar: {
                VehicleID: selectedCar.VehicleID,
                DriverID: selectedCar.DriverID,
                Model: selectedCar.Model,
                LicensePlate: selectedCar.LicensePlate
            },
            customer,
            price: bookingData.price  // Include price in payload
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/confirm-booking', bookingPayload);
    
            if (response.data.success) {
                const bookingID = response.data.bookingID;
                
                // Check if bookingID is received in the response
                console.log('Received bookingID:', bookingID);

                if (!bookingID) {
                    console.error('Booking ID is missing from the response');
                    return;
                }
            
                const bookingDetails = {
                    bookingID,  // Pass bookingID here
                    customer,
                    selectedCar,
                    price: bookingData.price,
                    BookingDate: bookingData.bookingDate,
                    TripDate: bookingData.tripDate
                };
            
                navigate('/payment', { state: { bookingDetails } });
            } else {
                console.error('Booking confirmation failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };            

    return (
        <div className="confirm-booking-container">
            <h1>Confirm Your Booking</h1>
            {customer ? (
                <>
                    <h2>Customer Details</h2>
                    <p>Name: {customer.FirstName} {customer.LastName}</p>
                    <p>Phone: {customer.Phone}</p>
                    <p>Email: {customer.Email}</p>
                </>
            ) : (
                <p>Loading customer details...</p>
            )}
            <h2>Booking Details</h2>
            <p>Trip Date: {bookingData.tripDate}</p>
            <p>Booking Date: {bookingData.bookingDate}</p>
            <p>Start Location: {bookingData.startLocation}</p>
            <p>End Location: {bookingData.endLocation}</p>
            <p>Total Cost: {bookingData.price}</p>
    
            <h2>Car Details</h2>
            <p>Model: {selectedCar.Model}</p>
            <p>License Plate: {selectedCar.LicensePlate}</p>
    
            <button onClick={handleConfirmBooking}>Confirm Booking</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );    
};

export default ConfirmBooking;