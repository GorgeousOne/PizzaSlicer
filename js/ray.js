
class Ray {

	constructor(centerNode, orbitNode) {
		this.start = orbitNode;
		this.dir = centerNode;
	}

	display(ctx) {
		let startX = this.start.x;
		let startY = this.start.y;
		let dirX = this.dir.x - startX;
		let dirY = this.dir.y - startY;

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(startX + dirX, startY + dirY);
		ctx.stroke();
	}
}