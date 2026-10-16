import { Link } from "react-router";

const footerSections = [
	{
		title: "Explore",
		links: [
			{ label: "All tours", href: "/tours" },
			{ label: "Short tours", href: "/tours?type=short" },
			{ label: "Long tours", href: "/tours?type=long" },
			{ label: "Divisions", href: "/divisions" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About us", href: "/about" },
			{ label: "Become a guide", href: "/become-a-guide" },
			{ label: "Contact", href: "/contact" },
		],
	},
	{
		title: "Support",
		links: [
			{ label: "Help centre", href: "/help" },
			{ label: "Cancellation policy", href: "/cancellation-policy" },
		],
	},
];

export default function Footer() {
	return (
		<footer className="w-full bg-background pb-7 pt-20">
			<div className="mx-auto flex max-w-300 flex-col gap-14 px-4 sm:px-10">
				<div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div className="flex flex-col gap-3.5">
						<Link to="/" className="flex items-center gap-2 text-foreground">
							<svg width="24" height="28" viewBox="0 0 26 30" aria-hidden="true">
								<path
									d="M13 0C5.8 0 0 5.6 0 12.6 0 21.7 13 30 13 30s13-8.3 13-17.4C26 5.6 20.2 0 13 0z"
									className="fill-primary"
								/>
								<circle cx="13" cy="12.5" r="5" fill="#fff" />
							</svg>
							<span className="text-xl font-bold">Phovia Tour</span>
						</Link>
						<p className="max-w-65 text-sm text-muted-foreground">
							Guided tours across Bangladesh, booked and paid online in taka.
						</p>
					</div>

					{/* Link columns */}
					{footerSections.map((section) => (
						<nav key={section.title} aria-label={section.title} className="flex flex-col gap-3">
							<strong className="text-[15px] font-semibold text-foreground">{section.title}</strong>
							{section.links.map((link) => (
								<Link
									key={link.label}
									to={link.href}
									className="text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									{link.label}
								</Link>
							))}
							{section.title === "Support" && (
								<>
									<span className="text-sm text-muted-foreground">+880 1XXX-XXXXXX</span>
									<span className="text-sm text-muted-foreground">support@phoviatour.com</span>
								</>
							)}
						</nav>
					))}
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col gap-3 border-t pt-5.5 text-[13px] sm:flex-row sm:items-center sm:justify-between">
					<span className="text-muted-foreground">© 2026 Phovia Tour. All rights reserved.</span>
					<div className="flex gap-6">
						<Link to="/terms" className="text-muted-foreground hover:text-primary">
							Terms of service
						</Link>
						<Link to="/privacy" className="text-muted-foreground hover:text-primary">
							Privacy policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
