import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    FaTruck,
    FaMoneyCheckAlt,
    FaTable,
    FaThLarge,
    FaEye,
    FaTrashAlt,
    FaMoneyBillWave,
} from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import useAuth from '../../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../../Hooks/useAuth/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';
import { GiCardboardBoxClosed } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router';

const getStatusColor = (status) => {
    switch (status) {
        case 'not_collected': return 'bg-yellow-100 text-yellow-800';
        case 'in_transit': return 'bg-blue-100 text-blue-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const MyParcel = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isCardView, setIsCardView] = useState(true);
    const navigate = useNavigate()

    const { data: parcels = [], refetch, isLoading, error } = useQuery({
        queryKey: ['my-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/user-parcels?email=${user?.email}`);
            return res.data;
        }
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this parcel delete!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6B8E23',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/single-parcel/${id}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire('Deleted!', 'Parcel has been removed.', 'success');
                    refetch(); // Refresh list
                } else {
                    throw new Error("Parcel not found or already deleted.");
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to delete parcel.', 'error');
            }
        }
    };


    const handleView = (parcel) => {
        Swal.fire({
            title: `📦 Parcel: ${parcel.title}`,
            html: `
                <p><strong>Tracking ID:</strong> ${parcel.trackingId}</p>
                <p><strong>Receiver:</strong> ${parcel.receiverName}</p>
                <p><strong>Status:</strong> ${parcel.delivery_status}</p>
                <p><strong>Cost:</strong> ৳${parcel.cost}</p>
            `,
            icon: 'info',
        });
    };

    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`)
    };

    if (isLoading) return <div className="text-center py-10 font-semibold text-lg">⏳ Loading parcels...</div>;
    if (error) return <div className="text-center py-10 text-red-600">❌ Error loading parcels</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#6B8E23] flex items-center gap-2">
                    <GiCardboardBoxClosed className="text-[#6B8E23]" /> My Parcels
                </h2>
                <button
                    onClick={() => setIsCardView(!isCardView)}
                    className="btn btn-sm bg-[#6B8E23] hover:bg-[#5a7420] text-white"
                >
                    {isCardView ? <><FaTable className="mr-2" /> Table View</> : <><FaThLarge className="mr-2" /> Card View</>}
                </button>
            </div>

            {parcels.length === 0 ? (
                <div className="text-center text-gray-500">No parcels found.</div>
            ) : isCardView ? (
                // 🌈 Card Layout
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parcels.map(parcel => (
                        <div key={parcel._id} className="p-5 border shadow rounded-xl bg-white hover:shadow-lg transition">
                            <h3 className="text-lg font-bold text-[#2E8B57]">{parcel.title}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <HiOutlineLocationMarker /> <span className="font-mono">{parcel.trackingId}</span>
                            </p>
                            <div className="mt-3 text-sm space-y-1">
                                <p><strong>Receiver:</strong> {parcel.receiverName}</p>
                                <p><strong>Type:</strong> {parcel.type}</p>
                                <p><strong>Cost:</strong> ৳{parcel.cost}</p>
                                <p><strong>Date:</strong> {new Date(parcel.creation_date).toLocaleString()}</p>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(parcel.delivery_status)}`}>
                                    <FaTruck /> {parcel.delivery_status.replace(/_/g, ' ')}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1">
                                    <FaMoneyCheckAlt /> {parcel.payment_status}
                                </span>
                            </div>
                            <div className="mt-4 flex gap-2 justify-end">
                                <button onClick={() => handleView(parcel)} className="btn btn-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    <FaEye /> View
                                </button>
                                <Link onClick={() => handlePay(parcel._id)} className="btn btn-sm bg-green-100 text-green-800 hover:bg-green-200">
                                    <FaMoneyBillWave /> Pay
                                </Link>
                                <button onClick={() => handleDelete(parcel._id)} className="btn btn-sm bg-red-100 text-red-800 hover:bg-red-200">
                                    <FaTrashAlt /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // 🧾 Table Layout
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="table w-full border">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Title</th>
                                <th>Receiver</th>
                                <th>Cost</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map((parcel, idx) => (
                                <tr key={parcel._id} className="hover:bg-gray-50">
                                    <td>{idx + 1}</td>
                                    <td className="font-mono text-sm">{parcel.trackingId}</td>
                                    <td>{parcel.title}</td>
                                    <td>{parcel.receiverName}</td>
                                    <td>৳{parcel.cost}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(parcel.delivery_status)}`}>
                                            {parcel.delivery_status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="text-xs">{parcel.payment_status}</td>
                                    <td className="text-sm">{new Date(parcel.creation_date).toLocaleDateString()}</td>
                                    <td className="flex flex-col md:flex-row gap-2">
                                        <button onClick={() => handleView(parcel)} className="btn btn-xs bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
                                            <FaEye /> View
                                        </button>
                                        <button onClick={() => handlePay(parcel)} className="btn btn-xs bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                                            <FaMoneyBillWave /> Pay
                                        </button>
                                        <button onClick={() => handleDelete(parcel._id)} className="btn btn-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
                                            <FaTrashAlt /> Delete
                                        </button>
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

export default MyParcel;
