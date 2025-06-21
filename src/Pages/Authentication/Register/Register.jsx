import React from 'react';
import { useForm } from 'react-hook-form';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = e => {
        console.log(e);
    }
    return (
        <div className="">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 my-12">
                <div className="card-body">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
                        <label className="label">Email</label>
                        <input type="email" {...register('email', {
                            required: true,
                        })} className="input" placeholder="Email" />
                        {
                            errors.email?.type === 'required' && (
                                <p role='alert' className='text-red-500'>Email is required</p>
                            )
                        }
                        <label className="label">Password</label>
                        <input type="password" {...register('password', {
                            required: true,
                            minLength: 6
                        })} className="input" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && (
                                <p className='text-red-500'>Password is required</p>
                            )
                        }
                        {
                            errors.password?.type === 'minLength' && (
                                <p className='text-red-500'>Password must be 6 character..!</p>
                            )
                        }
                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button type='submit' className="btn btn-neutral mt-4">Login</button>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Register;