import { useState, useCallback } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure/useAxiosSecure';

const useTracking = () => {
    const axiosSecure = useAxiosSecure();
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTracking = useCallback(async (trackingId) => {
        setError('');
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/track/${trackingId}`);
            setTrackingData(res.data);
        } catch (err) {
            setTrackingData(null);
            setError(err?.response?.data?.error || 'Tracking information not found.');
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    return {
        trackingData,
        loading,
        error,
        fetchTracking,
    };
};

export default useTracking;
