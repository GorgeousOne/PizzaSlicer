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
	cameraSensor = document.querySelector("#camera--sensor"),
	cameraTrigger = document.querySelector("#camera--trigger")

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

	let ctx = pizzaSlicer.getContext("2d");
	ctx.drawImage(cameraView, 0, 0);
	ctx.save();

	// cameraOutput.src = cameraSensor.toDataURL("image/webp");
	//triggers css fade in
	// cameraOutput.classList.add("taken");

	drawSliceTool();
};

function drawSliceTool() {
	let width = pizzaSlicer.width;
	let height = pizzaSlicer.height;

	let ctx = pizzaSlicer.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(width/2, 20);
	ctx.lineTo(width/2, height-20);

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 10;
	ctx.strokeStyle = "#00ffff";
	ctx.stroke();
}

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);