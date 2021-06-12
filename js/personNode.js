
const personSize = 90;
const personGrabRange = 110;

class PersonNode extends DragNode {

	constructor(x, y, color, slices) {
		super(x, y, personSize * pixelRatio, personGrabRange * pixelRatio);
		this.color = color.clone();
		this.textColor = brighten(color);
		this.text = Math.round(100 * getPercentageSum(slices)) + "%";

		for (let slice of slices) {
			slice.setColor(color);
		}
	}

	stopDrag() {
		super.stopDrag();
		this.color.a = 1;
	}

	display(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color.string();
		ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
		ctx.shadowBlur = 20;
		ctx.arc(this.x, this.y, this.size / 2, 0, 2*Math.PI);
		ctx.fill();

		ctx.shadowBlur = 0;
		ctx.fillStyle = this.textColor.string();
		ctx.fillText(this.text, this.x, this.y);
	}
}