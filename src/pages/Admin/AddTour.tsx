import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import MultiImageUploader from "@/components/ui/multi-image-uploader";
import SearchableSelect from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import { useGetDivisionsQuery } from "@/redux/features/Division/division.api";
import { useAddTourMutation, useGetTourTypesQuery } from "@/redux/features/Tour/tour.api";
import type { IDivision, ITourType, TApiError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import * as z from "zod";

const inputCls = "h-11 rounded-lg px-3.5 text-[15px]";

/* ───────── schema ───────── */

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

const formSchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(3, { error: "Title must be at least 3 characters long." })
			.max(120, { error: "Title cannot exceed 120 characters." }),
		division: z.string().min(1, { error: "Please select a division." }),
		tourType: z.string().min(1, { error: "Please select a tour type." }),
		description: z.string().trim().optional(),
		images: z
			.array(
				z
					.instanceof(File)
					.refine((file) => IMAGE_TYPES.includes(file.type), { error: "Only PNG, JPG or WEBP allowed." })
					.refine((file) => file.size <= MAX_SIZE, { error: "Each image must be 2 MB or smaller." }),
			)
			.max(10, { error: "You can upload up to 10 images." }),
		location: z.string().trim().optional(),
		departureLocation: z.string().trim().optional(),
		arrivalLocation: z.string().trim().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		costFrom: z.number({ error: "Enter a valid amount." }).min(0, { error: "Cost can't be negative." }).optional(),
		maxGuest: z.number({ error: "Enter a valid number." }).int().min(1, { error: "At least 1 guest." }).optional(),
		minAge: z.number({ error: "Enter a valid number." }).int().min(0, { error: "Age can't be negative." }).optional(),
		included: z.array(z.string()),
		excluded: z.array(z.string()),
		amenities: z.array(z.string()),
		tourPlan: z.array(z.string()),
	})
	.refine((data) => !data.startDate || data.startDate >= getToday(), {
		error: "Start date can't be in the past.",
		path: ["startDate"],
	})
	.refine((data) => !data.endDate || data.endDate >= getToday(), {
		error: "End date can't be in the past.",
		path: ["endDate"],
	})
	.refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
		error: "End date can't be before start date.",
		path: ["endDate"],
	});

type FormValues = z.infer<typeof formSchema>;

const makeSlug = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const getToday = () => {
	const d = new Date();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${month}-${day}`;
};

/* ───────── small helpers ───────── */

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
	value,
	onChange,
	numbered = false,
}: {
	id: string;
	label: string;
	placeholder: string;
	value: string[];
	onChange: (items: string[]) => void;
	numbered?: boolean;
}) {
	const [draft, setDraft] = useState("");

	const addItem = () => {
		const text = draft.trim();
		if (!text || value.includes(text)) return;
		onChange([...value, text]);
		setDraft("");
	};

	const removeItem = (index: number) => onChange(value.filter((_, i) => i !== index));

	// Enter → add item (not submit the whole form)
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addItem();
		}
	};

	return (
		<Field className="gap-1.5">
			<FieldLabel htmlFor={id} className="text-sm font-semibold">
				{label}
			</FieldLabel>
			<div className="flex gap-2">
				<Input
					id={id}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					autoComplete="off"
					className={inputCls}
				/>
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={addItem}
					aria-label={`Add to ${label}`}
					className="size-11 rounded-lg"
				>
					<Plus className="size-4.5" />
				</Button>
			</div>
			{value.length > 0 && (
				<ul className="mt-1 flex flex-col gap-1.5">
					{value.map((item, i) => (
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
								onClick={() => removeItem(i)}
								aria-label={`Remove ${item}`}
								className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-destructive"
							>
								<X className="size-4" />
							</button>
						</li>
					))}
				</ul>
			)}
		</Field>
	);
}

/* ───────── page ───────── */

export default function AddTour() {
	const { data: divisions = [], isLoading: divisionLoading } = useGetDivisionsQuery(undefined);
	const { data: tourTypes = [], isLoading: tourTypeLoading } = useGetTourTypesQuery(undefined);

	// API data → { value, label } for SearchableSelect
	const divisionOptions = useMemo(
		() => (divisions as IDivision[]).map((item) => ({ value: item._id, label: item.name })),
		[divisions],
	);

	const tourTypeOptions = useMemo(
		() => (tourTypes as ITourType[]).map((item) => ({ value: item._id, label: item.name })),
		[tourTypes],
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			division: "",
			tourType: "",
			description: "",
			images: [],
			location: "",
			departureLocation: "",
			arrivalLocation: "",
			startDate: "",
			endDate: "",
			costFrom: undefined,
			maxGuest: undefined,
			minAge: undefined,
			included: [],
			excluded: [],
			amenities: [],
			tourPlan: [],
		},
	});

	const title = form.watch("title");

	const today = getToday();
	const startDate = form.watch("startDate");

	const [addTour, { isLoading }] = useAddTourMutation();
	const navigate = useNavigate();

	const onSubmit = async (data: FormValues) => {
		const { images, ...rest } = data;

		// remove empty strings / empty arrays so backend gets only filled fields
		const tourData = Object.fromEntries(
			Object.entries(rest).filter(([, v]) => v !== "" && v !== undefined && !(Array.isArray(v) && v.length === 0)),
		);

		const formData = new FormData();
		formData.append("data", JSON.stringify(tourData));
		images.forEach((file) => formData.append("files", file)); // multerUpload.array("files")

		const toastId = toast.loading("Creating tour…");

		try {
			const res = await addTour(formData).unwrap();
			console.log(res);
			toast.success("Tour created successfully", { id: toastId });
			form.reset();
			navigate("/admin/tours");
		} catch (err) {
			const error = err as TApiError;
			const message =
				error.data?.errorSources?.[0]?.message || error.data?.message || "Failed to create tour. Please try again.";
			toast.error(message, { id: toastId });
		}
	};

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

			<form id="add-tour" className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset disabled={isLoading} className="flex flex-col gap-5 disabled:opacity-60">
					{/* ── 1. Basic info ── */}
					<Section title="Basic info">
						<Controller
							name="title"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-1.5">
									<FieldLabel htmlFor="tour-title" className="text-sm font-semibold">
										Title *
									</FieldLabel>
									<Input
										{...field}
										id="tour-title"
										placeholder="e.g. Sajek Valley 3-Day Escape"
										aria-invalid={fieldState.invalid}
										className={inputCls}
									/>
									<FieldDescription className="text-[13px]">
										Slug: /tours/{makeSlug(title) || "your-tour-title"}
									</FieldDescription>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<Controller
								name="division"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="gap-1.5">
										<FieldLabel htmlFor="tour-division" className="text-sm font-semibold">
											Division *
										</FieldLabel>
										<SearchableSelect
											id="tour-division"
											options={divisionOptions}
											value={field.value}
											onChange={field.onChange}
											invalid={fieldState.invalid}
											disabled={divisionLoading}
											placeholder={divisionLoading ? "Loading divisions…" : "Select a division"}
											searchPlaceholder="Search division…"
											emptyText="No division found."
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							<Controller
								name="tourType"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="gap-1.5">
										<FieldLabel htmlFor="tour-type" className="text-sm font-semibold">
											Tour type *
										</FieldLabel>
										<SearchableSelect
											id="tour-type"
											options={tourTypeOptions}
											value={field.value}
											onChange={field.onChange}
											invalid={fieldState.invalid}
											disabled={tourTypeLoading}
											placeholder={tourTypeLoading ? "Loading tour types…" : "Select a tour type"}
											searchPlaceholder="Search tour type…"
											emptyText="No tour type found."
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</div>

						<Controller
							name="description"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-1.5">
									<FieldLabel htmlFor="tour-desc" className="text-sm font-semibold">
										Description
									</FieldLabel>
									<Textarea
										{...field}
										id="tour-desc"
										placeholder="What makes this tour special…"
										className="min-h-32 resize-y rounded-lg px-3.5 py-2.5 text-[15px]"
									/>
								</Field>
							)}
						/>
					</Section>

					{/* ── 2. Images ── */}
					<Section title="Images" description="First image is used as the cover.">
						<Controller
							name="images"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-1.5">
									<FieldLabel htmlFor="tour-images" className="sr-only">
										Images
									</FieldLabel>
									<MultiImageUploader
										id="tour-images"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<FieldError>
											{fieldState.error.message ?? fieldState.error.root?.message ?? "Some images are invalid."}
										</FieldError>
									)}
								</Field>
							)}
						/>
					</Section>

					{/* ── 3. Location & dates ── */}
					<Section title="Location & dates">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<Controller
								name="location"
								control={form.control}
								render={({ field }) => (
									<Field className="gap-1.5 sm:col-span-2">
										<FieldLabel htmlFor="tour-location" className="text-sm font-semibold">
											Location
										</FieldLabel>
										<Input {...field} id="tour-location" placeholder="e.g. Sajek, Rangamati" className={inputCls} />
									</Field>
								)}
							/>
							<Controller
								name="departureLocation"
								control={form.control}
								render={({ field }) => (
									<Field className="gap-1.5">
										<FieldLabel htmlFor="tour-departure" className="text-sm font-semibold">
											Departure location
										</FieldLabel>
										<Input {...field} id="tour-departure" placeholder="e.g. Dhaka (Arambagh)" className={inputCls} />
									</Field>
								)}
							/>
							<Controller
								name="arrivalLocation"
								control={form.control}
								render={({ field }) => (
									<Field className="gap-1.5">
										<FieldLabel htmlFor="tour-arrival" className="text-sm font-semibold">
											Arrival location
										</FieldLabel>
										<Input {...field} id="tour-arrival" placeholder="e.g. Sajek Valley" className={inputCls} />
									</Field>
								)}
							/>
							<Controller
								name="startDate"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="gap-1.5">
										<FieldLabel htmlFor="tour-start" className="text-sm font-semibold">
											Start date
										</FieldLabel>
										<Input
											{...field}
											id="tour-start"
											type="date"
											min={today}
											onChange={(e) => {
												field.onChange(e);
												// clear end date if it is now before the new start date
												const end = form.getValues("endDate");
												if (end && end < e.target.value) form.setValue("endDate", "");
											}}
											aria-invalid={fieldState.invalid}
											className={inputCls}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="endDate"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="gap-1.5">
										<FieldLabel htmlFor="tour-end" className="text-sm font-semibold">
											End date
										</FieldLabel>
										<Input
											{...field}
											id="tour-end"
											type="date"
											min={startDate || today}
											aria-invalid={fieldState.invalid}
											className={inputCls}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</div>
					</Section>

					{/* ── 4. Pricing & guests ── */}
					<Section title="Pricing & guests">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							{(
								[
									{ name: "costFrom", id: "tour-cost", label: "Cost from (৳)", placeholder: "5500", min: 0 },
									{ name: "maxGuest", id: "tour-max-guest", label: "Max guests", placeholder: "20", min: 1 },
									{ name: "minAge", id: "tour-min-age", label: "Min age", placeholder: "12", min: 0 },
								] as const
							).map((item) => (
								<Controller
									key={item.name}
									name={item.name}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid} className="gap-1.5">
											<FieldLabel htmlFor={item.id} className="text-sm font-semibold">
												{item.label}
											</FieldLabel>
											<Input
												id={item.id}
												type="number"
												min={item.min}
												placeholder={item.placeholder}
												name={field.name}
												ref={field.ref}
												onBlur={field.onBlur}
												value={field.value ?? ""}
												// input gives string → convert to number (empty → undefined)
												onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
												aria-invalid={fieldState.invalid}
												className={inputCls}
											/>
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</Field>
									)}
								/>
							))}
						</div>
					</Section>

					{/* ── 5. What's included ── */}
					<Section title="What's included" description="Type and press Enter (or +) to add.">
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
							<Controller
								name="included"
								control={form.control}
								render={({ field }) => (
									<ListField
										id="tour-included"
										label="Included"
										placeholder="e.g. AC bus ticket"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							<Controller
								name="excluded"
								control={form.control}
								render={({ field }) => (
									<ListField
										id="tour-excluded"
										label="Excluded"
										placeholder="e.g. Personal expenses"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							<Controller
								name="amenities"
								control={form.control}
								render={({ field }) => (
									<ListField
										id="tour-amenities"
										label="Amenities"
										placeholder="e.g. Wi-Fi"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</div>
					</Section>

					{/* ── 6. Tour plan ── */}
					<Section title="Tour plan" description="Add each day or step in order.">
						<Controller
							name="tourPlan"
							control={form.control}
							render={({ field }) => (
								<ListField
									id="tour-plan"
									label="Plan"
									placeholder="e.g. Day 1: Dhaka → Khagrachari, then jeep to Sajek"
									value={field.value}
									onChange={field.onChange}
									numbered
								/>
							)}
						/>
					</Section>

					{/* ── Sticky action bar ── */}
					<div className="sticky bottom-0 z-10 -mx-4 flex justify-end gap-2.5 border-t border-border bg-background/95 px-4 py-3.5 backdrop-blur">
						<Button asChild variant="outline" className="h-11 rounded-lg px-4 font-semibold" aria-disabled={isLoading}>
							<Link to="/admin/tours" className={isLoading ? "pointer-events-none opacity-50" : ""}>
								Cancel
							</Link>
						</Button>
						<Button type="submit" disabled={isLoading} className="h-11 min-w-32 gap-2 rounded-lg px-5 font-semibold">
							{isLoading ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Saving…
								</>
							) : (
								"Save tour"
							)}
						</Button>
					</div>
				</fieldset>
			</form>
		</div>
	);
}
