import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../ScosalLogin/SocialLogin';
import useAuth from '../../../Hooks/useAuth/useAuth';
import { motion } from 'framer-motion';

const LogIn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    const { signIn } = useAuth();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            navigate(from);
        } catch (error) {
            console.error(error);
            // Handle error (e.g., show an error toast or message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 my-12">
            <div className="card-body">
                <h1 className="text-xl font-bold">Log in now</h1>

                {/* Form with Smooth Transition */}
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    className="fieldset"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <label className="label">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: true })}
                        required
                        className="input w-full"
                        placeholder="Email"
                    />
                    {errors.email?.type === 'required' && (
                        <motion.p role="alert" className="error-text">
                            Email is required.
                        </motion.p>
                    )}

                    <label className="label">Password</label>
                    <input
                        type="password"
                        {...register('password', { required: true, minLength: 6 })}
                        className="input w-full"
                        placeholder="Password"
                    />
                    {errors.password?.type === 'required' && (
                        <motion.p role="alert" className="error-text">
                            Password is required.
                        </motion.p>
                    )}
                    {errors?.password?.type === 'minLength' && (
                        <motion.p role="alert" className="error-text">
                            Password must be 6 characters or more.
                        </motion.p>
                    )}

                    <div>
                        <a className="link link-hover">Forgot password?</a>
                    </div>

                    <motion.button
                        className="btn btn-primary text-black mt-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </motion.form>

                <p>
                    New to this website? Please{' '}
                    <Link className="text-blue-500 underline" to="/register">
                        Register
                    </Link>
                </p>

                <SocialLogin location={location} form={from} navigate={navigate} />
            </div>
        </div>
    );
};

export default LogIn;
