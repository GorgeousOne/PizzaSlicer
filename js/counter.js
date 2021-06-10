const xmlString = `
		<div class="count-container">
			<div class="counter">
				<button class="count-button" id="minus">-</button>
				<span id="value">0</span>
				<button class="count-button" id="plus">+</button>
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

	registerChangeListener(listener) {
		if (typeof listener.oncounterchange != 'function') {
			throw "Listener does not have function oncounterchange";
		}
		listener.push(listener);
	}

	_create_dom_element() {
		let parser = new DOMParser();
		let doc;

		try {
			doc = parser.parseFromString(xmlString, 'text/html');
			this.domElement = doc.firstChild;
		} catch (err) {
			console.error("Oops " + err);
		}
		this.domParent.appendChild(this.domElement);
		this.decButton = doc.getElementById("minus");
		this.incButton = doc.getElementById("plus");
		console.log(doc, this.decButton, this.incButton);
		this.decButton.onclick = this._decrement;
		this.incButton.onclick = this._increment;
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
		this.domElement.getElementById("value").textContent = this.value.toString();
	}

	remove() {
		this.domParent.removeChild(this.domElement);
		this.listeners = [];
	}
}

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
let stringToHTML = function (str) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};
