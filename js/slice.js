class Slice {

	constructor(pizzaMidVec, pizzaRadius, tipVec, corner1Vec, corner2Vec) {
		this.pizzaMidVec = pizzaMidVec;
		this.pizzaRadius = pizzaRadius;
		this.tipVec = tipVec;
		this.corner1Vec = corner1Vec;
		this.corner2Vec = corner2Vec;
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
}