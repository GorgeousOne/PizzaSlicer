
// Set constraints for the video stream
let constraints = {
	video: {
		facingMode: {
			"ideal" : "environment"
		}
	},
	audio: false
};

const cameraView = document.querySelector("#camera--view"),
	canvas = document.querySelector("#pizza-slicer"),
	buffer = document.querySelector("#buffer"),
	cameraTrigger = document.querySelector("#camera--trigger");

function startCamera() {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function (stream) {
			track = stream.getTracks()[0];
			cameraView.srcObject = stream;
		})
		.catch(function (error) {
			console.error("Oops. Something is broken.", error);
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
	sliceTool = new SliceTool(
		circleTool.centerNode.x,
		circleTool.centerNode.y,
		circleTool.satellite.getRadius());
	circleTool = undefined;

	cameraTrigger.innerHTML = "Mark the pizza cuts";
	cameraTrigger.onclick = undefined;
	repaint();
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
let isDragging;
let canvasOffX = 0;
let canvasOffY = 0;

function handleMouseDown(event){
	isDragging=true;
	moveMouse(event.clientX, event.clientY);
	dragHandler.onCursorDown(mouseX, mouseY);
}

function handleMouseUp(event){
	isDragging=false;
	dragHandler.onCursorUp();
}

function handleMouseMove(event){
	moveMouse(event.clientX, event.clientY);
	dragHandler.onCursorMove(mouseX, mouseY);
}

function handleTouchStart(event) {
	isDragging = true;
	moveMouse(event.touches[0].clientX, event.touches[0].clientY);
	dragHandler.onCursorDown(mouseX, mouseY);
}

function handleTouchEnd(event) {
	isDragging = false;
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

function repaint() {
	let ctx = canvas.getContext("2d");
	ctx.drawImage(buffer, 0, 0);

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 3;

	if (sliceTool) {
		sliceTool.display(ctx);
	}//else
	if (circleTool) {
		circleTool.display(ctx);
	}

	for (let node of dragHandler.nodes) {
		node.display(ctx);
	}
}

// Start the video stream when the window loads
window.addEventListener("load", startCamera, false);