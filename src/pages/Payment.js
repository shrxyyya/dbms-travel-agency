import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const { bookingData, selectedCar } = location.state; // Get booking data and selected car

    const unsettledDues = 50; // Example value for unsettled dues
    const totalPrice = selectedCar.price + unsettledDues; // Calculate total price

    const handlePayment = () => {
        // Logic to process payment goes here
        console.log('Processing payment for:', bookingData, selectedCar);

        // Simulate payment success and redirect to a confirmation page or dashboard
        alert('Payment successful! Thank you for your booking.');

        // After successful payment, update car availability (you would implement this logic in the backend)
        axios.post('http://localhost:5000/api/update-car-availability', { carId: selectedCar.id })
            .then(response => {
                console.log('Car availability updated:', response.data);
            })
            .catch(error => {
                console.error('Error updating car availability:', error);
            });
    };

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <p>Car: {selectedCar.model}</p>
            <p>Booking Date: {bookingData.tripDate}</p>
            <p>Start Location: {bookingData.startLocation}</p>
            <p>End Location: {bookingData.endLocation}</p>
            <h2>Total: ${totalPrice}</h2>
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default Payment;
