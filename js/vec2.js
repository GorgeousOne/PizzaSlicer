class Vec2 {

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	clone() {
		return new Vec2(this.x, this.y);
	}

	normal() {
		let length = this.length();
		this.x /= length;
		this.y /= length;
		return this;
	}

	length() {
		return Math.sqrt(this.lengthSq());
	}

	lengthSq() {
		return Math.pow(this.x, 2) + Math.pow(this.y, 2);
	}

	add(other) {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	sub(other) {
		this.x -= other.x;
		this.y -= other.y;
		return this;

	}

	mul(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	dot(other) {
		return this.x * other.x + this.y * other.y;
	}

	/**
	 * Returns the size a 3D-vector would have constructed by the cross product of two 2D-vectors
	 * @param other vector to build cross product with
	 */
	crossLength(other) {
		return Math.abs(this.x * other.y - other.x * this.y);
	}

	/**
	 * Returns a clockwise positive angle to other vector between 0 and 2PI
	 * @param other vec2 to calculate angle towards
	 */
	angleTo(other) {
		let phi = Math.atan2(other.y, other.x) - Math.atan2(this.y, this.x);
		if (phi < 0) {
			phi += 2 * Math.PI;
		}
		return phi;
	}
}

function normal(v1) {
	let length = v1.length();
	return new Vec2(v1.x / length, v1.y / length);
}

function add(v1, v2) {
	return new Vec2(v1.x + v2.x, v1.y + v2.y);
}

function sub(v1, v2) {
	return new Vec2(v1.x - v2.x, v1.y - v2.y);
}

function mul(v2, scalar) {
	return new Vec2(scalar * v2.x, scalar * v2.y);
}