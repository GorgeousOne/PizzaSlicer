
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
		for (let slice of this.slices) {
			console.log(Math.round(100 * slice.percentage) + "%");
		}
		let bestDistribution = this.distribute(1 / peopleCount, new Set(), Array.from(this.slices), []);

		// console.log(bestDistribution[0], bestDistribution[1]);
		for (let slices of bestDistribution[0]) {
			console.log("  --------");
			// for (let slice of slices) {
				console.log(Math.floor(this.getPercentageSum(slices) * 100) + "%");
			// }
		}
	}

	distribute(portionSize, sliceDistribution, slicesLeft, currentPortion, level = 0, row = "") {
		if (slicesLeft.length === 0) {
			let imbalance = this.calcImbalance(portionSize, sliceDistribution);
			// console.log(level, bestImbalance);
			// console.log(row, imbalance);
			return [sliceDistribution, imbalance];
		}
		let bestDistribution = undefined;
		let bestImbalance = Infinity;

		for (let slice of slicesLeft) {
			let distributionCopy = this.copyDistribution(sliceDistribution);
			let slicesLeftCopy = slicesLeft.slice(1, slicesLeft.length);
			let portionCopy = Array.from(currentPortion);
			portionCopy.push(slicesLeft[0]);

			if (this.getPercentageSum(portionCopy) > portionSize) {
				distributionCopy.add(portionCopy);
				portionCopy = [];
			}
			let newDistribution = this.distribute(portionSize, distributionCopy, slicesLeftCopy, portionCopy, level + (portionCopy.length === 0 ? 1 : 0), row + level);

			if (newDistribution[1] < bestImbalance) {
				bestDistribution = newDistribution[0];
				bestImbalance = newDistribution[1];
			}
		}
		return [bestDistribution, bestImbalance];
	}

	copyDistribution(distribution) {
		let copy = new Set();

		for (let portion of distribution) {
			copy.add(Array.from(portion));
		}
		return copy;
	}

	calcImbalance(peopleCount, sliceDistribution) {
		let perfectPortion = 1 / peopleCount;
		let imbalance = 0;

		for (let slices of sliceDistribution) {
			let personPortion = this.getPercentageSum(slices);
			imbalance += Math.abs(perfectPortion - personPortion) / perfectPortion;
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