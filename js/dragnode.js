const nodeSize = 30;
const grabSize = 50;

class DragNode {

	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = nodeSize;
		this.grabSize = grabSize;

		this.isDragged = false;
		this.dragX = 0;
		this.dragY = 0;

		this.color = new Color(0, 255, 255, 0.5);
	}

	setBounds(minX, minY, maxX, maxY, spacing = nodeSize / 2) {
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
		this.boundSpacing = spacing;
		return this;
	}

	getMinBoundDistance() {
		let boundDistances = [
			this.x - this.minX ,
			this.y - this.minY,
			this.maxX - this.x,
			this.maxY - this.y];
		return Math.min(...boundDistances);
	}

	contains(x, y) {
		let dx = x - this.x;
		let dy = y - this.y;
		return Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(this.grabSize / 2, 2);
	}

	startDrag(mouseX, mouseY) {
		this.isDragged = true;
		this.dragX = this.x - mouseX;
		this.dragY = this.y - mouseY;
		this.color.a = 1;
	}

	stopDrag() {
		this.isDragged = false;
		this.color.a = 0.5;
	}

	move(mouseX, mouseY) {
		let newX = mouseX + this.dragX;
		let newY = mouseY + this.dragY;

		if (this.minX !== undefined) {
			this.x = clamp(newX, this.minX + this.boundSpacing, this.maxX - this.boundSpacing);
			this.y = clamp(newY, this.minY + this.boundSpacing, this.maxY - this.boundSpacing);
		} else {
			this.x = newX;
			this.y = newY;
		}
	}

	display(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color.string();
		ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
		ctx.fill();
	}
}