
// Set constraints for the video stream
let constraints = {
	video: {
		facingMode: {
			"ideal" : "environment"
		}
	},
	audio: false
};

// Define constants
const cameraView = document.querySelector("#camera--view"),
	pizzaSlicer = document.querySelector("#pizza-slicer"),
	buffer = document.querySelector("#buffer"),
	cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
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

cameraTrigger.onclick = function () {
	// pizzaSlicer.width = cameraView.videoWidth;
	// pizzaSlicer.height = cameraView.videoHeight;

	let imgWidth = cameraView.videoWidth;
	let imgHeight = cameraView.videoHeight;
	let screenWidth = cameraView.clientWidth;
	let screenHeight = cameraView.clientHeight;

	let imgRatio = imgWidth / imgHeight;
	let screenRatio = screenWidth / screenHeight;

	if (screenRatio > imgRatio) {
		pizzaSlicer.width = screenHeight * imgRatio;
		pizzaSlicer.height = screenHeight;
		canvasOffX = (screenWidth - pizzaSlicer.width) / 2;
	}else {
		pizzaSlicer.width = screenWidth;
		pizzaSlicer.height = screenWidth / imgRatio;
		canvasOffY = (screenHeight - pizzaSlicer.height) / 2;
	}
	pizzaSlicer.getContext("2d").drawImage(cameraView, 0, 0, pizzaSlicer.width, pizzaSlicer.height);
	buffer.src = pizzaSlicer.toDataURL("image/png");

	stopStreamedVideo(cameraView);
	cameraTrigger.parentElement.removeChild(cameraTrigger);

	pizzaSlicer.onmousemove = handleMouseMove;
	pizzaSlicer.onmousedown = handleMouseDown;
	pizzaSlicer.onmouseup = handleMouseUp;
	pizzaSlicer.ontouchstart = handleTouchStart;
	pizzaSlicer.ontouchend = handleTouchEnd;
	pizzaSlicer.ontouchmove = handleTouchMove;
	dragHandler = new DragHandler();
	dragHandler.registerNode(new DragNode(100, 100, 25));
	dragHandler.registerNode(new DragNode(300, 300, 30));
};

function stopStreamedVideo(videoElem) {
	const stream = videoElem.srcObject;
	const tracks = stream.getTracks();

	tracks.forEach(function(track) {
		track.stop();
	});
	videoElem.srcObject = null;
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
	// document.getElementById("demo").innerHTML = x + ", " + y;
}

// let pizza = new Pizza(0, 0, 25);
let dragHandler;

function update() {
	let ctx = pizzaSlicer.getContext("2d");
	ctx.drawImage(buffer, 0, 0);

	ctx.beginPath();
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#00ffff";
	ctx.fillStyle = "#00ffff";

	for (let node of dragHandler.nodes) {
		node.display(ctx);
	}
}

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);