
const colors = [
	Color.fromHex("#FF3333"),
	Color.fromHex("#ff970f"),
	Color.fromHex("#83de3a"),
	Color.fromHex("#AF3DB8"),
	Color.fromHex("#fff600"),
	Color.fromHex("#00ffff"),
	Color.fromHex("#ff7cac"),
	Color.fromHex("#0070ff")
];

class DistributeTool {

	constructor(peopleCount, pizzaMidVec, pizzaRadius, intersectionVec, rays) {
		this.createSlices(pizzaMidVec, pizzaRadius, intersectionVec, rays);
		this.distributeSlices(peopleCount);
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
		this.createPeople(bestDistribution[0]);
	}

	createPeople(sliceDistribution) {
		this.people = [];
		let peopleCount = sliceDistribution.size;

		let phi = 2*Math.PI / peopleCount;
		let offPhi = phi* 4/3;

		let centerX = canvas.width / 2;
		let centerY = canvas.height / 2;
		let radius = Math.min(centerX, centerY) * 3/4;

		let i = 0;
		for (let slices of sliceDistribution.values()) {
			let x = centerX + Math.cos(offPhi + i * phi) * radius;
			let y = centerY + Math.sin(offPhi + i * phi) * radius;

			let person = new PersonNode(x, y, colors[i], slices);
			this.people.push(person);
			dragHandler.registerNode(person);
			++i;
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
			if (getPercentageSum(sliceDistribution.get(i)) > portionSize) {
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

	/**
	 * Returns a value for how imbalanced the slice distribution is based on percentage.
	 * Missing or additional percent to each portion are summed up
	 * (and squared for greater differences to have a bigger impact)
	 * @param {number} peopleCount
	 * @param {Map} sliceDistribution
	 * @returns {number}
	 */
	calcImbalance(peopleCount, sliceDistribution) {
		let perfectPortion = 1 / peopleCount;
		let imbalance = 0;

		for (let slices of sliceDistribution.values()) {
			let personPortion = getPercentageSum(slices);
			imbalance += Math.pow(perfectPortion - personPortion, 2);
		}
		return imbalance;
	}

	display(ctx) {
		for (let slice of this.slices) {
			slice.display(ctx);
		}
		for (let person of  this.people) {
			person.display(ctx);
		}
	}
}