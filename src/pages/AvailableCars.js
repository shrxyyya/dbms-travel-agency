import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AvailableCars = () => {
    const location = useLocation();
    const { bookingData } = location.state; // Get booking data from previous page
    const navigate = useNavigate();

    // Hard-coded list of available cars
    const cars = [
        {
            id: 1,
            model: 'Mini Cooper',
            driverName: 'John Doe',
            driverPhone: '123-456-7890',
            driverRating: 4.8,
            driverPicture: 'https://via.placeholder.com/150', // Placeholder image
            price: 1500, // Example price for this car
        },
        {
            id: 2,
            model: 'Suzuki Swift',
            driverName: 'Jane Smith',
            driverPhone: '987-654-3210',
            driverRating: 4.6,
            driverPicture: 'https://via.placeholder.com/150',
            price: 1200,
        },
        {
            id: 3,
            model: 'Hyundai i10',
            driverName: 'Alice Johnson',
            driverPhone: '555-123-4567',
            driverRating: 4.5,
            driverPicture: 'https://via.placeholder.com/150',
            price: 1300,
        },
    ];

    const handleCarSelection = (car) => {
        // Redirect to payment page with the selected car and booking data
        navigate('/payment', { state: { bookingData, selectedCar: car } });
    };

    return (
        <div className="available-cars-container">
            <h1>Available Mini Cars</h1>
            <ul>
                {cars.map(car => (
                    <li key={car.id} onClick={() => handleCarSelection(car)}>
                        <img src={car.driverPicture} alt="Driver" />
                        <h2>{car.model}</h2>
                        <p>Driver: {car.driverName}</p>
                        <p>Phone: {car.driverPhone}</p>
                        <p>Rating: {car.driverRating}</p>
                        <p>Price: ${car.price}</p> {/* Display car price */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableCars;
