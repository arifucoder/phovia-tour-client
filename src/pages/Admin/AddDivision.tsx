import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import AddDivisionModal from "@/components/modules/Admin/Division/AddDivisionModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDivisionsQuery, useRemoveDivisionMutation } from "@/redux/features/Division/division.api";
import type { IDivision, TApiError } from "@/types";
import { AlertCircle, ImageIcon, MapPinned, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

const COLS = 5;

export default function AddDivision() {
	const { data, isLoading, isError, isFetching, refetch } = useGetDivisionsQuery(undefined);
	const [removeDivision] = useRemoveDivisionMutation();

	const divisions: IDivision[] = data ?? [];

	const handleRemoveDivision = async (id: string) => {
		const toastId = toast.loading("Deleting division…");
		try {
			await removeDivision(id).unwrap();
			toast.success("Division deleted", { id: toastId });
		} catch (err) {
			const error = err as TApiError;
			toast.error(error.data?.message || "Failed to delete division", { id: toastId });
		}
	};

	return (
		<div className="flex w-full flex-col gap-5">
			{/* Header + Add button */}
			<div className="flex flex-wrap items-end justify-between gap-3.5">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Divisions</h1>
					<p className="text-muted-foreground">
						{isLoading ? "Loading…" : `${divisions.length} divisions`} · each has a public page at /divisions/slug
					</p>
				</div>
				<AddDivisionModal />
			</div>

			{/* Table */}
			<section className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[680px] border-collapse text-left text-sm">
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
												<Skeleton className="h-11 w-16 rounded-lg" />
												<Skeleton className="h-4 w-28" />
											</div>
										</td>
										<td className="px-4.5 py-3">
											<Skeleton className="h-4 w-24" />
										</td>
										<td className="px-4.5 py-3">
											<Skeleton className="h-4 w-56" />
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
												<p className="font-semibold text-foreground">Couldn't load divisions</p>
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
							{!isLoading && !isError && divisions.length === 0 && (
								<tr className="border-t border-border">
									<td colSpan={COLS} className="px-4.5 py-14">
										<div className="flex flex-col items-center gap-3 text-center">
											<span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
												<MapPinned className="size-5" />
											</span>
											<div>
												<p className="font-semibold text-foreground">No divisions yet</p>
												<p className="text-[13.5px] text-muted-foreground">
													Add your first division to start grouping tours.
												</p>
											</div>
										</div>
									</td>
								</tr>
							)}

							{/* ── Data ── */}
							{!isLoading &&
								!isError &&
								divisions.map((division, index) => (
									<tr key={division._id} className="border-t border-border transition-colors hover:bg-muted/60">
										<td className="px-4.5 py-3 text-muted-foreground">{index + 1}</td>

										{/* Thumbnail + name */}
										<td className="px-4.5 py-3">
											<div className="flex items-center gap-3">
												<div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent text-accent-foreground">
													{division.thumbnail ? (
														<img
															src={division.thumbnail}
															alt={division.name}
															loading="lazy"
															className="size-full object-cover"
														/>
													) : (
														<ImageIcon className="size-4.5" />
													)}
												</div>
												<span className="font-semibold text-foreground">{division.name}</span>
											</div>
										</td>

										<td className="px-4.5 py-3 text-muted-foreground">/{division.slug}</td>

										<td className="max-w-xs px-4.5 py-3">
											<p className="truncate text-muted-foreground" title={division.description}>
												{division.description || "—"}
											</p>
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

												<DeleteConfirmation
													itemName={division.name}
													description="This removes the division and its public page. This can't be undone."
													onConfirm={() => handleRemoveDivision(division._id)}
												>
													<Button
														variant="outline"
														size="icon"
														type="button"
														aria-label={`Delete ${division.name}`}
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
				{!isLoading && !isError && divisions.length > 0 && (
					<div className="flex items-center justify-between gap-3 border-t border-border bg-muted px-4.5 py-3 text-[13.5px] text-muted-foreground">
						<span>Showing {divisions.length} divisions</span>
					</div>
				)}
			</section>
		</div>
	);
}
