import { createBrowserRouter } from "react-router"; // ✅ correct import
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../Pages/Home/Home/Home";
import AboutUs from "../Pages/About/AboutUs";
import AuthLayouts from "../Layouts/AuthLayouts/AuthLayouts";
import LogIn from "../Pages/Authentication/LogIn/LogIn";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoutes from "../private/PrivateRoutes";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import MyParcel from "../Pages/Dashboard/MyParcel/MyParcel";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import Profile from "../Pages/Dashboard/Profile/Profile";
import BeRider from "../Pages/Dashboard/BeRider/BeRider";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "../private/AdminRoute/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import RiderRoute from "../private/RiderRoute/RiderRoute";
import InProgressDeliveries from "../Pages/Dashboard/InProgressDeliveries/InProgressDeliveries";
import CompletedDeliveries from "../Pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import MyEarning from "../Pages/Dashboard/MyEarning/MyEarning";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayouts />, // ✅ use element
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'about-us',
                element: <AboutUs />
            },
            {
                path: 'coverage',
                element: <Coverage />
            },
            {
                path: 'parcel-send',
                element: (
                    <PrivateRoutes>
                        <SendParcel />
                    </PrivateRoutes>
                )
            },
            {
                path: 'be-a-rider',
                element: (
                    <PrivateRoutes>
                        <BeRider />
                    </PrivateRoutes>
                )
            }
        ]
    },
    {
        path: '/',
        element: <AuthLayouts />,
        children: [
            {
                path: 'login',
                element: <LogIn />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'forbidden',
                Component: Forbidden
            }
        ]
    },
    {
        path: 'dashboard',
        element: (
            <PrivateRoutes>
                <DashboardLayout />
            </PrivateRoutes>
        ),
        children: [
            {
                path: 'my-parcel',
                element: <MyParcel />
            },
            {
                path: 'assign-rider',
                element: <AdminRoute>
                    <AssignRider />
                </AdminRoute>
            },
            {
                path: 'payment/:id',
                element: <Payment />
            },
            {
                path: 'payment-history',
                element: <PaymentHistory />
            },
            {
                path: 'track-package',
                element: <TrackParcel />
            },
            {
                path: 'active-riders',
                element: <AdminRoute>
                    <ActiveRiders />
                </AdminRoute>
            },
            {
                path: 'pending-riders',
                element: <AdminRoute>
                    <PendingRiders />
                </AdminRoute>
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'make-admin',
                element: <PrivateRoutes>
                    <AdminRoute>
                        <MakeAdmin />
                    </AdminRoute>
                </PrivateRoutes>
            },
            {
                path: 'pending-delivery',
                element: (
                    <RiderRoute>
                        <PendingDeliveries />
                    </RiderRoute>
                )
            },
            {
                path: 'in-progress-delivery',
                element: (
                    <RiderRoute>
                        <InProgressDeliveries />
                    </RiderRoute>
                )
            },
            {
                path: 'completed-deliveries',
                element: (
                    <RiderRoute>
                        <CompletedDeliveries />
                    </RiderRoute>
                )
            },
            {
                path: 'my-earnings',
                element: (
                    <RiderRoute>
                        <MyEarning />
                    </RiderRoute>
                )
            },
        ]
    }
]);
