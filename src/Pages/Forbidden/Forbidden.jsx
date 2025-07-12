// src/Pages/Shared/Forbidden.jsx
import React from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-4">
            <FaLock className="text-6xl text-red-500 mb-4" />
            <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Forbidden</h1>
            <p className="text-lg text-base-content mb-6">
                You don’t have permission to access this page.
            </p>
            <Link to="/" className="btn btn-primary bg-[#CAEB66] text-black">
                Go Home
            </Link>
        </div>
    );
};

export default Forbidden;
