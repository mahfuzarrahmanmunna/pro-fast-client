import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Swal from 'sweetalert2';

const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch all parcels for this rider with status = rider_assigned or in-transit
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['riderParcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/pending-parcels?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Mutation to update parcel status
    const updateParcelStatus = useMutation({
        mutationFn: ({ parcelId, status }) =>
            axiosSecure.put(`/parcels/status/${parcelId}`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['riderParcels', user?.email]);
            Swal.fire('Success', 'Parcel status updated', 'success');
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update parcel status', 'error');
        }
    });

    const handleStatusUpdate = (parcelId, newStatus) => {
        updateParcelStatus.mutate({ parcelId, status: newStatus });
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">My Assigned Deliveries</h2>

            {isLoading ? (
                <p>Loading...</p>
            ) : parcels.length > 0 ? (
                <div className="overflow-x-auto border rounded">
                    <table className="table w-full text-sm">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Receiver</th>
                                <th>Region</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>
                                    <td>{parcel.trackingId}</td>
                                    <td>
                                        <div>
                                            <p className="font-semibold">{parcel.receiverName}</p>
                                            <p className="text-xs text-gray-500">{parcel.receiverContact}</p>
                                        </div>
                                    </td>
                                    <td>{parcel.receiverRegion}</td>
                                    <td>
                                        <span className="badge badge-info capitalize">
                                            {parcel.delivery_status}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {parcel.delivery_status === 'rider_assigned' && (
                                            <button
                                                onClick={() => handleStatusUpdate(parcel._id, 'in-transit')}
                                                className="btn btn-xs btn-warning"
                                            >
                                                Mark Picked
                                            </button>
                                        )}
                                        {parcel.delivery_status === 'in-transit' && (
                                            <button
                                                onClick={() => handleStatusUpdate(parcel._id, 'delivered')}
                                                className="btn btn-xs btn-success"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No pending deliveries at the moment.</p>
            )}
        </div>
    );
};

export default PendingDeliveries;
