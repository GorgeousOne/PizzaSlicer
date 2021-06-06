class Slice {

	constructor(pizzaMidVec, pizzaRadius, tipVec, corner1Vec, corner2Vec) {
		this.pizzaMidVec = pizzaMidVec;
		this.pizzaRadius = pizzaRadius;
		this.tipVec = tipVec;
		this.corner1Vec = corner1Vec;
		this.corner2Vec = corner2Vec;

		this.stroke = Color.rnd();
		this.fill = this.stroke.clone();
		this.fill.a = 0.5;
	}

	getAngle() {
		let edge1 = sub(this.corner1Vec, this.tipVec);
		let edge2 = sub(this.corner2Vec, this.tipVec);
		return Math.abs(edge1.angleTo(edge2));
	}

	getSize() {
		let edge1 = sub(this.corner1Vec, this.tipVec);
		let edge2 = sub(this.corner2Vec, this.tipVec);

		//lots of interesting facts to circular segments I can't comprehend: https://de.wikipedia.org/wiki/Kreissegment
		let triangleSize = edge1.crossLength(edge2) / 2;
		let phi = Math.abs(edge1.angleTo(edge2));
		let circleSegmentSize = Math.pow(this.pizzaRadius, 2) * (phi - Math.sin(phi)) / 2;
		return triangleSize + circleSegmentSize;
	}

	display(ctx) {
		let edge1 = sub(this.corner1Vec, this.pizzaMidVec);
		let edge2 = sub(this.corner2Vec, this.pizzaMidVec);

		let phiStart = Math.atan2(edge1.y, edge1.x);
		let phiEnd = Math.atan2(edge2.y, edge2.x);

		ctx.strokeStyle = this.stroke.string();
		ctx.fillStyle = this.fill.string();
		ctx.beginPath();

		ctx.moveTo(this.corner2Vec.x, this.corner2Vec.y);
		ctx.lineTo(this.tipVec.x, this.tipVec.y);
		ctx.lineTo(this.corner1Vec.x, this.corner1Vec.y);
		ctx.arc(this.pizzaMidVec.x, this.pizzaMidVec.y, this.pizzaRadius, phiStart, phiEnd);

		ctx.stroke();
		ctx.fill();
		this.displayPercentage(ctx, edge1, edge2);
	}

	displayPercentage(ctx, edge1, edge2) {
		let percentage = this.getSize() / (Math.PI * Math.pow(this.pizzaRadius, 2));
		percentage = Math.round(100 * percentage);

		let center = add(this.tipVec, add(edge1, edge2).mul(0.45));
		ctx.fillStyle = this.stroke.string();
		console.log(this.stroke.a, this.stroke.string());
		ctx.fillText(percentage + "%", center.x, center.y);
	}
}