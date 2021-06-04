
class DragHandler {

	constructor() {
		this.nodes = [];
		this.draggedNode = undefined;


		this.pmouseX = 0;
		this.pmouseX = 0;
		this.isDragging = false;
	}

	registerNode(dragNode) {
		this.nodes.push(dragNode);
	}

	onCursorDown(mouseX, mouseY) {
		this.isDragging = true;

		for (let node of this.nodes) {
			if (node.contains(mouseX, mouseY)) {
				this.draggedNode = node;
				break;
			}
		}
		this.pmouseX = mouseX;
		this.pmouseY = mouseY;
	}

	onCursorUp() {
		this.isDragging = false;
		this.draggedNode = undefined;
	}

	onCursorMove(mouseX, mouseY) {
		if (this.draggedNode) {
			let dx = mouseX - this.pmouseX;
			let dy = mouseY - this.pmouseY;
			this.draggedNode.move(dx, dy);
		}
		this.pmouseX = mouseX;
		this.pmouseY = mouseY;
		update();
	}

}