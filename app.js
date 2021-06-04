
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

// Take a picture when cameraTrigger is tapped
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

	console.log(pizzaSlicer.width, pizzaSlicer.height);
	console.log(pizzaSlicer.getBoundingClientRect());

	pizzaSlicer.onmousemove = handleMouseMove;
	pizzaSlicer.onmousedown = handleMouseDown;
	pizzaSlicer.onmouseup = handleMouseUp;
	pizzaSlicer.ontouchstart = handleTouchStart;
	pizzaSlicer.ontouchend = handleTouchEnd;
	pizzaSlicer.ontouchmove = handleTouchMove;
};

function stopStreamedVideo(videoElem) {
	const stream = videoElem.srcObject;
	const tracks = stream.getTracks();

	tracks.forEach(function(track) {
		track.stop();
	});
	videoElem.srcObject = null;
}

let pizza = new Pizza(0, 0, 25);
function drawSliceTool() {
	let width = pizzaSlicer.width;
	let height = pizzaSlicer.height;

	let ctx = pizzaSlicer.getContext("2d");
	ctx.drawImage(buffer, 0, 0);

	pizza.setCenter(mouseX, mouseY);
	ctx.arc(mouseX, mouseY, 100, 0, 2*Math.PI);

	ctx.beginPath();

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#00ffff";

	pizza.display(ctx);

	ctx.moveTo(mouseX, 20);
	ctx.lineTo(mouseX, height-20);
	ctx.stroke();
}

let mouseX;
let mouseY;
let isDragging;
let canvasOffX = 0;
let canvasOffY = 0;

function handleMouseDown(event){
	isDragging=true;
}

function handleMouseUp(event){
	isDragging=false;
}

function handleMouseMove(event){
	moveMouse(event.clientX, event.clientY);
}

function handleTouchStart(event) {
	isDragging = true;
	console.log("start");
}

function handleTouchEnd(event) {
	isDragging = false;
	console.log("stop");
}

function handleTouchMove(event) {
	console.log("move");
	moveMouse(event.touches[0].clientX, event.touches[0].clientY);
}

function moveMouse(x, y) {
	mouseX = x - canvasOffX;
	mouseY = y - canvasOffY;
	document.getElementById("demo").innerHTML = x + ", " + y;
	drawSliceTool();


}
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);