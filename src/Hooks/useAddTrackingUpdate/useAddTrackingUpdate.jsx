import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../useAxiosSecure/useAxiosSecure';

const useAddTrackingUpdate = () => {
    const axiosSecure = useAxiosSecure();

    const {
        mutate: addTrackingUpdate,
        isLoading,
        isSuccess,
        isError,
        error,
        data
    } = useMutation({
        mutationFn: async ({ trackingId, parcelId, status, location }) => {
            const response = await axiosSecure.post('/track-update', {
                trackingId,
                parcelId,
                status,
                location
            });
            return response.data;
        }
    });

    return {
        addTrackingUpdate,
        isLoading,
        isSuccess,
        isError,
        error,
        data
    };
};

export default useAddTrackingUpdate;
