var audioContext, bufferLoader, audioList;

function initAudio(){
  audioContext = new webkitAudioContext();

  audioList = [];

  var tmpAudioList = [];

  for(var i = 0; i < AUDIO_SOURCES.length; i++)
  {
    var audio = new Audio();
    audio.src = AUDIO_SOURCES[i];
    audio.controls = false;
    audio.autoplay = true;
    audio.loop = true;
    document.body.appendChild(audio);
    tmpAudioList.push(audio);
  }

  window.addEventListener('load', function(e){
    for(var i = 0; i < tmpAudioList.length; i++){
      var audio = tmpAudioList[i];

      var source = audioContext.createMediaElementSource(audio);
      source.loop = true;

      var volumeControl = audioContext.createGainNode();
      volumeControl.gain.value = 0;

      var filter = audioContext.createBiquadFilter();
      filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
      filter.frequency.value = 800;

      source.connect(filter);
      filter.connect(volumeControl);
      volumeControl.connect(audioContext.destination);

      audioList[i] = {'source': source, 'volume':volumeControl, 'filter': filter};
    }
  });

};

function playAudio(index){
  if(index >= audioList.length) return;
  audioList[index].volume.gain.value = 1;
};

function pauseAudio(index){
  if(index >= audioList.length) return;
  audioList[index].volume.gain.value = 0;
};

function pauseAllAudio(){
  for(var i = 0; i < audioList.length; i++)
    pauseAudio(i);
};

function setPlaybackRate(rate){
  for(var i = 0; i < audioList.length; i++){
    audioList[i].source.mediaElement.playbackRate = rate;

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
