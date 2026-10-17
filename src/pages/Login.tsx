// src/pages/LoginPage.tsx
// Static login page — React + TypeScript + shadcn/ui (Radix) + Tailwind + lucide-react
// Required: npx shadcn@latest add button input label separator

import { Eye } from "lucide-react";

import GoogleIcon from "@/assets/icons/GoogleIcon";
import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
			<div className="flex flex-col px-4 py-8 sm:px-6">
				{/* Mobile-only logo (image panel hidden on small screens) */}
				<div className="lg:hidden">
					<Logo />
				</div>

				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-sm">
						<h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
						<p className="mt-2 text-sm text-slate-600">Log in to manage your bookings.</p>

						<Button variant="outline" className="mt-6 w-full gap-2" type="button">
							<GoogleIcon />
							Continue with Google
						</Button>

						<div className="my-5 flex items-center gap-3">
							<Separator className="flex-1" />
							<span className="text-xs text-slate-500">or log in with email</span>
							<Separator className="flex-1" />
						</div>

						<form className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="you@example.com" />
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<a
										href="/forgot-password"
										className="text-xs font-medium text-indigo-600 underline underline-offset-4"
									>
										Forgot password?
									</a>
								</div>
								<div className="relative">
									<Input id="password" type="password" className="pr-10" />
									<button
										type="button"
										aria-label="Show password"
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
									>
										<Eye className="h-4 w-4" />
									</button>
								</div>
							</div>

							<Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
								Log in
							</Button>
						</form>

						<p className="mt-6 text-center text-sm text-slate-600">
							New to Phovia Tour?{" "}
							<a href="/signup" className="font-medium text-indigo-600 underline underline-offset-4">
								Create an account
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
