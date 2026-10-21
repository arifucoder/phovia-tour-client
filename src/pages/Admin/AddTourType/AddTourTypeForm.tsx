import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus } from "lucide-react";

export default function AddTourTypeForm() {
	return (
		<section className="rounded-xl border border-border bg-card shadow-card lg:sticky lg:top-4">
			<div className="border-b border-border px-4.5 py-4">
				<h2 className="text-base font-semibold">Add a tour type</h2>
				<p className="text-[13.5px] text-muted-foreground">Give it a short, clear name.</p>
			</div>

			<form className="flex flex-col gap-4 p-4.5">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="tt-new" className="text-sm font-semibold">
						Name
					</Label>
					<Input
						id="tt-new"
						placeholder="e.g. Short tour"
						aria-invalid="true"
						aria-describedby="tt-new-error"
						className="h-11 rounded-lg px-3.5 text-[15px]"
					/>
					<p id="tt-new-error" className="flex items-center gap-1.5 text-[13px] text-destructive">
						<AlertCircle className="size-3.75" />
						“Short tour” already exists
					</p>
				</div>

				<Button type="submit" className="h-11 w-full gap-2 rounded-lg text-[14.5px] font-semibold">
					<Plus className="size-4.25" strokeWidth={2.4} />
					Add tour type
				</Button>
			</form>
		</section>
	);
}
