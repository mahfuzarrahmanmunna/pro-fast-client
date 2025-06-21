import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth/useAuth';
import { Link } from 'react-router';

const Register = () => {
    const { createUser } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = e => {
        console.log(e);
        console.log(createUser);
        createUser(e.email, e.password)
            .then(result => {
                console.log(result.user);
            })
            .catch(err => {
                console.error(err.code);
            })
    }
    return (
        <div className="">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 my-12">
                <div className="card-body">
                    <h1 className="text-5xl font-bold">Register now!</h1>
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
                                <p className='text-red-500'>Password is required.  </p>
                            )
                        }
                        {
                            errors.password?.type === 'minLength' && (
                                <p className='text-red-500'>Password must be 6 character..!</p>
                            )
                        }
                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button type='submit' className="btn btn-primary text-black mt-4">Register</button>
                    </form>
                    <p>Already have an account. Please <Link className='text-blue-500 underline' to='/login'>Login</Link></p>
                </div>
            </div>
        </div >
    );
};

export default Register;