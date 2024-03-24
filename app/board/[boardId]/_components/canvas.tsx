'use client';
// * module imports *
import React, { useState, useCallback } from 'react';
import {
	useHistory,
	useCanRedo,
	useCanUndo,
	useMutation
} from '@/liveblocks.config';
import { Camera, CanvasMode, CanvasState } from '@/types/canvas';
// * components imports *
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { CursorsPresence } from './cursors-presence';

interface CanvasProps {
	boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
	const [canvasState, setCanvasState] = useState<CanvasState>({
		mode: CanvasMode.None
	});
	const [Camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

	const history = useHistory();
	const canUndo = useCanUndo();
	const canRedo = useCanRedo();

	const onWheel = useCallback((e: React.WheelEvent) => {
		setCamera((camera) => ({
			x: camera.x + e.deltaX,
			y: camera.y + e.deltaY
		}));
	}, []);

	// ! display the cursor of the user on the canvas and update it when the user moves the cursor
	const onPointerMove = useMutation(
		({ setMyPresence }, e: React.PointerEvent) => {
			e.preventDefault();

			const current = { x: 0, y: 0 };

			setMyPresence({ cursor: current });
		},
		[]
	);

	return (
		<main className='h-full w-full relative bg-neutral-100 touch-none'>
			<Info boardId={boardId} />
			<Participants />
			<Toolbar
				canvasState={canvasState}
				setCanvasState={setCanvasState}
				canRedo={canRedo}
				canUndo={canUndo}
				undo={history.undo}
				redo={history.redo}
			/>
			<svg
				className=' h-[100vh] w-[100vw]'
				onWheel={onWheel}
				onPointerMove={onPointerMove}
			>
				<g>
					<CursorsPresence />
				</g>
			</svg>
		</main>
	);
};
