import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Plus, X } from "lucide-react";
import type { ReactNode } from "react";

/* ───────── small static helpers (same file) ───────── */

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-4 border-b border-border pb-6 last:border-b-0 last:pb-0">
			<div>
				<h3 className="text-[15px] font-bold text-foreground">{title}</h3>
				{description && <p className="text-[13px] text-muted-foreground">{description}</p>}
			</div>
			{children}
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
				<Input id={id} placeholder={placeholder} autoComplete="off" className="h-11 rounded-lg px-3.5 text-[15px]" />
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

/* ───────── modal ───────── */

const inputCls = "h-11 rounded-lg px-3.5 text-[15px]";

export default function AddTourModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button" className="h-11 gap-2 rounded-lg px-4 text-[14.5px] font-semibold">
					<Plus className="size-4.5" strokeWidth={2.4} />
					Add tour
				</Button>
			</DialogTrigger>

			<DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-4xl">
				{/* Header (fixed) */}
				<DialogHeader className="shrink-0 border-b border-border px-6 py-4.5 text-left">
					<DialogTitle className="text-xl font-bold">Add tour</DialogTitle>
					<DialogDescription className="text-[13.5px]">
						Fill in the details below. Fields marked * are required.
					</DialogDescription>
				</DialogHeader>

				{/* Body (scrolls) */}
				<form id="add-tour" className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-6">
					<div className="flex flex-col gap-6">
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
									<Select>
										<SelectTrigger id="tour-division" className="h-11! w-full rounded-lg px-3.5 text-[15px]">
											<SelectValue placeholder="Select a division" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="chattogram">Chattogram</SelectItem>
											<SelectItem value="sylhet">Sylhet</SelectItem>
											<SelectItem value="dhaka">Dhaka</SelectItem>
										</SelectContent>
									</Select>
								</Field>

								<Field className="gap-1.5">
									<FieldLabel htmlFor="tour-type" className="text-sm font-semibold">
										Tour type *
									</FieldLabel>
									<Select>
										<SelectTrigger id="tour-type" className="h-11! w-full rounded-lg px-3.5 text-[15px]">
											<SelectValue placeholder="Select a tour type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="short">Short tour</SelectItem>
											<SelectItem value="long">Long tour</SelectItem>
											<SelectItem value="weekend">Weekend getaway</SelectItem>
										</SelectContent>
									</Select>
								</Field>
							</div>

							<Field className="gap-1.5">
								<FieldLabel htmlFor="tour-desc" className="text-sm font-semibold">
									Description
								</FieldLabel>
								<Textarea
									id="tour-desc"
									placeholder="What makes this tour special…"
									className="min-h-28 resize-y rounded-lg px-3.5 py-2.5 text-[15px]"
								/>
							</Field>
						</Section>

						{/* ── 2. Images ── */}
						<Section title="Images" description="First image is used as the cover. PNG, JPG or WEBP · max 2 MB each.">
							<label
								htmlFor="tour-images"
								className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted text-center transition-colors hover:border-primary hover:bg-accent"
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
									<div
										key={name}
										className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-accent"
									>
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
								<ListField
									id="tour-amenities"
									label="Amenities"
									placeholder="e.g. Wi-Fi"
									items={["Wi-Fi", "Breakfast"]}
								/>
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
					</div>
				</form>

				{/* Footer (fixed) */}
				<DialogFooter className="shrink-0 border-t border-border bg-muted px-6 py-4">
					<DialogClose asChild>
						<Button variant="outline" type="button" className="h-11 rounded-lg px-4 font-semibold">
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" form="add-tour" className="h-11 rounded-lg px-5 font-semibold">
						Save tour
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
