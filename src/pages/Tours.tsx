import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetToursQuery } from "@/redux/features/Tour/tour.api";
import type { ITour } from "@/types";
import {
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	ImageIcon,
	MapPin,
	RefreshCw,
	Search,
	SearchX,
	SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";

const LIMIT = 12;

const SORT_OPTIONS = [
	{ value: "-createdAt", label: "Newest first" },
	{ value: "costFrom", label: "Price: low to high" },
	{ value: "-costFrom", label: "Price: high to low" },
];

/* ───────── helpers ───────── */

const formatPrice = (amount?: number) => (amount === undefined ? "—" : amount.toLocaleString("en-IN"));

const shortDate = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const getDays = (start: string, end: string) =>
	Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;

const getTourMeta = (tour: ITour) => {
	const parts: string[] = [];
	if (tour.startDate && tour.endDate) {
		const days = getDays(tour.startDate, tour.endDate);
		parts.push(`${days} ${days === 1 ? "day" : "days"}`);
		parts.push(
			tour.startDate.slice(0, 10) === tour.endDate.slice(0, 10)
				? shortDate(tour.startDate)
				: `${shortDate(tour.startDate)} – ${shortDate(tour.endDate)}`,
		);
	}
	if (tour.maxGuest) parts.push(`Max ${tour.maxGuest} guests`);
	return parts.join(" · ");
};

// 1 … 4 5 6 … 10
const getPageNumbers = (current: number, total: number): (number | "…")[] => {
	if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
	const pages: (number | "…")[] = [1];
	if (current > 3) pages.push("…");
	for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
	if (current < total - 2) pages.push("…");
	pages.push(total);
	return pages;
};

type TFilterOption = { _id: string; name: string; count: number };

// unique { _id, name, count } list from tours, sorted by name
const buildOptions = (tours: ITour[], key: "division" | "tourType"): TFilterOption[] => {
	const map = new Map<string, TFilterOption>();
	tours.forEach((tour) => {
		const item = tour[key];
		if (!item?._id) return;
		const existing = map.get(item._id);
		if (existing) existing.count += 1;
		else map.set(item._id, { _id: item._id, name: item.name, count: 1 });
	});
	return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
};

const selectCls =
	"h-11.5 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/* ───────── filters panel (used in sidebar + mobile sheet) ───────── */

type FiltersProps = {
	divisions: TFilterOption[];
	tourTypes: TFilterOption[];
	totalTours: number;
	division: string;
	tourType: string;
	onDivisionChange: (value: string) => void;
	onTourTypeChange: (value: string) => void;
	onReset: () => void;
	idPrefix: string;
};

function Filters({
	divisions,
	tourTypes,
	totalTours,
	division,
	tourType,
	onDivisionChange,
	onTourTypeChange,
	onReset,
	idPrefix,
}: FiltersProps) {
	const hasFilter = Boolean(division || tourType);

	return (
		<div className="flex flex-col gap-6.5">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Filters</h2>
				<Button
					variant="link"
					type="button"
					onClick={onReset}
					disabled={!hasFilter}
					className="h-auto p-0 text-[13.5px]"
				>
					Reset all
				</Button>
			</div>

			{/* Division (single choice) */}
			{divisions.length > 0 && (
				<fieldset className="flex flex-col gap-0.5">
					<legend className="mb-2.5 text-sm font-semibold">Division</legend>
					{[{ _id: "", name: "All divisions", count: totalTours }, ...divisions].map((d) => (
						<label
							key={d._id || "all"}
							htmlFor={`${idPrefix}-div-${d._id || "all"}`}
							className="flex min-h-8.5 cursor-pointer items-center gap-2.5 text-sm"
						>
							<input
								id={`${idPrefix}-div-${d._id || "all"}`}
								type="radio"
								name={`${idPrefix}-division`}
								checked={division === d._id}
								onChange={() => onDivisionChange(d._id)}
								className="size-4.5 cursor-pointer accent-primary"
							/>
							<span className="flex-1">{d.name}</span>
							<span className="text-[12.5px] text-muted-foreground">{d.count}</span>
						</label>
					))}
				</fieldset>
			)}

			{/* Tour type (single choice) */}
			{tourTypes.length > 0 && (
				<fieldset>
					<legend className="mb-2.5 text-sm font-semibold">Tour type</legend>
					<div className="flex flex-wrap gap-2">
						{[{ _id: "", name: "All", count: totalTours }, ...tourTypes].map((t) => {
							const active = tourType === t._id;
							return (
								<button
									key={t._id || "all"}
									type="button"
									aria-pressed={active}
									onClick={() => onTourTypeChange(t._id)}
									className={[
										"inline-flex h-9.5 items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-medium transition-colors",
										active
											? "border-primary bg-accent text-primary"
											: "border-border bg-background text-foreground hover:border-primary/50",
									].join(" ")}
								>
									{t.name}
									<span className={active ? "text-primary/70" : "text-muted-foreground"}>{t.count}</span>
								</button>
							);
						})}
					</div>
				</fieldset>
			)}
		</div>
	);
}

/* ───────── page ───────── */

export default function Tours() {
	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [division, setDivision] = useState("");
	const [tourType, setTourType] = useState("");
	const [sort, setSort] = useState("-createdAt");
	const [page, setPage] = useState(1);

	// only send filled params
	const params = {
		page,
		limit: LIMIT,
		sort,
		...(searchTerm && { searchTerm }),
		...(division && { division }),
		...(tourType && { tourType }),
	};

	const { data, isLoading, isError, isFetching, refetch } = useGetToursQuery(params);

	// all tours, only division + tourType → for sidebar options & counts
	const { data: optionData } = useGetToursQuery({ limit: 1000, fields: "division,tourType" });

	const { divisions, tourTypes, totalTours } = useMemo(() => {
		const all = optionData?.data ?? [];
		return {
			divisions: buildOptions(all, "division"),
			tourTypes: buildOptions(all, "tourType"),
			totalTours: all.length,
		};
	}, [optionData]);

	const tours = data?.data ?? [];
	const total = data?.meta?.total ?? 0;
	const totalPage = data?.meta?.totalPage ?? 1;

	const activeFilterCount = [division, tourType].filter(Boolean).length;

	// any filter change → back to page 1
	const handleSearch = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSearchTerm(searchInput.trim());
		setPage(1);
	};
	const handleDivision = (value: string) => {
		setDivision(value);
		setPage(1);
	};
	const handleTourType = (value: string) => {
		setTourType(value);
		setPage(1);
	};
	const handleSort = (value: string) => {
		setSort(value);
		setPage(1);
	};
	const handleReset = () => {
		setDivision("");
		setTourType("");
		setSearchInput("");
		setSearchTerm("");
		setPage(1);
	};
	const goToPage = (p: number) => {
		setPage(p);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const filterProps = {
		divisions,
		tourTypes,
		totalTours,
		division,
		tourType,
		onDivisionChange: handleDivision,
		onTourTypeChange: handleTourType,
		onReset: handleReset,
	};

	return (
		<div className="bg-background">
			{/* ───── Hero + search ───── */}
			<section className="bg-muted">
				<div className="mx-auto flex max-w-[1200px] flex-col gap-4.5 px-4 py-12 sm:px-10">
					<nav aria-label="Breadcrumb" className="flex gap-2 text-[13.5px] text-muted-foreground">
						<Link to="/" className="hover:text-foreground">
							Home
						</Link>
						<span aria-hidden="true">/</span>
						<span className="font-medium text-primary">Tours</span>
					</nav>

					<h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Find your tour</h1>

					<form
						role="search"
						onSubmit={handleSearch}
						className="flex max-w-[720px] flex-col gap-2.5 rounded-xl bg-card p-2.5 shadow-card sm:flex-row"
					>
						<label htmlFor="tour-search" className="sr-only">
							Search tours
						</label>
						<div className="relative flex-1">
							<Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="tour-search"
								type="search"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								placeholder="Search by tour name or location…"
								className="h-11.5 rounded-lg border-transparent pl-11 text-[15px] shadow-none"
							/>
						</div>
						<Button type="submit" className="h-11.5 rounded-lg px-6 text-[14.5px] font-semibold">
							Search
						</Button>
					</form>
				</div>
			</section>

			{/* ───── Filters + results ───── */}
			<div className="mx-auto flex max-w-[1200px] items-start gap-8 px-4 pt-10 pb-22 sm:px-10">
				{/* Filters (desktop) */}
				<aside aria-label="Filters" className="hidden w-70 shrink-0 rounded-xl bg-card p-6 shadow-card lg:block">
					<Filters {...filterProps} idPrefix="desk" />
				</aside>

				{/* Results */}
				<main className="flex min-w-0 flex-1 flex-col gap-6">
					{/* Toolbar */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p>
							{isLoading ? (
								<span className="text-muted-foreground">Loading tours…</span>
							) : (
								<>
									<strong>
										{total} {total === 1 ? "tour" : "tours"}
									</strong>{" "}
									<span className="text-muted-foreground">found{searchTerm && <> for “{searchTerm}”</>}</span>
								</>
							)}
						</p>

						<div className="flex items-center gap-2.5">
							{/* Filters (mobile) */}
							<Sheet>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										type="button"
										className="h-11.5 flex-1 gap-2 rounded-lg border-[1.5px] border-primary text-primary lg:hidden"
									>
										<SlidersHorizontal className="size-4.5" />
										Filters{activeFilterCount > 0 && ` · ${activeFilterCount}`}
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="w-80 overflow-y-auto p-6">
									<SheetHeader className="sr-only">
										<SheetTitle>Filters</SheetTitle>
									</SheetHeader>
									<Filters {...filterProps} idPrefix="mob" />
								</SheetContent>
							</Sheet>

							<label htmlFor="tour-sort" className="hidden text-sm text-muted-foreground sm:block">
								Sort by
							</label>
							<select
								id="tour-sort"
								value={sort}
								onChange={(e) => handleSort(e.target.value)}
								className={`${selectCls} flex-1 sm:w-48 sm:flex-none`}
							>
								{SORT_OPTIONS.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* ── Loading ── */}
					{isLoading && (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="overflow-hidden rounded-xl bg-card shadow-card">
									<Skeleton className="h-50 rounded-none" />
									<div className="flex flex-col gap-2.5 p-4.5">
										<Skeleton className="h-3.5 w-28" />
										<Skeleton className="h-5 w-full" />
										<Skeleton className="h-3.5 w-40" />
										<Skeleton className="mt-2 h-6 w-24" />
									</div>
								</div>
							))}
						</div>
					)}

					{/* ── Error ── */}
					{isError && (
						<div className="flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-16 text-center shadow-card">
							<span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
								<AlertCircle className="size-5" />
							</span>
							<div>
								<p className="font-semibold">Couldn't load tours</p>
								<p className="text-[13.5px] text-muted-foreground">Check your connection and try again.</p>
							</div>
							<Button variant="outline" onClick={() => refetch()} className="h-10 gap-2 rounded-lg">
								<RefreshCw className="size-4" />
								Try again
							</Button>
						</div>
					)}

					{/* ── Empty ── */}
					{!isLoading && !isError && tours.length === 0 && (
						<div className="flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-16 text-center shadow-card">
							<span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
								<SearchX className="size-5" />
							</span>
							<div>
								<p className="font-semibold">No tours found</p>
								<p className="text-[13.5px] text-muted-foreground">Try a different search or clear the filters.</p>
							</div>
							<Button variant="outline" onClick={handleReset} className="h-10 rounded-lg">
								Clear search & filters
							</Button>
						</div>
					)}

					{/* ── Cards ── */}
					{!isLoading && !isError && tours.length > 0 && (
						<div
							className={[
								"grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
								isFetching ? "opacity-60" : "",
							].join(" ")}
						>
							{tours.map((tour) => (
								<Link
									key={tour._id}
									to={`/tours/${tour.slug}`}
									className="group flex flex-col overflow-hidden rounded-xl bg-card text-foreground shadow-card transition-shadow hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
								>
									{/* Image */}
									<div className="relative flex h-50 items-center justify-center overflow-hidden bg-accent text-muted-foreground">
										{tour.images?.[0] ? (
											<img
												src={tour.images[0]}
												alt={tour.title}
												loading="lazy"
												className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										) : (
											<ImageIcon className="size-7" />
										)}
										{tour.tourType && (
											<span className="absolute top-3 left-3 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground">
												{tour.tourType.name}
											</span>
										)}
									</div>

									{/* Body */}
									<div className="flex flex-1 flex-col gap-1.5 px-4.5 pt-4 pb-4.5">
										{(tour.location || tour.division) && (
											<span className="flex items-center gap-1 text-[12.5px] font-medium text-primary">
												<MapPin className="size-3.5 shrink-0" />
												<span className="truncate">
													{[tour.location, tour.division?.name].filter(Boolean).join(", ")}
												</span>
											</span>
										)}
										<h3 className="text-base leading-snug font-semibold group-hover:text-primary">{tour.title}</h3>
										{getTourMeta(tour) && <p className="text-[12.5px] text-muted-foreground">{getTourMeta(tour)}</p>}
										<div className="mt-auto pt-1.5">
											<span className="text-xs text-muted-foreground">from </span>
											<strong className="text-lg font-bold text-primary">৳{formatPrice(tour.costFrom)}</strong>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}

					{/* ── Pagination ── */}
					{!isLoading && !isError && totalPage > 1 && (
						<nav aria-label="Pagination" className="flex flex-wrap justify-center gap-2 pt-4">
							<Button
								variant="outline"
								size="icon"
								onClick={() => goToPage(page - 1)}
								disabled={page === 1 || isFetching}
								aria-label="Previous page"
								className="size-11 rounded-lg border-[1.5px]"
							>
								<ChevronLeft className="size-4.5" />
							</Button>

							{getPageNumbers(page, totalPage).map((p, i) =>
								p === "…" ? (
									<span key={`dots-${i}`} className="flex size-11 items-center justify-center text-muted-foreground">
										…
									</span>
								) : (
									<Button
										key={p}
										variant={p === page ? "default" : "outline"}
										onClick={() => goToPage(p)}
										disabled={isFetching}
										aria-current={p === page ? "page" : undefined}
										className="size-11 rounded-lg border-[1.5px] font-medium"
									>
										{p}
									</Button>
								),
							)}

							<Button
								variant="outline"
								size="icon"
								onClick={() => goToPage(page + 1)}
								disabled={page >= totalPage || isFetching}
								aria-label="Next page"
								className="size-11 rounded-lg border-[1.5px]"
							>
								<ChevronRight className="size-4.5" />
							</Button>
						</nav>
					)}
				</main>
			</div>
		</div>
	);
}
