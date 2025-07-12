import React from 'react';
import useAuth from '../../Hooks/useAuth/useAuth';
import useUserRole from '../../Hooks/useUserRole/useUserRole';
import FallBack from '../../Pages/Shared/FallBack/FallBack';
import { Navigate } from 'react-router';

const RiderRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, userLoading } = useUserRole();

    if (loading || userLoading) {
        return <FallBack />
    }

    if (!user || role !== 'rider') {
        return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default RiderRoute;