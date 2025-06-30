import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../../Hooks/useAuth/useAxiosSecure/useAxiosSecure';

const MyParcel = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()

    const { data: parcels = [] } = useQuery({
        queryKey: ['my-parcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.length(`parcels?=email=${user?.email}`);
            return res.data
        }
    })

    console.log(parcels);
    return (
        <div>
            myParcel is coming here
        </div>
    );
};

export default MyParcel;