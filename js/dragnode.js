const nodeSize = 25;

class DragNode {

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.radius = nodeSize;

		this.isDragged = false;
		this.dragX = 0;
		this.dragY = 0;

		this.color = new Color(0, 255, 255);
	}

	setBounds(minX, minY, maxX, maxY, spacing = nodeSize) {
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
		this.spacing = spacing;
		return this;
	}

	contains(x, y) {
		let dx = x - this.x;
		let dy = y - this.y;
		return dx * dx + dy * dy < this.radius * this.radius;
	}

	startDrag(mouseX, mouseY) {
		this.isDragged = true;
		this.dragX = this.x - mouseX;
		this.dragY = this.y - mouseY;
		this.color.a = 0.5;
	}

	stopDrag() {
		this.isDragged = false;
		this.color.a = 1;
	}

	move(mouseX, mouseY) {
		let newX = mouseX + this.dragX;
		let newY = mouseY + this.dragY;

		if (this.minX !== undefined) {
			this.x = clamp(newX, this.minX + this.spacing, this.maxX - this.spacing);
			this.y = clamp(newY, this.minY + this.spacing, this.maxY - this.spacing);
		}else {
			this.x = newX;
			this.y = newY;
		}
	}

	display(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color.string();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function clamp(num, min, max) {
	return Math.max(min, Math.min(max, num));
}