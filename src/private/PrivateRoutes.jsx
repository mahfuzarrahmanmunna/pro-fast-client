import React from 'react';
import useAuth from '../Hooks/useAuth/useAuth';
import FallBack from '../Pages/Shared/FallBack/FallBack';
import { Navigate, useLocation } from 'react-router'; // ✅ CORRECT IMPORT

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <FallBack />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default PrivateRoutes;
