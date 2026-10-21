import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAddTourTypeMutation } from "@/redux/features/Tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, { error: "Name must be at least 2 characters long." })
		.max(50, { error: "Name cannot exceed 50 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddTourTypeForm() {
	const [addTourType] = useAddTourTypeMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const res = await addTourType({ name: data.name }).unwrap();
		if (res.success) {
			toast.success("Tour Type Added");
		}
	};

	return (
		<section className="rounded-xl border border-border bg-card shadow-card lg:sticky lg:top-4">
			<div className="border-b border-border px-4.5 py-4">
				<h2 className="text-base font-semibold">Add a tour type</h2>
				<p className="text-[13.5px] text-muted-foreground">Give it a short, clear name.</p>
			</div>

			<form id="add-tour-type" className="flex flex-col gap-4 p-4.5" onSubmit={form.handleSubmit(onSubmit)}>
				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="gap-1.5">
							<FieldLabel htmlFor="tt-new" className="text-sm font-semibold">
								Name
							</FieldLabel>
							<Input
								{...field}
								id="tt-new"
								placeholder="e.g. Short tour"
								autoComplete="off"
								aria-invalid={fieldState.invalid}
								className="h-11 rounded-lg px-3.5 text-[15px]"
							/>
							{fieldState.invalid && (
								<FieldError className="flex items-center gap-1.5 text-[13px]">
									<AlertCircle className="size-3.75 shrink-0" />
									{fieldState.error?.message}
								</FieldError>
							)}
						</Field>
					)}
				/>

				<Button
					type="submit"
					disabled={form.formState.isSubmitting}
					className="h-11 w-full gap-2 rounded-lg text-[14.5px] font-semibold"
				>
					<Plus className="size-4.25" strokeWidth={2.4} />
					Add tour type
				</Button>
			</form>
		</section>
	);
}
