import { useEffect, useState } from 'react';
import useAuth from '../useAuth/useAuth';
import useAxiosSecure from '../useAxiosSecure/useAxiosSecure';

const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchRole = async () => {
            if (!user?.email) return;

            try {
                const res = await axiosSecure.get(`/users/role/${user.email}`);
                setRole(res.data.role);
            } catch (error) {
                console.error('Failed to fetch user role:', error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchRole();
        }
    }, [user, authLoading, axiosSecure]);

    return { role, loading };
};

export default useUserRole;
