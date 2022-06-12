import { Vector2, Rectangle } from "./area_tools";

export class Piece {
	url: string;
	position: Vector2;
	boundary: Rectangle;
	constructor(
		url: string,
		x: number = 0,
		y: number = 0,
		xBoundary: number,
		yBoundary: number,
		wBoundary: number,
		hBoundary: number,
	) {
		this.url = url;
		this.position = new Vector2(x, y);
		this.boundary = {
			x: xBoundary,
			y: yBoundary,
			w: wBoundary,
			h: hBoundary,
		}
	}
}
