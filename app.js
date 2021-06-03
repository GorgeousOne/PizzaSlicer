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

pizzaSlicer.onmousemove = handleMouseMove;
pizzaSlicer.onmousedown = handleMouseDown;
pizzaSlicer.onmouseup = handleMouseUp;

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

function handleMouseDown(event){
	isDragging=true;
}

function handleMouseUp(event){
	isDragging=false;
}

// function handleMouseOut(event){
// 	mouseX=parseInt(event.clientX);
// 	mouseY=parseInt(event.clientY);
	// isDragging=false;
// }

function handleMouseMove(event){
	mouseX=parseInt(event.clientX) - pizzaSlicer.offsetLeft;
	mouseY=parseInt(event.clientY) - pizzaSlicer.offsetTop;

	if (isDragging) {
		drawSliceTool();
	}
}

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);