import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaUserPlus } from 'react-icons/fa';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import toast, { Toaster } from 'react-hot-toast';

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: parcels = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['assignableParcels'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-parcel?payment_status=paid&delivery_status=not_collected');
            return res.data;
        }
    });

    const { data: riders = [], isLoading: ridersLoading } = useQuery({
        queryKey: ['riders', selectedParcel?.receiverRegion],
        enabled: !!selectedParcel,
        queryFn: async () => {
            const res = await axiosSecure.get(`/be-rider/active?region=${selectedParcel.receiverRegion}`);
            return res.data;
        }
    });

    const openModal = (parcel) => {
        setSelectedParcel(parcel);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedParcel(null);
    };

    const handleAssign = async (riderEmail, riderName) => {
        console.log(riderEmail);
        try {
            const res = await axiosSecure.put(`/assign-rider`, {
                parcelId: selectedParcel._id,
                riderEmail,
                riderName
            });

            if (res.data?.parcelUpdate?.modifiedCount > 0) {
                toast.success('Rider assigned & parcel marked in-transit');
                closeModal();
                refetch(); // refresh parcel list
            }
        } catch (error) {
            toast.error('Failed to assign rider');
            console.error('Assignment failed:', error);
        }
    };


    if (isLoading) return <div className="text-center p-4 text-sm">Loading parcels...</div>;
    if (isError) return <div className="text-center p-4 text-red-500 text-sm">Failed to load parcels.</div>;

    return (
        <div className="px-2 py-4 sm:p-4 max-w-7xl mx-auto text-sm">
            <Toaster />
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Assign Rider to Parcels</h2>
            <div className="overflow-x-auto border rounded-md shadow-sm">
                <table className="table w-full text-sm overflow-x-scroll-auto">
                    <thead className="bg-base-200 text-[13px] text-gray-700">
                        <tr>
                            <th>#</th>
                            <th>Parcel ID</th>
                            <th>Recipient</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Region</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>
                                <td className="break-all">{parcel._id}</td>
                                <td>{parcel.receiverName || 'N/A'}</td>
                                <td className="break-words">{parcel.receiverAddress || 'N/A'}</td>
                                <td>{parcel.receiverContact || 'N/A'}</td>
                                <td>{parcel.receiverRegion || 'N/A'}</td>
                                <td className="text-green-600 capitalize">{parcel.payment_status}</td>
                                <td className="text-yellow-600 capitalize">{parcel.delivery_status}</td>
                                <td className="whitespace-nowrap">{new Date(parcel.creation_date).toLocaleString()}</td>
                                <td>
                                    <button
                                        onClick={() => openModal(parcel)}
                                        className="btn btn-xs btn-primary flex items-center gap-1"
                                    >
                                        <FaUserPlus /> Assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box w-[96%] sm:max-w-lg text-sm px-3 py-2">
                        <h3 className="font-semibold text-base mb-1">
                            Assign to Parcel: <span className="text-primary">{selectedParcel?._id}</span>
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                            Region: <strong>{selectedParcel?.receiverRegion}</strong>
                        </p>

                        {ridersLoading ? (
                            <p className="text-xs">Loading riders...</p>
                        ) : (
                            <ul className="space-y-2 max-h-64 overflow-y-auto">
                                {riders.length === 0 ? (
                                    <p className="text-red-500">No riders found for this region.</p>
                                ) : (
                                    riders.map((rider) => (
                                        <li key={rider._id} className="flex justify-between items-center border px-2 py-1 rounded-md">
                                            <div>
                                                <p className="font-medium">{rider.name}</p>
                                                <p className="text-xs text-gray-500">{rider.email}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAssign(rider.email, rider.name)}
                                                className="btn btn-xs btn-success"
                                            >
                                                Assign
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}

                        <div className="modal-action mt-2">
                            <form method="dialog">
                                <button className="btn btn-sm" onClick={closeModal}>Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AssignRider;
