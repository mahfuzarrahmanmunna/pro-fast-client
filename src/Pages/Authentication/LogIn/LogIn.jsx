import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

const LogIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const onSubmit = data => {
        console.log(data);
    }
    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 my-12">
            <div className="card-body">
                <h1 className='text-xl font-bold'>Log in now</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} required className="input w-full" placeholder="Email" />
                    {errors.email?.type === "required" && (
                        <p role="alert">First name is required</p>
                    )}
                    <label className="label">Password</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: true,
                            minLength: 6
                        })}
                        className="input w-full"
                        placeholder="Password" />
                    {errors.password?.type === "required" && (
                        <p role="alert">Password is required</p>
                    )}
                    {
                        errors?.password?.type === 'minLength' &&
                        <p role="alert">Password must be 6 character or long..</p>
                    }
                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-primary text-black mt-4">Login</button>
                </form>
                <p>New to this website. Please <Link className='text-blue-500 underline' to='/register'>Register</Link></p>
            </div>
        </div>
    );
};

export default LogIn;