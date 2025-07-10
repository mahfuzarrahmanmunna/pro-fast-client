import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';

const UserRoleManager = () => {
    const axiosSecure = useAxiosSecure();
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!email) return;
        setLoading(true);
        setError('');
        setUser(null);
        try {
            const res = await axiosSecure.get(`/users/search?email=${email}`);
            setUser(res.data);
        } catch (err) {
            setError('User not found or something went wrong');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (role) => {
        if (!user?._id) return;
        try {
            const res = await axiosSecure.put(`/users/role/${user._id}`, { role });
            if (res.data.modifiedCount > 0) {
                Swal.fire('Success', `User role updated to ${role}`, 'success');
                setUser(prev => ({ ...prev, role }));
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to update user role', err);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Admin Role Manager</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="Search user by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSearch} className="btn btn-primary">Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {user && (
                <div className="bg-white p-4 rounded shadow space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Current Role:</strong> {user.role}</p>

                    {user.role === 'admin' ? (
                        <button
                            onClick={() => updateRole('customer')}
                            className="btn btn-warning btn-sm"
                        >
                            Remove Admin
                        </button>
                    ) : (
                        <button
                            onClick={() => updateRole('admin')}
                            className="btn btn-success btn-sm"
                        >
                            Make Admin
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserRoleManager;
