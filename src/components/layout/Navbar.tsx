import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Link } from "react-router";

const navLinks = [
	{ label: "Home", href: "/" },
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

function Logo() {
	return (
		<Link to="/" className="flex items-center gap-2 text-foreground">
			<svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
				<path
					d="M13 0C5.8 0 0 5.6 0 12.6 0 21.7 13 30 13 30s13-8.3 13-17.4C26 5.6 20.2 0 13 0z"
					className="fill-primary"
				/>
				<circle cx="13" cy="12.5" r="5" className="fill-background" />
			</svg>
			<span className="text-[22px] font-bold tracking-tight">Phovia Tour</span>
		</Link>
	);
}

export default function Header() {
	return (
		<header className="w-full bg-background">
			<div className="mx-auto flex h-21 max-w-300 items-center justify-between gap-6 px-4 sm:px-10">
				<Logo />

				{/* Desktop nav */}
				<nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							to={link.href}
							className="py-1.5 text-[14.5px] font-medium text-foreground transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Right side */}
				<div className="flex items-center gap-3.5">
					<Link
						to="/login"
						className="hidden py-1.5 text-[14.5px] font-medium text-foreground transition-colors hover:text-primary sm:inline-block"
					>
						Log in
					</Link>
					<Link to="/register" className={cn(primaryBtn, "hidden sm:inline-flex")}>
						Sign up
					</Link>

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
									<Link
										key={link.label}
										to={link.href}
										className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
									>
										{link.label}
									</Link>
								))}
							</nav>
							<div className="mt-4 flex flex-col gap-3 px-4 sm:hidden">
								<Link to="/login" className={outlineBtn}>
									Log in
								</Link>
								<Link to="/register" className={primaryBtn}>
									Sign up
								</Link>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
