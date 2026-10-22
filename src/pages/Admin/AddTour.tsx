import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ImagePlus, Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

// Static options — later replace with API data
const divisionOptions = [
	{ value: "chattogram", label: "Chattogram" },
	{ value: "sylhet", label: "Sylhet" },
	{ value: "dhaka", label: "Dhaka" },
	{ value: "khulna", label: "Khulna" },
	{ value: "rajshahi", label: "Rajshahi" },
	{ value: "barishal", label: "Barishal" },
	{ value: "mymensingh", label: "Mymensingh" },
	{ value: "rangpur", label: "Rangpur" },
];

const tourTypeOptions = [
	{ value: "short", label: "Short tour" },
	{ value: "long", label: "Long tour (3+ days)" },
	{ value: "weekend", label: "Weekend getaway" },
];

const inputCls = "h-11 rounded-lg px-3.5 text-[15px]";

/* ───────── small static helpers ───────── */

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
	return (
		<section className="rounded-xl border border-border bg-card shadow-card">
			<div className="border-b border-border px-5.5 py-4">
				<h2 className="text-base font-bold text-foreground">{title}</h2>
				{description && <p className="text-[13px] text-muted-foreground">{description}</p>}
			</div>
			<div className="flex flex-col gap-4 p-5.5">{children}</div>
		</section>
	);
}

function ListField({
	id,
	label,
	placeholder,
	items,
	numbered = false,
}: {
	id: string;
	label: string;
	placeholder: string;
	items: string[];
	numbered?: boolean;
}) {
	return (
		<Field className="gap-1.5">
			<FieldLabel htmlFor={id} className="text-sm font-semibold">
				{label}
			</FieldLabel>
			<div className="flex gap-2">
				<Input id={id} placeholder={placeholder} autoComplete="off" className={inputCls} />
				<Button
					type="button"
					variant="outline"
					size="icon"
					aria-label={`Add to ${label}`}
					className="size-11 rounded-lg"
				>
					<Plus className="size-4.5" />
				</Button>
			</div>
			<ul className="mt-1 flex flex-col gap-1.5">
				{items.map((item, i) => (
					<li
						key={item}
						className="flex items-center gap-2.5 rounded-lg border border-border bg-muted px-3 py-2 text-[14px]"
					>
						{numbered && (
							<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-semibold text-accent-foreground">
								{i + 1}
							</span>
						)}
						<span className="flex-1">{item}</span>
						<button
							type="button"
							aria-label={`Remove ${item}`}
							className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-destructive"
						>
							<X className="size-4" />
						</button>
					</li>
				))}
			</ul>
		</Field>
	);
}

/* ───────── page ───────── */

export default function AddTour() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
			{/* Page header */}
			<div className="flex flex-col gap-3">
				<Link
					to="/admin/tours"
					className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Back to tours
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Add tour</h1>
					<p className="text-muted-foreground">Fill in the details below. Fields marked * are required.</p>
				</div>
			</div>

			<form id="add-tour" className="flex flex-col gap-5">
				{/* ── 1. Basic info ── */}
				<Section title="Basic info">
					<Field className="gap-1.5">
						<FieldLabel htmlFor="tour-title" className="text-sm font-semibold">
							Title *
						</FieldLabel>
						<Input id="tour-title" placeholder="e.g. Sajek Valley 3-Day Escape" className={inputCls} />
						<FieldDescription className="text-[13px]">Slug: /tours/sajek-valley-3-day-escape</FieldDescription>
					</Field>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-division" className="text-sm font-semibold">
								Division *
							</FieldLabel>
							<SearchableSelect
								id="tour-division"
								options={divisionOptions}
								placeholder="Select a division"
								searchPlaceholder="Search division…"
								emptyText="No division found."
							/>
						</Field>

						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-type" className="text-sm font-semibold">
								Tour type *
							</FieldLabel>
							<SearchableSelect
								id="tour-type"
								options={tourTypeOptions}
								placeholder="Select a tour type"
								searchPlaceholder="Search tour type…"
								emptyText="No tour type found."
							/>
						</Field>
					</div>

					<Field className="gap-1.5">
						<FieldLabel htmlFor="tour-desc" className="text-sm font-semibold">
							Description
						</FieldLabel>
						<Textarea
							id="tour-desc"
							placeholder="What makes this tour special…"
							className="min-h-32 resize-y rounded-lg px-3.5 py-2.5 text-[15px]"
						/>
					</Field>
				</Section>

				{/* ── 2. Images ── */}
				<Section title="Images" description="First image is used as the cover. PNG, JPG or WEBP · max 2 MB each.">
					<label
						htmlFor="tour-images"
						className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted text-center transition-colors hover:border-primary hover:bg-accent"
					>
						<span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
							<ImagePlus className="size-5" />
						</span>
						<span className="text-sm font-semibold text-foreground">Click or drag images here</span>
						<span className="text-[12.5px] text-muted-foreground">You can select multiple files</span>
					</label>
					<input id="tour-images" type="file" accept="image/*" multiple className="sr-only" />

					{/* preview grid (static placeholders) */}
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{["cover.jpg", "view-2.jpg", "camp.jpg"].map((name, i) => (
							<div key={name} className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-accent">
								{i === 0 && (
									<span className="absolute top-2 left-2 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
										Cover
									</span>
								)}
								<button
									type="button"
									aria-label={`Remove ${name}`}
									className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
								>
									<X className="size-3.5" />
								</button>
								<span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/60 to-transparent px-2 pt-4 pb-1.5 text-[11.5px] text-white">
									{name}
								</span>
							</div>
						))}
					</div>
				</Section>

				{/* ── 3. Location & dates ── */}
				<Section title="Location & dates">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field className="gap-1.5 sm:col-span-2">
							<FieldLabel htmlFor="tour-location" className="text-sm font-semibold">
								Location
							</FieldLabel>
							<Input id="tour-location" placeholder="e.g. Sajek, Rangamati" className={inputCls} />
						</Field>
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-departure" className="text-sm font-semibold">
								Departure location
							</FieldLabel>
							<Input id="tour-departure" placeholder="e.g. Dhaka (Arambagh)" className={inputCls} />
						</Field>
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-arrival" className="text-sm font-semibold">
								Arrival location
							</FieldLabel>
							<Input id="tour-arrival" placeholder="e.g. Sajek Valley" className={inputCls} />
						</Field>
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-start" className="text-sm font-semibold">
								Start date
							</FieldLabel>
							<Input id="tour-start" type="date" className={inputCls} />
						</Field>
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-end" className="text-sm font-semibold">
								End date
							</FieldLabel>
							<Input id="tour-end" type="date" className={inputCls} />
						</Field>
					</div>
				</Section>

				{/* ── 4. Pricing & guests ── */}
				<Section title="Pricing & guests">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-cost" className="text-sm font-semibold">
								Cost from (৳)
							</FieldLabel>
							<Input id="tour-cost" type="number" min={0} placeholder="5500" className={inputCls} />
						</Field>
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-max-guest" className="text-sm font-semibold">
								Max guests
							</FieldLabel>
							<Input id="tour-max-guest" type="number" min={1} placeholder="20" className={inputCls} />
						</Field>
						<Field className="gap-1.5">
							<FieldLabel htmlFor="tour-min-age" className="text-sm font-semibold">
								Min age
							</FieldLabel>
							<Input id="tour-min-age" type="number" min={0} placeholder="12" className={inputCls} />
						</Field>
					</div>
				</Section>

				{/* ── 5. What's included ── */}
				<Section title="What's included">
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<ListField
							id="tour-included"
							label="Included"
							placeholder="e.g. AC bus ticket"
							items={["AC bus ticket", "2 nights resort stay"]}
						/>
						<ListField
							id="tour-excluded"
							label="Excluded"
							placeholder="e.g. Personal expenses"
							items={["Personal expenses"]}
						/>
						<ListField id="tour-amenities" label="Amenities" placeholder="e.g. Wi-Fi" items={["Wi-Fi", "Breakfast"]} />
					</div>
				</Section>

				{/* ── 6. Tour plan ── */}
				<Section title="Tour plan" description="Add each day or step in order.">
					<ListField
						id="tour-plan"
						label="Plan"
						placeholder="e.g. Day 1: Dhaka → Khagrachari, then jeep to Sajek"
						items={["Day 1: Dhaka → Khagrachari → Sajek", "Day 2: Konglak hill sunrise, local village walk"]}
						numbered
					/>
				</Section>

				{/* ── Sticky action bar ── */}
				<div className="sticky bottom-0 z-10 -mx-4 flex justify-end gap-2.5 border-t border-border bg-background/95 px-4 py-3.5 backdrop-blur">
					<Button asChild variant="outline" className="h-11 rounded-lg px-4 font-semibold">
						<Link to="/admin/tours">Cancel</Link>
					</Button>
					<Button type="submit" className="h-11 rounded-lg px-5 font-semibold">
						Save tour
					</Button>
				</div>
			</form>
		</div>
	);
}
