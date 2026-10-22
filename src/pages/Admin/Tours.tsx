import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetToursQuery, useRemoveTourMutation } from "@/redux/features/Tour/tour.api";
import type { TApiError } from "@/types";
import {
	AlertCircle,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	ImageIcon,
	MapPin,
	MapPinned,
	Pencil,
	Plus,
	RefreshCw,
	Trash2,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const LIMIT = 10;
const COLS = 8;

const formatDate = (date?: string) =>
	date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

const formatDateRange = (start?: string, end?: string) => {
	if (!start && !end) return "—";
	if (!end || start?.slice(0, 10) === end.slice(0, 10)) return formatDate(start ?? end);
	if (!start) return formatDate(end);
	return `${formatDate(start)} – ${formatDate(end)}`;
};

const formatPrice = (amount?: number) => (amount === undefined ? "—" : `৳${amount.toLocaleString("en-IN")}`);

export default function Tours() {
	const [page, setPage] = useState(1);

	const { data, isLoading, isError, isFetching, refetch } = useGetToursQuery({ page, limit: LIMIT });
	const [removeTour] = useRemoveTourMutation();

	const tours = data?.data ?? [];
	const meta = data?.meta;
	const total = meta?.total ?? 0;
	const totalPage = meta?.totalPage ?? 1;

	const handleRemoveTour = async (id: string) => {
		const toastId = toast.loading("Deleting tour…");
		try {
			await removeTour(id).unwrap();
			toast.success("Tour deleted", { id: toastId });

			// if the last item on this page was deleted, go back one page
			if (tours.length === 1 && page > 1) setPage((p) => p - 1);
		} catch (err) {
			const error = err as TApiError;
			toast.error(error.data?.message || "Failed to delete tour", { id: toastId });
		}
	};

	const from = total === 0 ? 0 : (page - 1) * LIMIT + 1;
	const to = Math.min(page * LIMIT, total);

	return (
		<div className="flex w-full flex-col gap-5">
			{/* Header + Add button */}
			<div className="flex flex-wrap items-end justify-between gap-3.5">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Tours</h1>
					<p className="text-muted-foreground">
						{isLoading ? "Loading…" : `${total} tours`} · each has a public page at /tours/slug
					</p>
				</div>
				<Button asChild className="h-11 gap-2 rounded-lg px-4 text-[14.5px] font-semibold">
					<Link to="/admin/add-tour">
						<Plus className="size-4.5" strokeWidth={2.4} />
						Add tour
					</Link>
				</Button>
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

						<tbody className={isFetching && !isLoading ? "opacity-60 transition-opacity" : ""}>
							{/* ── Loading ── */}
							{isLoading &&
								Array.from({ length: 5 }).map((_, i) => (
									<tr key={i} className="border-t border-border">
										<td className="px-4.5 py-3">
											<Skeleton className="h-4 w-5" />
										</td>
										<td className="px-4.5 py-3">
											<div className="flex items-center gap-3">
												<Skeleton className="h-12 w-18 rounded-lg" />
												<div className="flex flex-col gap-1.5">
													<Skeleton className="h-4 w-44" />
													<Skeleton className="h-3 w-28" />
												</div>
											</div>
										</td>
										<td className="px-4.5 py-3">
											<Skeleton className="h-4 w-20" />
										</td>
										<td className="px-4.5 py-3">
											<Skeleton className="h-5 w-20 rounded-full" />
										</td>
										<td className="px-4.5 py-3">
											<Skeleton className="h-4 w-36" />
										</td>
										<td className="px-4.5 py-3">
											<Skeleton className="ml-auto h-4 w-16" />
										</td>
										<td className="px-4.5 py-3">
											<Skeleton className="mx-auto h-4 w-8" />
										</td>
										<td className="px-4.5 py-3">
											<div className="flex justify-end gap-2">
												<Skeleton className="size-9 rounded-lg" />
												<Skeleton className="size-9 rounded-lg" />
											</div>
										</td>
									</tr>
								))}

							{/* ── Error ── */}
							{isError && (
								<tr className="border-t border-border">
									<td colSpan={COLS} className="px-4.5 py-14">
										<div className="flex flex-col items-center gap-3 text-center">
											<span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
												<AlertCircle className="size-5" />
											</span>
											<div>
												<p className="font-semibold text-foreground">Couldn't load tours</p>
												<p className="text-[13.5px] text-muted-foreground">Check your connection and try again.</p>
											</div>
											<Button variant="outline" onClick={() => refetch()} className="h-10 gap-2 rounded-lg">
												<RefreshCw className="size-4" />
												Try again
											</Button>
										</div>
									</td>
								</tr>
							)}

							{/* ── Empty ── */}
							{!isLoading && !isError && tours.length === 0 && (
								<tr className="border-t border-border">
									<td colSpan={COLS} className="px-4.5 py-14">
										<div className="flex flex-col items-center gap-3 text-center">
											<span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
												<MapPinned className="size-5" />
											</span>
											<div>
												<p className="font-semibold text-foreground">No tours yet</p>
												<p className="text-[13.5px] text-muted-foreground">
													Create your first tour to start taking bookings.
												</p>
											</div>
											<Button asChild className="h-10 gap-2 rounded-lg">
												<Link to="/admin/add-tour">
													<Plus className="size-4" />
													Add tour
												</Link>
											</Button>
										</div>
									</td>
								</tr>
							)}

							{/* ── Data ── */}
							{!isLoading &&
								!isError &&
								tours.map((tour, index) => (
									<tr key={tour._id} className="border-t border-border transition-colors hover:bg-muted/60">
										<td className="px-4.5 py-3 text-muted-foreground">{(page - 1) * LIMIT + index + 1}</td>

										{/* Cover + title + location */}
										<td className="px-4.5 py-3">
											<div className="flex items-center gap-3">
												<div className="flex h-12 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent text-accent-foreground">
													{tour.images?.[0] ? (
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
													{tour.location && (
														<p className="flex items-center gap-1 text-[13px] text-muted-foreground">
															<MapPin className="size-3.5 shrink-0" />
															<span className="max-w-56 truncate">{tour.location}</span>
														</p>
													)}
												</div>
											</div>
										</td>

										<td className="px-4.5 py-3 text-foreground">{tour.division?.name ?? "—"}</td>

										<td className="px-4.5 py-3">
											{tour.tourType ? (
												<span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-[12.5px] font-semibold whitespace-nowrap text-accent-foreground">
													{tour.tourType.name}
												</span>
											) : (
												<span className="text-muted-foreground">—</span>
											)}
										</td>

										<td className="px-4.5 py-3">
											<div className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
												<CalendarDays className="size-3.5 shrink-0" />
												{formatDateRange(tour.startDate, tour.endDate)}
											</div>
										</td>

										<td className="px-4.5 py-3 text-right font-semibold whitespace-nowrap text-foreground">
											{formatPrice(tour.costFrom)}
										</td>

										<td className="px-4.5 py-3">
											<div className="flex items-center justify-center gap-1.5 text-muted-foreground">
												<Users className="size-3.5" />
												{tour.maxGuest ?? "—"}
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
													description="This removes the tour, its images and its public page. This can't be undone."
													onConfirm={() => handleRemoveTour(tour._id)}
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

				{/* Footer + pagination */}
				{!isLoading && !isError && total > 0 && (
					<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted px-4.5 py-3 text-[13.5px] text-muted-foreground">
						<span>
							Showing {from}–{to} of {total}
						</span>

						{totalPage > 1 && (
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setPage((p) => p - 1)}
									disabled={page === 1 || isFetching}
									aria-label="Previous page"
									className="size-9 rounded-lg"
								>
									<ChevronLeft className="size-4" />
								</Button>
								<span className="min-w-20 text-center font-medium text-foreground">
									Page {page} of {totalPage}
								</span>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setPage((p) => p + 1)}
									disabled={page >= totalPage || isFetching}
									aria-label="Next page"
									className="size-9 rounded-lg"
								>
									<ChevronRight className="size-4" />
								</Button>
							</div>
						)}
					</div>
				)}
			</section>
		</div>
	);
}
