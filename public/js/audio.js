
    var audio_context;
    var recorder;
    var record_user_id;
    var record_test_id;
    var record_quiz_id;
    var record_token;

    function startUserMedia(stream) {
      if(audio_context!=null) {
        var input = audio_context.createMediaStreamSource(stream);
        recorder = new Recorder(input, { numChannels: 1 }); 
        recorder && recorder.record();       
      } 
    }

    function startRecording(tid=0, qid=0, uid=0, tkn='' ) {
      record_test_id = tid;
      record_quiz_id = qid;
      record_user_id = uid;
      record_token = tkn;
      enableaudiorecord();
      
    }

    function stopRecording() {
      recorder && recorder.stop();
      
      // create WAV download link using audio data blob
      createDownloadLink();

      recorder && recorder.clear();  
      disableaudiorecord();  
    }

    function createDownloadLink() {
      recorder && recorder.exportWAV(function(blob) { 
        
      });
    }

    function enableaudiorecord() {
      audio_context = new AudioContext;
      navigator.getUserMedia({audio: true}, startUserMedia, function(e) { });      
    }

    function disableaudiorecord() {
      audio_context = null;
      recorder = null;
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

