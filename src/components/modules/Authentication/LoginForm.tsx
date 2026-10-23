import GoogleIcon from "@/assets/icons/GoogleIcon";
import Logo from "@/assets/icons/Logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import config from "@/config";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import type { TApiError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
	email: z
		.email({ error: "Invalid email address format." })
		.min(5, { error: "Email must be at least 5 characters long." })
		.max(100, { error: "Email cannot exceed 100 characters." }),
	password: z.string().min(1, { error: "Password is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);

	const [login] = useLoginMutation();
	const navigate = useNavigate();
	const location = useLocation();
	const from = (location.state as { from?: string } | null)?.from ?? "/";

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const userInfo = {
			email: data.email,
			password: data.password,
		};

		try {
			const res = await login(userInfo).unwrap();
			if (res.success) {
				toast.message("Logged in successfully");
				navigate(from, { replace: true });
			}
		} catch (err) {
			const error = err as TApiError;
			console.error(error);

			// backend-এ unverified-এর জন্য যে status/message আসে, সেটা দিয়ে চেক করুন
			if (error.status === 401 && error.data?.message?.toLowerCase().includes("verif")) {
				toast.error("Your account is not verified");
				navigate("/verify", { state: data.email });
				return;
			}

			const message =
				error.data?.errorSources?.[0]?.message || error.data?.message || "Login failed. Please try again.";
			toast.error(message);
		}
	};

	return (
		<div className="flex flex-col px-4 py-8 sm:px-6">
			{/* Mobile-only logo (image panel hidden on small screens) */}
			<div className="lg:hidden">
				<Logo />
			</div>

			<div className="flex flex-1 items-center justify-center">
				<div className="w-full max-w-sm">
					<h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
					<p className="mt-2 text-sm text-foreground">Log in to manage your bookings.</p>

					<Button
						onClick={() => window.open(`${config.baseUrl}/auth/google`)}
						variant="outline"
						className="mt-6 w-full gap-2"
						type="button"
					>
						<GoogleIcon />
						Continue with Google
					</Button>

					<div className="my-5 flex items-center gap-3">
						<Separator className="flex-1" />
						<span className="text-xs text-foreground">or log in with email</span>
						<Separator className="flex-1" />
					</div>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
											placeholder="Password"
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
						<Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
							Log in
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-foreground">
						New to Phovia Tour?{" "}
						<a href="/signup" className="font-medium text-indigo-600 underline underline-offset-4">
							Create an account
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
