import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

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

    const approveMutation = useMutation({
        mutationFn: (id) => axiosSecure.put(`/be-rider/approve/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['pendingRiders'])
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/be-rider/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['pendingRiders'])
    });

    const handleApprove = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to approve this rider.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                approveMutation.mutate(id, {
                    onSuccess: () => {
                        Swal.fire('Approved!', 'Rider has been approved.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                    }
                });
            }
        });
    };


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
                deleteMutation.mutate(id, {
                    onSuccess: () => {
                        Swal.fire('Deleted!', 'Rider application has been deleted.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error!', 'Failed to delete application.', 'error');
                    }
                });
            }
        });
    };


    return (
        <div className="p-4">
            <h2 className="text-3xl font-semibold mb-4">Pending Rider Applications</h2>

            {isLoading && <p>Loading pending riders...</p>}
            {isError && <p className="text-red-500">{error.message}</p>}

            {pendingRiders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
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
                                    <td>{rider.status}</td>
                                    <td className="space-x-2">
                                        <button
                                            onClick={() => setSelectedRider(rider)}
                                            className="btn btn-xs btn-info"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleApprove(rider._id)}
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
                <p>No pending rider applications.</p>
            )}

            {/* Modal for viewing rider info */}
            {selectedRider && (
                <dialog id="riderModal" className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Rider Details</h3>
                        <p><strong>Name:</strong> {selectedRider.name}</p>
                        <p><strong>Email:</strong> {selectedRider.email}</p>
                        <p><strong>Phone:</strong> {selectedRider.contact}</p>
                        <p><strong>Address:</strong> {selectedRider.region}</p>
                        <p><strong>Region:</strong> {selectedRider.region}</p>
                        <p><strong>Status:</strong> {selectedRider.status}</p>

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
