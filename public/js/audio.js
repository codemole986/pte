  var audio_context;
  var recorder;

  function startUserMedia(stream) {
    if(audio_context!=null) {
      var input = audio_context.createMediaStreamSource(stream);
      recorder = new Recorder(input, { numChannels: 1 });    
    } 
  }

  function startRecording() {
    enableaudiorecord();
    recorder && recorder.record();    
  }

  function stopRecording() {
    recorder && recorder.stop();
    
    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();  
    disableaudiorecord();  
  }

  function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) { });
  }

  function enableaudiorecord() {
    audio_context = new AudioContext;
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) { });
  }

  function disableaudiorecord() {
    audio_context = null;
  }

  window.onload = function init() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
      window.URL = window.URL || window.webkitURL;

      

    } catch (e) {
      alert('No web audio support in this browser!');
    }

  };
