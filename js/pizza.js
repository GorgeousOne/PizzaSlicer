
class Pizza {

	constructor(x, y, radius) {
		this.centerNode = new DragNode(x, y);

		this.radius = radius;
		this.isDashed = false;
	}

	display(ctx) {
		if (this.isDashed) {
			let dash = Math.PI * this.radius / 20;
			ctx.setLineDash([dash, dash]);
		}
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.stroke();
	}
}