import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/payment.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails } = location.state || {};

    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    if (!bookingDetails) {
        console.error("Booking details are missing.");
        return <div>Error: Missing necessary booking details.</div>;
    }

    const { selectedCar, customer, price, BookingDate, TripDate, bookingID } = bookingDetails;

    if (!bookingID) {
        console.error('Booking ID is missing.');
        return <div>Error: Booking ID is missing.</div>;
    }

    const unsettledDues = 50;
    const totalPrice = (price || 0) + unsettledDues;

    const handlePayment = async () => {
        setIsProcessingPayment(true);
        try {
            const paymentData = {
                bookingID: bookingID,
                amount: totalPrice,
                paymentMethod: paymentMethod,
                dues: unsettledDues
            };
    
            const response = await axios.post('http://localhost:5000/api/process-payment', paymentData);
    
            if (response.data.success) {
                await axios.post('http://localhost:5000/api/update-car-availability', { 
                    carId: selectedCar.VehicleID 
                });
    
                const bookingResponse = await axios.get(`http://localhost:5000/api/get-booking-status/${bookingID}`);
    
                if (bookingResponse.status === 404) {
                    console.error('Booking not found');
                    alert('Booking not found. Please try again later.');
                    return;
                }
                
                const updatedPaymentStatus = bookingResponse.data.PaymentStatus;
    
                if (updatedPaymentStatus === 'Completed') {
                    setIsPaymentComplete(true);
                    alert('Payment successful! Thank you for your booking.');
                } else {
                    console.warn('Payment succeeded but booking status was not updated.');
                    alert('Payment succeeded, but there was an issue updating the booking status. Please contact support.');
                }
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessingPayment(false); // Ensure processing state is reset after completion
        }
    };    
    
    // Simplify button text handling based on payment state
    const getButtonText = () => {
        if (isProcessingPayment) return 'Processing...';
        if (isPaymentComplete) return 'Payment Complete';
        return 'Pay Now';
    };    

    const downloadReceipt = () => {
        const receiptElement = document.getElementById('receipt');
        html2canvas(receiptElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('Booking_Receipt.pdf');
        });
    };

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <div id="receipt">
                <p>Customer: {customer.FirstName} {customer.LastName}</p>
                <p>Car: {selectedCar.Model}</p>
                <p>Booking Date: {BookingDate}</p>
                <p>Trip Date: {TripDate}</p>
                <p>Base Price: ${price}</p>
                <p>Additional Dues: ${unsettledDues}</p>
                <h2>Total: ${totalPrice}</h2>
            </div>

            <div className="payment-method-selection">
                <label>
                    Payment Method:
                    <select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isProcessingPayment || isPaymentComplete}
                    >
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="net_banking">Net Banking</option>
                    </select>
                </label>
            </div>

            <button 
                onClick={handlePayment} 
                disabled={isProcessingPayment || isPaymentComplete}
                className={isProcessingPayment ? 'processing' : isPaymentComplete ? 'disabled-btn' : ''}
            >
                {getButtonText()}
            </button>

            {isPaymentComplete && (
                <>
                    <button onClick={downloadReceipt}>Download Receipt</button>
                    <button onClick={() => navigate('/home', { state: { customerID: customer.CustomerID } })}>
                        Back to Home
                    </button>
                </>
            )}
        </div>
    );
};

export default Payment;