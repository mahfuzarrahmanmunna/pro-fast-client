import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import FallBack from '../../Shared/FallBack/FallBack';

const TrackParcelPage = () => {
    const { trackingId } = useParams();
    const [inputId, setInputId] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Function to load tracking info
    const fetchTracking = async (id) => {
        setError('');
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/track/${id}`);
            setTrackingData(res.data);
        } catch (err) {
            setTrackingData(null);
            setError(err?.response?.data?.error || 'Tracking information not found.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-load if there's a tracking ID in the URL
    useEffect(() => {
        if (trackingId) {
            setInputId(trackingId);
            fetchTracking(trackingId);
        }
    }, [trackingId]);

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputId) return;
        navigate(`/track/${inputId}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">📦 Track Your Parcel</h1>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    placeholder="Enter Tracking ID"
                    className="input input-bordered w-full"
                    required
                />
                <button type="submit" className="btn btn-primary">
                    Track
                </button>
            </form>

            {/* Loading fallback */}
            {loading && <FallBack />}

            {/* Error message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Tracking result */}
            {trackingData && (
                <div className="bg-base-100 p-5 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-2 text-primary">Tracking Timeline</h2>
                    <p className="text-sm mb-3"><strong>Tracking ID:</strong> {trackingData.trackingId}</p>

                    <ul className="timeline timeline-vertical">
                        {trackingData.updates.map((update, i) => (
                            <li key={i}>
                                <div className="timeline-start text-sm font-medium capitalize">
                                    {new Date(update.timestamp).toLocaleString()}
                                </div>
                                <div className="timeline-middle">
                                    <span className="badge badge-primary"></span>
                                </div>
                                <div className="timeline-end mb-4">
                                    <div className="bg-base-200 p-3 rounded shadow-sm">
                                        <p><strong>Status:</strong> {update.status}</p>
                                        <p><strong>Description:</strong> {update.description || 'No details provided.'}</p>
                                        <p><strong>Location:</strong> {update.location}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TrackParcelPage;
