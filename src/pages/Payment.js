import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const { bookingData, selectedCar, customer } = location.state;

    const unsettledDues = 50; // Example value for unsettled dues
    const totalPrice = selectedCar.price + unsettledDues;

    const handlePayment = () => {
        console.log('Processing payment for:', bookingData, selectedCar, customer);

        alert('Payment successful! Thank you for your booking.');

        // Update car availability after successful payment
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
            <p>Customer: {customer.FirstName} {customer.LastName}</p> {/* Correct property casing */}
            <p>Car: {selectedCar.Model}</p> {/* Correct property casing */}
            <p>Booking Date: {bookingData.bookingDate}</p>
            <p>Trip Date: {bookingData.tripDate}</p>
            <h2>Total: ${totalPrice}</h2>
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default Payment;
