import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";

import { role } from "@/constants/role";
import About from "@/pages/About";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Tours from "@/pages/Tours";
import Unauthorized from "@/pages/Unauthorized";
import Verify from "@/pages/verify";
import type { TRole } from "@/types";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
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
			{ Component: Tours, path: "tours" },
		],
	},
	{
		Component: withAuth(DashboardLayout, role.superAdmin as TRole),
		path: "/admin",
		children: [...generateRoutes(adminSidebarItems)],
	},
	{
		Component: withAuth(DashboardLayout, role.user as TRole),
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
