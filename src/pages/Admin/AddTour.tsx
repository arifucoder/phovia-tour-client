import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import AddTourModal from "@/components/modules/Admin/Tour/AddTourModal";
import { Button } from "@/components/ui/button";
import { CalendarDays, ImageIcon, MapPin, Pencil, Trash2, Users } from "lucide-react";

// Static demo data — later replace with API data
const tours = [
	{
		_id: "1",
		title: "Sajek Valley 3-Day Escape",
		slug: "sajek-valley-3-day-escape",
		images: [] as string[],
		location: "Sajek, Rangamati",
		division: { name: "Chattogram" },
		tourType: { name: "Long tour" },
		startDate: "2026-11-12",
		endDate: "2026-11-14",
		costFrom: 7500,
		maxGuest: 20,
	},
	{
		_id: "2",
		title: "Sreemangal Tea Garden Day Trip",
		slug: "sreemangal-tea-garden-day-trip",
		images: [] as string[],
		location: "Sreemangal, Moulvibazar",
		division: { name: "Sylhet" },
		tourType: { name: "Short tour" },
		startDate: "2026-11-20",
		endDate: "2026-11-20",
		costFrom: 3200,
		maxGuest: 30,
	},
	{
		_id: "3",
		title: "Sundarbans Mangrove Cruise",
		slug: "sundarbans-mangrove-cruise",
		images: [] as string[],
		location: "Mongla, Bagerhat",
		division: { name: "Khulna" },
		tourType: { name: "Long tour" },
		startDate: "2026-12-05",
		endDate: "2026-12-07",
		costFrom: 12500,
		maxGuest: 16,
	},
	{
		_id: "4",
		title: "Old Dhaka Food Walk",
		slug: "old-dhaka-food-walk",
		images: [] as string[],
		location: "Puran Dhaka",
		division: { name: "Dhaka" },
		tourType: { name: "Short tour" },
		startDate: "2026-11-08",
		endDate: "2026-11-08",
		costFrom: 1500,
		maxGuest: 12,
	},
	{
		_id: "5",
		title: "Cox's Bazar Weekend Getaway",
		slug: "coxs-bazar-weekend-getaway",
		images: [] as string[],
		location: "Inani Beach, Cox's Bazar",
		division: { name: "Chattogram" },
		tourType: { name: "Weekend getaway" },
		startDate: "2026-11-27",
		endDate: "2026-11-29",
		costFrom: 9800,
		maxGuest: 25,
	},
];

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const formatPrice = (amount: number) => `৳${amount.toLocaleString("en-IN")}`;

export default function AddTour() {
	return (
		<div className="flex w-full flex-col gap-5">
			{/* Header + Add button */}
			<div className="flex flex-wrap items-end justify-between gap-3.5">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Tours</h1>
					<p className="text-muted-foreground">{tours.length} tours · each has a public page at /tours/slug</p>
				</div>
				<AddTourModal />
			</div>

			{/* Table */}
			<section className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[960px] border-collapse text-left text-sm">
						<thead className="bg-muted">
							<tr className="text-[13px] font-semibold text-muted-foreground">
								<th scope="col" className="w-14 px-4.5 py-3">
									#
								</th>
								<th scope="col" className="px-4.5 py-3">
									Tour
								</th>
								<th scope="col" className="px-4.5 py-3">
									Division
								</th>
								<th scope="col" className="px-4.5 py-3">
									Type
								</th>
								<th scope="col" className="px-4.5 py-3">
									Dates
								</th>
								<th scope="col" className="px-4.5 py-3 text-right">
									Price from
								</th>
								<th scope="col" className="px-4.5 py-3 text-center">
									Guests
								</th>
								<th scope="col" className="px-4.5 py-3 text-right">
									Actions
								</th>
							</tr>
						</thead>

						<tbody>
							{tours.map((tour, index) => (
								<tr key={tour._id} className="border-t border-border transition-colors hover:bg-muted/60">
									<td className="px-4.5 py-3 text-muted-foreground">{index + 1}</td>

									{/* Cover + title + location */}
									<td className="px-4.5 py-3">
										<div className="flex items-center gap-3">
											<div className="flex h-12 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent text-accent-foreground">
												{tour.images[0] ? (
													<img
														src={tour.images[0]}
														alt={tour.title}
														loading="lazy"
														className="size-full object-cover"
													/>
												) : (
													<ImageIcon className="size-4.5" />
												)}
											</div>
											<div className="min-w-0">
												<p className="max-w-64 truncate font-semibold text-foreground" title={tour.title}>
													{tour.title}
												</p>
												<p className="flex items-center gap-1 text-[13px] text-muted-foreground">
													<MapPin className="size-3.5 shrink-0" />
													<span className="truncate">{tour.location}</span>
												</p>
											</div>
										</div>
									</td>

									<td className="px-4.5 py-3 text-foreground">{tour.division.name}</td>

									<td className="px-4.5 py-3">
										<span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[12.5px] font-semibold whitespace-nowrap text-accent-foreground">
											{tour.tourType.name}
										</span>
									</td>

									<td className="px-4.5 py-3">
										<div className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
											<CalendarDays className="size-3.5 shrink-0" />
											{tour.startDate === tour.endDate
												? formatDate(tour.startDate)
												: `${formatDate(tour.startDate)} – ${formatDate(tour.endDate)}`}
										</div>
									</td>

									<td className="px-4.5 py-3 text-right font-semibold whitespace-nowrap text-foreground">
										{formatPrice(tour.costFrom)}
									</td>

									<td className="px-4.5 py-3">
										<div className="flex items-center justify-center gap-1.5 text-muted-foreground">
											<Users className="size-3.5" />
											{tour.maxGuest}
										</div>
									</td>

									<td className="px-4.5 py-3">
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="icon"
												type="button"
												aria-label={`Edit ${tour.title}`}
												className="size-9 rounded-lg"
											>
												<Pencil className="size-4" />
											</Button>

											<DeleteConfirmation
												itemName={tour.title}
												description="This removes the tour and its public page. Existing bookings may be affected."
												onConfirm={() => console.log("delete", tour._id)}
											>
												<Button
													variant="outline"
													size="icon"
													type="button"
													aria-label={`Delete ${tour.title}`}
													className="size-9 rounded-lg text-destructive hover:text-destructive"
												>
													<Trash2 className="size-4" />
												</Button>
											</DeleteConfirmation>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between gap-3 border-t border-border bg-muted px-4.5 py-3 text-[13.5px] text-muted-foreground">
					<span>Showing {tours.length} tours</span>
				</div>
			</section>
		</div>
	);
}
