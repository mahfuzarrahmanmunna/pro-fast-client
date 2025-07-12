import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from '../useAuth/useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
});

const useAxiosSecure = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log('inside res interceptor', error);
                const status = error?.response?.status;
                if (status === 401 || status === 403) {
                    logout().then(() => {
                        navigate('/login');
                    });
                }
                return Promise.reject(error);
            }
        );

        // Clean up
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [user, logout, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
