// import AddTour from "@/pages/Admin/AddTour";
// import AddTourTypes from "@/pages/Admin/AddTourTypes";
// import Analytics from "@/pages/Admin/Analytics";
// import Overview from "@/pages/Admin/Overview";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const Overview = lazy(() => import("@/pages/Admin/Overview"));
const AddTourTypes = lazy(() => import("@/pages/Admin/AddTourTypes"));
const AddTour = lazy(() => import("@/pages/Admin/AddTour"));

export const adminSidebarItems: ISidebarItem[] = [
	{
		title: "Dashboard",
		items: [
			{ title: "Overview", url: "/admin", component: Overview },
			{ title: "Analytics", url: "/admin/analytics", component: Analytics },
		],
	},
	{
		title: "Tour Management",
		items: [
			{ title: "Tours", url: "/admin/tours", component: AddTour },
			{ title: "Tour types", url: "/admin/tour-types", component: AddTourTypes },
		],
	},
];
