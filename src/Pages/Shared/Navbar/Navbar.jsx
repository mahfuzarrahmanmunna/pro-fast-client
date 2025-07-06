import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import ProFastLogo from '../ProFast/ProFastLogo';
import useAuth from '../../../Hooks/useAuth/useAuth';

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout().then(result => {
            console.log(result);
        })
            .catch(err => {
                console.log(err);
            })
    }

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
            {user &&
                <>
                    <li><NavLink to="/be-a-rider" className={({ isActive }) => isActive ? "text-primary" : ""}>Be a Rider</NavLink></li>
                    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-primary" : ""}>Dashboard</NavLink></li>
                </>
            }
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
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src={user?.photoURL} />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>
                ) :
                    <Link className='btn btn-primary text-black ' to='/login'>
                        Login
                    </Link>
                }
            </div>
        </div>
    );
};

export default Navbar;
