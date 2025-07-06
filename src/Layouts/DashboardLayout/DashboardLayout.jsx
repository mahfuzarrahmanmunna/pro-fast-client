import React from 'react';
import { NavLink, Outlet } from 'react-router'; // Note: `react-router` should be `react-router-dom`
import ProFastLogo from '../../Pages/Shared/ProFast/ProFastLogo';
import { FaBox, FaCreditCard, FaMapMarkedAlt, FaUser, FaBars, FaUsers, FaHourglassHalf } from 'react-icons/fa';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Page content here */}
                <div className="navbar bg-base-300 w-full block lg:hidden">
                    <div className="flex items-center justify-between w-full px-4 py-2">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <FaBars className="h-6 w-6 text-base-content" />
                        </label>
                        <span className="text-lg font-semibold">Dashboard</span>
                    </div>
                </div>
                <Outlet />
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2 text-[16px] font-medium">
                    {/* Sidebar content here */}
                    <ProFastLogo />
                    <li>
                        <NavLink to="/dashboard/my-parcel" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaBox className="text-lg" /> All Parcels
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/payment-history" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaCreditCard className="text-lg" /> Payment History
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/track-package" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaMapMarkedAlt className="text-lg" /> Track a Package
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaUser className="text-lg" /> Profile
                        </NavLink>
                    </li>
                    {/* New routes for Active Riders and Pending Riders */}
                    <li>
                        <NavLink to="/dashboard/active-riders" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaUsers className="text-lg" /> Active Riders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/pending-riders" className={({ isActive }) => isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaHourglassHalf className="text-lg" /> Pending Riders
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;
