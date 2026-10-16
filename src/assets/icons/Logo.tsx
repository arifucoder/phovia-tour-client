import { Link } from "react-router";

export default function Logo() {
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
