class Slice {

	constructor(pizzaMidVec, pizzaRadius, tipVec, corner1Vec, corner2Vec) {
		this.pizzaMidVec = pizzaMidVec;
		this.pizzaRadius = pizzaRadius;
		this.tipVec = tipVec;
		this.corner1Vec = corner1Vec;
		this.corner2Vec = corner2Vec;

		this.calcSize();
		this.setColor(new Color(255, 255, 255));
		this.text = Math.round(100 * this.percentage) + "%";
	}

	setColor(color) {
		this.stroke = color.clone();
		this.fill = color.clone();
		this.fill.a = 0.25;
		this.textColor = brighten(color);
	}

	getAngle() {
		let edge1 = sub(this.corner1Vec, this.tipVec);
		let edge2 = sub(this.corner2Vec, this.tipVec);
		return Math.abs(edge1.angleTo(edge2));
	}

	getPercentage() {
		return this.percentage;
	}

	calcSize() {
		let edge1 = sub(this.corner1Vec, this.tipVec);
		let edge2 = sub(this.corner2Vec, this.tipVec);
		let triangleSize = edge1.crossLength(edge2) / 2;

		//lots of interesting facts to circular segments I can't comprehend: https://de.wikipedia.org/wiki/Kreissegment
		let radius1 = sub(this.corner1Vec, this.pizzaMidVec);
		let radius2 = sub(this.corner2Vec, this.pizzaMidVec);
		let phi = radius1.angleTo(radius2);
		let circleSegmentSize = Math.pow(this.pizzaRadius, 2) * (phi - Math.sin(phi)) / 2;

		let size = triangleSize + circleSegmentSize;
		this.percentage = size / (Math.PI * Math.pow(this.pizzaRadius, 2));
	}

	display(ctx) {
		let radius1 = sub(this.corner1Vec, this.pizzaMidVec);
		let radius2 = sub(this.corner2Vec, this.pizzaMidVec);
		let phiStart = Math.atan2(radius1.y, radius1.x);
		let phiEnd = Math.atan2(radius2.y, radius2.x);

		ctx.strokeStyle = this.stroke.string();
		ctx.fillStyle = this.fill.string();
		ctx.beginPath();

		ctx.moveTo(this.corner2Vec.x, this.corner2Vec.y);
		ctx.lineTo(this.tipVec.x, this.tipVec.y);
		ctx.lineTo(this.corner1Vec.x, this.corner1Vec.y);
		ctx.arc(this.pizzaMidVec.x, this.pizzaMidVec.y, this.pizzaRadius, phiStart, phiEnd);

		ctx.stroke();
		ctx.fill();
		this.displayPercentage(ctx, phiStart, phiEnd);
	}

	displayPercentage(ctx) {
		let edge1 = sub(this.corner1Vec, this.tipVec);
		let edge2 = sub(this.corner2Vec, this.tipVec);
		let center = add(this.tipVec, add(edge1, edge2).mul(0.45));

		ctx.fillStyle = this.textColor.string();
		ctx.fillText(this.text, center.x, center.y);
	}
}

function getPercentageSum(slices) {
	let sum = 0;

	for (let slice of slices) {
		sum += slice.getPercentage();
	}
	return sum;
}