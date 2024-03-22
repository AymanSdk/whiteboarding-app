import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// * Array of colors for user border colors
const COLORS = [
	'#Dc2626',
	'#D97706',
	'#059669',
	'#2563eb',
	'#7c3aed',
	'#f43f5e',
	'#f59e0b',
	'#10b981',
	'#3b82f6',
	'#9333ea',
	'#ec4899',
	'#f87171',
	'#fbbf24',
	'#34d399',
	'#60a5fa',
	'#818cf8',
	'#a5b4fc'
];

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number): string {
	return COLORS[connectionId % COLORS.length];
}
