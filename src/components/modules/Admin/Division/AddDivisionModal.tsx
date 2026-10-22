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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import ImageUploader from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const MAX_SIZE = 1 * 1024 * 1024; // 1 MB
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

const formSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, { error: "Name must be at least 2 characters long." })
		.max(50, { error: "Name cannot exceed 50 characters." }),
	description: z.string().trim().max(300, { error: "Description cannot exceed 300 characters." }).optional(),
	thumbnail: z
		.instanceof(File)
		.refine((file) => IMAGE_TYPES.includes(file.type), { error: "Only PNG, JPG or WEBP allowed." })
		.refine((file) => file.size <= MAX_SIZE, { error: "Image must be 1 MB or smaller." })
		.optional(),
});

type FormValues = z.infer<typeof formSchema>;

const makeSlug = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

export default function AddDivisionModal() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			thumbnail: undefined,
		},
	});

	const name = form.watch("name");

	const onSubmit = (data: FormValues) => {
		console.log({ ...data, slug: makeSlug(data.name) });
		// file details
		if (data.thumbnail) {
			console.log("Thumbnail:", {
				name: data.thumbnail.name,
				type: data.thumbnail.type,
				size: `${(data.thumbnail.size / 1024).toFixed(1)} KB`,
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button" className="h-11 gap-2 rounded-lg px-4 text-[14.5px] font-semibold">
					<Plus className="size-4.5" strokeWidth={2.4} />
					Add division
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] gap-0 overflow-y-auto rounded-xl p-0 sm:max-w-[480px]">
				<DialogHeader className="border-b border-border px-5.5 py-4.5 text-left">
					<DialogTitle className="text-lg font-bold">Add division</DialogTitle>
					<DialogDescription className="text-[13.5px]">
						Each division gets its own public page at /divisions/slug.
					</DialogDescription>
				</DialogHeader>

				<form id="add-division" className="flex flex-col gap-4 px-5.5 py-5" onSubmit={form.handleSubmit(onSubmit)}>
					{/* Thumbnail */}
					<Controller
						name="thumbnail"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="gap-1.5">
								<FieldLabel htmlFor="dv-thumbnail" className="text-sm font-semibold">
									Thumbnail
								</FieldLabel>
								<ImageUploader
									id="dv-thumbnail"
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									invalid={fieldState.invalid}
								/>
								<FieldDescription className="text-[13px]">
									Shown on the home page and the division banner. 1600 × 900 px recommended.
								</FieldDescription>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					{/* Name */}
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="gap-1.5">
								<FieldLabel htmlFor="dv-name" className="text-sm font-semibold">
									Name
								</FieldLabel>
								<Input
									{...field}
									id="dv-name"
									placeholder="e.g. Sylhet"
									autoComplete="off"
									aria-invalid={fieldState.invalid}
									className="h-11 rounded-lg px-3.5 text-[15px]"
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					{/* Slug (auto from name) */}
					<Field className="gap-1.5">
						<FieldLabel htmlFor="dv-slug" className="text-sm font-semibold">
							Slug
						</FieldLabel>
						<Input
							id="dv-slug"
							value={makeSlug(name)}
							placeholder="sylhet"
							readOnly
							className="h-11 rounded-lg bg-muted px-3.5 text-[15px] text-muted-foreground"
						/>
						<FieldDescription className="text-[13px]">Generated automatically from the name.</FieldDescription>
					</Field>

					{/* Description */}
					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="gap-1.5">
								<FieldLabel htmlFor="dv-desc" className="text-sm font-semibold">
									Description
								</FieldLabel>
								<Textarea
									{...field}
									id="dv-desc"
									placeholder="A short line about what makes this division special…"
									aria-invalid={fieldState.invalid}
									className="min-h-25 resize-y rounded-lg px-3.5 py-2.5 text-[15px]"
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</form>

				<DialogFooter className="border-t border-border bg-muted px-5.5 py-4">
					<DialogClose asChild>
						<Button variant="outline" type="button" className="h-11 rounded-lg px-4 font-semibold">
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" form="add-division" className="h-11 rounded-lg px-4 font-semibold">
						Save division
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
