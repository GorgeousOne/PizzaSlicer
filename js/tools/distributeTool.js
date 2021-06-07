
class DistributeTool {

	constructor(pizzaMidVec, pizzaRadius, intersectionVec, rays) {

		this.createSlices(pizzaMidVec, pizzaRadius, intersectionVec, rays);
		this.distributeSlices(4);
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
		let sortedSlices = Array.from(this.slices);
		sortedSlices.sort(function (a, b) {return b.getPercentage() - a.getPercentage();});
		let bestDistribution = this.distribute(sliceDistribution, sortedSlices, peopleCount);

		for (let slice of sortedSlices) {
			console.log((Math.round(10000 * slice.percentage) / 100) + "%");
		}

		console.log(bestDistribution[0], bestDistribution[1]);
		for (let slices of bestDistribution[0].values()) {
			let rndColor = Color.rnd();
			for (let slice of slices) {
				slice.setColor(rndColor);
			}
		}
	}

	distribute(sliceDistribution, slicesLeft, peopleCount, startPerson = 0, endPerson = 1) {
		if (slicesLeft.length === 0) {
			let imbalance = this.calcImbalance(peopleCount, sliceDistribution);
			return [sliceDistribution, imbalance];
		}
		let bestDistribution = undefined;
		let bestImbalance = Infinity;
		let portionSize = 1 / peopleCount;

		for (let i = startPerson; i < Math.min(peopleCount, endPerson); ++i) {
			if (this.getPercentageSum(sliceDistribution.get(i)) > portionSize) {
				++startPerson;
				continue;
			}
			let distributionCopy = this.copyDistribution(sliceDistribution);
			distributionCopy.get(i).push(slicesLeft[0]);
			let slicesLeftCopy = slicesLeft.slice(1, slicesLeft.length);
			let newDistribution = this.distribute(distributionCopy, slicesLeftCopy, peopleCount, startPerson, endPerson + 1);

			if (newDistribution[1] < bestImbalance) {
				bestDistribution = newDistribution[0];
				bestImbalance = newDistribution[1];
			}
		}
		return [bestDistribution, bestImbalance];
	}

	copyDistribution(distribution) {
		let copy = new Map();

		for (let key of distribution.keys()) {
			copy.set(key, Array.from(distribution.get(key)));
		}
		return copy;
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