(function(window){

  var WORKER_PATH = 'js/recorderWorker.js';
  var encoderWorker = new Worker('js/mp3Worker.js');

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    var numChannels = config.numChannels || 2;

    this.context = source.context;
    this.node = (this.context.createScriptProcessor ||
                 this.context.createJavaScriptNode).call(this.context,
                 bufferLen, numChannels, numChannels);

    var worker = new Worker(config.workerPath || WORKER_PATH);

    
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: numChannels
      }
    });

    var recording = false,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      var buffer = [];
      for (var channel = 0; channel < numChannels; channel++){
          buffer.push(e.inputBuffer.getChannelData(channel));
      }
      worker.postMessage({
        command: 'record',
        buffer: buffer
      });
    }	
    
    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
		recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffer = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffer' })
    }

    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });      
    }

	//Mp3 conversion
    worker.onmessage = function(e){
    	
      var blob = e.data;
	  
	  var arrayBuffer;
	  var fileReader = new FileReader();

	  fileReader.onload = function(){
	  	
		arrayBuffer = this.result;
		
		var buffer = new Uint8Array(arrayBuffer),
        data = parseWav(buffer);

        encoderWorker.postMessage({ cmd: 'init', config:{
            mode : 3,
			channels:1,
			samplerate: data.sampleRate,
			bitrate: data.bitsPerSample
        }});

        encoderWorker.postMessage({ cmd: 'encode', buf: Uint8ArrayToFloat32Array(data.samples) });
        encoderWorker.postMessage({ cmd: 'finish'});
        encoderWorker.onmessage = function(e) {
            if (e.data.cmd == 'data') {

				/*var audio = new Audio();
				audio.src = 'data:audio/mp3;base64,'+encode64(e.data.buf);
				audio.play();*/
				$('#divselfaudiosource').html("");
				var au = document.createElement('audio');
				au.controls = true;
				au.controlsList = "nodownload";
				au.src = 'data:audio/mp3;base64,'+encode64(e.data.buf);
				document.getElementById('divselfaudiosource').appendChild(au);
				
				/*var mp3Blob = new Blob([new Uint8Array(e.data.buf)], {type: 'audio/mp3'});
				uploadAudio2(mp3Blob);*/

            }
        };
	  };

	  fileReader.readAsArrayBuffer(blob);

      currCallback(blob);
    }


	function encode64(buffer) {
		var binary = '',
			bytes = new Uint8Array( buffer ),
			len = bytes.byteLength;

		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		return window.btoa( binary );
	}

	function parseWav(wav) {
		function readInt(i, bytes) {
			var ret = 0,
				shft = 0;

			while (bytes) {
				ret += wav[i] << shft;
				shft += 8;
				i++;
				bytes--;
			}
			return ret;
		}
		if (readInt(20, 2) != 1) throw 'Invalid compression code, not PCM';
		if (readInt(22, 2) != 1) throw 'Invalid number of channels, not 1';
		return {
			sampleRate: readInt(24, 4),
			bitsPerSample: readInt(34, 2),
			samples: wav.subarray(44)
		};
	}

	function Uint8ArrayToFloat32Array(u8a){
		var f32Buffer = new Float32Array(u8a.length);
		for (var i = 0; i < u8a.length; i++) {
			var value = u8a[i<<1] + (u8a[(i<<1)+1]<<8);
			if (value >= 0x8000) value |= ~0x7FFF;
			f32Buffer[i] = value / 0x8000;
		}
		return f32Buffer;
	}

	function uploadAudio2(mp3Data){
		var reader = new FileReader();
		reader.onload = function(event){
			

			/*var fd = new FormData();
			var mp3Name = encodeURIComponent('speaking-' + new Date().getTime() + '.mp3');
			fd.append('fname', mp3Name);
			fd.append('data', event.target.result);
			fd.append('testid', record_test_id);
			fd.append('quizid', record_quiz_id);
			fd.append('userid', record_user_id);
			fd.append('_token', record_token);
			$.ajax({
				type: 'POST',
				url: '/answer/uploadaudio',
				data: fd,
				processData: false,
				contentType: false
			}).done(function(data) {
				var res = JSON.parse(data);
				if(res.status == "Success") {
					var saudio_src = "";
					if(record_test_id == 0) {
						saudio_src = "/recordings/"+record_user_id+"/"+record_quiz_id+"/"+record_quiz_id+"-"+mp3Name;
					} else {
						saudio_src = "/recordings/"+record_test_id+"/"+record_quiz_id+"/"+record_quiz_id+"-"+mp3Name;
					}
					
					var au = document.createElement('audio');
					au.controls = true;
					au.src = saudio_src;
					document.getElementById('divselfaudiosource').appendChild(au);
									
				} else {
					alert("audio-file upload fail.");	
				}
			});*/
		};
		reader.readAsDataURL(mp3Data);
	}

    source && source.connect(this.node);
    this.node && this.node.connect(this.context.destination);    //this should not be necessary
  };

  
  window.Recorder = Recorder;

})(window);
