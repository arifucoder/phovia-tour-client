import AddTourTypeForm from "@/components/modules/Admin/TourType/AddTourTypeForm";
import { Button } from "@/components/ui/button";
import { useGetTourTypesQuery } from "@/redux/features/Tour/tour.api";
import { Pencil, Tag, Trash2 } from "lucide-react";

export default function AddTourTypes() {
	const { data } = useGetTourTypesQuery(undefined);

	return (
		<div className="flex w-full max-w-6xl flex-col gap-5">
			{/* Page heading */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Tour types</h1>
				<p className="text-muted-foreground">Used to filter tours and shown as a badge on each card.</p>
			</div>

			<div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[360px_1fr]">
				{/* ───── Left: Add form ───── */}
				<AddTourTypeForm />
				{/* ───── Right: Tour types list ───── */}
				<section className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
					<div className="flex items-center justify-between gap-3 px-[18px] py-4">
						<div>
							<h2 className="text-base font-semibold">All tour types</h2>
							<p className="text-[13.5px] text-muted-foreground">3 types</p>
						</div>
					</div>

					<ul className="list-none">
						{/* Normal row (in use → delete disabled) */}
						{data?.map((item) => (
							<li key={item._id} className="flex items-center gap-3.5 border-t border-border px-4.5 py-3.5">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
									<Tag className="size-4.5" />
								</span>
								<div className="min-w-0 flex-1">
									<strong className="block truncate">{item?.name}</strong>
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
									title="In use by 46 tours — move them first"
									aria-label="Delete Short tour — in use by 46 tours"
									className="size-10 rounded-lg disabled:opacity-40"
								>
									<Trash2 className="size-4.25" />
								</Button>
							</li>
						))}

						{/* Edit-mode row */}
						{/* <li className="flex items-center gap-3.5 border-t border-border bg-accent px-[18px] py-3.5">
							<form className="flex flex-1 flex-wrap items-center gap-2.5">
								<Label htmlFor="tt-edit" className="sr-only">
									Tour type name
								</Label>
								<Input
									id="tt-edit"
									defaultValue="Long tour (3+ days)"
									className="h-11 flex-[1_1_220px] rounded-lg border-primary bg-card px-3.5 text-[15px]"
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
						</li> */}
					</ul>

					<p className="border-t border-border bg-muted px-4.5 py-3 text-[13.5px] text-muted-foreground">
						A type that's still used by tours can't be deleted. Reassign those tours first.
					</p>
				</section>
			</div>
		</div>
	);
}
