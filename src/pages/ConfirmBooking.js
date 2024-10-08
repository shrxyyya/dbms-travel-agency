// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ConfirmBooking = () => {
//     const location = useLocation();
//     const { bookingData, selectedCar, customerID } = location.state || {}; // Ensure location.state exists
//     const [customer, setCustomer] = useState({});
//     const [vehicleDetails, setVehicleDetails] = useState({});
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Fetch customer details if customerID exists
//         const fetchCustomerDetails = async () => {
//             if (customerID) {
//                 try {
//                     const response = await axios.get(`http://localhost:5000/api/customer-details/${customerID}`);
//                     setCustomer(response.data);
//                 } catch (error) {
//                     console.error('Error fetching customer details:', error);
//                 }
//             }
//         };
        
//         fetchCustomerDetails();
//     }, [customerID]);    

//     // Handle the case when bookingData, selectedCar, or customerID is missing
//     if (!bookingData || !selectedCar || !customerID) {
//         return <div>Error: Booking data, Car data, or Customer ID is missing.</div>;
//     }

//     const handleConfirmBooking = async () => {
//         const bookingPayload = {
//             ...bookingData,
//             selectedCar,
//             customer,
//         };

//         try {
//             const response = await axios.post('http://localhost:5000/api/confirm-booking', bookingPayload);
//             if (response.data.success) {
//                 // Redirect to payment page if booking is successful
//                 navigate('/payment', { state: { bookingData, selectedCar, customer, vehicleDetails: response.data.vehicleDetails } });
//             }
//         } catch (error) {
//             console.error('Error confirming booking:', error);
//         }
//     };

//     return (
//         <div className="confirm-booking-container">
//             <h1>Confirm Your Booking</h1>
//             {customer && (
//                 <>
//                     <h2>Customer Details</h2>
//                     <p>Name: {customer.FirstName} {customer.LastName}</p>
//                     <p>Phone: {customer.Phone}</p>
//                     <p>Email: {customer.Email}</p>
//                 </>
//             )}
//             <h2>Car Details</h2>
//             <p>Model: {selectedCar.Model}</p>
//             <p>License Plate: {selectedCar.LicensePlate}</p>

//             <h2>Driver Details</h2>
//             <p>Driver: {vehicleDetails.driverFirstName} {vehicleDetails.driverLastName}</p>

//             <button onClick={handleConfirmBooking}>Confirm Booking</button>
//             <button onClick={() => navigate(-1)}>Go Back</button>
//         </div>
//     );
// };

// export default ConfirmBooking;


// ConfirmBooking.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmBooking = () => {
    const location = useLocation();
    const { bookingData, selectedCar, customerID } = location.state || {};
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            if (customerID) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/customer-details/${customerID}`);
                    setCustomer(response.data);
                } catch (error) {
                    console.error('Error fetching customer details:', error);
                }
            } else {
                console.error('Customer ID is missing');
            }
        };

        fetchCustomerDetails();
    }, [customerID]);

    if (!bookingData || !selectedCar || !customerID) {
        return <div>Error: Booking data, Car data, or Customer ID is missing.</div>;
    }

    const handleConfirmBooking = async () => {
        if (!customer) {
            console.error('Customer data is not loaded yet');
            return;
        }

        const bookingPayload = {
            ...bookingData,
            selectedCar,
            customer,
            price: bookingData.price // Ensure price is included
        };

        try {
            const response = await axios.post('http://localhost:5000/api/confirm-booking', bookingPayload);
            if (response.data.success) {
                // Redirect to payment page if booking is successful
                navigate('/payment', { state: { bookingDetails: response.data.vehicleDetails } });
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
