// AvailableCars.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AvailableCars = () => {
    const location = useLocation();
    const { bookingData } = location.state || {};
    const navigate = useNavigate();
    const [availableCars, setAvailableCars] = useState([]);

    useEffect(() => {
        if (bookingData) {
            const fetchAvailableCars = async () => {
                try {
                    const response = await axios.post('http://localhost:5000/api/available-cars', {
                        startLocation: bookingData.startLocation,
                        endLocation: bookingData.endLocation,
                        vehicleType: bookingData.carType // Pass the selected car type (e.g., Sedan)
                    });
                    setAvailableCars(response.data);
                } catch (error) {
                    console.error('Error fetching available cars:', error);
                }
            };
            fetchAvailableCars();
        }
    }, [bookingData]);

    const handleCarSelection = (car) => {
        if (!bookingData) {
            console.error('Booking data is missing');
            return;
        }
        navigate('/confirm-booking', {
            state: {
                bookingData,
                selectedCar: {
                    ...car,
                    DriverID: car.DriverID // Ensure the driver ID is included
                },
                customerID: bookingData.customerID
            }
        });
    };
    

    return (
        <div className="available-cars-container">
            <h1>Available Cars</h1>
            {availableCars.length === 0 ? (
                <p>Loading available cars...</p>
            ) : (
                availableCars.map((car) => (
                    <div key={car.VehicleID} className="car-card">
                        <p>Model: {car.Model}</p>
                        <p>License Plate: {car.LicensePlate}</p>
                        <p>Driver: {car.driverFirstName} {car.driverLastName}</p>
                        <p>Capacity (including Driver): {car.Capacity}</p>
                        <button onClick={() => handleCarSelection(car)}>Select Car</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AvailableCars;