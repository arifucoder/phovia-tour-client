import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api";
import type { TApiError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const RESEND_TIME = 120; // সেকেন্ড

const FormSchema = z.object({
	pin: z.string().length(6, { error: "Your one-time password must be 6 characters." }),
});

type FormValues = z.infer<typeof FormSchema>;

const getErrorMessage = (err: unknown, fallback: string) => {
	const error = err as TApiError;
	return error.data?.errorSources?.[0]?.message || error.data?.message || fallback;
};

export default function Verify() {
	const location = useLocation();
	const navigate = useNavigate();
	const email = location.state as string | undefined;

	const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
	const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
	const [timer, setTimer] = useState(0);

	// StrictMode-এ effect দুবার চলে, তাই OTP যেন দুবার না যায়
	const hasSentRef = useRef(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: { pin: "" },
	});

	const handleSendOtp = async () => {
		if (!email) return;
		const toastId = toast.loading("Sending OTP...");

		try {
			await sendOtp({ email }).unwrap();
			toast.success("OTP sent to your email", { id: toastId });
			setTimer(RESEND_TIME);
		} catch (err) {
			toast.error(getErrorMessage(err, "Failed to send OTP"), { id: toastId });
		}
	};

	const onSubmit = async (data: FormValues) => {
		const toastId = toast.loading("Verifying OTP...");

		try {
			await verifyOtp({ email, otp: data.pin }).unwrap();
			toast.success("Email verified! Please log in.", { id: toastId });
			navigate("/login");
		} catch (err) {
			toast.error(getErrorMessage(err, "Invalid OTP"), { id: toastId });
			form.reset({ pin: "" });
		}
	};

	// email না থাকলে home-এ পাঠাও
	useEffect(() => {
		if (!email) navigate("/");
	}, [email, navigate]);

	// Page খুললেই একবার OTP পাঠাও
	useEffect(() => {
		if (!email || hasSentRef.current) return;
		hasSentRef.current = true;
		handleSendOtp();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]);

	// Countdown: 0 হলে নিজেই থেমে যায়
	useEffect(() => {
		if (timer <= 0) return;
		const id = setTimeout(() => setTimer((t) => t - 1), 1000);
		return () => clearTimeout(id);
	}, [timer]);

	return (
		<div className="grid h-screen place-content-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Verify your email address</CardTitle>
					<CardDescription>
						Please enter the 6-digit code we sent to <br />
						<span className="font-medium text-slate-900">{email}</span>
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form id="otp-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<Controller
							control={form.control}
							name="pin"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="otp-pin">One-Time Password</FieldLabel>
									<InputOTP id="otp-pin" maxLength={6} {...field} aria-invalid={fieldState.invalid}>
										<InputOTPGroup>
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
										</InputOTPGroup>
										<Dot />
										<InputOTPGroup>
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={5} />
										</InputOTPGroup>
									</InputOTP>

									<FieldDescription>
										Didn&apos;t get the code?{" "}
										{timer > 0 ? (
											<span className="text-slate-500">Resend in {timer}s</span>
										) : (
											<Button
												type="button"
												variant="link"
												onClick={handleSendOtp}
												disabled={isSending}
												className="h-auto p-0"
											>
												Resend OTP
											</Button>
										)}
									</FieldDescription>

									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</form>
				</CardContent>

				<CardFooter>
					<Button form="otp-form" type="submit" className="w-full" disabled={isVerifying}>
						{isVerifying ? "Verifying..." : "Verify"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
