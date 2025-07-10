import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../ScosalLogin/SocialLogin';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import Swal from 'sweetalert2';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedImage(file);
    };

    const onSubmit = async (data) => {
        setUploadError(null);

        if (!selectedImage) {
            setUploadError('Profile image is required');
            return;
        }

        setUploading(true);

        try {
            // Upload image to imgbb
            const formData = new FormData();
            formData.append('image', selectedImage);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_UPLOAD_KEY}`, {
                method: 'POST',
                body: formData,
            });
            const imgResponse = await res.json();

            if (!imgResponse.success) {
                setUploadError('Failed to upload image');
                setUploading(false);
                return;
            }

            const imageUrl = imgResponse.data.display_url;

            // Create Firebase user
            const result = await createUser(data.email, data.password);
            const user = result.user;

            // Update Firebase profile
            await updateUserProfile({ displayName: data.name, photoURL: imageUrl });

            // Save user in your database
            const savedUser = {
                name: data.name,
                email: data.email,
                photo: imageUrl,
                uid: user.uid,
                role: 'customer'
            };

            await axiosSecure.put('/users', savedUser);

            // ✅ SweetAlert success
            Swal.fire({
                title: 'Success!',
                text: 'User registered successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            reset();
            setSelectedImage(null);
            navigate(from);
        } catch (error) {
            console.error('Error during registration:', error);
            if (error.code === 'auth/email-already-in-use') {
                setUploadError('This email is already registered. Please login.');
            } else if (error.code === 'auth/invalid-email') {
                setUploadError('Invalid email address.');
            } else {
                setUploadError('Something went wrong. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="card bg-base-100 w-full max-w-sm p-6 border border-gray-200">
                <div className="card-body">
                    <h1 className="text-3xl font-bold text-center mb-4">Register</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <label className="label">Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Your Name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}

                        <label className="label mt-2">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}

                        <label className="label mt-2">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: true, minLength: 6 })}
                            className="input input-bordered w-full"
                            placeholder="Password"
                        />
                        {errors.password?.type === 'required' && <p className="text-red-500 text-sm mt-1">Password is required</p>}
                        {errors.password?.type === 'minLength' && <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>}

                        <label className="label mt-2">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered w-full"
                        />
                        {!selectedImage && <p className="text-red-500 text-sm mt-1">Profile image is required</p>}

                        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}

                        <button type="submit" disabled={uploading} className="btn btn-primary w-full mt-4">
                            {uploading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <p className="mt-4 text-center">
                        Already have an account?{' '}
                        <Link state={{ from }} to="/login" className="text-blue-500 underline">
                            Login
                        </Link>
                    </p>

                    <div className="mt-4">
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
