var svgElem, svgWidth, svgHeight, circleMatrix;
var audioSourceCircle;

var MAIN_PAGE_SCROLL_HEIGHT = 800;

$(function(){
  $(document).scroll(function(e){
    if(e.scrollTop > MAIN_PAGE_SCROLL_HEIGHT)
      unloadMainPage();

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
  circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5].remove();
  audioSourceCircle.show();
  circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] = audioSourceCircle;

  audioContext = new webkitAudioContext();

  //loadAudio();
  //loadNoise();

  hoverHandlerOn = true;
  clickHandlerOn = true;

  $('svg').mousemove(function(e){
    if(audioVolumeControl){
      audioVolumeControl.gain.value = MAX_AUDIO_GAIN * (1 - Math.abs(e.clientX - audioSourceCircle.x)/svgWidth) * Math.max(0,(MAIN_PAGE_SCROLL_HEIGHT - $(document).scrollTop())/MAIN_PAGE_SCROLL_HEIGHT);
    }
    if(noiseVolumeControl){
      noiseVolumeControl.gain.value = MAX_NOISE_GAIN * Math.abs(e.clientY - audioSourceCircle.y)/svgHeight * Math.max(0, (MAIN_PAGE_SCROLL_HEIGHT - $(document).scrollTop())/MAIN_PAGE_SCROLL_HEIGHT);
    }
  });
};

function loadPageOne(){
  audioSourceCircle.hide();
  circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] = new Circle(audioSourceCircle.x, audioSourceCircle.y, svgElem);
  circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5].init();

  hoverHandlerOn = false;
  clickHandlerOn = false;

  for(var x = 0; x < circleMatrix.length; x++)
    for(var y = 0; y < circleMatrix[x].length; y++)
      circleMatrix[x][y].reset();

  //Choose a random circle
  setInterval(connectRandomCircle, 2000);
};

var pathQueue = [];
function connectRandomCircle(){
  if(pathQueue.length > 5){
    var removedPathArr = pathQueue.shift();
    removedPathArr[0].removePath(removedPathArr[1], removedPathArr[2]);
  }

  var randomUncoveredXCoor = (svgWidth - Math.ceil($('#page_one .container').width()))*Math.random() + Math.ceil($('#page_one .container').width());
  randomUncoveredXCoor = randomUncoveredXCoor - (randomUncoveredXCoor - BOX_WIDTH/2)%BOX_WIDTH;
  var randomYCoor = svgHeight*Math.random();
  randomYCoor = randomYCoor - (randomYCoor - BOX_WIDTH/2)%BOX_WIDTH;
  var newConnectedCircle = circleMatrix[randomUncoveredXCoor/BOX_WIDTH - 0.5][randomYCoor/BOX_WIDTH - 0.5];


  var connectFromCircle;
  if(pathQueue.length == 0){
    randomUncoveredXCoor = (svgWidth - Math.ceil($('#page_one .container').width()))*Math.random() + Math.ceil($('#page_one .container').width());
    randomUncoveredXCoor = randomUncoveredXCoor - (randomUncoveredXCoor - BOX_WIDTH/2)%BOX_WIDTH;
    randomYCoor = svgHeight*Math.random();
    randomYCoor = randomYCoor - (randomYCoor - BOX_WIDTH/2)%BOX_WIDTH;

    connectFromCircle = circleMatrix[randomUncoveredXCoor/BOX_WIDTH - 0.5][randomYCoor/BOX_WIDTH - 0.5];
  }
  else{
    connectFromCircle = pathQueue[pathQueue.length - 1][1]
  }

  var path = connectFromCircle.connectNeighbourWithArc(newConnectedCircle);

  pathQueue.push([connectFromCircle, newConnectedCircle, path]);
};
