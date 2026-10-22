import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export type TOption = { value: string; label: string };

type SearchableSelectProps = {
	id?: string;
	options: TOption[];
	/** controlled value (optional) — if not given, component keeps its own state */
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	invalid?: boolean;
	disabled?: boolean;
	className?: string;
};

export default function SearchableSelect({
	id,
	options,
	value,
	onChange,
	placeholder = "Select an option",
	searchPlaceholder = "Search…",
	emptyText = "No results found.",
	invalid = false,
	disabled = false,
	className,
}: SearchableSelectProps) {
	const [open, setOpen] = useState(false);
	const [innerValue, setInnerValue] = useState("");

	const selectedValue = value ?? innerValue;
	const selected = options.find((option) => option.value === selectedValue);

	const handleSelect = (newValue: string) => {
		const next = newValue === selectedValue ? "" : newValue; // click again → clear
		if (value === undefined) setInnerValue(next);
		onChange?.(next);
		setOpen(false);
	};

	return (
		// modal → lets the list scroll when used inside a Dialog
		<Popover open={open} onOpenChange={setOpen} modal>
			<PopoverTrigger asChild>
				<Button
					id={id}
					type="button"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-invalid={invalid}
					disabled={disabled}
					className={cn(
						"h-11 w-full justify-between rounded-lg px-3.5 text-[15px] font-normal",
						!selected && "text-muted-foreground",
						className,
					)}
				>
					<span className="truncate">{selected ? selected.label : placeholder}</span>
					<ChevronsUpDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
				<Command>
					<CommandInput placeholder={searchPlaceholder} className="h-10" />
					<CommandList className="max-h-64">
						<CommandEmpty>{emptyText}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.label} // search matches the label
									onSelect={() => handleSelect(option.value)}
									className="py-2"
								>
									<span className="flex-1 truncate">{option.label}</span>
									<Check
										className={cn("size-4 text-primary", selectedValue === option.value ? "opacity-100" : "opacity-0")}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
