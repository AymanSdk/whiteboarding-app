'use client';

//? * module imports *

import {
	useHistory,
	useCanRedo,
	useCanUndo,
	useMutation,
	useStorage
} from '@/liveblocks.config';

import {
	Camera,
	CanvasMode,
	CanvasState,
	Color,
	LayerType,
	Point
} from '@/types/canvas';

import { nanoid } from 'nanoid';
import { pointerEventToCanvasPoint } from '@/lib/utils';
import React, { useState, useCallback } from 'react';
import { LiveObject } from '@liveblocks/client';

//? * components imports *

import { Info } from './info';
import { Participants } from './participants';
import { Toolbar } from './toolbar';
import { CursorsPresence } from './cursors-presence';

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
	const [lastUsedColor, setLastUsedColor] = useState<Color>({
		r: 0,
		g: 0,
		b: 0
	});

	const history = useHistory();
	const canUndo = useCanUndo();
	const canRedo = useCanRedo();

	const insertLayer = useMutation(
		(
			{ storage, setMyPresence },
			layerType:
				| LayerType.Ellipse
				| LayerType.Rectangle
				| LayerType.Text
				| LayerType.Note,
			position: Point
		) => {
			const liveLayers = storage.get('layers');
			if (liveLayers.size >= MAX_LAYERS) {
				return;
			}

			const liveLayerIds = storage.get('layerIds');
			const layerId = nanoid();
			const layer = new LiveObject({
				type: layerType,
				x: position.x,
				y: position.y,
				height: 100,
				width: 100,
				fill: lastUsedColor
			});

			liveLayerIds.push(layerId);
			liveLayers.set(layerId, layer); // TODO: checking why this didn't accept "layerId" as an argument

			setMyPresence({ selection: [layerId] }, { addToHistory: true });
			setCanvasState({ mode: CanvasMode.None });
		},
		[lastUsedColor]
	);

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

	const onPointerUp = useMutation(
		({}, e) => {
			const point = pointerEventToCanvasPoint(e, camera);

			if (canvasState.mode === CanvasMode.Inserting) {
				insertLayer(canvasState.layerType, point);
			} else {
				setCanvasState({ mode: CanvasMode.None });
			}

			history.resume();
		},
		[camera, canvasState, history, insertLayer]
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
				onPointerLeave={onPointerLeave}
				onPointerUp={onPointerUp}
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
