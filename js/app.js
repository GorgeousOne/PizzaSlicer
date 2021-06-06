
// Set constraints for the video stream
let constraints = {
	video: {
		facingMode: {
			"ideal" : "environment"
		}
	},
	audio: false
};

const cameraView = document.getElementById("camera--view");
const canvas = document.getElementById("pizza-slicer");
const buffer = document.getElementById("buffer");
const cameraTrigger = document.getElementById("camera--trigger");
// const cameraError = document.getElementById("camera--error");

function startCamera() {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function (stream) {
			track = stream.getTracks()[0];
			cameraView.srcObject = stream;
			cameraTrigger.style.display = "block";
		})
		.catch(function (error) {
			document.getElementById("error-container").style.display = "flex";
			console.error(error);
		});
}

function stopCamera(videoElem) {
	const stream = videoElem.srcObject;
	const tracks = stream.getTracks();

	tracks.forEach(function(track) {
		track.stop();
	});
	videoElem.srcObject = null;
}

cameraTrigger.onclick = function () {
	createCanvas();
	stopCamera(cameraView);
	// cameraTrigger.parentElement.removeChild(cameraTrigger);

	dragHandler = new DragHandler();

	let minExtent = Math.min(canvas.width, canvas.height);
	circleTool = new CircleTool(canvas.width/2, canvas.height/2, minExtent/4);
	circleTool.setBounds(0, 0, canvas.width, canvas.height);

	cameraTrigger.innerHTML = "Circle your pizza";
	cameraTrigger.onclick = startPizzaSlicing;
	repaint();
};

function startPizzaSlicing() {
	circleTool.unregister();
	sliceTool = new SliceTool(circleTool.getMid(), circleTool.getRadius());
	// circleTool = undefined;

	cameraTrigger.innerHTML = "Mark the pizza cuts";
	cameraTrigger.onclick = distributePizza;
	repaint();
}

function distributePizza() {
	distributeTool = new DistributeTool(
		circleTool.getMid(),
		circleTool.getRadius(),
		sliceTool.getIntersection(),
		sliceTool.getRays());

	cameraTrigger.innerHTML = "Wooh!";
	cameraTrigger.onclick = undefined;
}

function createCanvas() {
	let imgWidth = cameraView.videoWidth;
	let imgHeight = cameraView.videoHeight;
	let screenWidth = cameraView.clientWidth;
	let screenHeight = cameraView.clientHeight;

	let imgRatio = imgWidth / imgHeight;
	let screenRatio = screenWidth / screenHeight;

	if (screenRatio > imgRatio) {
		canvas.width = screenHeight * imgRatio;
		canvas.height = screenHeight;
		canvasOffX = Math.floor((screenWidth - canvas.width) / 2);
	}else {
		canvas.width = screenWidth;
		canvas.height = screenWidth / imgRatio;
		canvasOffY = Math.floor((screenHeight - canvas.height) / 2);
	}
	canvas.getContext("2d").drawImage(cameraView, 0, 0, canvas.width, canvas.height);
	buffer.src = canvas.toDataURL("image/png");

	canvas.onmousemove = handleMouseMove;
	canvas.onmousedown = handleMouseDown;
	canvas.onmouseup = handleMouseUp;
	// canvas.onmouseout = handleMouseUp;

	canvas.ontouchstart = handleTouchStart;
	canvas.ontouchend = handleTouchEnd;
	canvas.ontouchmove = handleTouchMove;
}

let mouseX;
let mouseY;
let canvasOffX = 0;
let canvasOffY = 0;

function handleMouseDown(event){
	moveMouse(event.clientX, event.clientY);
	dragHandler.onCursorDown(mouseX, mouseY);
}

function handleMouseUp(event){
	dragHandler.onCursorUp();
}

function handleMouseMove(event){
	moveMouse(event.clientX, event.clientY);
	dragHandler.onCursorMove(mouseX, mouseY);
}

function handleTouchStart(event) {
	moveMouse(event.touches[0].clientX, event.touches[0].clientY);
	dragHandler.onCursorDown(mouseX, mouseY);
}

function handleTouchEnd(event) {
	dragHandler.onCursorUp();
}

function handleTouchMove(event) {
	moveMouse(event.touches[0].clientX, event.touches[0].clientY);
	dragHandler.onCursorMove(mouseX, mouseY);
}

function moveMouse(x, y) {
	mouseX = x - canvasOffX;
	mouseY = y - canvasOffY;
}

let dragHandler;
let circleTool;
let sliceTool;
let distributeTool;

function repaint() {
	let ctx = canvas.getContext("2d");
	ctx.drawImage(buffer, 0, 0);

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 3;

	if (sliceTool) {
		sliceTool.display(ctx);
	}else if (circleTool) {
		circleTool.display(ctx);
	}

	for (let node of dragHandler.nodes) {
		node.display(ctx);
	}
}

// Start the video stream when the window loads
window.addEventListener("load", startCamera, false);

function clamp(num, min, max) {
	return Math.max(min, Math.min(max, num));
}

Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
}