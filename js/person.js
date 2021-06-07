
const personSize = 45;

class Person {

	constructor(x, y, color, slices) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.textColor = brighten(color);

		this.slices = slices;
		this.percentage = getPercentageSum(slices);

		for (let slice of slices) {
			slice.setColor(color);
		}
	}

	display(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color.string();
		ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
		ctx.shadowBlur = 20;
		ctx.arc(this.x, this.y, personSize, 0, 2*Math.PI);
		ctx.fill();

		ctx.shadowBlur = 0;
		ctx.fillStyle = this.textColor.string();
		let percentText = Math.round(100 * this.percentage) + "%";
		ctx.fillText(percentText, this.x, this.y);
	}
}