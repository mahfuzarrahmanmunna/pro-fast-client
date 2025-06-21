import React from 'react';
import logo from '../../../assets/logo.png'
import { Link } from 'react-router';

const ProFastLogo = () => {
    return (
        <div>
            <Link to='/'>
                <div className='flex items-end'>
                    <img src={logo} alt="" />
                    <h3 className='text-3xl -ms-2 font-extrabold'>ProFast</h3>
                </div>
            </Link>
        </div>
    );
};

export default ProFastLogo;