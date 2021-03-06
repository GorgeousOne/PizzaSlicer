
class SliceTool {

	constructor(pizzaMidVec, radius) {
		this.mid = pizzaMidVec.clone();
		this.radius = radius;
		this.color = new Color(0, 255, 255);

		this.midNode = new OrbitNode(this.mid.x, this.mid.y, 0, 0);
		this.midNode.maxRadius = this.radius - this.midNode.size;
		dragHandler.registerNode(this.midNode);

		this.controlNodes = [];
		this.rayCount = 3;
		this._creatRays();
		this._createCounter();
	}

	unregister() {
		dragHandler.unregisterNode(this.midNode);
		for (let node of this.controlNodes) {
			dragHandler.unregisterNode(node);
		}
		this.rayCounter.remove();
	}

	_creatRays() {
		for (let node of this.controlNodes) {
			dragHandler.unregisterNode(node);
		}
		this.controlNodes = [];

		this.rays = [];
		let phi = 1/this.rayCount * Math.PI;

		for (let i = 0; i < this.rayCount; ++i) {
			let controlNode = new OrbitNode(this.mid.x, this.mid.y, this.radius, this.radius, this.radius);
			let angle = i * phi;

			controlNode.setAngle(angle);

			let ray = new Ray(this.mid.clone(), this.midNode, controlNode);

			this.controlNodes.push(controlNode);
			this.rays.push(ray);
			dragHandler.registerNode(controlNode);
		}
		repaint();
	}

	_createCounter() {
		this.rayCounter = new Counter(document.getElementById("camera"), this.rayCount*2, 4, 12, 2);
		this.rayCounter.registerChangeListener(this);
		this.rayCounter.domElement.style.top = "30px";
	}

	/**
	 * Synchronizes amount of slicing rays with counter. Skips 10 sliced pizza.
	 * @param event
	 */
	oncounterchange(event) {
		if (event.newVal > event.oldVal) {
			if (event.newVal === 10) {
				event.newVal = 12;
			}

		}else {
			if (event.newVal === 10) {
				event.newVal = 8;
			}
		}
		this.rayCount = event.newVal / 2;
		this._creatRays();
	}

	getIntersection() {
		return new Vec2(this.midNode.x, this.midNode.y);
	}

	getRays() {
		return this.rays;
	}

	getSliceCount() {
		return this.rays.length * 2;
	}

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

