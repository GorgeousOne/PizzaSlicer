
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
		let slicerCount = 6;
		
		for (let i = 0; i < slicerCount; ++i) {
			let slicer = new OrbitNode(this.x, this.y, this.radius, this.radius, this.radius);
			slicer.setAngle(i/slicerCount * 2*Math.PI);

			this.slicers.push(slicer);
			dragHandler.registerNode(slicer);
		}
		console.log(this.slicers.length);
	}

	update() {

	}

	display(ctx) {
		this.update();

		ctx.beginPath();
		ctx.strokeStyle = this.color.string();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

