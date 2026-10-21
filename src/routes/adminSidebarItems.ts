import AddTour from "@/pages/Admin/AddTour";
import AddTourTypes from "@/pages/Admin/AddTourTypes";
import Overview from "@/pages/Admin/Overview";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] = [
	{
		title: "Dashboard",
		items: [{ title: "Overview", url: "/admin", component: Overview }],
	},
	{
		title: "Tour Management",
		items: [
			{ title: "Tours", url: "/admin/tours", component: AddTour },
			{ title: "Tour types", url: "/admin/tour-types", component: AddTourTypes },
		],
	},
];
