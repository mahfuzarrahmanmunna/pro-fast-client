import React from 'react';
import useAuth from '../../../Hooks/useAuth/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import FallBack from '../../Shared/FallBack/FallBack';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user-payments?email=${user?.email}`);
            return res.data;
        }
    });

    if (isPending) {
        return <FallBack />;
    }

    return (
        <div className="px-4 md:px-8 py-6">
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">💳 Payment History</h1>

            <div className="overflow-x-auto">
                <table className="table w-full border border-gray-200">
                    <thead className="bg-base-200 text-gray-800">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Transaction ID</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Paid At</th>
                            <th className="px-4 py-2">Parcel ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment._id} className="border-t text-sm">
                                <td className="px-4 py-2 text-center">{index + 1}</td>
                                <td className="px-4 py-2 text-xs break-all">{payment.transactionId}</td>
                                <td className="px-4 py-2 text-center">${payment.amount}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{new Date(payment.paid_at).toLocaleString()}</td>
                                <td className="px-4 py-2 text-xs break-all">{payment.parcelId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;