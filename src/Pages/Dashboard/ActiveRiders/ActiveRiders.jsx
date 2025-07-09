import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';

const ActiveRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Fetch Active Riders
    const { data: activeRiders = [], isLoading, isError, error } = useQuery({
        queryKey: ['activeRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/be-rider/active');
            return res.data;
        }
    });

    // Delete Rider
    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/be-rider/${id}`),
        onSuccess: () => {
            Swal.fire('Deleted!', 'Rider has been deleted.', 'success');
            queryClient.invalidateQueries(['activeRiders']);
        },
        onError: () => {
            Swal.fire('Error!', 'Failed to delete rider.', 'error');
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the rider permanently!',
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
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>

            {isLoading && <p>Loading active riders...</p>}
            {isError && <p className="text-red-500">{error.message}</p>}

            {!isLoading && activeRiders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2">#</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Phone</th>
                                <th className="border px-4 py-2">Region</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeRiders.map((rider, index) => (
                                <tr key={rider._id} className="text-center">
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{rider.name}</td>
                                    <td className="border px-4 py-2">{rider.email}</td>
                                    <td className="border px-4 py-2">{rider.contact}</td>
                                    <td className="border px-4 py-2">{rider.region}</td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => setSelectedRider(rider)}
                                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rider._id)}
                                            className="px-2 py-1 text-sm bg-red-500 text-white rounded"
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
                !isLoading && <p className="mt-4 text-gray-600">No active riders found.</p>
            )}

            {/* View Rider Modal */}
            {selectedRider && (
                <dialog open className="modal">
                    <div className="modal-box max-w-md w-full border border-gray-300 p-4">
                        <h3 className="text-lg font-bold mb-2">Rider Details</h3>
                        <p><strong>Name:</strong> {selectedRider.name}</p>
                        <p><strong>Email:</strong> {selectedRider.email}</p>
                        <p><strong>Phone:</strong> {selectedRider.contact}</p>
                        <p><strong>Region:</strong> {selectedRider.region}</p>

                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedRider(null)}
                                className="px-4 py-1 bg-gray-300 text-sm rounded"
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

export default ActiveRiders;
