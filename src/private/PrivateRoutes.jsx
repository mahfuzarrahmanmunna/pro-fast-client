import React from 'react';
import useAuth from '../Hooks/useAuth/useAuth';
import FallBack from '../Pages/Shared/FallBack/FallBack';
import { Navigate, useLocation } from 'react-router';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <FallBack />
    }

    if (!user || user?.email) {
        <Navigate to='/login' state={{ from: location.state }} replace />
    }
    return children;
};

export default PrivateRoutes;