import React from 'react';
import useAuth from '../../../Hooks/useAuth/useAuth';

const SocialLogin = ({ location, navigate, from }) => {
    const { googleLogin } = useAuth();

    const handleGoogleLogin = () => {
        googleLogin()
            .then(result => {
                console.log('User:', result.user);
                navigate(from)
                // You can redirect or show toast here
            })
            .catch(err => {
                console.error('Google Login Error:', err);
            });
    };

    return (
        <div>
            <div className="divider">Or</div>
            <button
                onClick={handleGoogleLogin}
                className="btn bg-white text-black w-full border border-[#e5e5e5] flex items-center justify-center gap-2"
            >
                <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g>
                        <path fill="#fff" d="M0 0h512v512H0z" />
                        <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
                        <path fill="#4285f4" d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
                        <path fill="#fbbc02" d="M90 341a208 200 0 010-171l63 49q-12 37 0 73" />
                        <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
                    </g>
                </svg>
                Login with Google
            </button>
        </div>
    );
};

export default SocialLogin;
