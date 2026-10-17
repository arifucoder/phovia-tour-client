// src/pages/LoginPage.tsx
// Static login page — React + TypeScript + shadcn/ui (Radix) + Tailwind + lucide-react
// Required: npx shadcn@latest add button input label separator

import Logo from "@/assets/icons/Logo";
import LoginForm from "@/components/modules/Authentication/LoginForm";
import heroImage from "../assets/images/auth/inani-beach.jpeg";
// Your own photo: put it in src/assets and uncomment
// import heroImage from "@/assets/inani-beach.jpg"

export default function LoginPage() {
	return (
		<div className="grid min-h-screen bg-white lg:grid-cols-2">
			{/* Left: image panel */}
			<div className="relative hidden p-4 lg:block">
				<div className="relative h-full overflow-hidden rounded-3xl bg-linear-to-b from-slate-200 via-slate-400 to-slate-700">
					<img src={heroImage} alt="Inani Beach, Cox's Bazar" className="absolute inset-0 h-full w-full object-cover" />
					<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

					{/* Logo — back to home */}
					<div className="absolute left-8 top-8 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur">
						<Logo />
					</div>

					<span className="absolute right-6 top-8 rounded bg-slate-800/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
						Photo · Inani Beach, Cox&apos;s Bazar
					</span>

					<div className="absolute bottom-0 left-0 p-10 text-white">
						<h2 className="text-4xl font-bold leading-tight">
							Your next trip is a few
							<br />
							taps away.
						</h2>
						<p className="mt-3 max-w-sm text-sm text-white/80">
							Log in to book tours, pay securely and keep every invoice in one place.
						</p>
					</div>
				</div>
			</div>

			{/* Right: form */}
			<LoginForm />
		</div>
	);
}
