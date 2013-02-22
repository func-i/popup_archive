var audioContext, audioSource, audioVolumeControl, noiseSource, noiseVolumeControl;

function startSound(audioSourceCircle, svgElem){
  audioContext = new webkitAudioContext();
  loadAudio();
  loadNoise();

  $(svgElem).mousemove(function(e){
    if(audioVolumeControl){
      audioVolumeControl.gain.value = MAX_AUDIO_GAIN * (1 - Math.abs(e.clientX - audioSourceCircle.x)/$(svgElem).width()) * Math.max(0,(800 - $(document).scrollTop())/800);
    }
    if(noiseVolumeControl){
      noiseVolumeControl.gain.value = MAX_NOISE_GAIN * Math.abs(e.clientY - audioSourceCircle.y)/$(svgElem).height() * Math.max(0, (800 - $(document).scrollTop())/800);
    }
  });
};

function pauseSound(){
    if(audioVolumeControl){
      audioVolumeControl.gain.value = 0;
    }
    if(noiseVolumeControl){
      noiseVolumeControl.gain.value = 0;
    }
};

function playSound(){
    if(audioVolumeControl){
      audioVolumeControl.gain.value = 1;
    }
    if(noiseVolumeControl){
      noiseVolumeControl.gain.value = 0;
    }
};

function loadAudio(){
  var request = new XMLHttpRequest();
  request.open('get',
    'MLKDream.ogg',
    true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    audioContext.decodeAudioData(
      request.response,
      function(incomingBuffer) {
        connectAudio(incomingBuffer); // Not defined yet
        audioSource.noteOn(0);
      },
      function (e) {console.log(e);}
    );
  };
  request.send();
};

function connectAudio(buffer) {
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = buffer;
  audioSource.loop = true;

  audioVolumeControl = audioContext.createGainNode();
  audioSource.connect(audioVolumeControl);
  audioVolumeControl.connect(audioContext.destination);
};

function loadNoise(){
  var request = new XMLHttpRequest();
  request.open('get',
    'white-noise.ogg',
    true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    audioContext.decodeAudioData(
      request.response,
      function(incomingBuffer) {
        connectNoise(incomingBuffer); // Not defined yet
        noiseSource.noteOn(0);
      },
      function (e) {console.log(e);}
    );
  };
  request.send();
};

function connectNoise(buffer) {
  noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  noiseVolumeControl = audioContext.createGainNode();
  noiseVolumeControl.gain.value = MAX_NOISE_GAIN;
  noiseSource.connect(noiseVolumeControl);
  noiseVolumeControl.connect(audioContext.destination);
};
