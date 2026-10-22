import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type MultiImageUploaderProps = {
	id?: string;
	value?: File[];
	onChange: (files: File[]) => void;
	onBlur?: () => void;
	maxFiles?: number;
	accept?: string;
	hint?: string;
	invalid?: boolean;
};

export default function MultiImageUploader({
	id = "multi-image-uploader",
	value = [],
	onChange,
	onBlur,
	maxFiles = 10,
	accept = "image/png,image/jpeg,image/webp",
	hint = "PNG, JPG or WEBP · max 2 MB each",
	invalid = false,
}: MultiImageUploaderProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	// File → preview URL
	const previews = useMemo(() => value.map((file) => URL.createObjectURL(file)), [value]);

	// free memory
	useEffect(() => {
		return () => previews.forEach((url) => URL.revokeObjectURL(url));
	}, [previews]);

	const addFiles = (fileList?: FileList | null) => {
		if (!fileList?.length) return;
		const next = [...value, ...Array.from(fileList)].slice(0, maxFiles);
		onChange(next);
		if (inputRef.current) inputRef.current.value = ""; // allow re-selecting same file
	};

	const removeFile = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};

	const isFull = value.length >= maxFiles;

	return (
		<div className="flex flex-col gap-3">
			<input
				ref={inputRef}
				id={id}
				type="file"
				accept={accept}
				multiple
				className="sr-only"
				onBlur={onBlur}
				disabled={isFull}
				onChange={(e) => addFiles(e.target.files)}
			/>

			<label
				htmlFor={id}
				onDragOver={(e) => {
					e.preventDefault();
					if (!isFull) setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={(e) => {
					e.preventDefault();
					setIsDragging(false);
					if (!isFull) addFiles(e.dataTransfer.files);
				}}
				className={[
					"flex h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors",
					isFull
						? "cursor-not-allowed border-border bg-muted opacity-60"
						: isDragging
							? "cursor-pointer border-primary bg-accent"
							: "cursor-pointer border-border bg-muted hover:border-primary hover:bg-accent",
					invalid ? "border-destructive" : "",
				].join(" ")}
			>
				<span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
					<ImagePlus className="size-5" />
				</span>
				<span className="text-sm font-semibold text-foreground">
					{isFull ? `Maximum ${maxFiles} images` : isDragging ? "Drop images here" : "Click or drag images here"}
				</span>
				<span className="text-[12.5px] text-muted-foreground">
					{hint} · {value.length}/{maxFiles}
				</span>
			</label>

			{value.length > 0 && (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{value.map((file, i) => (
						<div
							key={`${file.name}-${file.lastModified}-${i}`}
							className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-accent"
						>
							<img src={previews[i]} alt={file.name} className="size-full object-cover" />
							{i === 0 && (
								<span className="absolute top-2 left-2 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
									Cover
								</span>
							)}
							<button
								type="button"
								onClick={() => removeFile(i)}
								aria-label={`Remove ${file.name}`}
								className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
							>
								<X className="size-3.5" />
							</button>
							<span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/60 to-transparent px-2 pt-4 pb-1.5 text-[11.5px] text-white">
								{file.name}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
