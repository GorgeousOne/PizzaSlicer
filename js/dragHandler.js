
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

	unregisterNode(dragNode) {
		if (this.nodes.includes(dragNode)) {
			let i = this.nodes.indexOf(dragNode);
			this.nodes.splice(i, 1);
		}
	}

	onCursorDown(mouseX, mouseY) {
		this.isDragging = true;

		for (let node of this.nodes) {
			if (node.contains(mouseX, mouseY)) {
				this.draggedNode = node;
				this.draggedNode.startDrag(mouseX, mouseY);
				break;
			}
		}
		this.pmouseX = mouseX;
		this.pmouseY = mouseY;
		repaint();
	}

	onCursorUp() {
		this.isDragging = false;
		if (this.draggedNode) {
			this.draggedNode.stopDrag();
			this.draggedNode = undefined;
		}
		repaint();
	}

	onCursorMove(mouseX, mouseY) {
		if (this.draggedNode) {
			// let dx = mouseX - this.pmouseX;
			// let dy = mouseY - this.pmouseY;
			this.draggedNode.move(mouseX, mouseY);
			repaint();
		}
		this.pmouseX = mouseX;
		this.pmouseY = mouseY;
	}

}