import { useState } from "react";
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

interface ConfirmDialogProps {
	onConfirm: () => void;
	title?: string;
	description?: string;
	trigger: React.ReactNode;
	confirmText?: string;
	cancelText?: string;
}

export function ConfirmDialog({
	onConfirm,
	title = "Are you sure?",
	description,
	trigger,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: ConfirmDialogProps) {
	const [open, setOpen] = useState(false);

	const handleConfirm = () => {
		onConfirm();
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">{cancelText}</Button>
					</DialogClose>
					<Button onClick={handleConfirm}>{confirmText}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
