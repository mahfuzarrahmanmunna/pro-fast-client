import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import ProFastLogo from '../ProFast/ProFastLogo';

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY && currentY > 100) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navItems = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "text-primary" : ""}>Home</NavLink></li>
            <li><NavLink to="/about-us" className={({ isActive }) => isActive ? "text-primary" : ""}>About Us</NavLink></li>
            <li><NavLink to="/coverage" className={({ isActive }) => isActive ? "text-primary" : ""}>Coverage</NavLink></li>
            <li><NavLink to="/parcel-send" className={({ isActive }) => isActive ? "text-primary" : ""}>Send a parcel</NavLink></li>
        </>
    );

    return showNavbar && (
        <div className="navbar bg-base-100 lg:px-12 shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-300 backdrop-blur  ">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost  lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-10">
                        {navItems}
                    </ul>
                </div>
                <div className="text-xl">
                    <ProFastLogo />
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>
            <div className="navbar-end">
                <Link className='btn btn-primary text-black ' to='/login'>
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
