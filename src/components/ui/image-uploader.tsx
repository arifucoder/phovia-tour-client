import { Button } from "@/components/ui/button";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ImageUploaderProps = {
	id?: string;
	/** File (new upload) or string (existing image URL, for edit) */
	value?: File | string | null;
	onChange: (file: File | undefined) => void;
	onBlur?: () => void;
	accept?: string;
	hint?: string;
	invalid?: boolean;
	className?: string;
};

export default function ImageUploader({
	id = "image-uploader",
	value,
	onChange,
	onBlur,
	accept = "image/png,image/jpeg,image/webp",
	hint = "PNG, JPG or WEBP · max 2 MB",
	invalid = false,
	className = "",
}: ImageUploaderProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	// Build preview URL (File → object URL, string → as is)
	const previewUrl = useMemo(() => {
		if (!value) return null;
		return value instanceof File ? URL.createObjectURL(value) : value;
	}, [value]);

	// Free memory when file changes / component unmounts
	useEffect(() => {
		return () => {
			if (value instanceof File && previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [value, previewUrl]);

	const openPicker = () => inputRef.current?.click();

	const handleFile = (file?: File) => {
		if (!file) return;
		onChange(file);
	};

	const handleRemove = () => {
		onChange(undefined);
		if (inputRef.current) inputRef.current.value = ""; // allow re-selecting same file
	};

	const fileName = value instanceof File ? value.name : null;

	return (
		<div className={className}>
			<input
				ref={inputRef}
				id={id}
				type="file"
				accept={accept}
				className="sr-only"
				onBlur={onBlur}
				onChange={(e) => handleFile(e.target.files?.[0])}
			/>

			{previewUrl ? (
				/* ── Preview ── */
				<div className="relative h-44 overflow-hidden rounded-xl border border-border bg-muted">
					<img src={previewUrl} alt={fileName ?? "Selected image"} className="size-full object-cover" />

					<div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-2.5 pt-8">
						<span className="truncate text-[12.5px] font-medium text-white">{fileName}</span>
						<div className="flex shrink-0 gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={openPicker}
								className="h-9 gap-1.5 rounded-lg px-3 text-[13px] font-semibold"
							>
								<RefreshCw className="size-3.5" />
								Replace
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={handleRemove}
								className="h-9 gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-destructive hover:text-destructive"
							>
								<Trash2 className="size-3.5" />
								Remove
							</Button>
						</div>
					</div>
				</div>
			) : (
				/* ── Empty / drop zone ── */
				<label
					htmlFor={id}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={(e) => {
						e.preventDefault();
						setIsDragging(false);
						handleFile(e.dataTransfer.files?.[0]);
					}}
					className={[
						"flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors",
						isDragging ? "border-primary bg-accent" : "border-border bg-muted hover:border-primary hover:bg-accent",
						invalid ? "border-destructive" : "",
					].join(" ")}
				>
					<span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
						<ImagePlus className="size-5" />
					</span>
					<span className="text-sm font-semibold text-foreground">
						{isDragging ? "Drop the image here" : "Click or drag an image here"}
					</span>
					<span className="text-[12.5px] text-muted-foreground">{hint}</span>
				</label>
			)}
		</div>
	);
}
