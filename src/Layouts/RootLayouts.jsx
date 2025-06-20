import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import Footer from '../Pages/Shared/Footer/Footer';

const RootLayouts = () => {
    return (
        <div className='font-urbanist max-w-7xl mx-auto text-base transition-colors duration-300 min-h-screen flex flex-col'>
            <Navbar />
            <div className='flex-1 pt-20 transition-colors duration-300'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default RootLayouts;