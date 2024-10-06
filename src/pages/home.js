// import React from 'react';
// import '../styles/home.css';  // Import the CSS file
// import sedan from '../assets/sedan.jpeg';  // Import the Sedan image
// import suv from '../assets/suv.jpeg';      // Import the SUV image

// const Home = () => {
//     const carTypes = [
//         {
//             id: 1,
//             name: 'Mini',
//             description: 'Compact and economical for city travel.',
//             price: '$20/day',
//             image: ''  // No image for Mini (you can add one later if needed)
//         },
//         {
//             id: 2,
//             name: 'Sedan',
//             description: 'Comfortable and spacious for longer trips.',
//             price: '$30/day',
//             image: sedan  // Use the imported Sedan image
//         },
//         {
//             id: 3,
//             name: 'SUV',
//             description: 'Perfect for family trips with ample space.',
//             price: '$50/day',
//             image: suv  // Use the imported SUV image
//         }
//     ];

//     return (
//         <div className="home-container">
//             <h1>Available Car Types</h1>
//             <div className="car-list">
//                 {carTypes.map(car => (
//                     <div key={car.id} className="car-item">
//                         <h2>{car.name}</h2>
//                         {/* If image exists, display it, else display a placeholder */}
//                         {car.image ? (
//                             <img src={car.image} alt={car.name} className="car-image" />
//                         ) : (
//                             <div className="no-image">No Image Available</div>
//                         )}
//                         <p>{car.description}</p>
//                         <p><strong>{car.price}</strong></p>
//                         <button className="book-btn">Book Now</button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Home;
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../styles/home.css';
import sedan from '../assets/sedan.jpeg';
import suv from '../assets/suv.jpeg';

const Home = () => {
    const navigate = useNavigate();  // Initialize useNavigate

    const carTypes = [
        { id: 1, name: 'Mini', description: 'Compact and economical for city travel.', price: '$20/day' },
        { id: 2, name: 'Sedan', description: 'Comfortable and spacious for longer trips.', price: '$30/day', image: sedan },
        { id: 3, name: 'SUV', description: 'Perfect for family trips with ample space.', price: '$50/day', image: suv }
    ];

    // Handle "Book Now" button click
    const handleBookNow = (car) => {
        navigate('/booking', { state: { car } });  // Pass the car details to the booking page
    };

    return (
        <div className="home-container">
            <h1>Available Car Types</h1>
            <div className="car-list">
                {carTypes.map(car => (
                    <div key={car.id} className="car-item">
                        <h2>{car.name}</h2>
                        {car.image ? (
                            <img src={car.image} alt={car.name} className="car-image" />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                        <p>{car.description}</p>
                        <p><strong>{car.price}</strong></p>
                        <button className="book-btn" onClick={() => handleBookNow(car)}>Book Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
