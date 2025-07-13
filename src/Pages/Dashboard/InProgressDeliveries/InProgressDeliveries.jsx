import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Swal from 'sweetalert2';

const InProgressDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch only in-transit parcels for this rider
    const { data: inTransitParcels = [], isLoading } = useQuery({
        queryKey: ['inTransitParcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/in-progress-parcels?email=${user.email}`);
            return res.data;
        }
    });

    // Update parcel delivery status to 'delivered'
    const updateStatus = useMutation({
        mutationFn: (parcelId) =>
            axiosSecure.put(`/parcels/status/${parcelId}`, { status: 'delivered' }),
        onSuccess: () => {
            queryClient.invalidateQueries(['inTransitParcels', user?.email]);
            Swal.fire('Success', 'Parcel marked as delivered.', 'success');
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update delivery status.', 'error');
        }
    });

    const handleMarkDelivered = (parcelId) => {
        updateStatus.mutate(parcelId);
    };

    return (
        <div className="p-4 max-w-7xl mx-auto text-sm">
            <h2 className="text-xl font-semibold mb-4">In-Progress Deliveries</h2>

            {isLoading ? (
                <p>Loading in-progress deliveries...</p>
            ) : inTransitParcels.length > 0 ? (
                <div className="overflow-x-auto border rounded">
                    <table className="table w-full">
                        <thead className="bg-base-200 text-gray-700 text-[14px]">
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Receiver</th>
                                <th>Region</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inTransitParcels.map((parcel, idx) => (
                                <tr key={parcel._id}>
                                    <td>{idx + 1}</td>
                                    <td className="break-all">{parcel.trackingId}</td>
                                    <td>
                                        <div>
                                            <p className="font-medium">{parcel.receiverName}</p>
                                            <p className="text-xs text-gray-500">{parcel.receiverContact}</p>
                                        </div>
                                    </td>
                                    <td>{parcel.receiverRegion}</td>
                                    <td>
                                        <span className="badge badge-warning capitalize">
                                            {parcel.delivery_status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleMarkDelivered(parcel._id)}
                                            className="btn btn-xs btn-success"
                                        >
                                            Mark Delivered
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No in-progress deliveries.</p>
            )}
        </div>
    );
};

export default InProgressDeliveries;
