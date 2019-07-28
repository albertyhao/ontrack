// Windows Azure JS

var onTab = true;

document.addEventListener("visibilitychange", function() {
  onTab = !document.hidden;
})

function sendData() {
  if (onTab) {
    /* GRABBING THE PICTURE FROM THE VIDEO */
  	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  	var imageDataToSend = canvas.toDataURL();
  	var req = new XMLHttpRequest();
  	req.open('POST', 'https://ai.experimentdrivenlife.com/capture/save/dataurl', true);
  	req.setRequestHeader('content-type', 'application/json');
  	req.onreadystatechange = function() {
  		if (req.readyState != 4) {
  			return;
  		}
      processImage("https://ai.experimentdrivenlife.com/" + JSON.parse(req.response)["name"]);
      //return JSON.parse(req.response)["name"];
  	}
  	req.send(JSON.stringify({ image: imageDataToSend }));
  }
}

function processImage(theImageURL) {
    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = "f8b349387e6249f5ae85a6adec9702aa";

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentralus" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the "westus" region.
    // If you use a free trial subscription key, you shouldn't need to change
    // this region.
    var uriBase =
        "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    // Display the image.

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + theImageURL + '"}',
    })

    .done(function(data) {
      if (data[0]) { // If a face was identifiable
        console.log(isHappy(data[0]["faceAttributes"]["emotion"])); // Console log if the face was happy or not
      }
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ?
            "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ?
            "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
}

function isHappy(data) {
  if (data["happiness"] > 0.7) {
    return true;
  } else {
    return false;
  }
}

var video = document.getElementById("videoElement"); // Sets the element with the id "videoElement" as video

navigator.getUserMedia = navigator.getUserMedia || // Set up navigator.getUserMedia -- this is
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia ||
navigator.oGetUserMedia;

if (navigator.getUserMedia) { // If navigator.getUserMedia exists and is not a null value
  navigator.getUserMedia({video: true}, handleVideo, videoError); // Set the video up.
  // Arg 1: condition, Arg 2: What to do with the video, Arg 3: What to do if there is an error
}

function handleVideo(stream) { // Stream the video
  video.srcObject = stream; // Sets the source of the video element as the stream
  video.onloadedmetadata = function(e) {
    video.play(); // Play the video
  }
}

function videoError(e) {
  console.log(e); // If there is an error, console.log what the error is
}

var canvas = document.createElement('canvas'); // Set the canvas up
canvas.width = 720;
canvas.height = 480;
var ctx = canvas.getContext('2d');

setInterval(sendData, 5000); // Sets an interval where every single 10000 ms (10 sec) it will call takePic
