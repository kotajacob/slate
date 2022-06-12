import { Vector2, Rectangle } from "./area_tools";

/**
 * Each Piece represents a game piece
 */
export class Piece {
	url: string;
	position: Vector2;
	boundary: Rectangle;
	image: HTMLImageElement;

	// Add this.x and this.y which reference this.position
	get x() {
		return this.position.x;
	}
	set x(x: number) {
		this.position.x = x;
	}
	get y() {
		return this.position.y;
	}
	set y(y: number) {
		this.position.y = y;
	}

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
		this.image = new Image();
		this.image.src = this.url;
	}
}

/**
 * Each Stack represents a stack of pieces, i.e. a deck of cards
 * To add or remove pieces from contents, use addChild and removeChild
 */
export class Stack {
	contents: (Piece|Stack)[];
	position: Vector2 = new Vector2(0, 0);
	boundary: Rectangle = {x: 0, y: 0, w: 0, h: 0};
	image: HTMLImageElement = new Image();

	// Pass url through to first contents child
	get url(): string {
		if (this.contents[0]) {
			return this.contents[0].url;
		}
		return "";
	}
	set url(url: string) {
		if (this.contents[0]) {
			this.contents[0].url = url;
		}
	}

	// Add this.x and this.y which reference this.position
	get x() {
		return this.position.x;
	}
	set x(x: number) {
		this.position.x = x;
	}
	get y() {
		return this.position.y;
	}
	set y(y: number) {
		this.position.y = y;
	}

	// Add methods for adding and removing children while updating parameters
	addChild(child: (Piece|Stack), append: boolean = false) {
		if (append) {
			this.contents.push(child);
			return;
		}
		this.contents.unshift(child);
		this.#syncProperties();
	}
	removeChild(index: number) {
		this.contents.slice(index, 1);
		if (index === 0) {
			this.#syncProperties();
		}
	}

	// Add a private method for synchronizing the relevant properties with
	// the first contents child's
	#syncProperties() {
		if (this.contents.length > 0) {
			this.position = this.contents[0].position;
			this.boundary = this.contents[0].boundary;
			this.image    = this.contents[0].image;
		} else {
			this.position = new Vector2(0, 0);
			this.boundary = {x: 0, y: 0, w: 0, h: 0};
			this.image    = new Image();
		}
	}

	constructor(contents: (Piece|Stack)[]) {
		this.contents = contents;
		this.#syncProperties();
	}
}

