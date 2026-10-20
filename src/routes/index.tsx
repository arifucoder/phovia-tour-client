import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";

import About from "@/pages/About";
import AddTour from "@/pages/Admin/AddTour";
import Analytics from "@/pages/Admin/Analytics";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Booking from "@/pages/User/Booking";
import Verify from "@/pages/verify";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
	{
		Component: App,
		path: "/",
		children: [
			{
				Component: About,
				path: "about",
			},
		],
	},
	{
		Component: DashboardLayout,
		path: "/admin",
		children: [
			{
				Component: Analytics,
				path: "analytics",
			},
			{
				Component: AddTour,
				path: "add-tour",
			},
		],
	},
	{
		Component: DashboardLayout,
		path: "/user",
		children: [
			{
				Component: Booking,
				path: "bookings",
			},
		],
	},
	{
		Component: LoginPage,
		path: "/login",
	},
	{
		Component: RegisterPage,
		path: "/signup",
	},
	{
		Component: Verify,
		path: "/verify",
	},
]);
