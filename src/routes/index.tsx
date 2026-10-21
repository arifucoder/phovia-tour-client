import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";

import About from "@/pages/About";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Unauthorized from "@/pages/Unauthorized";
import Verify from "@/pages/verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";

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
		children: [...generateRoutes(adminSidebarItems)],
	},
	{
		Component: DashboardLayout,
		path: "/user",
		children: [{ index: true, element: <Navigate to="/user/bookings" /> }, ...generateRoutes(userSidebarItems)],
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
	{
		Component: Unauthorized,
		path: "/unauthorized",
	},
]);
