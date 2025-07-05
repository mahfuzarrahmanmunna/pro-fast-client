import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth/useAuth';
import { Link } from 'react-router';  // ✅ Fixed import
import SocialLogin from '../ScosalLogin/SocialLogin';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const axiosSecure = useAxiosSecure();

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

            // Save or update user in DB
            const savedUser = {
                name: data.name,
                email: data.email,
                photo: imageUrl,
                uid: user.uid,
                role: 'customer'
            };

            await axiosSecure.put('/users', savedUser);

            alert('User registered successfully!');
            reset();
            setSelectedImage(null);
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
        <div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 my-12">
                <div className="card-body">
                    <h1 className="text-5xl font-bold">Register now!</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="fieldset">

                        <label className="label">Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="input"
                            placeholder="Your Name"
                        />
                        {errors.name && <p className="text-red-500">Name is required</p>}

                        <label className="label">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="input"
                            placeholder="Email"
                        />
                        {errors.email && <p className="text-red-500">Email is required</p>}

                        <label className="label">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: true, minLength: 6 })}
                            className="input"
                            placeholder="Password"
                        />
                        {errors.password?.type === 'required' && <p className="text-red-500">Password is required.</p>}
                        {errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters.</p>}

                        <label className="label">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input"
                        />
                        {!selectedImage && <p className="text-red-500">Profile image is required.</p>}

                        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}

                        <div><a className="link link-hover">Forgot password?</a></div>

                        <button type="submit" disabled={uploading} className="btn btn-primary text-black mt-4">
                            {uploading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <p>
                        Already have an account? Please{' '}
                        <Link className="text-blue-500 underline" to="/login">Login</Link>
                    </p>

                    <SocialLogin />
                </div>
            </div>
        </div>
    );
};

export default Register;
