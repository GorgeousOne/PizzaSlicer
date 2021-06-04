
class DragNode {

	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}

	contains(x, y) {
		let dx = x - this.x;
		let dy = y - this.y;
		return dx*dx + dy*dy < this.radius*this.radius;
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}

	display(ctx) {
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fill();
	}
}