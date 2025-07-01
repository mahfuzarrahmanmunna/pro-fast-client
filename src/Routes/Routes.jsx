import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayouts,
        children: [
            {
                path: '/',
                Component: Home
            },
            {
                path: '/about-us',
                Component: AboutUs
            },
            {
                path: '/coverage',
                Component: Coverage
            },
            {
                path: '/parcel-send',
                element: <PrivateRoutes>
                    <SendParcel />
                </PrivateRoutes>
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayouts,
        children: [
            {
                path: '/login',
                Component: LogIn
            },
            {
                path: '/register',
                Component: Register
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoutes>
            <DashboardLayout />
        </PrivateRoutes>,
        children: [
            {
                path: 'my-parcel',
                Component: MyParcel
            },
            {
                path: '/payment/:id',
                Component: Payment,
            },
        ]
    }
])