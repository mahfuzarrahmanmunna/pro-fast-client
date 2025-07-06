import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import rider from '../../../assets/agent-pending.png';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';

const BeRider = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [regions, setRegions] = useState([]); // State to hold regions
    const axiosSecure = useAxiosSecure()

    // Fetching data from the warehouses.json file
    useEffect(() => {
        fetch('/warehouses.json')
            .then((response) => response.json())
            .then((data) => {
                // Extract unique regions
                const uniqueRegions = [...new Set(data.map((warehouse) => warehouse.region))];
                setRegions(uniqueRegions); // Set unique regions to state
            })
            .catch((error) => console.error('Error fetching warehouse data:', error));
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await axiosSecure.post('YOUR_API_ENDPOINT', data);
            console.log(response.data);
            // handle success, like showing a confirmation message
        } catch (error) {
            console.error(error);
            // handle error
        }
    };

    return (
        <div className="flex justify-center items-center py-10 px-4 lg:px-16">
            <div className="flex flex-col lg:flex-row bg-white p-8 rounded-xl shadow-lg w-full max-w-7xl">
                {/* Form Section */}
                <div className="flex-1 space-y-6 lg:space-y-8">
                    <h1 className="text-3xl font-semibold text-gray-800 text-center lg:text-left">Be a Rider</h1>
                    <p className="text-gray-600 text-center lg:text-left">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments – we deliver on time, every time.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-gray-700">Your Name</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-700">Your Age</label>
                            <input
                                type="number"
                                {...register('age', { required: 'Age is required' })}
                                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            />
                            {errors.age && <span className="text-red-500 text-sm">{errors.age.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-700">Your Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>

                        {/* Dynamically populated Region dropdown */}
                        <div className="space-y-2">
                            <label className="text-gray-700">Your Region</label>
                            <select {...register('region', { required: 'Region is required' })} className="select select-bordered w-full focus:ring-2 focus:ring-[#CAEB66]">
                                <option value="">Select your region</option>
                                {regions.map((region, index) => (
                                    <option key={index} value={region}>{region}</option>
                                ))}
                            </select>
                            {errors.region && <span className="text-red-500 text-sm">{errors.region.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700">NID No</label>
                            <input
                                type="text"
                                {...register('nid', { required: 'NID is required' })}
                                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            />
                            {errors.nid && <span className="text-red-500 text-sm">{errors.nid.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700">Contact</label>
                            <input
                                type="text"
                                {...register('contact', { required: 'Contact number is required' })}
                                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            />
                            {errors.contact && <span className="text-red-500 text-sm">{errors.contact.message}</span>}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-gray-700">Which warehouse you want to work?</label>
                            <select {...register('warehouse', { required: 'Warehouse is required' })} className="select select-bordered w-full focus:ring-2 focus:ring-[#CAEB66]">
                                <option value="">Select warehouse</option>
                                <option value="warehouse1">Warehouse 1</option>
                                <option value="warehouse2">Warehouse 2</option>
                            </select>
                            {errors.warehouse && <span className="text-red-500 text-sm">{errors.warehouse.message}</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full col-span-2 bg-[#CAEB66] text-white hover:bg-[#A8D94F] focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                {/* Illustration Section */}
                <div className="flex-1 flex justify-center items-center mt-6 lg:mt-0" data-aos="fade-left" data-aos-duration="1000">
                    <img src={rider} alt="Rider Illustration" className="max-w-xs lg:max-w-md" />
                </div>
            </div>
        </div>
    );
};

export default BeRider;
