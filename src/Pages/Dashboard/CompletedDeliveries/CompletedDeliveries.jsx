import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth/useAuth';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const CompletedDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['completedDeliveries', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completed-parcels?email=${user.email}`);
            return res.data;
        }
    });

    const cashoutMutation = useMutation({
        mutationFn: (parcelId) => axiosSecure.put(`/parcels/cashout/${parcelId}`),
        onSuccess: () => {
            Swal.fire('Success', 'You have cashed out successfully!', 'success');
            queryClient.invalidateQueries(['completedDeliveries', user?.email]);
        },
        onError: () => {
            Swal.fire('Error', 'Cashout failed. Try again.', 'error');
        }
    });


    const handleCashout = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will cash out your earnings for this delivery.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cash out!'
        }).then((result) => {
            if (result.isConfirmed) {
                cashoutMutation.mutate(id);
            }
        });
    };


    const calculateEarning = (parcel) => {
        if (parcel.senderRegion === parcel.receiverRegion) {
            return parcel.cost * 0.8;
        } else {
            return parcel.cost * 0.3;
        }
    };

    const totalEarnings = parcels.reduce((sum, parcel) => sum + calculateEarning(parcel), 0);

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Completed Deliveries</h2>

            <div className="mb-4">
                <p className="text-lg font-medium">
                    Total Earned: <span className="text-green-600 font-semibold">৳ {totalEarnings.toFixed(2)}</span>
                </p>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : parcels.length > 0 ? (
                <div className="overflow-x-auto border rounded">
                    <table className="table table-zebra w-full text-sm">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Receiver</th>
                                <th>From → To</th>
                                <th>Picked At</th>
                                <th>Delivered At</th>
                                <th>Cost</th>
                                <th>Earned</th>
                                <th>Cashout</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>
                                    <td>{parcel.trackingId}</td>
                                    <td>{parcel.receiverName}</td>
                                    <td>{parcel.senderRegion} → {parcel.receiverRegion}</td>
                                    <td>{parcel.picked_at ? new Date(parcel.picked_at).toLocaleString() : 'N/A'}</td>
                                    <td>{parcel.delivered_at ? new Date(parcel.delivered_at).toLocaleString() : 'N/A'}</td>
                                    <td>৳ {parcel.cost}</td>
                                    <td>৳ {calculateEarning(parcel).toFixed(2)}</td>
                                    <td>
                                        {parcel.cashed_out ? (
                                            <span className="badge badge-success">Cashed Out</span>
                                        ) : (
                                            <button
                                                onClick={() => handleCashout(parcel._id)}
                                                className="btn btn-xs btn-accent"
                                            >
                                                Cash Out
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600 mt-4">No completed deliveries found.</p>
            )}
        </div>
    );
};

export default CompletedDeliveries;
