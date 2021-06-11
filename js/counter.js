const xmlString = `
		<div class="counter-container">
			<div class="counter">
				<button id="minus">-</button>
				<span id="value">0</span>
				<button id="plus">+</button>
			</div>
		<div>`;

class Counter {
	/**
	 *
	 * @param domParent
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @param {number} increment
	 */
	constructor(domParent, value, min, max, increment) {
		this.domParent = domParent;
		this.value = value;
		this.min = min;
		this.max = max;
		this.increment = increment;
		this.listeners = [];

		this._create_dom_element();
	}

	getValue() {
		return this.value;
	}

	registerChangeListener(listener) {
		if (typeof listener.oncounterchange != 'function') {
			throw "Listener does not have function oncounterchange";
		}
		this.listeners.push(listener);
	}

	_create_dom_element() {
		this.domParent.insertAdjacentHTML("beforeend", xmlString);
		this.domElement = this.domParent.lastChild;

		this.decButton = this.domElement.querySelector("#minus");
		this.incButton = this.domElement.querySelector("#plus");
		this.decButton.onclick = this._decrement.bind(this);
		this.incButton.onclick = this._increment.bind(this);
		this._updateDom();
	}

	_increment() {
		this._callEvent(this.value, Math.min(this.max, this.value + this.increment));
		if (this.value === this.max) {
			this.incButton.disabled = true;
		}
		this.decButton.disabled = false;
		this._updateDom();
	}

	_decrement() {
		this._callEvent(this.value, Math.max(this.min, this.value - this.increment));
		if (this.value === this.min) {
			this.decButton.disabled = true;
		}
		this.incButton.disabled = false;
		this._updateDom();
	}

	_callEvent(oldValue, newValue) {
		let event = {
			oldVal: oldValue,
			newVal: newValue};

		for (let listener of this.listeners) {
			listener.oncounterchange(event);
		}
		this.value = event.newVal;
	}

	_updateDom() {
		this.domElement.querySelector("#value").textContent = this.value.toString();
	}

	remove() {
		this.domParent.removeChild(this.domElement);
		this.listeners = [];
	}
}