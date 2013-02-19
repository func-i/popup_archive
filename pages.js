var svgElem, svgWidth, svgHeight, circleMatrix;
var audioSourceCircle;

var MAIN_PAGE_SCROLL_HEIGHT = 800;

$(function(){
  $(document).scroll(function(){
  });
});

function initSVG(){
  svgWidth = window.innerWidth;
  svgHeight = window.innerHeight;
  svgElem = Raphael('svg_container', svgWidth, svgHeight);


  circleMatrix = new Array(Math.ceil(svgWidth/BOX_WIDTH));
  for(var x = BOX_WIDTH/2; x < svgWidth; x += BOX_WIDTH)
  {
    circleMatrix[x/BOX_WIDTH - 0.5] = new Array(Math.ceil(svgHeight/BOX_WIDTH));
    for(var y = BOX_WIDTH/2; y < svgHeight; y += BOX_WIDTH)
    {
      circleMatrix[x/BOX_WIDTH - 0.5][y/BOX_WIDTH - 0.5] = new Circle(x, y, svgElem);
      circleMatrix[x/BOX_WIDTH - 0.5][y/BOX_WIDTH - 0.5].init();
    }
  }

  var randomXCoor = (svgWidth - 2*BOX_WIDTH)*Math.random() + BOX_WIDTH;
  var randomYCoor = (svgHeight - 2*BOX_WIDTH)*Math.random() + BOX_WIDTH;
  var audioXCoor = randomXCoor - (randomXCoor - BOX_WIDTH/2) % BOX_WIDTH;
  var audioYCoor = randomYCoor - (randomYCoor - BOX_WIDTH/2) % BOX_WIDTH;
  audioSourceCircle =  new AudioSourceCircle(audioXCoor, audioYCoor, svgElem);
  audioSourceCircle.init();
};

function loadMainPage(){
  circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] .hide();
  circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] = audioSourceCircle;

  audioContext = new webkitAudioContext();

  loadAudio();
  loadNoise();

  $('svg').mousemove(function(e){
    if(audioVolumeControl){
      audioVolumeControl.gain.value = MAX_AUDIO_GAIN * (1 - Math.abs(e.clientX - audioSourceCircle.x)/svgWidth) * Math.max(0,(MAIN_PAGE_SCROLL_HEIGHT - $(document).scrollTop())/MAIN_PAGE_SCROLL_HEIGHT);
    }
    if(noiseVolumeControl){
      noiseVolumeControl.gain.value = MAX_NOISE_GAIN * Math.abs(e.clientY - audioSourceCircle.y)/svgHeight * Math.max(0, (MAIN_PAGE_SCROLL_HEIGHT - $(document).scrollTop())/MAIN_PAGE_SCROLL_HEIGHT);
    }
  });
};
