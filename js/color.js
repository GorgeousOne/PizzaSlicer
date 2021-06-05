class Color {

	constructor(r = 0, g = 0, b = 0, a = 1.0) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	string() {
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}
}