
class CircleTool {

	constructor(x, y, radius) {
		this.radius = radius;
		this.color = new Color(0, 255, 255);

		this.centerNode = new DragNode(x, y);
		this.satellite = new OrbitNode(x, y, this.radius);
		this.satellite.minRadius = this.satellite.size * 1.5;

		dragHandler.registerNode(this.centerNode);
		dragHandler.registerNode(this.satellite);
	}

	unregister() {
		dragHandler.unregisterNode(this.centerNode);
		dragHandler.unregisterNode(this.satellite);
	}

	getMid() {
		return new Vec2(this.centerNode.x, this.centerNode.y);
	}

	getRadius() {
		return this.radius;
	}

	setBounds(minX, minY, maxX, maxY) {
		this.centerNode.setBounds(minX, minY, maxX, maxY);
		this.satellite.setBounds(minX, minY, maxX, maxY);
		return this;
	}

	update() {
		this.satellite.setCenter(this.centerNode.x, this.centerNode.y);
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
