import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Fetch pending riders
    const {
        data: pendingRiders = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['pendingRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/be-rider/pending');
            return res.data;
        },
    });

    // Approve rider and update user role
    const approveMutation = useMutation({
        mutationFn: ({ id, email }) =>
            axiosSecure.put(`/be-rider/approve/${id}`, { email }),
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingRiders']);
            Swal.fire('Success!', 'Rider approved and role updated.', 'success');
            setSelectedRider(null);
        },
        onError: () => {
            Swal.fire('Error!', 'Approval failed.', 'error');
        },
    });

    // Delete rider application
    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/be-rider/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['pendingRiders']);
            Swal.fire('Deleted!', 'Rider application deleted.', 'success');
        },
        onError: () => Swal.fire('Error!', 'Failed to delete application.', 'error'),
    });

    // Confirm approve
    const handleApprove = (id, rider) => {
        console.log(rider);
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to approve this rider.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                approveMutation.mutate({ id, email: rider.email });
            }
        });
    };

    // Confirm delete
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the application!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Pending Rider Applications</h2>

            {isLoading && <p>Loading pending riders...</p>}
            {isError && <p className="text-red-500">{error.message}</p>}

            {pendingRiders.length > 0 ? (
                <div className="overflow-x-auto rounded-lg shadow border">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRiders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>
                                    <td>{rider.name}</td>
                                    <td>{rider.email}</td>
                                    <td>{rider.contact}</td>
                                    <td>{rider.region || 'N/A'}</td>
                                    <td>
                                        <span className="badge badge-warning capitalize">
                                            {rider.status}
                                        </span>
                                    </td>
                                    <td className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedRider(rider)}
                                            className="btn btn-xs btn-info"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleApprove(rider._id, rider)}
                                            className="btn btn-xs btn-success"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rider._id)}
                                            className="btn btn-xs btn-error"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="mt-4 text-gray-500">No pending rider applications.</p>
            )}

            {/* Modal for viewing rider info */}
            {selectedRider && (
                <dialog id="riderModal" className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Rider Details</h3>
                        <div className="space-y-2 text-gray-700 text-sm">
                            <p><strong>Name:</strong> {selectedRider.name}</p>
                            <p><strong>Email:</strong> {selectedRider.email}</p>
                            <p><strong>Phone:</strong> {selectedRider.contact}</p>
                            <p><strong>Region:</strong> {selectedRider.region}</p>
                            <p><strong>Status:</strong> {selectedRider.status}</p>
                        </div>

                        <div className="modal-action">
                            <button
                                onClick={() => setSelectedRider(null)}
                                className="btn btn-outline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default PendingRiders;
