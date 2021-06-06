
class OrbitNode extends DragNode {

	constructor(x, y, radius, minRadius = 0, maxRadius = 10000) {
		super(x, y + radius);
		this.centerX = x;
		this.centerY = y;
		this.orbitX = this.centerX - this.x;
		this.orbitY = this.centerY - this.y;

		this.minRadius = minRadius;
		this.maxRadius = maxRadius;
	}

	move(mouseX, mouseY) {
		super.move(mouseX, mouseY);
		this.orbitX = this.x - this.centerX;
		this.orbitY = this.y - this.centerY;
		this.checkRadius();
	}

	setCenter(x, y) {
		this.centerX = x;
		this.centerY = y;
		this.updatePos();
		this.checkRadius();
	}

	setAngle(phi) {
		let radius = this.getRadius();
		this.orbitX = radius * Math.cos(phi);
		this.orbitY = radius * Math.sin(phi);
		this.updatePos();
	}

	updatePos() {
		this.x = this.centerX + this.orbitX;
		this.y = this.centerY + this.orbitY;
	}

	checkRadius() {
		let radius = this.getRadius();
		if (radius < this.minRadius) {
			this.scaleRadius(this.minRadius / radius);
		}else if (radius > this.maxRadius) {
			this.scaleRadius(this.maxRadius / radius);
		}
	}

	scaleRadius(factor) {
		this.orbitX *= factor;
		this.orbitY *= factor;
		this.x = this.centerX + this.orbitX;
		this.y = this.centerY + this.orbitY;
	}

	getRadius() {
		return Math.sqrt(Math.pow(this.orbitX, 2) + Math.pow(this.orbitY, 2));
	}
}
