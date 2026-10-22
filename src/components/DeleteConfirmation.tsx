import { Trash2Icon } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ReactNode } from "react";

interface IProps {
	children: ReactNode;
	onConfirm: () => void;
	/** Name of the item, e.g. "Sylhet" → title becomes: Delete “Sylhet”? */
	itemName?: string;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
}

export function DeleteConfirmation({
	children,
	onConfirm,
	itemName,
	title,
	description = "This action can't be undone. It will be permanently deleted.",
	confirmText = "Delete",
	cancelText = "Cancel",
}: IProps) {
	const dialogTitle = title ?? (itemName ? `Delete “${itemName}”?` : "Are you sure?");

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
						<Trash2Icon />
					</AlertDialogMedia>
					<AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel variant="outline">{cancelText}</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={onConfirm}>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
