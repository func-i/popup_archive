var audioContext, bufferLoader, audioList;

function initAudio(){
  audioContext = new webkitAudioContext();

  audioList = [];

  bufferLoader = new BufferLoader(
    audioContext,
    [
      'MLKDream.ogg',
      'sc_post.mp3'
    ],
    finishedLoadingAudio
    );

  bufferLoader.load();
};

function finishedLoadingAudio(bufferList){
  for(var i = 0; i < bufferList.length; i++){
    var source = audioContext.createBufferSource();
    source.buffer = bufferList[i];
    source.loop = true;

    var volumeControl = audioContext.createGainNode();
    volumeControl.gain.value = 0;

    var filter = audioContext.createBiquadFilter();
    filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
    filter.frequency.value = 800;

    source.connect(volumeControl);
    filter.connect(volumeControl);
    volumeControl.connect(audioContext.destination);

    audioList.push({'source': source, 'volume':volumeControl, 'filter': filter});
  }
};

function playAudio(index){
  if(index >= audioList.length) return;
  audioList[index].volume.gain.value = 1;
  audioList[index].source.noteOn(0);
};

function pauseAudio(index){
  if(index >= audioList.length) return;
  audioList[index].volume.gain.value = 0;
};

function pauseAllAudio(){
  for(var i = 0; i < audioList.length; i++)
    pauseAudio(i);
}

function setPlaybackRate(rate){
  for(var i = 0; i < audioList.length; i++){
    audioList[i].source.playbackRate.value = rate;

    audioList[i].source.disconnect(0);
    audioList[i].filter.disconnect(0);

    if(rate == 1){
      audioList[i].source.connect(audioList[i].volume);
      //audioList[i].volumne.gain.value = audioList[i].volumne.gain.value == 0 ? 0 : 1;
    }
    else{
      audioList[i].source.connect(audioList[i].filter);
      audioList[i].filter.connect(audioList[i].volume);
//      audioList[i].volumne.gain.value = 2*audioList[i].volumne.gain.value;
    }
  }
};


/*
function startSound(svgElem){
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
    ,
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
};*/


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
