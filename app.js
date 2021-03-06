// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger"),
    cameraRescan = document.querySelector("#rescan")
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
        cameraView.play();
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}
// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    document.getElementById('ocr_text').innerHTML="Extracting Text..."; //Changing View Panel Message

    //Capturing image and preparing payload
    const contentType = 'image/png';
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    var dataURL = cameraOutput.src = cameraSensor.toDataURL(contentType);
    //console.log(cameraOutput.src);

    //console.log(dataURL);


    const b64Data = dataURL.substring(13 + contentType.length, (dataURL.length-1));
    //console.log(b64Data)
//*    const blob = b64toBlob(b64Data, contentType);
//    const blobUrl = URL.createObjectURL(blob);

  //  console.log(blobUrl);  

// *   var fd = new FormData();
// *   fd.append("image",  blob, 'capture.png');
// *   for (var key of fd.entries()) {
// *     console.log(key[0] + ', ' + key[1]);
// *  }

    $.ajax({
        type: 'POST',
        url: 'https://captainpool.co:1080/img',
        data: b64Data,
        processData: false,
        contentType: false,
        dataType:"json"
    }).done(function(data) {
          console.log("Data Sent.");
          console.log(data);
          if(data.text!="")
          document.getElementById('ocr_text').innerHTML=(data.text);
          else
          document.getElementById('ocr_text').innerHTML="Error Extracting Text. Please try again :(";
    })
    .fail(function() {
        document.getElementById('ocr_text').innerHTML="Aw Snap! Could not reach Server. Please try again! :(";});
    

    /*var form = document.getElementById("postImage");
    var formDataToUpload = new FormData(form);
    formDataToUpload.append("image", blobUrl);

    $.ajax({
      url:"http://35.224.223.39:1080/img",
      data: formDataToUpload,// Add as Data the Previously create formData
      type:"POST",
      contentType:false,
      processData:false,
      cache:false,
      dataType:"json", // Change this according to your response from the server.
      error:function(err){
          console.error(err);
      },
      success:function(data){
          console.log(data);
      },
      complete:function(){
          console.log("Request finished.");
      }
  });*/

    /*fetch(dataURL)
    .then(res => res.blob())
    .then(console.log)*/
    
    cameraOutput.classList.add("taken");
};


//converting base64 to blob
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }



// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
