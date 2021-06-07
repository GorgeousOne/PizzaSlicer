
class SliceTool {

	constructor(pizzaMidVec, radius) {
		this.mid = pizzaMidVec.clone();
		this.radius = radius;
		this.color = new Color(0, 255, 255);

		this.midNode = new OrbitNode(this.mid.x, this.mid.y, 0, 0);
		this.midNode.maxRadius = this.radius - this.midNode.size;
		dragHandler.registerNode(this.midNode);

		this.controlNodes = [];
		this.rays = [];
		let rayCount = 4;
		let phi = 1/rayCount * 2*Math.PI;

		for (let i = 0; i < rayCount; ++i) {
			let controlNode = new OrbitNode(this.mid.x, this.mid.y, this.radius, this.radius, this.radius);
			let angle = i * phi;

			if (rayCount % 2 === 0 && i >= rayCount/2) {
				angle -= Math.PI - phi/2;
			}
			controlNode.setAngle(angle);

			let ray = new Ray(this.mid.clone(), this.midNode, controlNode);

			this.controlNodes.push(controlNode);
			this.rays.push(ray);
			dragHandler.registerNode(controlNode);
		}
	}

	unregister() {
		dragHandler.unregisterNode(this.midNode);
		for (let node of this.controlNodes) {
			dragHandler.unregisterNode(node);
		}
	}

	getIntersection() {
		return new Vec2(this.midNode.x, this.midNode.y);
	}

	getRays() {
		return this.rays;
	}

	// update() {}

	display(ctx) {
		// this.update();

		ctx.beginPath();
		ctx.strokeStyle = this.color.string();
		ctx.arc(this.mid.x, this.mid.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();

		for (let ray of this.rays) {
			ray.display(ctx);
		}
	}
}

