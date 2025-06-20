import React from 'react';
import logo from '../../../assets/logo.png'

const ProFastLogo = () => {
    return (
        <div className='flex items-end'>
            <img src={logo} alt="" />
            <h3 className='text-3xl -ms-2 font-extrabold'>ProFast</h3>
        </div>
    );
};

export default ProFastLogo;