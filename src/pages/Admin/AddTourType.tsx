import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Pencil, Plus, Trash2 } from "lucide-react";

export default function AddTourTypes() {
	return (
		<div className="flex w-full max-w-205 flex-col gap-5">
			{/* Page heading */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Tour types</h1>
				<p className="text-muted-foreground">Used to filter tours and shown as a badge on each card.</p>
			</div>

			<section className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
				{/* Add form */}
				<form className="flex flex-col gap-1 bg-muted p-4.5">
					<Label htmlFor="tt-new" className="mb-1 text-sm font-semibold">
						Add a tour type
					</Label>
					<div className="flex gap-2.5">
						<Input
							id="tt-new"
							placeholder="e.g. Short tour"
							aria-invalid="true"
							aria-describedby="tt-new-error"
							className="h-11 rounded-lg bg-card px-3.5 text-[15px]"
						/>
						<Button type="submit" className="h-11 gap-2 rounded-lg px-4 text-[14.5px] font-semibold">
							<Plus className="size-4.25" strokeWidth={2.4} />
							Add
						</Button>
					</div>
					<p id="tt-new-error" className="mt-1.5 flex items-center gap-1.5 text-[13px] text-destructive">
						<AlertCircle className="size-3.75" />
						“Short tour” already exists
					</p>
				</form>

				{/* List */}
				<ul className="list-none">
					{/* Normal row (in use → delete disabled) */}
					<li className="flex items-center gap-3.5 border-t border-border px-[18px] py-3.5">
						<div className="flex-1">
							<strong>Short tour</strong>
							<div className="text-[13.5px] text-muted-foreground">46 tours · slug: short-tour</div>
						</div>
						<Button
							variant="outline"
							size="icon"
							type="button"
							aria-label="Rename Short tour"
							className="size-10 rounded-lg"
						>
							<Pencil className="size-4.25" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							type="button"
							disabled
							title="In use by 46 tours — move them first"
							aria-label="Delete Short tour — in use by 46 tours"
							className="size-10 rounded-lg disabled:opacity-40"
						>
							<Trash2 className="size-4.25" />
						</Button>
					</li>

					{/* Edit-mode row */}
					<li className="flex items-center gap-3.5 border-t border-border bg-accent px-[18px] py-3.5">
						<form className="flex flex-1 flex-wrap items-center gap-2.5">
							<Label htmlFor="tt-edit" className="sr-only">
								Tour type name
							</Label>
							<Input
								id="tt-edit"
								defaultValue="Long tour (3+ days)"
								className="h-11 flex-[1_1_220px] rounded-lg border-primary bg-card px-3.5 text-[15px] ring-3 ring-accent"
							/>
							<div className="flex gap-2">
								<Button variant="outline" type="button" className="h-11 rounded-lg px-4 font-semibold">
									Cancel
								</Button>
								<Button type="submit" className="h-11 rounded-lg px-4 font-semibold">
									Save
								</Button>
							</div>
						</form>
					</li>

					{/* Normal row (not in use → delete enabled) */}
					<li className="flex items-center gap-3.5 border-t border-border px-[18px] py-3.5">
						<div className="flex-1">
							<strong>Weekend getaway</strong>
							<div className="text-[13.5px] text-muted-foreground">0 tours · slug: weekend-getaway</div>
						</div>
						<Button
							variant="outline"
							size="icon"
							type="button"
							aria-label="Rename Weekend getaway"
							className="size-10 rounded-lg"
						>
							<Pencil className="size-4.25" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							type="button"
							aria-label="Delete Weekend getaway"
							className="size-10 rounded-lg text-destructive hover:text-destructive"
						>
							<Trash2 className="size-[17px]" />
						</Button>
					</li>
				</ul>
			</section>

			<p className="text-[13.5px] text-muted-foreground">
				A type that's still used by tours can't be deleted. Reassign those tours first.
			</p>
		</div>
	);
}
