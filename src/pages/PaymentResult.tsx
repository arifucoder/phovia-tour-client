import { Button } from "@/components/ui/button";
import { Ban, CircleCheck, CircleX } from "lucide-react";
import { Link, useSearchParams } from "react-router";

type TStatus = "success" | "fail" | "cancel";

const CONTENT: Record<TStatus, { title: string; text: string; icon: typeof CircleCheck; iconCls: string }> = {
	success: {
		title: "Payment successful",
		text: "Your booking is confirmed. A confirmation and invoice have been sent to your email.",
		icon: CircleCheck,
		iconCls: "bg-mint-soft text-success",
	},
	fail: {
		title: "Payment failed",
		text: "Your payment could not be completed. No money was taken. Please try booking again.",
		icon: CircleX,
		iconCls: "bg-destructive/10 text-destructive",
	},
	cancel: {
		title: "Payment cancelled",
		text: "You cancelled the payment. Your booking was not confirmed.",
		icon: Ban,
		iconCls: "bg-yellow-soft text-warning",
	},
};

export default function PaymentResult({ status }: { status: TStatus }) {
	const [searchParams] = useSearchParams();
	const transactionId = searchParams.get("transactionId");
	const amount = searchParams.get("amount");

	const { title, text, icon: Icon, iconCls } = CONTENT[status];

	return (
		<div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-20 text-center">
			<span className={`flex size-16 items-center justify-center rounded-full ${iconCls}`}>
				<Icon className="size-8" />
			</span>

			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				<p className="text-muted-foreground">{text}</p>
			</div>

			{(transactionId || amount) && (
				<dl className="flex w-full flex-col gap-2.5 rounded-xl bg-card p-5 text-left text-sm shadow-card">
					{transactionId && (
						<div className="flex justify-between gap-4">
							<dt className="text-muted-foreground">Transaction ID</dt>
							<dd className="font-medium break-all">{transactionId}</dd>
						</div>
					)}
					{amount && (
						<div className="flex justify-between gap-4">
							<dt className="text-muted-foreground">Amount</dt>
							<dd className="font-semibold">৳{Number(amount).toLocaleString("en-IN")}</dd>
						</div>
					)}
				</dl>
			)}

			<div className="flex flex-wrap justify-center gap-2.5">
				{status === "success" ? (
					<Button asChild className="h-11 rounded-lg px-5">
						<Link to="/user/bookings">View my bookings</Link>
					</Button>
				) : (
					<Button asChild className="h-11 rounded-lg px-5">
						<Link to="/tours">Back to tours</Link>
					</Button>
				)}
				<Button asChild variant="outline" className="h-11 rounded-lg px-5">
					<Link to="/">Go home</Link>
				</Button>
			</div>
		</div>
	);
}
