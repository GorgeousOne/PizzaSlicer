
class Pizza {

	constructor(cx, cy, radius) {
		this.setCenter(cx, cy);
		this.radius = radius;
		this.isDashed = false;
	}

	setCenter(cx, cy) {
		this.cx = cx;
		this.cy = cy;
	}

	display(ctx) {
		if (this.isDashed) {
			let dash = Math.PI * this.radius / 20;
			ctx.setLineDash([dash, dash]);
		}
		ctx.arc(this.cx, this.cy, this.radius, 0, 2*Math.PI);
		ctx.stroke();
	}
}