import { Vector2, Rectangle } from "./area_tools";

/**
 * Each Piece represents a game piece
 */
export class Piece {
	url: string;
	position: Vector2;
	w: number;
	h: number;
	boundary: Rectangle;
	boundaryPath: Path2D;
	image: HTMLImageElement;

	#imageIsLoaded: Promise<unknown> = Promise.resolve();
	#wIsSet = Promise.resolve();
	#hIsSet = Promise.resolve();
	#boundaryWIsSet = Promise.resolve();
	#boundaryHIsSet = Promise.resolve();

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

	async boundaryPathGenerate() {
		this.boundaryPath = new Path2D();
		await this.#boundaryWIsSet;
		await this.#boundaryHIsSet;
		this.boundaryPath.rect(
			this.x + this.boundary.x,
			this.y + this.boundary.y,
			this.boundary.w,
			this.boundary.h,
		);
	}

	// Default values for h, w, and boundary
	async #wSetDefault() {
		await this.#imageIsLoaded;
		this.w = this.image.naturalWidth;
		return;
	}
	async #hSetDefault() {
		await this.#imageIsLoaded;
		this.h = this.image.naturalHeight;
		return;
	}
	async #boundaryWSetDefault() {
		await this.#wIsSet;
		this.boundary.w = this.w
		return;
	}
	async #boundaryHSetDefault() {
		await this.#hIsSet;
		this.boundary.h = this.h
		return;
	}

	/**
	 * Create a piece
	 * Unset or 0 (w)idth and (h)eight will use the image defaults
	 * Unset or 0 boundaries will default to 0, 0, (w)idth, (h)eight
	 */
	constructor(
		url: string,
		x: number = 0,
		y: number = 0,
		w: number = 0,
		h: number = 0,
		xBoundary: number = 0,
		yBoundary: number = 0,
		wBoundary: number = w,
		hBoundary: number = h,
	) {
		this.url = url;
		this.image = new Image();
		this.image.src = this.url;
		let image = this.image;
		this.#imageIsLoaded = new Promise(function (resolve) {
			image.onload = resolve;
		});
		this.position = new Vector2(x, y);
		this.w = w;
		this.h = h;
		this.boundary = {
			x: xBoundary,
			y: yBoundary,
			w: wBoundary,
			h: hBoundary,
		}
		this.boundaryPath = new Path2D();
		if (this.w === 0) {
			this.#wIsSet = this.#wSetDefault();
		}
		if (this.h === 0) {
			this.#hIsSet = this.#hSetDefault();
		}
		if (this.boundary.w === 0) {
			this.#boundaryWIsSet = this.#boundaryWSetDefault();
		}
		if (this.boundary.h === 0) {
			this.#boundaryHIsSet = this.#boundaryHSetDefault();
		}
		this.boundaryPathGenerate();
	}
}

/**
 * Each Stack represents a stack of pieces, i.e. a deck of cards
 * To add or remove pieces from contents, use addChild and removeChild
 */
export class Stack {
	contents: (Piece|Stack)[];
	position = new Vector2(0, 0);
	boundary: Rectangle = {x: 0, y: 0, w: 0, h: 0};
	boundaryPath = new Path2D();
	image = new Image();

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

	// Pass (w)idth and (h)eight through to first contents child
	get w(): number {
		if (this.contents[0]) {
			return this.contents[0].w;
		}
		return 0;
	}
	set w(w: number) {
		if (this.contents[0]) {
			this.contents[0].w = w;
		}
	}
	get h(): number {
		if (this.contents[0]) {
			return this.contents[0].h;
		}
		return 0;
	}
	set h(h: number) {
		if (this.contents[0]) {
			this.contents[0].h = h;
		}
	}

	async boundaryPathGenerate() {
		if (this.contents[0]) {
			await this.contents[0].boundaryPathGenerate();
			this.boundaryPath = this.contents[0].boundaryPath;
		} else {
			this.boundaryPath = new Path2D();
		}
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
			this.boundaryPath = this.contents[0].boundaryPath;
			this.image = this.contents[0].image;
		} else {
			this.position = new Vector2(0, 0);
			this.boundary = {x: 0, y: 0, w: 0, h: 0};
			this.boundaryPath = new Path2D();
			this.image = new Image();
		}
	}

	constructor(contents: (Piece|Stack)[]) {
		this.contents = contents;
		this.#syncProperties();
	}
}

