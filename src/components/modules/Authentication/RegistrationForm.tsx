export default function RegistrationForm() {
	return (
		<div className="flex flex-col px-4 py-8 sm:px-6">
			{/* Mobile-only logo (image panel hidden on small screens) */}
			<div className="lg:hidden">
				<Logo />
			</div>

			<div className="flex flex-1 items-center justify-center">
				<div className="w-full max-w-sm">
					<h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
					<p className="mt-2 text-sm text-slate-600">Sign up to start booking your tours.</p>

					<Button variant="outline" className="mt-6 w-full gap-2" type="button">
						<GoogleIcon />
						Sign up with Google
					</Button>

					<div className="my-5 flex items-center gap-3">
						<Separator className="flex-1" />
						<span className="text-xs text-slate-500">or sign up with email</span>
						<Separator className="flex-1" />
					</div>

					<form className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="name">Full name</Label>
							<Input id="name" type="text" placeholder="Your full name" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="you@example.com" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input id="password" type="password" placeholder="At least 8 characters" className="pr-10" />
								<button
									type="button"
									aria-label="Show password"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
								>
									<Eye className="h-4 w-4" />
								</button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirm-password">Confirm password</Label>
							<div className="relative">
								<Input id="confirm-password" type="password" placeholder="Re-enter password" className="pr-10" />
								<button
									type="button"
									aria-label="Show confirm password"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
								>
									<Eye className="h-4 w-4" />
								</button>
							</div>
						</div>

						<Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
							Create account
						</Button>
					</form>

					<p className="mt-4 text-center text-xs text-slate-500">
						By signing up, you agree to our{" "}
						<a href="/terms" className="underline underline-offset-4 hover:text-slate-700">
							Terms &amp; Privacy
						</a>
						.
					</p>

					<p className="mt-4 text-center text-sm text-slate-600">
						Already have an account?{" "}
						<a href="/login" className="font-medium text-indigo-600 underline underline-offset-4">
							Log in
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
