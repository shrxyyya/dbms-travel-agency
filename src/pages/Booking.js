// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/booking.css'; // Assuming you have a CSS file for styling

// const Booking = () => {
//     const navigate = useNavigate(); // Initialize useNavigate for redirection

//     const [tripDate, setTripDate] = useState(''); // New Trip Date State
//     const [startLocation, setStartLocation] = useState('Bangalore');
//     const [endLocation, setEndLocation] = useState('Mysore');
//     const [price, setPrice] = useState(0);

//     // Hard-coded pricing logic
//     const priceMapping = {
//         'Bangalore-Mysore': 1500,
//         'Bangalore-Hyderabad': 2500,
//         'Mysore-Bangalore': 1500,
//         'Mysore-Hyderabad': 2500,
//         'Hyderabad-Bangalore': 2500,
//         'Hyderabad-Mysore': 2500,
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const selectedKey = `${startLocation}-${endLocation}`;
//         const calculatedPrice = priceMapping[selectedKey] || 0;

//         const bookingData = {
//             tripDate,
//             startLocation,
//             endLocation,
//             price: calculatedPrice, // Add price to booking data
//         };

//         // Redirect to available cars page, passing booking data
//         navigate('/available-cars', { state: { bookingData } });
//     };

//     return (
//         <div className="booking-container">
//             <h1>Book a Mini</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Trip Date:</label>
//                     <input
//                         type="date"
//                         value={tripDate}
//                         onChange={(e) => setTripDate(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Start Location:</label>
//                     <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)} required>
//                         <option value="Bangalore">Bangalore</option>
//                         <option value="Mysore">Mysore</option>
//                         <option value="Hyderabad">Hyderabad</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label>End Location:</label>
//                     <select value={endLocation} onChange={(e) => setEndLocation(e.target.value)} required>
//                         <option value="Mysore">Mysore</option>
//                         <option value="Bangalore">Bangalore</option>
//                         <option value="Hyderabad">Hyderabad</option>
//                     </select>
//                 </div>
//                 <button type="submit">Find Available Cars</button>
//             </form>
//         </div>
//     );
// };

// export default Booking;





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/booking.css';

const Booking = () => {
    const navigate = useNavigate();

    const [tripDate, setTripDate] = useState(''); // Trip date
    const [bookingDate] = useState(new Date().toISOString().split('T')[0]); // Set booking date to current date
    const [startLocation, setStartLocation] = useState('Bangalore');
    const [endLocation, setEndLocation] = useState('Mysore');
    const [distanceRange, setDistanceRange] = useState('30-40'); // New state for distance range
    const [price, setPrice] = useState(0);

    const priceMapping = {
        '30-40': 1500,
        '40-50': 2000,
        '50-60': 2500,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const calculatedPrice = priceMapping[distanceRange] || 0;

        const bookingData = {
            tripDate,
            bookingDate, // Added booking date
            startLocation,
            endLocation,
            distanceRange,
            price: calculatedPrice, 
        };

        // Redirect to confirm booking page, passing booking data
        navigate('/confirm-booking', { state: { bookingData } });
    };

    return (
        <div className="booking-container">
            <h1>Book a Mini</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Trip Date:</label>
                    <input
                        type="date"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Start Location:</label>
                    <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)} required>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Mysore">Mysore</option>
                        <option value="Hyderabad">Hyderabad</option>
                    </select>
                </div>
                <div>
                    <label>End Location:</label>
                    <select value={endLocation} onChange={(e) => setEndLocation(e.target.value)} required>
                        <option value="Mysore">Mysore</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                    </select>
                </div>
                <div>
                    <label>Distance Range (in km):</label>
                    <select value={distanceRange} onChange={(e) => setDistanceRange(e.target.value)} required>
                        <option value="30-40">30-40 km</option>
                        <option value="40-50">40-50 km</option>
                        <option value="50-60">50-60 km</option>
                    </select>
                </div>
                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
};

export default Booking;
