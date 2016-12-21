var emotionAPIUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";
var subscriptionKeyEmotionAPI = "ADD KEY HERE"; 

var faceAPIUrl = "https://api.projectoxford.ai/face/v1.0/detect?returnFaceLandmarks=true&returnFaceAttributes=age,gender,facialHair,glasses";
var subscriptionKeyFaceAPI = "ADD KEY HERE";

function showCamera(){
	Webcam.set({
		width: 320,
		height: 240,
		image_format: 'jpeg',
		jpeg_quality: 100
	});
	Webcam.attach('#my_camera');
}

function capturePicture() {
    Webcam.snap(function(data_uri) {
		$("#results").html('<img id="base64image" src="'+data_uri+'"/>');
	});
	$("#resultsActions").css("display", "block");
	hideMarkers();
}
		
function submitToEmotionAPI(){
	hideMarkers();
	$("#status").text("Submitting to cloud...");
    var file = document.getElementById("base64image").src.substring(23).replace(' ', '+');
	var img = Base64Binary.decodeArrayBuffer(file);
	
    var xhr = new XMLHttpRequest();
    xhr.open("POST", emotionAPIUrl, "image/jpg");
	xhr.responseType = "json";
	xhr.setRequestHeader("Content-Type","application/octet-stream");
	xhr.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKeyEmotionAPI);
	xhr.onload = uploadEmotionAPIComplete;
	xhr.send(img);
}

function uploadEmotionAPIComplete(event){
	if (this.status == 200) {
		if (event.target.response.length > 0) {
			$("#status").text("Found " + event.target.response.length + " Faces");
			var firstFace = event.target.response[0]

			// Show face rectangle
            var faceRectange = firstFace.faceRectangle;
            var faceWidth = faceRectange.width;
			var faceHeight = faceRectange.height;
			var faceLeft = faceRectange.left;
			var faceTop = faceRectange.top;
			$("#FaceMarker").css("top", faceTop);
			$("#FaceMarker").css("left", faceLeft);
			$("#FaceMarker").css("height", faceHeight);
			$("#FaceMarker").css("width", faceWidth);
			$("#FaceMarker").css("display", "block");

			// Show scores information
			var scores = firstFace.scores;
			var outputText = "";
			outputText += "Anger: " + scores.anger + "<br>";
			outputText += "Contempt: " + scores.contempt + "<br>";
			outputText += "Disgust: " + scores.disgust + "<br>";
			outputText += "Fear: " + scores.fear + "<br>";
			outputText += "Happiness: " + scores.happiness + "<br>";
			outputText += "Neutral: " + scores.neutral + "<br>";
			outputText += "Sadness: " + scores.sadness + "<br>";
			outputText += "Surprise: " + scores.surprise + "<br>";
			$("#output").html(outputText);
		}
		else {
			$("#status").text("No face found. Please try again!");
			$("#output").html("");
		}
	}
	else {
		$("#status").text("Error: See the console for details");
		console.log(this.responseText);
	}
}

function submitToFaceAPI(){
	hideMarkers();
	$("#status").text("Submitting to cloud...");
    var file = document.getElementById("base64image").src.substring(23).replace(' ', '+');
	var img = Base64Binary.decodeArrayBuffer(file);
	
    var xhr = new XMLHttpRequest();
    xhr.open("POST", faceAPIUrl, "image/jpg");
	xhr.responseType = "json";
	xhr.setRequestHeader("Content-Type","application/octet-stream");
	xhr.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKeyFaceAPI);
	xhr.onload = uploadFaceAPIComplete;
	xhr.send(img);
}

function uploadFaceAPIComplete(event){
	if (this.status == 200) {
		if (event.target.response.length > 0) {
			$("#status").text("Found " + event.target.response.length + " Faces");
			var firstFace = event.target.response[0]

			// Show face rectangle
            var faceRectange = firstFace.faceRectangle;
            var faceWidth = faceRectange.width;
			var faceHeight = faceRectange.height;
			var faceLeft = faceRectange.left;
			var faceTop = faceRectange.top;

			$("#Hat").css("top", faceTop - faceWidth);
			$("#Hat").css("left", faceLeft);
			$("#Hat").css("height", faceWidth * 1.2);
			$("#Hat").css("width", faceWidth * 1.2);
			$("#Hat").css("display", "block");

			var noseWidth = firstFace.faceLandmarks.noseRightAlarOutTip.x - firstFace.faceLandmarks.noseLeftAlarOutTip.x
			$("#Nose").css("top", firstFace.faceLandmarks.noseLeftAlarOutTip.y - (noseWidth / 2));
			$("#Nose").css("left", firstFace.faceLandmarks.noseLeftAlarOutTip.x);
			$("#Nose").css("height", noseWidth * 1.1);
			$("#Nose").css("width", noseWidth * 1.1);
			$("#Nose").css("display", "block");

			/*
			// Show scores information
			var scores = firstFace.scores;
			var outputText = "";
			outputText += "Anger: " + scores.anger + "<br>";
			outputText += "Contempt: " + scores.contempt + "<br>";
			outputText += "Disgust: " + scores.disgust + "<br>";
			outputText += "Fear: " + scores.fear + "<br>";
			outputText += "Happiness: " + scores.happiness + "<br>";
			outputText += "Neutral: " + scores.neutral + "<br>";
			outputText += "Sadness: " + scores.sadness + "<br>";
			outputText += "Surprise: " + scores.surprise + "<br>";
			$("#output").html(outputText);
*/
			$("#output").html(JSON.stringify(firstFace.faceAttributes));
		}
		else {
			$("#status").text("No face found. Please try again!");
			$("#output").html("");
		}
	}
	else {
		$("#status").text("Error: See the console for details");
		console.log(this.responseText);
	}
}

function hideMarkers() {
	$("#FaceMarker").css("display", "none");
	$("#Hat").css("display", "none");
	$("#Nose").css("display", "none");
};
	
window.onload = showCamera;
