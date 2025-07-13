import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth/useAuth';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const MyEarning = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const today = new Date();

    const { data: deliveries = [], isLoading } = useQuery({
        queryKey: ['completedDeliveries', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completed-parcels?email=${user.email}`);
            return res.data;
        }
    });

    const cashoutMutation = useMutation({
        mutationFn: async (id) => {
            await axiosSecure.put(`/parcels/cashout/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['completedDeliveries', user?.email]);
            Swal.fire('Success!', 'Parcel marked as cashed out.', 'success');
        },
        onError: () => {
            Swal.fire('Error!', 'Cashout failed.', 'error');
        }
    });

    const handleCashOut = (parcelId) => {
        Swal.fire({
            title: 'Cashout Confirmation',
            text: 'Are you sure you want to mark this delivery as cashed out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CAEB66',
            confirmButtonText: 'Yes, cashout!',
        }).then((result) => {
            if (result.isConfirmed) {
                cashoutMutation.mutate(parcelId);
            }
        });
    };

    const calculateEarnings = (parcel) => {
        const sameDistrict = parcel.receiverRegion === parcel.senderRegion;
        return sameDistrict ? parcel.cost * 0.8 : parcel.cost * 0.3;
    };

    const isValidDate = (date) => date instanceof Date && !isNaN(date);
    const isSameDay = (d1, d2) => {
        if (!isValidDate(d1) || !isValidDate(d2)) return false;
        return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
    };

    const summary = deliveries.reduce(
        (acc, parcel) => {
            const e = calculateEarnings(parcel);
            if (!parcel.isCashedOut) acc.pending += e;
            if (parcel.isCashedOut) acc.total += e;

            const deliveredAt = parcel.delivered_at ? new Date(parcel.delivered_at) : null;
            if (isValidDate(deliveredAt)) {
                if (isSameDay(today, deliveredAt)) acc.today += e;

                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                if (deliveredAt >= oneWeekAgo) acc.week += e;

                if (
                    today.getMonth() === deliveredAt.getMonth() &&
                    today.getFullYear() === deliveredAt.getFullYear()
                ) {
                    acc.month += e;
                }
            }
            return acc;
        },
        { total: 0, pending: 0, today: 0, week: 0, month: 0 }
    );

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">My Earnings</h2>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="p-4 bg-base-200 rounded shadow">
                    <p className="text-gray-500 mb-1">Earnings Today</p>
                    <p className="text-lg font-semibold text-green-600">৳{summary.today.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-base-200 rounded shadow">
                    <p className="text-gray-500 mb-1">Earnings This Week</p>
                    <p className="text-lg font-semibold text-green-600">৳{summary.week.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-base-200 rounded shadow">
                    <p className="text-gray-500 mb-1">Earnings This Month</p>
                    <p className="text-lg font-semibold text-green-600">৳{summary.month.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-base-200 rounded shadow">
                    <p className="text-gray-500 mb-1">Pending Cashout</p>
                    <p className="text-lg font-semibold text-yellow-600">৳{summary.pending.toFixed(2)}</p>
                </div>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : deliveries.length === 0 ? (
                <p className="text-gray-500">No completed deliveries found.</p>
            ) : (
                <div className="overflow-x-auto border rounded-md shadow-sm">
                    <table className="table w-full text-sm">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Pickup Time</th>
                                <th>Delivery Time</th>
                                <th>From → To</th>
                                <th>Cost</th>
                                <th>Your Earning</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>
                                    <td>{parcel.trackingId}</td>
                                    <td>{parcel.picked_at ? new Date(parcel.picked_at).toLocaleString() : '—'}</td>
                                    <td>{parcel.delivered_at ? new Date(parcel.delivered_at).toLocaleString() : '—'}</td>
                                    <td>{parcel.senderRegion} → {parcel.receiverRegion}</td>
                                    <td>৳{parcel.cost}</td>
                                    <td className="text-green-700 font-semibold">
                                        ৳{calculateEarnings(parcel).toFixed(2)}
                                    </td>
                                    <td>
                                        {parcel.isCashedOut ? (
                                            <span className="badge badge-success">Cashed Out</span>
                                        ) : (
                                            <button
                                                className="btn btn-xs btn-outline btn-success"
                                                onClick={() => handleCashOut(parcel._id)}
                                            >
                                                Cashout
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyEarning;
