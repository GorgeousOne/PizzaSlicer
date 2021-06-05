
class PizzaTool {

	constructor(x, y, radius) {
		this.radius = radius;
		this.color = new Color(0, 255, 255);

		this.centerNode = new DragNode(x, y);
		this.satellite = new OrbitNode(this.centerNode, this.radius);

		dragHandler.registerNode(this.centerNode);
		dragHandler.registerNode(this.satellite);
	}

	setBounds(minX, minY, maxX, maxY) {
		this.centerNode.setBounds(minX, minY, maxX, maxY);
		this.satellite.setBounds(minX, minY, maxX, maxY);
		return this;
	}

	update() {
		this.radius = this.satellite.getRadius();
		this.centerNode.boundSpacing = this.radius + this.satellite.size/2;
		this.satellite.maxRadius = this.centerNode.getMinBoundDistance() - this.satellite.size/2;
	}

	display(ctx) {
		this.update();

		ctx.beginPath();
		ctx.strokeStyle = this.color.string();
		ctx.arc(this.centerNode.x, this.centerNode.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

class OrbitNode extends DragNode {

	constructor(centerNode, radius) {
		super(centerNode.x, centerNode.y + radius);
		this.centerNode = centerNode;
		this.orbitX = this.x - this.centerNode.x;
		this.orbitY = this.y - this.centerNode.y;

		this.minRadius = 1.5 * this.size;
		this.maxRadius = 10000;
	}

	move(mouseX, mouseY) {
		super.move(mouseX, mouseY);
		this.orbitX = this.x - this.centerNode.x;
		this.orbitY = this.y - this.centerNode.y;
	}

	update() {
		this.checkRadius();
		this.x = this.centerNode.x + this.orbitX;
		this.y = this.centerNode.y + this.orbitY;
	}

	checkRadius() {
		let radius = this.getRadius();
		if (this.minRadius && radius < this.minRadius) {
			this.scaleRadius(this.minRadius / radius);
		}else if (this.maxRadius && radius > this.maxRadius) {
			this.scaleRadius(this.maxRadius / radius);
		}
	}

	scaleRadius(factor) {
		this.orbitX *= factor;
		this.orbitY *= factor;
	}

	getRadius() {
		return Math.sqrt(Math.pow(this.orbitX, 2) + Math.pow(this.orbitY, 2));
	}

	display(ctx) {
		this.update();
		super.display(ctx);
	}
}
