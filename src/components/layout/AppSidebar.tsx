import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getSidebarItems } from "@/utils/getSidebarItems";
import * as React from "react";
import { Link, useLocation } from "react-router";

// sidebar-01-এর মতো: section অনুযায়ী ভাগ করা navigation

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { pathname } = useLocation();
	const { data: userData } = useUserInfoQuery(undefined);
	const data = {
		navMain: getSidebarItems(userData?.data?.role),
	};

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Link to="/" className="flex items-center gap-2.5 p-2">
					<svg width="25" height="29" viewBox="0 0 26 30" aria-hidden="true">
						<path
							d="M13 0C5.8 0 0 5.6 0 12.6 0 21.7 13 30 13 30s13-8.3 13-17.4C26 5.6 20.2 0 13 0z"
							className="fill-sidebar-primary"
						/>
						<circle cx="13" cy="12.5" r="5" fill="#fff" />
					</svg>
					<span className="leading-tight">
						<span className="block text-lg font-bold text-white">Phovia Tour</span>
						<span className="text-xs text-sidebar-foreground/70">Dashboard console</span>
					</span>
				</Link>
			</SidebarHeader>

			<SidebarContent>
				{data.navMain.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel className="text-sidebar-foreground/60">{group.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={pathname === item.url}
											className="data-[active=true]:shadow-[inset_3px_0_0_var(--star)]"
										>
											<Link to={item.url}>{item.title}</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link to="/">View public site</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton>Log out</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
