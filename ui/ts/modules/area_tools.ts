/**
 * Rectangle
 * x, y, (w)idth, and (h)eight
 */
export interface Rectangle {
	x: number,
	y: number,
	w: number,
	h: number,
}

/**
 * 2 dimentional vector
 */
export class Vector2 {
	x: number = 0;
	y: number = 0;
	/**
	 * Length of the vector
	 */
	get l(): number {
		return this.calcLength();
	}
	/**
	 * Direction of the vector in radians (arc length)
	 */
	get a(): number {
		return this.calcDirection(false);
	}
	/**
	 * Direction of the vector in degrees
	 */
	get d(): number {
		return this.calcDirection(true);
	}
	calcLength(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	calcDirection(degrees: boolean = false): number {
		let radianDirection = Math.atan2(this.x, this.y);
		if (degrees) {
			return radianDirection * 180 / Math.PI;
		}
		return radianDirection;
	}
	negative() {
		return new Vector2(-this.x, -this.y);
	}
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
