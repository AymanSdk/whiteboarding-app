'use client';

import { Hint } from '@/components/hint';
import Link from 'next/link';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface InfoProps {
	boardId: string;
}

const font = Poppins({
	subsets: ['latin'],
	weight: ['600']
});

export const Info = ({ boardId }: InfoProps) => {
	const data = useQuery(api.board.get, {
		id: boardId as Id<'boards'>
	});

	if (!data) return <InfoSkeleton />;

	return (
		<div className=' absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md'>
			<Button asChild variant='board' className='px-2'>
				<Link href='/'>
					<Image src='/logo.svg' alt='Logo' height={40} width={40} />
					<span
						className={cn(
							'font-semibold text-xl ml-2 text-black',
							font.className
						)}
					>
						Sketflow
					</span>
				</Link>
			</Button>
		</div>
	);
};

export const InfoSkeleton = () => {
	return (
		<div className=' absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]' />
	);
};
