
const personSize = 45;

class Person extends DragNode {

	constructor(x, y, color, slices) {
		super(x, y);
		this.color = color.clone();
		this.textColor = brighten(color);
		this.text = Math.round(100 * getPercentageSum(slices)) + "%";

		for (let slice of slices) {
			slice.setColor(color);
		}
		this.size = personSize * pixelRatio;
		this.grabSize = (personSize + 10) * pixelRatio;
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
		ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
		ctx.fill();

		ctx.shadowBlur = 0;
		ctx.fillStyle = this.textColor.string();
		ctx.fillText(this.text, this.x, this.y);
	}
}