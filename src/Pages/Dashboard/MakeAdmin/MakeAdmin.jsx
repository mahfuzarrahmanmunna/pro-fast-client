import React, { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';

const MakeAdmin = () => {
    const [searchEmail, setSearchEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const axiosSecure = useAxiosSecure();

    const handleSearch = async () => {
        if (!searchEmail) return;

        try {
            setLoading(true);
            const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
            setUsers(res.data);
        } catch (error) {
            setUsers([]);
            Swal.fire('Not Found', 'No user found with that email.', 'warning');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (email, role) => {
        const confirm = await Swal.fire({
            title: `Change Role?`,
            text: `Are you sure to set this user as ${role}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, set ${role}`,
        });

        if (!confirm.isConfirmed) return;

        try {
            // get Firebase token
            const token = await user.getIdToken();

            const res = await axiosSecure.put(`/users/role/${email}`, { role }, {
                headers: {
                    Authorization: `Bearer ${token}` // SEND TOKEN HERE
                }
            });

            if (res.data?.message) {
                Swal.fire('Success', res.data.message, 'success');
                setUsers((prev) =>
                    prev.map((u) =>
                        u.email === email ? { ...u, role } : u
                    )
                );
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Role update failed.', 'error');
        }
    };
    

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Make or Remove Admin</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="email"
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
                <button onClick={handleSearch} className="btn btn-primary bg-[#CAEB66] text-black">
                    Search
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {users.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Created At</th>
                                <th>Current Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.email}>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {user.role === 'admin' ? (
                                            <button
                                                onClick={() => handleRoleChange(user.email, 'customer')}
                                                className="btn btn-xs btn-warning"
                                            >
                                                Remove Admin
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRoleChange(user.email, 'admin')}
                                                className="btn btn-xs btn-success"
                                            >
                                                Make Admin
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

export default MakeAdmin;
