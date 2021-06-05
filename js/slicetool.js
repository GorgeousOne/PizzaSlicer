
class SliceTool {

	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = new Color(0, 255, 255);

		this.midNode = new OrbitNode(this.x, this.y, 0, 0);
		this.midNode.maxRadius = this.radius - this.midNode.size;
		dragHandler.registerNode(this.midNode);

		this.controlNodes = [];
		this.rays = [];
		let slicerCount = 3;
		
		for (let i = 0; i < slicerCount; ++i) {
			let controlNode = new OrbitNode(this.x, this.y, this.radius, this.radius, this.radius);
			controlNode.setAngle(i/slicerCount * 2*Math.PI);

			let ray = new Ray(new Vec2(this.x, this.y), this.midNode, controlNode);

			this.controlNodes.push(controlNode);
			this.rays.push(ray);
			dragHandler.registerNode(controlNode);
		}
	}

	update() {

	}

	display(ctx) {
		this.update();

		ctx.beginPath();
		ctx.strokeStyle = this.color.string();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();

		for (let ray of this.rays) {
			ray.display(ctx);
		}
	}
}

