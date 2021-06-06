class Color {

	constructor(r = 0, g = 0, b = 0, a = 1.0) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	clone() {
		return new Color(this.r, this.g, this.b, this.a);
	}

	string() {
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}

	static rnd() {
		return new Color(
			rndInt(64, 196),
			rndInt(64, 196),
			rndInt(64, 196)
		)
	}
}

function rndInt(min, max) {
	return min + Math.floor(Math.random() * (max - min));
}
