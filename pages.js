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
  showAudioSourceCircle();

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

var pathQueue;
var pageOneIntervalTimer;
function loadPageOne(){
  resetNonAudioPages();

  for(var x = 0; x < circleMatrix.length; x++){
    for(var y = 0; y < circleMatrix[x].length; y++){
      var blur = 5 * ($('#page_one .container').width() - x*BOX_WIDTH) / $('#page_one .container').width();
      if(blur > 0)
        circleMatrix[x][y].blur(blur);
    }
  }

  //Choose a random circle
  pathQueue = [];
  pageOneIntervalTimer = setInterval(connectRandomCircle, 2000);
};

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

var bubbleArray;
var pageTwoIntervalTimer;
function loadPageTwo(){
  resetNonAudioPages();

  //Bubble from bottom to top
  bubbleArray = new Array(circleMatrix.length);
  pageTwoIntervalTimer = setInterval(bubbleToTop, 500);
};

function bubbleToTop(){
  for(var x = 0; x < bubbleArray.length; x++){
    var nextBubble;
    var currentBubble = bubbleArray[x];

    if(typeof currentBubble == 'undefined'){
      if(Math.random()*Math.random() < 0.5)
        continue;

      nextBubble = circleMatrix[x][circleMatrix[x].length - 1];
    }
    else{
      var currentYIndex = currentBubble.y / BOX_WIDTH - 0.5;

      if(currentYIndex == 0 || !circleMatrix[x][currentYIndex - 1].isVisible()){
        nextBubble = undefined;
      }
      else
        nextBubble = circleMatrix[x][currentYIndex - 1];

      currentBubble.reset(0.5);
    }

    if(typeof nextBubble != 'undefined'){
      nextBubble.grow(0.5, 700);

      if(0 == nextBubble.y / BOX_WIDTH - 0.5 || !circleMatrix[x][nextBubble.y / BOX_WIDTH - 0.5 - 1].isVisible())
        nextBubble.sendBroadcast(1, 0.7)
    }

    bubbleArray[x] = nextBubble;
  }
};

function loadPageThree(){
  resetNonAudioPages();

  circleMatrix[4][4].grow(3, 1500);
  circleMatrix[4][4].callOnNeighbours(1, function(){
    this.innerCircle.stop().animate({'opacity': 0}, 1500);
    this.outerCircle.stop().animate({'opacity': 0}, 1500);
  });
  circleMatrix[4][4].startBroadcast(1, 0.7, 1000);

  circleMatrix[9][2].grow(3, 1500);
  circleMatrix[9][2].callOnNeighbours(1, function(){
    this.innerCircle.stop().animate({'opacity': 0}, 1500);
    this.outerCircle.stop().animate({'opacity': 0}, 1500);
  });
  circleMatrix[9][2].startBroadcast(1, 0.7, 1000);
};

var currentColoredColumnIndex;
var pageFourIntervalTimer;
function loadPageFour(){
  resetNonAudioPages();

  currentColoredColumnIndex = undefined;
  pageFourIntervalTimer = setInterval(colorColumn, 1500);
};

function colorColumn(){
  if(typeof currentColoredColumnIndex != 'undefined'){
    for(var y = 0; y < circleMatrix[currentColoredColumnIndex].length; y++){
      circleMatrix[currentColoredColumnIndex][y].colorOff();
    }

    currentColoredColumnIndex = currentColoredColumnIndex + 1
  }

  if(typeof currentColoredColumnIndex == 'undefined' || currentColoredColumnIndex >= circleMatrix.length)
    currentColoredColumnIndex = 0;

  for(var y = 0; y < circleMatrix[currentColoredColumnIndex].length; y++){
    if(typeof circleMatrix[currentColoredColumnIndex][y] != 'undefined' && circleMatrix[currentColoredColumnIndex][y].isVisible())
      circleMatrix[currentColoredColumnIndex][y].colorOn();
  }
};

function resetNonAudioPages(){
  cancelAllTimers();

  hideAudioSourceCircle();

  hoverHandlerOn = false;
  clickHandlerOn = false;

  for(var x = 0; x < circleMatrix.length; x++)
    for(var y = 0; y < circleMatrix[x].length; y++){
      circleMatrix[x][y].reset();
    }
};

function cancelAllTimers(){
  clearInterval(pageOneIntervalTimer);
  clearInterval(pageTwoIntervalTimer);
  clearInterval(pageFourIntervalTimer);
}

function hideAudioSourceCircle(){
  audioSourceCircle.hide();
  audioSourceCircle.stopBroadcast();

  if(circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] instanceof AudioSourceCircle){
    circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] = new Circle(audioSourceCircle.x, audioSourceCircle.y, svgElem);
    circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5].init();
  }
};

function showAudioSourceCircle(){
  audioSourceCircle.show();
  audioSourceCircle.startBroadcast(1, 0.7);

  if(!(circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] instanceof AudioSourceCircle)){
    circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5].remove();
    circleMatrix[audioSourceCircle.x/BOX_WIDTH - 0.5][audioSourceCircle.y/BOX_WIDTH - 0.5] = audioSourceCircle;
  }
};
