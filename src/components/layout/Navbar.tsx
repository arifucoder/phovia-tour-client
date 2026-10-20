import Logo from "@/assets/icons/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { authApi, useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { LogOut, Menu } from "lucide-react";
import { Link, NavLink } from "react-router";
import { ModeToggle } from "./ModeToggler";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Tours", href: "/tours" },
	{ label: "Divisions", href: "/divisions" },
	{ label: "Short tours", href: "/tours?type=short" },
	{ label: "Long tours", href: "/tours?type=long" },
];

const primaryBtn = cn(
	buttonVariants(),
	"h-11 rounded-lg px-[22px] text-[14.5px] font-medium shadow-lg shadow-primary/25 hover:bg-primary-hover",
);

const outlineBtn = cn(
	buttonVariants({ variant: "outline" }),
	"h-11 rounded-lg border-primary text-[14.5px] font-medium text-primary hover:bg-accent hover:text-accent-foreground",
);

export default function Navbar() {
	const { data } = useUserInfoQuery(undefined);
	const [logout] = useLogoutMutation();
	const dispatch = useAppDispatch();

	const handleLogout = async () => {
		try {
			await logout(undefined).unwrap();
		} finally {
			dispatch(authApi.util.resetApiState());
		}
	};
	return (
		<header className="w-full bg-background">
			<div className="mx-auto flex h-21 max-w-300 items-center justify-between gap-6 px-4 sm:px-10">
				<Logo />

				{/* Desktop nav */}
				<nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
					{navLinks.map((link) => (
						<NavLink
							key={link.label}
							to={link.href}
							className="relative py-1.5 text-[14.5px] font-medium text-foreground transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-1/2 after:size-1.25 after:-translate-x-1/2 after:rounded-full after:bg-primary after:opacity-0 aria-[current=page]:after:opacity-100"
						>
							{link.label}
						</NavLink>
					))}
				</nav>

				{/* Right side */}
				<div className="flex items-center gap-3.5">
					{data?.data?.email ? (
						<Button onClick={handleLogout} className={cn(outlineBtn, "hidden sm:inline-flex")}>
							<LogOut className="size-4" />
							Log out
						</Button>
					) : (
						<>
							<Link
								to="/login"
								className="hidden py-1.5 text-[14.5px] font-medium text-foreground transition-colors hover:text-primary sm:inline-block"
							>
								Log in
							</Link>
							<Link to="/signup" className={cn(primaryBtn, "hidden sm:inline-flex")}>
								Sign up
							</Link>
						</>
					)}

					{/* Mobile menu */}
					<Sheet>
						<SheetTrigger
							aria-label="Open menu"
							className={cn(
								buttonVariants({ variant: "outline", size: "icon" }),
								"size-11 rounded-lg border-border text-foreground lg:hidden",
							)}
						>
							<Menu className="size-5.5" />
						</SheetTrigger>
						<SheetContent side="right" className="w-75 bg-background">
							<SheetHeader>
								<SheetTitle className="text-left">
									<Logo />
								</SheetTitle>
							</SheetHeader>
							<nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
								{navLinks.map((link) => (
									<NavLink
										key={link.label}
										to={link.href}
										className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
									>
										{link.label}
									</NavLink>
								))}
							</nav>
							<div className="mt-4 flex flex-col gap-3 px-4 sm:hidden">
								{data?.data?.email ? (
									<button onClick={handleLogout} className={outlineBtn}>
										<LogOut className="size-4" />
										Log out
									</button>
								) : (
									<>
										<Link to="/login" className={outlineBtn}>
											Log in
										</Link>
										<Link to="/register" className={primaryBtn}>
											Sign up
										</Link>
									</>
								)}
							</div>
						</SheetContent>
					</Sheet>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
