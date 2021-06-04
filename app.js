// Set constraints for the video stream
var constraints = {
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
	pizzaSlicer.width = cameraView.videoWidth;
	pizzaSlicer.height = cameraView.videoHeight;
	pizzaSlicer.getContext("2d").drawImage(cameraView, 0, 0);
	buffer.src = pizzaSlicer.toDataURL("image/png");

	stopStreamedVideo(cameraView);
	cameraTrigger.parentElement.removeChild(cameraTrigger);

	console.log(pizzaSlicer.offsetLeft, pizzaSlicer.offsetTop);
};

function stopStreamedVideo(videoElem) {
	const stream = videoElem.srcObject;
	const tracks = stream.getTracks();

	tracks.forEach(function(track) {
		track.stop();
	});
	videoElem.srcObject = null;
}

function drawSliceTool() {
	let width = pizzaSlicer.width;
	let height = pizzaSlicer.height;

	let ctx = pizzaSlicer.getContext("2d");
	ctx.drawImage(buffer, 0, 0);

	ctx.beginPath();
	ctx.moveTo(mouseX, 20);
	ctx.lineTo(mouseX, height-20);

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 10;
	ctx.strokeStyle = "#00ffff";
	ctx.stroke();
}

let mouseX;
let mouseY;
let isDragging;

pizzaSlicer.onmousemove = handleMouseMove;
pizzaSlicer.onmousedown = handleMouseDown;
pizzaSlicer.onmouseup = handleMouseUp;
pizzaSlicer.ontouchstart = handleTouchStart;
pizzaSlicer.ontouchend = handleTouchEnd;
pizzaSlicer.ontouchmove = handleTouchMove;

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
	mouseX = x;
	mouseY = y;
	document.getElementById("demo").innerHTML = x + ", " + y;
	// if (isDragging) {
		drawSliceTool();
	// }
}
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);