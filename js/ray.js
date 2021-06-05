
class Ray {

	constructor(circleMid, midNode, controlNode) {
		this.circleMid = circleMid;
		this.midNode = midNode;
		this.controlNode = controlNode;
	}

	display(ctx) {
		let start = new Vec2(this.controlNode.x, this.controlNode.y);
		let controlDir = sub(new Vec2(this.midNode.x, this.midNode.y), start);
		let midDir = sub(this.circleMid, start);

		let phi = controlDir.angleTo(midDir);
		let chordLength = 2 * Math.cos(phi) * midDir.length();
		let end = add(start, normal(controlDir).mul(chordLength));

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}
}