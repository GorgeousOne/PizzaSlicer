class Vec2 {

	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	clone() {
		return new Vec2(this.x, this.y);
	}

	normalize() {
		let l = this.length();
		this.x = this.x / l;
		this.y = this.y / l;
		return this;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	add(v1, v2) {
		return new Vec2(v1.x + v2.x, v1.y + v2.y);
	}

	mul(scalar, v2) {
		return new Vec2(scalar * v2.x, scalar * v2.y);
	}

	sub(v1, v2) {
		return new Vec2(v1.x - v2.x, v1.y - v2.y);
	}

	dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	}
}