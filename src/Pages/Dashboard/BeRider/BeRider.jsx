import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import rider from '../../../assets/agent-pending.png';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth/useAuth';

const BeRider = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [regions, setRegions] = useState([]);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth()

    useEffect(() => {
        fetch('/warehouses.json')
            .then(res => res.json())
            .then(data => {
                const uniqueRegions = [...new Set(data.map(warehouse => warehouse.region))];
                setRegions(uniqueRegions);
            })
            .catch(error => console.error('Error loading warehouse data:', error));
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await axiosSecure.post(`${import.meta.env.VITE_API_URL}/be-rider`, data);
            if (response.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted',
                    text: 'Your rider application has been submitted and is pending review.',
                    confirmButtonColor: '#CAEB66'
                });
                reset();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Something went wrong. Please try again later.',
            });
        }
    };

    return (
        <div className="flex justify-center items-center py-10 px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col lg:flex-row-reverse bg-white p-6 sm:p-8 lg:p-12 rounded-xl shadow-lg w-full max-w-7xl gap-10">
                {/* Rider Image */}
                <div className="flex justify-center items-center">
                    <img
                        src={rider}
                        alt="Rider Illustration"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
                    />
                </div>

                {/* Form Section */}
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Apply to Be a Rider</h2>
                    <p className="text-gray-600 mb-8">
                        Deliver smiles and parcels. Become part of our fast-growing logistics network.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                defaultValue={user?.displayName}
                                disabled
                                className="input input-bordered w-full"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="block mb-1 font-medium text-gray-700">Age</label>
                            <input
                                type="number"
                                {...register('age', { required: 'Age is required' })}
                                className="input input-bordered w-full"
                            />
                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="block mb-1 font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                defaultValue={user.email}
                                disabled
                                className="input input-bordered w-full"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="block mb-1 font-medium text-gray-700">Region</label>
                            <select {...register('region', { required: 'Region is required' })} className="select select-bordered w-full">
                                <option value="">Select Region</option>
                                {regions.map((region, index) => (
                                    <option key={index} value={region}>{region}</option>
                                ))}
                            </select>
                            {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="block mb-1 font-medium text-gray-700">NID Number</label>
                            <input
                                type="text"
                                {...register('nid', { required: 'NID is required' })}
                                className="input input-bordered w-full"
                            />
                            {errors.nid && <p className="text-red-500 text-sm mt-1">{errors.nid.message}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="block mb-1 font-medium text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                {...register('contact', { required: 'Contact number is required' })}
                                className="input input-bordered w-full"
                            />
                            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block mb-1 font-medium text-gray-700">Preferred Warehouse</label>
                            <select {...register('warehouse', { required: 'Warehouse is required' })} className="select select-bordered w-full">
                                <option value="">Select warehouse</option>
                                <option value="warehouse1">Warehouse 1</option>
                                <option value="warehouse2">Warehouse 2</option>
                            </select>
                            {errors.warehouse && <p className="text-red-500 text-sm mt-1">{errors.warehouse.message}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-full bg-[#CAEB66] hover:bg-[#A8D94F] text-black"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BeRider;