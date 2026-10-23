import { Button } from "@/components/ui/button";
import {
	CalendarDays,
	Check,
	Clock,
	Heart,
	ImageIcon,
	MapPin,
	Minus,
	Plus,
	Route,
	Share2,
	Sparkles,
	Tag,
	UserRound,
	Users,
	X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router";

// Static demo data (same shape as backend ITour) — later replace with API data
const tour = {
	_id: "1",
	title: "Sajek Valley Cloud Escape",
	slug: "sajek-valley-cloud-escape",
	description:
		"Sajek sits on a ridge 1,800 feet above the Kasalong valley, where mornings often begin above a sea of cloud. We travel overnight from Dhaka to Khagrachari, switch to open-top jeeps for the hill road, and spend two nights in a cottage on the ridge. Expect easy walks, sunrise at Konglak Para, a visit to Hajachara waterfall and evenings around the cottage with local food.",
	images: [] as string[],
	location: "Sajek Valley, Baghaichhari, Rangamati",
	costFrom: 7500,
	startDate: "2026-11-12",
	endDate: "2026-11-14",
	departureLocation: "Dhaka",
	arrivalLocation: "Sajek Valley",
	included: [
		"AC bus Dhaka ⇄ Khagrachari",
		"Shared jeep to Sajek",
		"2 nights in a ridge cottage",
		"All listed meals",
		"Licensed guide and permits",
	],
	excluded: ["Personal snacks and drinks", "Single-room upgrade", "Travel insurance", "Anything not listed"],
	amenities: ["Hot water in cottage", "Power backup at night", "First-aid kit with guide", "Life jackets"],
	tourPlan: [
		"Night bus to Khagrachari, then the escorted jeep convoy up to Sajek. Check in and catch sunset at Helipad viewpoint.",
		"Early walk to Konglak Para for sunrise over the valley, a gentle hike through the Lushai village and a barbecue dinner.",
		"Jeeps back down with a stop at Hajachara waterfall and Alutila cave, then the evening bus to Dhaka.",
	],
	maxGuest: 20,
	minAge: 8,
	division: { _id: "d1", name: "Chattogram" },
	tourType: { _id: "t1", name: "Long tour" },
};

const GUESTS = 2; // static for now

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const formatPrice = (amount: number) => `৳${amount.toLocaleString("en-IN")}`;

const getDays = (start: string, end: string) =>
	Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;

/* ───────── small helpers ───────── */

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

/* ───────── page ───────── */

export default function TourDetails() {
	const { id } = useParams();
	console.log("Tour id:", id); // later: useGetSingleTourQuery(id)

	const days = getDays(tour.startDate, tour.endDate);
	const total = tour.costFrom * GUESTS;

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
					<span aria-hidden="true">/</span>
					<span>{tour.division.name}</span>
					<span aria-hidden="true">/</span>
					<span className="font-medium text-primary">{tour.title}</span>
				</nav>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex flex-col gap-2.5">
						<div className="flex flex-wrap gap-2">
							<span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
								{tour.tourType.name}
							</span>
							<span className="rounded-full bg-pink-soft px-3 py-1 text-xs font-semibold text-pink">
								{tour.division.name}
							</span>
						</div>
						<h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-[42px]">{tour.title}</h1>
						<p className="flex items-center gap-1.5 text-muted-foreground">
							<MapPin className="size-4 shrink-0 text-primary" />
							{tour.location}
						</p>
					</div>
					<div className="flex gap-2.5">
						<Button
							variant="outline"
							type="button"
							className="h-11 gap-2 rounded-lg border-[1.5px] border-primary px-5 text-primary"
						>
							<Share2 className="size-4" />
							Share
						</Button>
						<Button
							variant="outline"
							size="icon"
							type="button"
							aria-label="Save to wishlist"
							className="size-11 rounded-lg border-[1.5px]"
						>
							<Heart className="size-5" />
						</Button>
					</div>
				</div>

				{/* Gallery */}
				<div className="relative grid grid-cols-1 gap-3.5 sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-[220px_220px]">
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className={[
								"flex items-center justify-center overflow-hidden rounded-2xl bg-accent text-muted-foreground",
								i === 0 ? "h-64 sm:row-span-2 sm:h-auto" : "hidden sm:flex",
							].join(" ")}
						>
							{tour.images[i] ? (
								<img src={tour.images[i]} alt={`${tour.title} photo ${i + 1}`} className="size-full object-cover" />
							) : (
								<ImageIcon className={i === 0 ? "size-9" : "size-6"} />
							)}
						</div>
					))}
					<Button
						type="button"
						variant="outline"
						className="absolute right-3.5 bottom-3.5 h-10 rounded-lg border-0 bg-card px-4 shadow-card"
					>
						View all photos
					</Button>
				</div>
			</div>

			{/* ───── Content + booking card ───── */}
			<div className="mx-auto flex max-w-[1200px] flex-col items-start gap-12 px-4 pt-11 pb-24 sm:px-10 lg:flex-row">
				<main className="flex w-full min-w-0 flex-1 flex-col gap-11">
					{/* Facts */}
					<dl className="grid grid-cols-1 gap-x-7 gap-y-6 rounded-xl bg-card p-6.5 shadow-card sm:grid-cols-2 xl:grid-cols-3">
						<Fact
							icon={<Route className="size-5.5" />}
							iconCls="bg-accent text-primary"
							label="Departure → Arrival"
							value={`${tour.departureLocation} → ${tour.arrivalLocation}`}
						/>
						<Fact
							icon={<CalendarDays className="size-5.5" />}
							iconCls="bg-pink-soft text-pink"
							label="Start → End date"
							value={`${formatDate(tour.startDate)} → ${formatDate(tour.endDate)}`}
						/>
						<Fact
							icon={<Clock className="size-5.5" />}
							iconCls="bg-yellow-soft text-warning"
							label="Duration"
							value={`${days} days · ${days - 1} nights`}
						/>
						<Fact
							icon={<Users className="size-5.5" />}
							iconCls="bg-mint-soft text-success"
							label="Max guests"
							value={`${tour.maxGuest} per departure`}
						/>
						<Fact
							icon={<UserRound className="size-5.5" />}
							iconCls="bg-accent text-primary"
							label="Minimum age"
							value={`${tour.minAge} years`}
						/>
						<Fact
							icon={<Tag className="size-5.5" />}
							iconCls="bg-pink-soft text-pink"
							label="Price"
							value={`${formatPrice(tour.costFrom)} per person`}
						/>
					</dl>

					{/* About */}
					<section className="flex flex-col gap-3.5">
						<h2 className="text-2xl font-bold sm:text-[26px]">About this tour</h2>
						<p className="max-w-[70ch] text-[15.5px] leading-relaxed text-muted-foreground">{tour.description}</p>
					</section>

					{/* Tour plan */}
					<section className="flex flex-col gap-5.5">
						<h2 className="text-2xl font-bold sm:text-[26px]">Tour plan</h2>
						<ol className="flex flex-col">
							{tour.tourPlan.map((step, i) => (
								<li key={step} className="flex gap-4.5">
									<div className="flex flex-col items-center">
										<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-[0_8px_18px_rgba(91,76,240,.25)]">
											{i + 1}
										</span>
										{i < tour.tourPlan.length - 1 && <span className="my-1.5 min-h-6 w-0.5 flex-1 bg-border" />}
									</div>
									<div className="mb-4.5 flex flex-1 flex-col gap-1.5 rounded-xl bg-card px-5 py-4.5 shadow-card">
										<span className="text-[12.5px] font-semibold text-primary">Day {i + 1}</span>
										<p className="text-sm leading-relaxed text-muted-foreground">{step}</p>
									</div>
								</li>
							))}
						</ol>
					</section>

					{/* Included / Excluded / Amenities */}
					<section className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-3">
						<ListCard
							title="Included"
							items={tour.included}
							icon={<Check className="size-4.5 text-success" strokeWidth={2.6} />}
						/>
						<ListCard
							title="Not included"
							items={tour.excluded}
							icon={<X className="size-4.5 text-destructive" strokeWidth={2.6} />}
						/>
						<ListCard title="Amenities" items={tour.amenities} icon={<Sparkles className="size-4.5 text-primary" />} />
					</section>
				</main>

				{/* Booking card */}
				<aside
					aria-label="Book this tour"
					className="flex w-full flex-col gap-4.5 rounded-xl bg-card p-6.5 shadow-card lg:sticky lg:top-6 lg:w-[370px] lg:shrink-0"
				>
					<div>
						<span className="text-[13px] text-muted-foreground">from</span>
						<div className="flex items-baseline gap-1.5">
							<strong className="text-[32px] font-bold text-primary">{formatPrice(tour.costFrom)}</strong>
							<span className="text-sm text-muted-foreground">/ person</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2.5">
						<div className="rounded-lg bg-muted px-3.5 py-3">
							<span className="text-xs text-muted-foreground">Start</span>
							<div className="text-sm font-semibold">{formatDate(tour.startDate)}</div>
						</div>
						<div className="rounded-lg bg-muted px-3.5 py-3">
							<span className="text-xs text-muted-foreground">End</span>
							<div className="text-sm font-semibold">{formatDate(tour.endDate)}</div>
						</div>
					</div>

					<div className="flex items-center justify-between gap-3">
						<div>
							<div id="guests-label" className="font-semibold">
								Guests
							</div>
							<div className="text-[12.5px] text-muted-foreground">
								Max {tour.maxGuest} · age {tour.minAge}+
							</div>
						</div>
						<div role="group" aria-labelledby="guests-label" className="flex items-center gap-1.5">
							<Button
								variant="outline"
								size="icon"
								type="button"
								aria-label="Remove a guest"
								className="size-11 rounded-lg border-[1.5px]"
							>
								<Minus className="size-4.5" />
							</Button>
							<output aria-live="polite" className="min-w-8.5 text-center text-lg font-bold">
								{GUESTS}
							</output>
							<Button
								variant="outline"
								size="icon"
								type="button"
								aria-label="Add a guest"
								className="size-11 rounded-lg border-[1.5px] border-primary text-primary"
							>
								<Plus className="size-4.5" />
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-2 border-t border-dashed border-border pt-4">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								{formatPrice(tour.costFrom)} × {GUESTS} guests
							</span>
							<span>{formatPrice(total)}</span>
						</div>
						<div className="flex items-baseline justify-between pt-1">
							<strong>Total</strong>
							<strong className="text-2xl font-bold">{formatPrice(total)}</strong>
						</div>
					</div>

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
