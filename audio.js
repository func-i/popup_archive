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
        playAudio(incomingBuffer); // Not defined yet
      },
      function (e) {console.log(e);}
    );
  };
  request.send();
};

function playAudio(buffer) {
  var source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  audioVolumeControl = audioContext.createGainNode();
  source.connect(audioVolumeControl);
  audioVolumeControl.connect(audioContext.destination);

  source.noteOn(0);
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
        playNoise(incomingBuffer); // Not defined yet
      },
      function (e) {console.log(e);}
    );
  };
  request.send();
};

function playNoise(buffer) {
  var source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  noiseVolumeControl = audioContext.createGainNode();
  noiseVolumeControl.gain.value = MAX_NOISE_GAIN;
  source.connect(noiseVolumeControl);
  noiseVolumeControl.connect(audioContext.destination);

  source.noteOn(0);
};
