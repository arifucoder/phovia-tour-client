import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

export default function Unauthorized() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-svh flex-col bg-background">
			<header className="px-6 py-5">
				<Logo />
			</header>

			<main className="flex flex-1 flex-col items-center justify-center gap-[18px] px-4 pt-8 pb-16 text-center">
				<div aria-hidden="true">
					<span className="text-[120px] leading-[0.9] font-extrabold tracking-[-0.03em] text-primary sm:text-[200px]">
						4<span className="text-[#FF7A93] dark:text-[#FF8FA6]">0</span>3
					</span>
					<svg width="120" height="40" viewBox="0 0 120 40" className="mx-auto mt-2 block">
						<path
							d="M2 30 C 22 8, 40 8, 60 22 S 98 36, 118 10"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeDasharray="2 9"
							className="text-[#FF7A93] dark:text-[#FF8FA6]"
						/>
					</svg>
				</div>

				<p className="text-[13px] font-bold tracking-[0.08em] text-pink uppercase">No entry</p>

				<h1 className="max-w-[640px] text-[28px] font-bold tracking-tight sm:text-[40px]">
					This trail is for staff only
				</h1>

				<p className="max-w-[520px] text-[17px] text-muted-foreground">
					You don't have permission to view this page. Log in with an account that has access, or head back to where you
					were.
				</p>

				<div className="flex flex-wrap justify-center gap-2.5 pt-1.5">
					<Button asChild className="h-12 px-5 text-[15px] font-semibold">
						<Link to="/">Go to home</Link>
					</Button>
					<Button variant="outline" onClick={() => navigate(-1)} className="h-12 px-5 text-[15px] font-semibold">
						Go back
					</Button>
				</div>

				<p className="pt-2 text-sm text-muted-foreground">
					Wrong account?{" "}
					<Link to="/login" className="font-semibold text-primary hover:underline">
						Log in again
					</Link>
				</p>
			</main>
		</div>
	);
}
