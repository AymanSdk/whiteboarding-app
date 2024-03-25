'use client';
// * module imports *
import React, { useState, useCallback } from 'react';
import {
	useHistory,
	useCanRedo,
	useCanUndo,
	useMutation,
	useStorage
} from '@/liveblocks.config';
import { Camera, CanvasMode, CanvasState } from '@/types/canvas';
import { pointerEventToCanvasPoint } from '@/lib/utils';
// * components imports *
import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { CursorsPresence } from './cursors-presence';
import { root } from 'postcss';
// ! < ------------------ Main Functions ------------------ >
// * Limit the number of layers to 100 *
const MAX_LAYERS = 100;

interface CanvasProps {
	boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
	const layerIds = useStorage((root) => root.layerIds);

	const [canvasState, setCanvasState] = useState<CanvasState>({
		mode: CanvasMode.None
	});
	const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

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

			const current = pointerEventToCanvasPoint(e, camera); // TODO: checking why this didn't accept "camera" as an argument

			setMyPresence({ cursor: current });
		},
		[]
	);
	// ! make the cursor disappear when the user leaves the canvas
	const onPointerLeave = useMutation(({ setMyPresence }) => {
		setMyPresence({ cursor: null });
	}, []);

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
				onPointerLeave={onPointerLeave}
			>
				<g
					style={{
						transform: `translate(${camera.x}px, ${camera.y}px)`
					}}
				>
					<CursorsPresence />
				</g>
			</svg>
		</main>
	);
};
