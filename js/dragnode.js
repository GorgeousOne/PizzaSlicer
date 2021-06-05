const nodeSize = 25;

class DragNode {

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.radius = nodeSize;

		this.isDragged = false;
		//drag point offset from node location
		this.dx = 0;
		this.dy = 0;

		this.minX = 0;
		this.minY = 0;
		this.maxX = 500;
		this.maxY = 500;
		this.color = new Color(0, 255, 255);
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
		return dx * dx + dy * dy < this.radius * this.radius;
	}

	startDrag(mouseX, mouseY) {
		this.isDragged = true;
		this.dx = this.x - mouseX;
		this.dy = this.y - mouseY;
		this.color.a = 0.5;
	}

	stopDrag() {
		this.isDragged = false;
		this.color.a = 1;
	}

	move(mouseX, mouseY) {
		this.x = clamp(mouseX + this.dx, this.minX, this.maxX);
		this.y = clamp(mouseY + this.dy, this.minY, this.maxY);
	}

	display(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color.string();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function clamp(num, min, max) {
	return Math.max(min, Math.min(max, num));
}