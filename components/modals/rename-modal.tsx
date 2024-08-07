'use client';

// * <-------  components Imports  ------>
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogClose,
	DialogFooter,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
// * <-------  server side Imports  ------>
import { useRenameModal } from '@/store/use-rename-modal';
import { FormEventHandler, useEffect, useState } from 'react';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/convex/_generated/api';

// ? <-------  Main rename functionality   ------>
export const RenameModal = () => {
	const { mutate, pending } = useApiMutation(api.board.update);

	const { isOpen, onClose, initialValues } = useRenameModal();

	const [title, setTitle] = useState(initialValues.title);

	useEffect(() => {
		setTitle(initialValues.title);
	}, [initialValues.title]);

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		mutate({
			id: initialValues.id,
			title
		})
			.then(() => {
				toast.success('Board renamed');
				onClose();
			})
			.catch(() => {
				toast.error('Failed to rename board');
			});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename board</DialogTitle>
				</DialogHeader>
				<DialogDescription>Enter a new name for the board</DialogDescription>
				<form onSubmit={onSubmit} className='space-y-4'>
					<Input
						disabled={pending}
						required
						maxLength={60}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder='Board a title'
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button type='button' variant='outline'>
								Cancel
							</Button>
						</DialogClose>
						<Button disabled={pending} type='submit'>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
