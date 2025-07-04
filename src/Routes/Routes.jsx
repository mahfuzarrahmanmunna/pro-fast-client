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
                path: 'profile',
                element: <Profile />
            },
        ]
    }
]);
