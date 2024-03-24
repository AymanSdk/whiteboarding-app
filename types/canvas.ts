// * Type definitions for the canvas reusable component *
export type Color = {
	r: number;
	g: number;
	b: number;
};

export type Camera = {
	x: number;
	y: number;
};

export enum LayerType {
	Rectangle,
	Ellipse,
	Path,
	Text,
	Note
}
// ? Layer types for the canvas component are defined here as interfaces and enums
// * RectangleLayer: A rectangle layer
export type RectangleLayer = {
	type: LayerType.Rectangle;
	x: number;
	y: number;
	height: number;
	width: number;
	fill: Color;
	value?: string;
};
// * EllipseLayer: An ellipse layer
export type EllipseLayer = {
	type: LayerType.Ellipse;
	x: number;
	y: number;
	height: number;
	width: number;
	fill: Color;
	value?: string;
};
// * PathLayer: A path layer
export type PathLayer = {
	type: LayerType.Path;
	x: number;
	y: number;
	height: number;
	width: number;
	fill: Color;
	points: number[][]; // ! Array of points
	value?: string;
};
// * TextLayer: A text layer
export type TextLayer = {
	type: LayerType.Text;
	x: number;
	y: number;
	height: number;
	width: number;
	fill: Color;
	value?: string;
};
// * NoteLayer: A note layer
export type NoteLayer = {
	type: LayerType.Text;
	x: number;
	y: number;
	height: number;
	width: number;
	fill: Color;
	value?: string;
};
// * Point: A point in the canvas grid (x, y)
export type Point = {
	x: number;
	y: number;
};
// * XYWH: for rezising and inserting layers
export type XYWH = {
	x: number;
	y: number;
	width: number;
	height: number;
};
// * resize: the current side of the layer being resized
export enum Side {
	Top = 1,
	Bottom = 2,
	Left = 4,
	Right = 8
}

// * state: the Current mode of the canvas: <<- selection, translation, insertion, resizing, pencil ->>
export type CanvasState =
	| {
			mode: CanvasMode.None;
	  }
	| {
			mode: CanvasMode.SelectionNet;
			origin: Point;
			current?: Point;
	  }
	| {
			mode: CanvasMode.Translating;
			current: Point;
	  }
	| {
			mode: CanvasMode.Inserting;
			layerType:
				| LayerType.Ellipse
				| LayerType.Rectangle
				| LayerType.Text
				| LayerType.Note;
	  }
	| {
			mode: CanvasMode.Pencil;
	  }
	| {
			mode: CanvasMode.Pressing;
			origin: Point;
	  }
	| {
			mode: CanvasMode.Resizing;
			initialBounds: XYWH;
			corner: Side;
	  };

export enum CanvasMode {
	None,
	Pressing,
	SelectionNet,
	Translating,
	Inserting,
	Resizing,
	Pencil
}
