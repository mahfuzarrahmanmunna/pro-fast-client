// MakeAdmin.jsx
import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';

const MakeAdmin = () => {
    const [searchEmail, setSearchEmail] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();

    const handleSearch = async () => {
        if (!searchEmail) return;
        try {
            const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
            setUser(res.data);
            setError('');
        } catch (err) {
            setUser(null);
            setError('User not found');
            console.log(err);
        }
    };

    const updateRole = async (newRole) => {
        try {
            const res = await axiosSecure.put(`/users/role/${user._id}`, { role: newRole });
            Swal.fire('Success', res.data.message, 'success');
            setUser(prev => ({ ...prev, role: newRole }));
        } catch (err) {
            Swal.fire('Error', 'Failed to update role', err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-semibold mb-4">Make / Revoke Admin</h2>

            <div className="flex gap-4 mb-4">
                <input
                    type="email"
                    placeholder="Search by email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
                <button onClick={handleSearch} className="btn btn-primary">Search</button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {user && (
                <div className="bg-white p-6 rounded shadow w-full max-w-md">
                    <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => updateRole('admin')}
                            className="btn btn-success"
                            disabled={user.role === 'admin'}
                        >
                            Make Admin
                        </button>
                        <button
                            onClick={() => updateRole('customer')}
                            className="btn btn-error"
                            disabled={user.role !== 'admin'}
                        >
                            Revoke Admin
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MakeAdmin;
