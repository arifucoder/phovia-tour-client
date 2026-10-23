import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleTourQuery } from "@/redux/features/Tour/tour.api";
import type { TApiError } from "@/types";
import {
	CalendarDays,
	Check,
	Clock,
	ImageIcon,
	MapPin,
	MapPinOff,
	Minus,
	Plus,
	RefreshCw,
	Route,
	Share2,
	Sparkles,
	Tag,
	UserRound,
	Users,
	X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

/* ───────── helpers ───────── */

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const formatPrice = (amount: number) => `৳${amount.toLocaleString("en-IN")}`;

const getDays = (start: string, end: string) =>
	Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;

const DEFAULT_MAX_GUESTS = 10; // used when tour has no maxGuest

function Fact({ icon, iconCls, label, value }: { icon: ReactNode; iconCls: string; label: string; value: string }) {
	return (
		<div className="flex items-center gap-3.5">
			<span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${iconCls}`}>{icon}</span>
			<div>
				<dt className="text-[12.5px] text-muted-foreground">{label}</dt>
				<dd className="font-semibold text-foreground">{value}</dd>
			</div>
		</div>
	);
}

function ListCard({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
	return (
		<div className="flex flex-col gap-3.5 rounded-xl bg-card p-5.5 shadow-card">
			<h3 className="text-[17px] font-semibold">{title}</h3>
			<ul className="flex flex-col gap-2.5">
				{items.map((item) => (
					<li key={item} className="flex items-start gap-2.5 text-sm">
						<span className="mt-0.5 shrink-0">{icon}</span>
						{item}
					</li>
				))}
			</ul>
		</div>
	);
}

function TourDetailsSkeleton() {
	return (
		<div className="mx-auto flex max-w-[1200px] flex-col gap-5.5 px-4 pt-4 pb-24 sm:px-10">
			<Skeleton className="h-4 w-64" />
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-40 rounded-full" />
				<Skeleton className="h-10 w-full max-w-xl" />
				<Skeleton className="h-4 w-72" />
			</div>
			<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-[220px_220px]">
				<Skeleton className="h-64 rounded-2xl sm:row-span-2 sm:h-auto" />
				{[1, 2, 3, 4].map((i) => (
					<Skeleton key={i} className="hidden rounded-2xl sm:block" />
				))}
			</div>
			<div className="flex flex-col gap-12 pt-6 lg:flex-row">
				<div className="flex flex-1 flex-col gap-6">
					<Skeleton className="h-44 rounded-xl" />
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-24 rounded-xl" />
				</div>
				<Skeleton className="h-96 rounded-xl lg:w-[370px]" />
			</div>
		</div>
	);
}

/* ───────── page ───────── */

export default function TourDetails() {
	const { slug } = useParams();
	const {
		data: tour,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetSingleTourQuery(slug as string, {
		skip: !slug,
	});

	const [guests, setGuests] = useState(1);

	/* ── Loading ── */
	if (isLoading) return <TourDetailsSkeleton />;

	/* ── Not found / error ── */
	if (isError || !tour) {
		const notFound = (error as TApiError | undefined)?.status === 404 || (!isError && !tour);
		return (
			<div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-4 py-24 text-center sm:px-10">
				<span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
					<MapPinOff className="size-6" />
				</span>
				<div>
					<h1 className="text-2xl font-bold">{notFound ? "Tour not found" : "Couldn't load this tour"}</h1>
					<p className="text-muted-foreground">
						{notFound
							? "This tour may have been removed or the link is wrong."
							: "Check your connection and try again."}
					</p>
				</div>
				<div className="flex gap-2.5">
					{!notFound && (
						<Button variant="outline" onClick={() => refetch()} className="h-11 gap-2 rounded-lg">
							<RefreshCw className="size-4" />
							Try again
						</Button>
					)}
					<Button asChild className="h-11 rounded-lg">
						<Link to="/tours">Browse all tours</Link>
					</Button>
				</div>
			</div>
		);
	}

	/* ── Derived values ── */
	const images = tour.images ?? [];
	const hasDates = Boolean(tour.startDate && tour.endDate);
	const days = hasDates ? getDays(tour.startDate!, tour.endDate!) : 0;
	const maxGuests = tour.maxGuest ?? DEFAULT_MAX_GUESTS;
	const price = tour.costFrom ?? 0;
	const total = price * guests;

	const facts: { icon: ReactNode; iconCls: string; label: string; value: string }[] = [];
	if (tour.departureLocation || tour.arrivalLocation)
		facts.push({
			icon: <Route className="size-5.5" />,
			iconCls: "bg-accent text-primary",
			label: "Departure → Arrival",
			value: `${tour.departureLocation ?? "—"} → ${tour.arrivalLocation ?? "—"}`,
		});
	if (hasDates)
		facts.push(
			{
				icon: <CalendarDays className="size-5.5" />,
				iconCls: "bg-pink-soft text-pink",
				label: "Start → End date",
				value: `${formatDate(tour.startDate!)} → ${formatDate(tour.endDate!)}`,
			},
			{
				icon: <Clock className="size-5.5" />,
				iconCls: "bg-yellow-soft text-warning",
				label: "Duration",
				value: days === 1 ? "1 day" : `${days} days · ${days - 1} ${days - 1 === 1 ? "night" : "nights"}`,
			},
		);
	if (tour.maxGuest)
		facts.push({
			icon: <Users className="size-5.5" />,
			iconCls: "bg-mint-soft text-success",
			label: "Max guests",
			value: `${tour.maxGuest} per departure`,
		});
	if (tour.minAge !== undefined)
		facts.push({
			icon: <UserRound className="size-5.5" />,
			iconCls: "bg-accent text-primary",
			label: "Minimum age",
			value: `${tour.minAge} years`,
		});
	if (tour.costFrom !== undefined)
		facts.push({
			icon: <Tag className="size-5.5" />,
			iconCls: "bg-pink-soft text-pink",
			label: "Price",
			value: `${formatPrice(tour.costFrom)} per person`,
		});

	const handleShare = async () => {
		const url = window.location.href;
		try {
			if (navigator.share) {
				await navigator.share({ title: tour.title, url });
			} else {
				await navigator.clipboard.writeText(url);
				toast.success("Link copied to clipboard");
			}
		} catch {
			// user closed the share sheet — nothing to do
		}
	};

	return (
		<div className="bg-background">
			{/* ───── Header + gallery ───── */}
			<div className="mx-auto flex max-w-[1200px] flex-col gap-5.5 px-4 pt-4 sm:px-10">
				<nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13.5px] text-muted-foreground">
					<Link to="/" className="hover:text-foreground">
						Home
					</Link>
					<span aria-hidden="true">/</span>
					<Link to="/tours" className="hover:text-foreground">
						Tours
					</Link>
					{tour.division && (
						<>
							<span aria-hidden="true">/</span>
							<span>{tour.division.name}</span>
						</>
					)}
					<span aria-hidden="true">/</span>
					<span className="font-medium text-primary">{tour.title}</span>
				</nav>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex flex-col gap-2.5">
						{(tour.tourType || tour.division) && (
							<div className="flex flex-wrap gap-2">
								{tour.tourType && (
									<span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
										{tour.tourType.name}
									</span>
								)}
								{tour.division && (
									<span className="rounded-full bg-pink-soft px-3 py-1 text-xs font-semibold text-pink">
										{tour.division.name}
									</span>
								)}
							</div>
						)}
						<h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-[42px]">{tour.title}</h1>
						{tour.location && (
							<p className="flex items-center gap-1.5 text-muted-foreground">
								<MapPin className="size-4 shrink-0 text-primary" />
								{tour.location}
							</p>
						)}
					</div>
					<Button
						variant="outline"
						type="button"
						onClick={handleShare}
						className="h-11 gap-2 self-start rounded-lg border-[1.5px] border-primary px-5 text-primary sm:self-auto"
					>
						<Share2 className="size-4" />
						Share
					</Button>
				</div>

				{/* Gallery */}
				{images.length <= 1 ? (
					<div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-accent text-muted-foreground sm:h-[454px]">
						{images[0] ? (
							<img src={images[0]} alt={tour.title} className="size-full object-cover" />
						) : (
							<ImageIcon className="size-9" />
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-[220px_220px]">
						{images.slice(0, 5).map((src, i) => (
							<div
								key={src}
								className={[
									"overflow-hidden rounded-2xl bg-accent",
									i === 0 ? "h-64 sm:row-span-2 sm:h-auto" : "hidden sm:block",
									// 2 images → second one spans the rest
									images.length === 2 && i === 1 ? "sm:col-span-2 sm:row-span-2" : "",
								].join(" ")}
							>
								<img
									src={src}
									alt={`${tour.title} photo ${i + 1}`}
									loading={i === 0 ? "eager" : "lazy"}
									className="size-full object-cover"
								/>
							</div>
						))}
					</div>
				)}
			</div>

			{/* ───── Content + booking card ───── */}
			<div className="mx-auto flex max-w-[1200px] flex-col items-start gap-12 px-4 pt-11 pb-24 sm:px-10 lg:flex-row">
				<main className="flex w-full min-w-0 flex-1 flex-col gap-11">
					{/* Facts */}
					{facts.length > 0 && (
						<dl className="grid grid-cols-1 gap-x-7 gap-y-6 rounded-xl bg-card p-6.5 shadow-card sm:grid-cols-2 xl:grid-cols-3">
							{facts.map((fact) => (
								<Fact key={fact.label} {...fact} />
							))}
						</dl>
					)}

					{/* About */}
					{tour.description && (
						<section className="flex flex-col gap-3.5">
							<h2 className="text-2xl font-bold sm:text-[26px]">About this tour</h2>
							<p className="max-w-[70ch] text-[15.5px] leading-relaxed whitespace-pre-line text-muted-foreground">
								{tour.description}
							</p>
						</section>
					)}

					{/* Tour plan */}
					{tour.tourPlan && tour.tourPlan.length > 0 && (
						<section className="flex flex-col gap-5.5">
							<h2 className="text-2xl font-bold sm:text-[26px]">Tour plan</h2>
							<ol className="flex flex-col">
								{tour.tourPlan.map((step, i) => (
									<li key={`${i}-${step}`} className="flex gap-4.5">
										<div className="flex flex-col items-center">
											<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-[0_8px_18px_rgba(91,76,240,.25)]">
												{i + 1}
											</span>
											{i < tour.tourPlan!.length - 1 && <span className="my-1.5 min-h-6 w-0.5 flex-1 bg-border" />}
										</div>
										<div className="mb-4.5 flex flex-1 flex-col gap-1.5 rounded-xl bg-card px-5 py-4.5 shadow-card">
											<span className="text-[12.5px] font-semibold text-primary">Day {i + 1}</span>
											<p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
										</div>
									</li>
								))}
							</ol>
						</section>
					)}

					{/* Included / Excluded / Amenities */}
					{Boolean(tour.included?.length || tour.excluded?.length || tour.amenities?.length) && (
						<section className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-3">
							{tour.included && tour.included.length > 0 && (
								<ListCard
									title="Included"
									items={tour.included}
									icon={<Check className="size-4.5 text-success" strokeWidth={2.6} />}
								/>
							)}
							{tour.excluded && tour.excluded.length > 0 && (
								<ListCard
									title="Not included"
									items={tour.excluded}
									icon={<X className="size-4.5 text-destructive" strokeWidth={2.6} />}
								/>
							)}
							{tour.amenities && tour.amenities.length > 0 && (
								<ListCard
									title="Amenities"
									items={tour.amenities}
									icon={<Sparkles className="size-4.5 text-primary" />}
								/>
							)}
						</section>
					)}
				</main>

				{/* Booking card */}
				<aside
					aria-label="Book this tour"
					className="flex w-full flex-col gap-4.5 rounded-xl bg-card p-6.5 shadow-card lg:sticky lg:top-6 lg:w-[370px] lg:shrink-0"
				>
					<div>
						<span className="text-[13px] text-muted-foreground">from</span>
						<div className="flex items-baseline gap-1.5">
							<strong className="text-[32px] font-bold text-primary">
								{tour.costFrom !== undefined ? formatPrice(tour.costFrom) : "Price on request"}
							</strong>
							{tour.costFrom !== undefined && <span className="text-sm text-muted-foreground">/ person</span>}
						</div>
					</div>

					{hasDates && (
						<div className="grid grid-cols-2 gap-2.5">
							<div className="rounded-lg bg-muted px-3.5 py-3">
								<span className="text-xs text-muted-foreground">Start</span>
								<div className="text-sm font-semibold">{formatDate(tour.startDate!)}</div>
							</div>
							<div className="rounded-lg bg-muted px-3.5 py-3">
								<span className="text-xs text-muted-foreground">End</span>
								<div className="text-sm font-semibold">{formatDate(tour.endDate!)}</div>
							</div>
						</div>
					)}

					<div className="flex items-center justify-between gap-3">
						<div>
							<div id="guests-label" className="font-semibold">
								Guests
							</div>
							<div className="text-[12.5px] text-muted-foreground">
								Max {maxGuests}
								{tour.minAge !== undefined && ` · age ${tour.minAge}+`}
							</div>
						</div>
						<div role="group" aria-labelledby="guests-label" className="flex items-center gap-1.5">
							<Button
								variant="outline"
								size="icon"
								type="button"
								onClick={() => setGuests((g) => Math.max(1, g - 1))}
								disabled={guests <= 1}
								aria-label="Remove a guest"
								className="size-11 rounded-lg border-[1.5px]"
							>
								<Minus className="size-4.5" />
							</Button>
							<output aria-live="polite" className="min-w-8.5 text-center text-lg font-bold">
								{guests}
							</output>
							<Button
								variant="outline"
								size="icon"
								type="button"
								onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
								disabled={guests >= maxGuests}
								aria-label="Add a guest"
								className="size-11 rounded-lg border-[1.5px] border-primary text-primary"
							>
								<Plus className="size-4.5" />
							</Button>
						</div>
					</div>

					{tour.costFrom !== undefined && (
						<div className="flex flex-col gap-2 border-t border-dashed border-border pt-4">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">
									{formatPrice(price)} × {guests} {guests === 1 ? "guest" : "guests"}
								</span>
								<span>{formatPrice(total)}</span>
							</div>
							<div className="flex items-baseline justify-between pt-1">
								<strong>Total</strong>
								<strong className="text-2xl font-bold">{formatPrice(total)}</strong>
							</div>
						</div>
					)}

					{/* TODO: connect to booking (pass tour._id + guests) */}
					<Button type="button" className="h-13 rounded-lg text-[15.5px] font-semibold">
						Book now
					</Button>
					<p className="text-center text-[12.5px] text-muted-foreground">
						You review everything before paying · secure checkout in taka
					</p>
				</aside>
			</div>
		</div>
	);
}
