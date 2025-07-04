import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import FallBack from '../../Shared/FallBack/FallBack';

const TrackParcelPage = () => {
    const { trackingId } = useParams();
    const [inputId, setInputId] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const fetchTracking = async (id) => {
        setError('');
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/track/${id}`);
            setData(res.data);
        } catch (err) {
            setData(null);
            setError(err.response?.data?.error || 'Tracking info not found');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (trackingId) {
            setInputId(trackingId);
            fetchTracking(trackingId);
        }
    }, [trackingId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputId) return;
        navigate(`/track/${inputId}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">📦 Track Your Parcel</h1>
            <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    placeholder="Enter Tracking ID"
                    className="input input-bordered w-full"
                    required
                />
                <button className="btn btn-primary">Track</button>
            </form>

            {loading && <FallBack />}

            {error && <p className="text-red-500">{error}</p>}

            {data && (
                <div className="bg-base-100 p-4 rounded shadow">
                    <h2 className="text-xl font-semibold text-primary mb-2">Tracking Updates</h2>
                    <p><strong>Tracking ID:</strong> {data.trackingId}</p>
                    <ul className="mt-4 space-y-3">
                        {data.updates.map((update, i) => (
                            <li key={i} className="border-b pb-2">
                                <p><strong>Status:</strong> {update.status}</p>
                                <p><strong>Location:</strong> {update.location}</p>
                                <p><strong>Time:</strong> {new Date(update.timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TrackParcelPage;
