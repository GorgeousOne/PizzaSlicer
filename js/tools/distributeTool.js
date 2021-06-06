
class DistributeTool {

	constructor(pizzaMidVec, pizzaRadius, intersectionVec, rays) {

		this.slices = [];
		let nodes = new Map();

		for (let ray of rays) {
			let phi = ray.getAngle();
			nodes.set(phi, ray.getStart());
			nodes.set(this.invertAngle(phi), ray.getEnd());
		}
		let angles = Array.from(nodes.keys());
		angles.sort(function(a,b) { return a - b; });
		console.log("pizza  size: ", Math.PI * Math.pow(pizzaRadius, 2));

		for (let i = 0; i < angles.length; ++i) {
			let node1 = nodes.get(angles[i]).clone();
			let node2 = nodes.get(angles[(i+1) % angles.length]).clone();

			let slice = new Slice(pizzaMidVec.clone(), pizzaRadius, intersectionVec.clone(), node1, node2);
			console.log(
				Math.round(Math.degrees(angles[i])),
				Math.round(Math.degrees(slice.getAngle())),
				slice.getSize());
			this.slices.push(slice);
		}
	}

	invertAngle(phi) {
		return phi > 0 ? phi - Math.PI : phi + Math.PI;
	}

	display(ctx) {
		ctx.font = "30px Montserrat";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';

		for (let slice of this.slices) {
			slice.display(ctx);
		}
	}
}