
class DistributeTool {

	constructor(pizzaMidVec, pizzaRadius, intersectionVec, rays) {

		this.createSlices(pizzaMidVec, pizzaRadius, intersectionVec, rays);
		this.distributeSlices(3);
	}

	createSlices(pizzaMidVec, pizzaRadius, intersectionVec, rays) {
		this.slices = [];
		let nodes = new Map();

		for (let ray of rays) {
			let phi = ray.getAngle();
			nodes.set(phi, ray.getStart());
			nodes.set(this.invertAngle(phi), ray.getEnd());
		}
		let angles = Array.from(nodes.keys());
		angles.sort(function(a,b) {return a - b;});

		for (let i = 0; i < angles.length; ++i) {
			let node1 = nodes.get(angles[i]).clone();
			let node2 = nodes.get(angles[(i+1) % angles.length]).clone();

			let slice = new Slice(pizzaMidVec.clone(), pizzaRadius, intersectionVec.clone(), node1, node2);
			this.slices.push(slice);
		}
	}

	invertAngle(phi) {
		return phi > 0 ? phi - Math.PI : phi + Math.PI;
	}

	distributeSlices(peopleCount) {
		let sliceDistribution = new Map();

		for (let i = 0; i < peopleCount; ++i) {
			sliceDistribution.set(i, []);
		}

		let bestDistribution = this.distribute(peopleCount, sliceDistribution, Array.from(this.slices));

		let i = 0;
		for (let slices of bestDistribution[0].values()) {
			console.log("---", i, "---");
			for (let slice of slices) {
				console.log("  ", Math.round(slice.getPercentage()));
			}
			++i;
		}
	}

	distribute(peopleCount, sliceDistribution, slicesLeft) {
		if (slicesLeft.length === 0) {
			let imbalance = this.calcImbalance(peopleCount, sliceDistribution);
			return [sliceDistribution, imbalance];
		}
		let bestDistribution;
		let bestImbalance = Infinity;

		for (let i = 0; i < peopleCount; ++i) {
			let distributionCopy = new Map(sliceDistribution);
			distributionCopy.get(i).push(slicesLeft[0]);
			let slicesLeftCopy = slicesLeft.slice(1, slicesLeft.length);
			let newDistribution = this.distribute(peopleCount, distributionCopy, slicesLeftCopy);

			if (newDistribution[1] < bestImbalance) {
				bestDistribution = newDistribution[0];
				bestImbalance = newDistribution[1];
			}
		}
		// console.log("left:", slicesLeft.length, bestImbalance);
		return [bestDistribution, bestImbalance];
	}

	calcImbalance(peopleCount, sliceDistribution) {
		let perfectPortion = 1 / peopleCount;
		let imbalance = 0;

		for (let slices of sliceDistribution.values()) {
			let personPortion = this.getPercentageSum(slices);
			imbalance += Math.abs(perfectPortion - personPortion);
		}
		return imbalance;
	}

	getPercentageSum(slices) {
		let sum = 0;

		for (let slice of slices) {
			sum += slice.getPercentage();
		}
		return sum;
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