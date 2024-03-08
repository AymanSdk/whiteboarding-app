'use client';
import { useRenameModal } from '@/store/use-rename-modal';
import { useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogClose,
	DialogFooter,
	DialogTitle
} from '@/components/ui/dialog';

export const RenameModal = () => {
	const { isOpen, onClose, initialValues } = useRenameModal();

	const [title, setTitle] = useState(initialValues.title);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename board</DialogTitle>
				</DialogHeader>
				<DialogDescription>Enter a new name for the board</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};
