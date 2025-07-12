import React from 'react';
import { NavLink, Outlet } from 'react-router';
import ProFastLogo from '../../Pages/Shared/ProFast/ProFastLogo';
import {
    FaBoxOpen,
    FaCreditCard,
    FaMapMarkedAlt,
    FaUserCircle,
    FaBars,
    FaUsers,
    FaUserCheck,
    FaUserClock,
    FaUserShield,
    FaUserTag,
    FaUserEdit,
    FaMotorcycle,
} from 'react-icons/fa';
import useUserRole from '../../Hooks/useUserRole/useUserRole';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = () => {
    const { role, loading } = useUserRole();

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Mobile navbar */}
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
            <Toaster />
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2 text-[16px] font-medium">
                    <ProFastLogo />

                    {/* ✨ Universal User Routes */}
                    <li>
                        <NavLink to="/dashboard/my-parcel" className={({ isActive }) =>
                            isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaBoxOpen className="text-lg" /> My Parcels
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/payment-history" className={({ isActive }) =>
                            isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaCreditCard className="text-lg" /> Payment History
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/track-package" className={({ isActive }) =>
                            isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaMapMarkedAlt className="text-lg" /> Track Package
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/profile" className={({ isActive }) =>
                            isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                            <FaUserCircle className="text-lg" /> My Profile
                        </NavLink>
                    </li>

                    {/* 🛡️ Admin Only Routes */}
                    {
                        !loading && role === 'admin' && (
                            <>
                                <li className="mt-4 mb-1 text-gray-500 uppercase text-xs tracking-wide pl-2">Admin Panel</li>

                                <li>
                                    <NavLink to="/dashboard/active-riders" className={({ isActive }) =>
                                        isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                                        <FaUserCheck className="text-lg" /> Active Riders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/pending-riders" className={({ isActive }) =>
                                        isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                                        <FaUserClock className="text-lg" /> Pending Riders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/make-admin" className={({ isActive }) =>
                                        isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                                        <FaUserShield className="text-lg" /> Make Admin
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/assign-rider" className={({ isActive }) =>
                                        isActive ? "text-primary font-semibold" : "hover:text-primary flex items-center gap-2"}>
                                        <FaMotorcycle className="text-lg" /> Assign Rider
                                    </NavLink>
                                </li>
                            </>
                        )
                    }
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;
