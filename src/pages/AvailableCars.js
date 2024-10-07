// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const AvailableCars = () => {
//     const location = useLocation();
//     const { bookingData } = location.state; // Get booking data from previous page
//     const navigate = useNavigate();

//     // Hard-coded list of available cars
//     const cars = [
//         {
//             id: 1,
//             model: 'Mini Cooper',
//             driverName: 'John Doe',
//             driverPhone: '123-456-7890',
//             driverRating: 4.8,
//             driverPicture: 'https://via.placeholder.com/150', // Placeholder image
//             price: 1500, // Example price for this car
//         },
//         {
//             id: 2,
//             model: 'Suzuki Swift',
//             driverName: 'Jane Smith',
//             driverPhone: '987-654-3210',
//             driverRating: 4.6,
//             driverPicture: 'https://via.placeholder.com/150',
//             price: 1200,
//         },
//         {
//             id: 3,
//             model: 'Hyundai i10',
//             driverName: 'Alice Johnson',
//             driverPhone: '555-123-4567',
//             driverRating: 4.5,
//             driverPicture: 'https://via.placeholder.com/150',
//             price: 1300,
//         },
//     ];

//     const handleCarSelection = (car) => {
//         // Redirect to payment page with the selected car and booking data
//         navigate('/payment', { state: { bookingData, selectedCar: car } });
//     };

//     return (
//         <div className="available-cars-container">
//             <h1>Available Mini Cars</h1>
//             <ul>
//                 {cars.map(car => (
//                     <li key={car.id} onClick={() => handleCarSelection(car)}>
//                         <img src={car.driverPicture} alt="Driver" />
//                         <h2>{car.model}</h2>
//                         <p>Driver: {car.driverName}</p>
//                         <p>Phone: {car.driverPhone}</p>
//                         <p>Rating: {car.driverRating}</p>
//                         <p>Price: ${car.price}</p> {/* Display car price */}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default AvailableCars;


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AvailableCars = () => {
//     const location = useLocation();
//     const { bookingData } = location.state;
//     const navigate = useNavigate();
//     const [availableCars, setAvailableCars] = useState([]);

//     useEffect(() => {
//         // Fetch available cars and drivers from the database based on start and end locations
//         axios.post('http://localhost:5000/api/available-cars', { 
//             startLocation: bookingData.startLocation, 
//             endLocation: bookingData.endLocation 
//         })
//         .then(response => {
//             setAvailableCars(response.data);
//         })
//         .catch(error => {
//             console.error('Error fetching available cars:', error);
//         });
//     }, [bookingData.startLocation, bookingData.endLocation]);

//     const handleCarSelection = (car) => {
//         navigate('/confirm-booking', { state: { bookingData, selectedCar: car } });
//     };

//     return (
//         <div className="available-cars-container">
//             <h1>Available Cars</h1>
//             {availableCars.length === 0 ? (
//                 <p>No cars available for this route.</p>
//             ) : (
//                 availableCars.map((car) => (
//                     <div key={car.VehicleID} className="car-card">
//                         <p>Model: {car.Model}</p>
//                         <p>License Plate: {car.LicensePlate}</p>
//                         <p>Driver: {car.driverFirstName} {car.driverLastName}</p>
//                         <button onClick={() => handleCarSelection(car)}>Select Car</button>
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default AvailableCars;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AvailableCars = () => {
    const location = useLocation();
    const { bookingData } = location.state || {}; // Ensure bookingData exists
    const navigate = useNavigate();
    const [availableCars, setAvailableCars] = useState([]);

    useEffect(() => {
        // Hard-coded available cars for testing
        const mockAvailableCars = [
            {
                VehicleID: 1,
                Model: 'Mini Cooper',
                LicensePlate: 'KA-01-AB-1234',
                driverFirstName: 'Jane',
                driverLastName: 'Doe',
                Capacity: '4 seats'
            },
            {
                VehicleID: 2,
                Model: 'Mini Countryman',
                LicensePlate: 'KA-02-CD-5678',
                driverFirstName: 'John',
                driverLastName: 'Smith',
                Capacity: '5 seats'
            },
            {
                VehicleID: 3,
                Model: 'Mini Clubman',
                LicensePlate: 'KA-03-EF-9101',
                driverFirstName: 'Alice',
                driverLastName: 'Johnson',
                Capacity: '4 seats'
            }
        ];

        setAvailableCars(mockAvailableCars);
    }, []);

    const handleCarSelection = (car) => {
        if (!bookingData) {
            console.error('Booking data is missing');
            return;
        }
        navigate('/confirm-booking', { state: { bookingData, selectedCar: car } });
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
                        <p>Capacity: {car.Capacity}</p>
                        <button onClick={() => handleCarSelection(car)}>Select Car</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default AvailableCars;
