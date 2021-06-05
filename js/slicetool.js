
class SliceTool {

	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = new Color(0, 255, 255);

		this.intersectionNode = new OrbitNode(this.x, this.y, 0, 0);
		this.intersectionNode.maxRadius = this.radius - this.intersectionNode.size;
		dragHandler.registerNode(this.intersectionNode);

		this.slicers = [];
		this.rays = [];
		let slicerCount = 6;
		
		for (let i = 0; i < slicerCount; ++i) {
			let slicerNode = new OrbitNode(this.x, this.y, this.radius, this.radius, this.radius);
			slicerNode.setAngle(i/slicerCount * 2*Math.PI);

			let ray = new Ray(this.intersectionNode, slicerNode);

			this.slicers.push(slicerNode);
			this.rays.push(ray);
			dragHandler.registerNode(slicerNode);
		}

		console.log(this.rays.length);
	}

	update() {

	}

	display(ctx) {
		console.log("log");
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

