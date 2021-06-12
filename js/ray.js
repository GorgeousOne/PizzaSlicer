
class Ray {

	constructor(circleMidVec, midNode, controlNode) {
		this.circleMid = circleMidVec;
		this.midNode = midNode;
		this.controlNode = controlNode;
	}

	getStart() {
		return new Vec2(this.controlNode.x, this.controlNode.y);
	}

	getDir(start = this.getStart()) {
		return sub(new Vec2(this.midNode.x, this.midNode.y), start);
	}

	getEnd(start = this.getStart()) {
		let controlDir = this.getDir(start);
		let midDir = sub(this.circleMid, start);

		let phi = controlDir.angleTo(midDir);
		let chordLength = 2 * Math.cos(phi) * midDir.length();
		return add(start, normal(controlDir).mul(chordLength));
	}

	getAngle() {
		let dir = this.getDir();
		return Math.atan2(dir.y, dir.x);
	}

	display(ctx) {
		let start = this.getStart();
		let end = this.getEnd(start);

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}
}