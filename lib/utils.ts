import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import React from 'react';
import { Camera } from '@/types/canvas';
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
// ! Function to convert connectionId to color
export function connectionIdToColor(connectionId: number): string {
	return COLORS[connectionId % COLORS.length];
}
// ! Function to convert pointer event to canvas point
export function pointerEventToCanvasPoint(
	e: React.PointerEvent,
	camera: Camera
) {
	return {
		x: Math.round(e.clientX) - camera.x,
		y: Math.round(e.clientY) - camera.y
	};
}
