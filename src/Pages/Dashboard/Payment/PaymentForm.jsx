import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAuth/useAxiosSecure/useAxiosSecure';
import FallBack from '../../Shared/FallBack/FallBack';
import useAuth from '../../../Hooks/useAuth/useAuth';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth()

    const { id } = useParams();
    const { isPending, isError, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/single-parcel/${id}`);
            return res.data;
        }
    });
    const amount = parcelInfo.cost;
    const amountInCent = amount * 100;
    console.log(amountInCent);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        // 1. Create payment method
        const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (paymentError) {
            console.error(paymentError);
            setError(paymentError.message);
            return;
        } else {
            setError('');
        }

        // 2. Create payment intent from backend
        const res = await axiosSecure.post('/create-payment-intent', {
            amountInCent,
            parcelId: id
        });
        const clientSecret = res.data.clientSecret;

        // 3. Confirm payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    name: user?.displayName || 'Unknown',
                    email: user?.email || 'Unknown'
                }
            }
        });

        if (confirmError) {
            console.error(confirmError);
            setError(confirmError.message);
        } else if (paymentIntent.status === 'succeeded') {
            setError('')
            console.log('✅ Payment succeeded!');
            // TODO: Save transaction details to backend if needed
        }
    };


    if (isPending) {
        return <FallBack />
    }
    return (
        <div className="mx-12 mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">💳 Payment Details</h2>
            <form onSubmit={handleSubmit}>
                <CardElement
                />
                <button
                    type='submit'
                    disabled={!stripe}
                    className='mt-6 w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    Pay ${amount}
                </button>
                {
                    error && <p className='text-red-500 text-center'>{error}</p>
                }
            </form>
        </div>

    );
};

export default PaymentForm;