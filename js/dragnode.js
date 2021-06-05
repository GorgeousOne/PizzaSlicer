
class DragNode {

	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;

		this.isDragged = false;
		//drag point offset from node location
		this.dx = 0;
		this.dy = 0;

		this.minX = 0;
		this.minY = 0;
		this.maxX = 500;
		this.maxY = 500;
	}

	setBounds(minX, minY, maxX, maxY) {
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
		return this;
	}

	contains(x, y) {
		let dx = x - this.x;
		let dy = y - this.y;
		return dx*dx + dy*dy < this.radius*this.radius;
	}

	startDrag(mouseX, mouseY) {
		this.isDragged = false;
		this.dx = mouseX - this.x;
		this.dy = mouseY - this.y;
		console.log(this.dx, this.dy);
	}

	stopDrag() {
		this.isDragged = false;
	}

	move(mouseX, mouseY) {
		this.x = clamp(mouseX + this.dx, this.minX, this.maxX);
		this.y = clamp(mouseY + this.dy, this.minY, this.maxY);
	}

	display(ctx) {
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fill();
	}
}

function clamp(num, min, max) {
	return Math.max(min, Math.min(max, num));
}