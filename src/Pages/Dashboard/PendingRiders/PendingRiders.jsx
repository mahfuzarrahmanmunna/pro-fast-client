import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';

const PendingRiders = () => {
    const [pendingRiders, setPendingRiders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchPendingRiders = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axiosSecure.get(`/be-rider/pending`); // Adjust with the correct API URL for pending riders
                setPendingRiders(response.data);
            } catch (err) {
                setError('Failed to fetch pending riders');
                console.error('Error fetching pending riders:', err);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchPendingRiders();
    }, []);

    // Handle rider approval
    const handleApprove = async (id) => {
        try {
            await axiosSecure.put(`/be-rider/approve/${id}`); // Update status to active
            // Update the state to reflect the approval immediately without refetching
            setPendingRiders(prevRiders => prevRiders.map(rider =>
                rider._id === id ? { ...rider, status: 'active' } : rider
            ));
        } catch (err) {
            console.error('Error approving rider:', err);
            setError('Failed to approve rider');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold">Pending Riders</h2>
            {loading && <p>Loading pending riders...</p>} {/* Show loading message */}
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {pendingRiders.length > 0 ? (
                    pendingRiders.map((rider) => (
                        <li key={rider._id} className="border-b py-2">
                            <p><strong>Name:</strong> {rider.name}</p>
                            <p><strong>Email:</strong> {rider.email}</p>
                            <p><strong>Phone:</strong> {rider.phone}</p>
                            <p><strong>Address:</strong> {rider.address}</p>
                            <p><strong>Region:</strong> {rider.region}</p>
                            <button
                                onClick={() => handleApprove(rider._id)}
                                className="btn btn-primary"
                            >
                                Approve
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No pending riders at the moment.</p>
                )}
            </ul>
        </div>
    );
};

export default PendingRiders;
