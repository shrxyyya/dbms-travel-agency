import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ViewBookings = () => {
    const [activeBookings, setActiveBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve customerID from location state or localStorage as fallback
    const customerID = location.state?.customerID || localStorage.getItem('customerID');

    useEffect(() => {
        // Redirect to login if no customerID is found
        if (!customerID) {
            console.log('No customer ID found, redirecting to login');
            navigate('/login');
            return;
        }

        fetchBookings();
    }, [customerID, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/booking-history/${customerID}`);
            
            if (response.data && Array.isArray(response.data)) {
                // Separate active and past bookings based on TripDate or PaymentStatus
                const now = new Date();
                const active = response.data.filter(booking => 
                    new Date(booking.TripDate) >= now || booking.PaymentStatus !== 'Completed'
                );
                const past = response.data.filter(booking => 
                    new Date(booking.TripDate) < now && booking.PaymentStatus === 'Completed'
                );
                
                setActiveBookings(active);
                setPastBookings(past);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching booking history:', err);
            setError(err.response?.data?.error || 'Error fetching booking history');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-lg">Loading your bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={() => fetchBookings()}
                        className="mt-4 bg-red-100 text-red-700 py-2 px-4 rounded-md hover:bg-red-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Bookings</h1>
            
            {activeBookings.length === 0 && pastBookings.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 text-lg mb-4">No bookings were made.</p>
                    <button 
                        onClick={() => navigate('/home', { state: { customerID } })}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            ) : (
                <>
                    {activeBookings.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold mt-4 mb-2">Active Bookings</h2>
                            {activeBookings.map((booking) => (
                                <div key={booking.BookingID} className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
                                    {/* Booking details here */}
                                </div>
                            ))}
                        </section>
                    )}
                    {pastBookings.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold mt-4 mb-2">Past Bookings</h2>
                            {pastBookings.map((booking) => (
                                <div key={booking.BookingID} className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
                                    {/* Booking details here */}
                                </div>
                            ))}
                        </section>
                    )}
                    <button 
                        onClick={() => navigate('/home', { state: { customerID } })}
                        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </>
            )}
        </div>
    );
};

export default ViewBookings;