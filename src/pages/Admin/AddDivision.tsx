import AddDivisionModal from "@/components/modules/Admin/Division/AddDivisionModal";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";

// Static demo data — later replace with API data
const divisions = [
	{
		_id: "1",
		name: "Chattogram",
		slug: "chattogram",
		tours: 28,
		description: "Hills, beaches and the longest sea beach in the world.",
	},
	{
		_id: "2",
		name: "Sylhet",
		slug: "sylhet",
		tours: 19,
		description: "Rolling tea gardens, swamp forests and crystal rivers.",
	},
	{
		_id: "3",
		name: "Dhaka",
		slug: "dhaka",
		tours: 12,
		description: "Old Dhaka heritage, food streets and river life.",
	},
	{ _id: "4", name: "Khulna", slug: "khulna", tours: 9, description: "Gateway to the Sundarbans mangrove forest." },
	{
		_id: "5",
		name: "Rajshahi",
		slug: "rajshahi",
		tours: 7,
		description: "Ancient ruins, mango orchards and the Padma river.",
	},
	{ _id: "6", name: "Barishal", slug: "barishal", tours: 6, description: "Floating markets and backwater boat rides." },
	{
		_id: "7",
		name: "Mymensingh",
		slug: "mymensingh",
		tours: 5,
		description: "Garo hills, Brahmaputra banks and quiet villages.",
	},
	{ _id: "8", name: "Rangpur", slug: "rangpur", tours: 0, description: "Historic palaces and northern countryside." },
];

export default function AddDivision() {
	return (
		<div className="flex w-full flex-col gap-5">
			{/* Header + Add button */}
			<div className="flex flex-wrap items-end justify-between gap-3.5">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Divisions</h1>
					<p className="text-muted-foreground">
						{divisions.length} divisions · each has a public page at /divisions/slug
					</p>
				</div>
				{/* <Button type="button" className="h-11 gap-2 rounded-lg px-4 text-[14.5px] font-semibold">
					<Plus className="size-4.5" strokeWidth={2.4} />
					Add division
				</Button> */}
				<AddDivisionModal />
			</div>

			{/* Table */}
			<section className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[760px] border-collapse text-left text-sm">
						<thead className="bg-muted">
							<tr className="text-[13px] font-semibold text-muted-foreground">
								<th scope="col" className="w-14 px-4.5 py-3">
									#
								</th>
								<th scope="col" className="px-4.5 py-3">
									Division
								</th>
								<th scope="col" className="px-4.5 py-3">
									Slug
								</th>
								<th scope="col" className="px-4.5 py-3">
									Description
								</th>
								<th scope="col" className="px-4.5 py-3 text-center">
									Tours
								</th>
								<th scope="col" className="px-4.5 py-3 text-right">
									Actions
								</th>
							</tr>
						</thead>

						<tbody>
							{divisions.map((division, index) => (
								<tr key={division._id} className="border-t border-border transition-colors hover:bg-muted/60">
									<td className="px-4.5 py-3 text-muted-foreground">{index + 1}</td>

									{/* Thumbnail + name */}
									<td className="px-4.5 py-3">
										<div className="flex items-center gap-3">
											<div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent text-accent-foreground">
												{/* later: <img src={division.thumbnail} alt={division.name} className="size-full object-cover" /> */}
												<ImageIcon className="size-4.5" />
											</div>
											<span className="font-semibold text-foreground">{division.name}</span>
										</div>
									</td>

									<td className="px-4.5 py-3 text-muted-foreground">/{division.slug}</td>

									<td className="max-w-xs px-4.5 py-3">
										<p className="truncate text-muted-foreground" title={division.description}>
											{division.description}
										</p>
									</td>

									<td className="px-4.5 py-3 text-center">
										<span className="inline-flex min-w-9 items-center justify-center rounded-full bg-accent px-2.5 py-0.5 text-[13px] font-semibold text-accent-foreground">
											{division.tours}
										</span>
									</td>

									<td className="px-4.5 py-3">
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="icon"
												type="button"
												aria-label={`Edit ${division.name}`}
												className="size-9 rounded-lg"
											>
												<Pencil className="size-4" />
											</Button>
											<Button
												variant="outline"
												size="icon"
												type="button"
												aria-label={`Delete ${division.name}`}
												className="size-9 rounded-lg text-destructive hover:text-destructive"
											>
												<Trash2 className="size-4" />
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between gap-3 border-t border-border bg-muted px-4.5 py-3 text-[13.5px] text-muted-foreground">
					<span>
						Showing 1–{divisions.length} of {divisions.length}
					</span>
				</div>
			</section>
		</div>
	);
}
