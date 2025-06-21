import React from 'react';
import { Outlet } from 'react-router';
import authImage from '../../assets/authImage.png'
import ProFastLogo from '../../Pages/Shared/ProFast/ProFastLogo';

const AuthLayouts = () => {
    return (
        <div className='p-12'>
            <div className='py-4 '>
                <ProFastLogo />
            </div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='bg-[#FAFDF0] flex-1'>
                    <img
                        src={authImage}
                        className="max-w-sm rounded-lg"
                    />
                </div>
                <div className='flex-1'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayouts;