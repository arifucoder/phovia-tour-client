import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ImageIcon, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router";

// Static demo data — later replace with API data
const divisions = [
	{ name: "Dhaka", count: 12, checked: false },
	{ name: "Chattogram", count: 28, checked: true },
	{ name: "Sylhet", count: 19, checked: true },
	{ name: "Khulna", count: 9, checked: false },
	{ name: "Rajshahi", count: 7, checked: false },
	{ name: "Barishal", count: 6, checked: false },
	{ name: "Rangpur", count: 4, checked: false },
	{ name: "Mymensingh", count: 5, checked: false },
];

const tourTypes = ["All", "Short tour", "Long tour", "Weekend getaway"];

const tours = [
	{
		slug: "sajek-valley-cloud-escape",
		title: "Sajek Valley Cloud Escape",
		location: "Rangamati, Chattogram",
		type: "Long tour",
		dates: "12–14 Nov",
		days: "3 days",
		maxGuest: 20,
		costFrom: 7500,
		seatsLeft: 4,
	},
	{
		slug: "bandarban-nilgiri-boga-lake",
		title: "Bandarban: Nilgiri & Boga Lake",
		location: "Bandarban, Chattogram",
		type: "Long tour",
		dates: "15–18 Nov",
		days: "4 days",
		maxGuest: 14,
		costFrom: 11200,
	},
	{
		slug: "srimangal-tea-trails",
		title: "Srimangal Tea Trails",
		location: "Moulvibazar, Sylhet",
		type: "Long tour",
		dates: "21–23 Nov",
		days: "3 days",
		maxGuest: 24,
		costFrom: 6800,
	},
	{
		slug: "khagrachari-caves-alutila",
		title: "Khagrachari Caves & Alutila",
		location: "Khagrachari, Chattogram",
		type: "Long tour",
		dates: "27–29 Nov",
		days: "3 days",
		maxGuest: 18,
		costFrom: 6900,
	},
	{
		slug: "jaflong-lalakhal-highlands",
		title: "Jaflong & Lalakhal Highlands",
		location: "Sylhet, Sylhet",
		type: "Long tour",
		dates: "4–6 Dec",
		days: "3 days",
		maxGuest: 22,
		costFrom: 8400,
		seatsLeft: 5,
	},
	{
		slug: "kaptai-lake-shuvolong-falls",
		title: "Kaptai Lake & Shuvolong Falls",
		location: "Rangamati, Chattogram",
		type: "Long tour",
		dates: "10–12 Dec",
		days: "3 days",
		maxGuest: 25,
		costFrom: 7900,
	},
	{
		slug: "keokradong-summit-trek",
		title: "Keokradong Summit Trek",
		location: "Bandarban, Chattogram",
		type: "Long tour",
		dates: "14–18 Dec",
		days: "5 days",
		maxGuest: 12,
		costFrom: 13500,
		seatsLeft: 3,
	},
	{
		slug: "lawachara-forest-madhabkunda",
		title: "Lawachara Forest & Madhabkunda",
		location: "Moulvibazar, Sylhet",
		type: "Long tour",
		dates: "19–21 Dec",
		days: "3 days",
		maxGuest: 20,
		costFrom: 7200,
	},
	{
		slug: "marayan-tong-sunrise-camp",
		title: "Marayan Tong Sunrise Camp",
		location: "Bandarban, Chattogram",
		type: "Long tour",
		dates: "26–28 Dec",
		days: "3 days",
		maxGuest: 16,
		costFrom: 8900,
	},
];

const formatPrice = (amount: number) => amount.toLocaleString("en-IN");

const selectCls =
	"h-11.5 w-full rounded-lg border-[1.5px] border-border bg-background px-3.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default function Tours() {
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
				<aside
					aria-label="Filters"
					className="hidden w-70 shrink-0 flex-col gap-6.5 rounded-xl bg-card p-6 shadow-card lg:flex"
				>
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">Filters</h2>
						<Button variant="link" type="button" className="h-auto p-0 text-[13.5px]">
							Reset all
						</Button>
					</div>

					{/* Division */}
					<fieldset className="flex flex-col gap-0.5">
						<legend className="mb-2.5 text-sm font-semibold">Division</legend>
						{divisions.map((d) => (
							<label key={d.name} className="flex min-h-8.5 cursor-pointer items-center gap-2.5 text-sm">
								<input type="checkbox" defaultChecked={d.checked} className="size-4.5 cursor-pointer accent-primary" />
								<span className="flex-1">{d.name}</span>
								<span className="text-[12.5px] text-muted-foreground">{d.count}</span>
							</label>
						))}
					</fieldset>

					{/* Tour type */}
					<fieldset>
						<legend className="mb-2.5 text-sm font-semibold">Tour type</legend>
						<div className="flex flex-wrap gap-2">
							{tourTypes.map((type) => {
								const active = type === "Long tour";
								return (
									<button
										key={type}
										type="button"
										aria-pressed={active}
										className={[
											"h-9.5 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-medium transition-colors",
											active
												? "border-primary bg-accent text-primary"
												: "border-border bg-background text-foreground hover:border-primary/50",
										].join(" ")}
									>
										{type}
									</button>
								);
							})}
						</div>
					</fieldset>

					{/* Price range */}
					<fieldset className="flex flex-col gap-2.5">
						<legend className="mb-2.5 text-sm font-semibold">Price range (৳)</legend>
						<div className="flex gap-2.5">
							<Input
								aria-label="Minimum price"
								inputMode="numeric"
								placeholder="Min"
								defaultValue="3000"
								className="h-11.5 rounded-lg border-[1.5px] text-sm"
							/>
							<Input
								aria-label="Maximum price"
								inputMode="numeric"
								placeholder="Max"
								defaultValue="15000"
								className="h-11.5 rounded-lg border-[1.5px] text-sm"
							/>
						</div>
					</fieldset>

					<Button type="button" className="h-11 rounded-lg font-semibold">
						Apply filters
					</Button>
				</aside>

				{/* Results */}
				<main className="flex min-w-0 flex-1 flex-col gap-6">
					{/* Toolbar */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p>
							<strong>{tours.length} tours</strong> <span className="text-muted-foreground">found</span>
						</p>
						<div className="flex items-center gap-2.5">
							<Button
								variant="outline"
								type="button"
								className="h-11.5 flex-1 gap-2 rounded-lg border-[1.5px] border-primary text-primary lg:hidden"
							>
								<SlidersHorizontal className="size-4.5" />
								Filters · 3
							</Button>
							<label htmlFor="tour-sort" className="hidden text-sm text-muted-foreground sm:block">
								Sort by
							</label>
							<select id="tour-sort" defaultValue="newest" className={`${selectCls} flex-1 sm:w-48 sm:flex-none`}>
								<option value="newest">Newest first</option>
								<option value="price-asc">Price: low to high</option>
								<option value="price-desc">Price: high to low</option>
							</select>
						</div>
					</div>

					{/* Cards */}
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
						{tours.map((tour) => (
							<Link
								key={tour.slug}
								to={`/tours/${tour.slug}`}
								className="group flex flex-col overflow-hidden rounded-xl bg-card text-foreground shadow-card transition-shadow hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
							>
								{/* Image */}
								<div className="relative flex h-50 items-center justify-center overflow-hidden bg-accent text-muted-foreground">
									{/* later: <img src={tour.images[0]} alt={tour.title} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" /> */}
									<ImageIcon className="size-7" />
									<span className="absolute top-3 left-3 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground">
										{tour.type}
									</span>
								</div>

								{/* Body */}
								<div className="flex flex-1 flex-col gap-1.5 px-4.5 pt-4 pb-4.5">
									<span className="flex items-center gap-1 text-[12.5px] font-medium text-primary">
										<MapPin className="size-3.5" />
										{tour.location}
									</span>
									<h3 className="text-base leading-snug font-semibold group-hover:text-primary">{tour.title}</h3>
									<p className="text-[12.5px] text-muted-foreground">
										{tour.days} · {tour.dates} · Max {tour.maxGuest} guests
									</p>
									<div className="mt-auto flex items-center justify-between pt-1.5">
										<span>
											<span className="text-xs text-muted-foreground">from </span>
											<strong className="text-lg font-bold text-primary">৳{formatPrice(tour.costFrom)}</strong>
										</span>
										{tour.seatsLeft && (
											<span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
												{tour.seatsLeft} seats left
											</span>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>

					{/* Pagination */}
					<nav aria-label="Pagination" className="flex flex-wrap justify-center gap-2 pt-4">
						<Button
							variant="outline"
							size="icon"
							aria-label="Previous page"
							className="size-11 rounded-lg border-[1.5px]"
						>
							<ChevronLeft className="size-4.5" />
						</Button>
						{[1, 2, 3].map((n) => (
							<Button
								key={n}
								variant={n === 1 ? "default" : "outline"}
								aria-current={n === 1 ? "page" : undefined}
								className="size-11 rounded-lg border-[1.5px] font-medium"
							>
								{n}
							</Button>
						))}
						<span className="flex size-11 items-center justify-center text-muted-foreground">…</span>
						<Button variant="outline" className="size-11 rounded-lg border-[1.5px] font-medium">
							5
						</Button>
						<Button variant="outline" size="icon" aria-label="Next page" className="size-11 rounded-lg border-[1.5px]">
							<ChevronRight className="size-4.5" />
						</Button>
					</nav>
				</main>
			</div>
		</div>
	);
}
