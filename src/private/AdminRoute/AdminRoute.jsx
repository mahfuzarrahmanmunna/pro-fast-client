import React from 'react';
import useAuth from '../../Hooks/useAuth/useAuth';
import FallBack from '../../Pages/Shared/FallBack/FallBack';
import useUserRole from '../../Hooks/useUserRole/useUserRole';
import { Navigate } from 'react-router';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, userLoading } = useUserRole();


    if (loading || userLoading) {
        return <FallBack />;
    }

    if (!user || role !== 'admin') {
        return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
    }

    return children
};

export default AdminRoute;