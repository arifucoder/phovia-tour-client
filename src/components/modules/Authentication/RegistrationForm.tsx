import GoogleIcon from "@/assets/icons/GoogleIcon";
import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
	.object({
		name: z
			.string({ error: "Name must be string" })
			.min(2, { error: "Name must be at least 2 characters long." })
			.max(50, { error: "Name cannot exceed 50 characters." }),
		email: z
			.email({ error: "Invalid email address format." })
			.min(5, { error: "Email must be at least 5 characters long." })
			.max(100, { error: "Email cannot exceed 100 characters." }),
		password: z
			.string({ error: "Password must be string" })
			.min(8, { error: "Password must be at least 8 characters long." })
			.regex(/[A-Z]/, { error: "Password must contain at least 1 uppercase letter." })
			.regex(/[!@#$%^&*]/, { error: "Password must contain at least 1 special character." })
			.regex(/\d/, { error: "Password must contain at least 1 number." }),
		// Confirm password-এ আলাদা নিয়ম লাগে না, শুধু password-এর সাথে মিলতে হবে
		confirmPassword: z.string().min(1, { error: "Please confirm your password." }),
		// Optional field খালি থাকলে "" আসে, তাই "" কেও valid ধরা হচ্ছে
		phone: z
			.string()
			.regex(/^(?:\+8801\d{9}|01\d{9})$/, {
				error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
			})
			.or(z.literal("")),
		address: z.string().max(200, { error: "Address cannot exceed 200 characters." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords do not match.",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		// প্রতিটি field-এর default value দিতে হবে
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			phone: "",
			address: "",
		},
	});

	function onSubmit(data: FormValues) {
		console.log(data);
	}

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

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Full name</FieldLabel>
									<Input
										{...field}
										id="name"
										type="text"
										placeholder="Your full name"
										autoComplete="name"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										{...field}
										id="email"
										type="email"
										placeholder="you@example.com"
										autoComplete="email"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									{/* absolute button-এর জন্য relative wrapper লাগবে */}
									<div className="relative">
										<Input
											{...field}
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="At least 8 characters"
											autoComplete="new-password"
											className="pr-10"
											aria-invalid={fieldState.invalid}
										/>
										<button
											type="button"
											onClick={() => setShowPassword((prev) => !prev)}
											aria-label={showPassword ? "Hide password" : "Show password"}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
										>
											{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
									<div className="relative">
										<Input
											{...field}
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Re-enter password"
											autoComplete="new-password"
											className="pr-10"
											aria-invalid={fieldState.invalid}
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword((prev) => !prev)}
											aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
										>
											{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="phone"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
									<Input
										{...field}
										id="phone"
										type="tel"
										placeholder="01XXXXXXXXX"
										autoComplete="tel"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="address"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="address">Address (optional)</FieldLabel>
									<Textarea
										{...field}
										id="address"
										placeholder="Your address"
										className="min-h-20 resize-none"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

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
