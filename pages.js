var svgElem, svgWidth, svgHeight, svgTopMargin, circleMatrix;
var audioSourceCircle;

var MAIN_PAGE_SCROLL_HEIGHT = 800;
var PAGE_ONE_SCROLL_HEIGHT = 1600;
var PAGE_TWO_SCROLL_HEIGHT = 2400;
var PAGE_THREE_SCROLL_HEIGHT = 3200;
var PAGE_FOUR_SCROLL_HEIGHT = 4000;
var PAGE_FIVE_SCROLL_HEIGHT = 4800;
var PAGE_SIX_SCROLL_HEIGHT = 5600;

var currentPage;
$(function(){
  $(document).scroll(function(e){
    loadCorrectPage();
  });
});

function loadCorrectPage(){
    var scrollTop = $(window).scrollTop() + window.innerHeight;
    if(scrollTop < MAIN_PAGE_SCROLL_HEIGHT){
      if(currentPage != 0){
        currentPage = 0;
        loadMainPage();
      }
    }
    else if(scrollTop < PAGE_ONE_SCROLL_HEIGHT){
      if(currentPage != 1){
        currentPage = 1;
        loadPageOne();
      }
    }
    else if(scrollTop < PAGE_TWO_SCROLL_HEIGHT){
      if(currentPage != 2){
        currentPage = 2;
        loadPageTwo();
      }
    }
    else if(scrollTop < PAGE_THREE_SCROLL_HEIGHT){
      if(currentPage != 3){
        currentPage = 3;
        loadPageThree();
      }
    }
    else if(scrollTop < PAGE_FOUR_SCROLL_HEIGHT){
      if(currentPage != 4){
        currentPage = 4;
        loadPageFour();
      }
    }
    else if(scrollTop < PAGE_FIVE_SCROLL_HEIGHT){
      if(currentPage != 5){
        currentPage = 5;
        loadPageFive();
      }
    }
    else if(scrollTop < PAGE_SIX_SCROLL_HEIGHT){
      if(currentPage != 6){
        currentPage = 6;
        loadPageSix();
      }
    }
    else{
      if(currentPage != 0){
        currentPage = 0;
        loadPageSeven();
      }
    }
}

function initSVG(){
  svgWidth = window.innerWidth;
  svgHeight = $('#svg_container').height();
  svgTopMargin = $('header').height();
  svgElem = Raphael('svg_container', svgWidth, svgHeight);

  circleMatrix = new Array(Math.ceil(svgWidth/BOX_WIDTH));
  for(var x = BOX_WIDTH/2; x <= svgWidth; x += BOX_WIDTH)
  {
    var coorX = Circle.convertCoordinatesIntoMatrixIndex(x, null)[0];
    circleMatrix[coorX] = new Array(Math.ceil((svgHeight - svgTopMargin)/BOX_WIDTH));
    for(var y = svgTopMargin + BOX_WIDTH/2; y <= svgHeight; y += BOX_WIDTH)
    {
      coorY = Circle.convertCoordinatesIntoMatrixIndex(null, y)[1];
      circleMatrix[coorX][coorY] = new Circle(x, y, svgElem);
      circleMatrix[coorX][coorY].init();
    }
  }

  var replaceCircleForAudio = getRandomCircle(1, 1, circleMatrix.length - 2, circleMatrix[0].length - 2);
  audioSourceCircle =  new AudioSourceCircle(replaceCircleForAudio.x, replaceCircleForAudio.y, svgElem);
  audioSourceCircle.init();
};

function loadMainPage(){
  cancelAllTimers();
  hideAllPages();

  showAudioSourceCircle();

  hoverHandlerOn = true;
  clickHandlerOn = true;

  setRandomColors();

  for(var x = 0; x < circleMatrix.length; x++)
    for(var y = 0; y < circleMatrix[x].length; y++){
      circleMatrix[x][y].show();
      circleMatrix[x][y].reset();
    }

  audioContext = new webkitAudioContext();

  //loadAudio();
  //loadNoise();

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
  hideAllPages();
  showPage(1);

  setRandomColors();
  resetNonAudioPages();
  resetAllCircles();

  var rightPosOfText = Math.ceil(($('#content_container').offset().left + $('.page.active').first().width()) / BOX_WIDTH);

  for(var x = 0; x < circleMatrix.length; x++){
    for(var y = 0; y < circleMatrix[x].length; y++){
      var blur = 5 * (rightPosOfText - x) / rightPosOfText;
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
    removedPathArr[0].removePath(removedPathArr[2], removedPathArr[1]);
  }

  var rightPosOfText = Math.ceil(($('#content_container').offset().left + $('.page.active').first().width()) / BOX_WIDTH);
  var newConnectedCircle = getRandomVisibleCircle(rightPosOfText, 0, circleMatrix.length - rightPosOfText, circleMatrix[0].length);

  var connectFromCircle;
  if(pathQueue.length == 0){
    connectFromCircle = getRandomVisibleCircle(rightPosOfText, 0, circleMatrix.length - rightPosOfText, circleMatrix[0].length);
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
  hideAllPages();
  showPage(2);

  setRandomColors();
  resetNonAudioPages();
  resetAllCircles();

  //Bubble from bottom to top
  bubbleArray = new Array(circleMatrix.length);
  pageTwoIntervalTimer = setInterval(bubbleToTop, 500);
};

function bubbleToTop(){
  for(var x = 0; x < bubbleArray.length; x++){
    var nextBubble;
    var currentBubble = bubbleArray[x];

    if(typeof currentBubble == 'undefined'){
      if(Math.random() < 0.75)
        continue;

      nextBubble = circleMatrix[x][circleMatrix[x].length - 1];
    }
    else{
      var currentYIndex = Circle.convertCoordinatesIntoMatrixIndex(null, currentBubble.y)[1];

      if(currentYIndex == 0 || !circleMatrix[x][currentYIndex - 1].isVisible()){
        nextBubble = undefined;
      }
      else
        nextBubble = circleMatrix[x][currentYIndex - 1];

      currentBubble.reset(0.5);
    }

    if(typeof nextBubble != 'undefined'){
      nextBubble.grow(1, 700);

      var nextYIndex = Circle.convertCoordinatesIntoMatrixIndex(null, nextBubble.y)[1];

      if(0 == nextYIndex || !circleMatrix[x][nextYIndex].isVisible())
        nextBubble.sendBroadcast(1, 0.7)
    }

    bubbleArray[x] = nextBubble;
  }
};

function loadPageThree(){
  hideAllPages();
  showPage(3);

  setRandomColors();
  resetNonAudioPages();
  resetAllCircles();

  circleMatrix[4][3].grow(3, 1500);
  circleMatrix[4][3].callOnNeighbours(1, function(){
    this.innerCircle.stop().animate({'opacity': 0}, 1500);
    this.outerCircle.stop().animate({'opacity': 0}, 1500);
  });
  circleMatrix[4][3].startBroadcast(1, 0.7, 1000);

  circleMatrix[9][1].grow(3, 1500);
  circleMatrix[9][1].callOnNeighbours(1, function(){
    this.innerCircle.stop().animate({'opacity': 0}, 1500);
    this.outerCircle.stop().animate({'opacity': 0}, 1500);
  });
  circleMatrix[9][1].startBroadcast(1, 0.7, 1000);
};

var currentColoredColumnIndex;
var pageFourIntervalTimer;
function loadPageFour(){
  hideAllPages();
  showPage(4);

  resetNonAudioPages();
  resetAllCircles();
  setRandomColors();

  for(var x = 0; x < circleMatrix.length; x++){
    var hideLength = Math.floor(circleMatrix[x].length*Math.random()) - 1;

    for(var y = 0; y <hideLength; y++)
      circleMatrix[x][y].hide();
  }

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

var swappedInnerRadiuses;
var pageFiveIntervalTimer;

function loadPageFive(){
  hideAllPages();
  showPage(5);

  resetNonAudioPages();

  //Split the screen width in 3 and set size of innerRadius accordingly
  for(var x = 0; x < circleMatrix.length; x++){
    var innerRadius;
    if(x < Math.floor(circleMatrix.length/3)) innerRadius = 10;
    else if(x < 2*Math.floor(circleMatrix.length/3)) innerRadius = 25;
    else innerRadius = 17;

    for(var y = 0; y < circleMatrix[x].length; y++)
      circleMatrix[x][y].setInnerRadius(innerRadius);
  }

  swapRandomInnerRadiuses();

  setRandomColors();
  resetAllCircles();

  //returnSwappedRadiuses();
  pageFiveIntervalTimer = setTimeout(returnSwappedRadiuses, 5000);
};

function returnSwappedRadiuses(){
  if(swappedInnerRadiuses.length == 0) return;

  var randomIndex = Math.floor(swappedInnerRadiuses.length*Math.random());
  var swappedRadiuses = swappedInnerRadiuses[randomIndex];

  var circle1 = swappedRadiuses[0];
  var circle2 = swappedRadiuses[1];

  var circle1Radius = circle1.currentInnerRadius();
  var circle2Radius = circle2.currentInnerRadius();

  var circle1Fill = circle1.innerCircleColor;
  var circle2Fill = circle2.innerCircleColor;

  circle1.colorOn();
  circle2.colorOn();

  circle1.innerCircle.animate({opacity: 0}, 2000, function(){
    circle1.innerCircle.attr({
      r: circle2Radius,
      fill: circle2Fill
    });

    var swapAnim = Raphael.animation({opacity: 1}, 1000, function(){
      circle1.colorOff();
    });

    circle1.innerCircle.animate(swapAnim.delay(2000));
  });

  circle2.innerCircle.animate({opacity: 0}, 2000, function(){
    circle2.innerCircle.attr({
      r: circle1Radius,
      fill: circle1Fill
    });

    var swapAnim = Raphael.animation({
      opacity: 1
    }, 1000, function(){
      circle2.colorOff();
    })

    circle2.innerCircle.animate(swapAnim.delay(2000));
  });

  swappedInnerRadiuses.splice(randomIndex, 1);

  pageFiveIntervalTimer = setTimeout(returnSwappedRadiuses, 7000);
}

function swapRandomInnerRadiuses(){
  swappedInnerRadiuses = [];

  var height = circleMatrix[0].length;
  var firstSectionStart = 0;
  var firstSectionWidth = Math.floor(circleMatrix.length/3);
  var secondSectionStart = Math.floor(circleMatrix.length/3);
  var secondSectionWidth = Math.floor(circleMatrix.length/3);
  var thirdSectionStart = 2*Math.floor(circleMatrix.length/3);
  var thirdSectionWidth = circleMatrix.length - 2*Math.floor(circleMatrix.length/3);
  //Swap 1st and 2nd section
  for(var i = 0; i < 3; i++){
    var firstSectionRandomCircle = getVisibleUnSwappedRandomCircle(firstSectionStart, 0, firstSectionWidth, height, 10);
    var secondSectionRandomCircle = getVisibleUnSwappedRandomCircle(secondSectionStart, 0, secondSectionWidth, height, 25);
    firstSectionRandomCircle.setInnerRadius(25);
    secondSectionRandomCircle.setInnerRadius(10);
    swappedInnerRadiuses.push([firstSectionRandomCircle, secondSectionRandomCircle]);
  }
  //Swap 1st and 3rd section
  for(var i = 0; i < 3; i++){
    var firstSectionRandomCircle = getVisibleUnSwappedRandomCircle(firstSectionStart, 0, firstSectionWidth, height, 10);
    var thirdSectionRandomCircle = getVisibleUnSwappedRandomCircle(thirdSectionStart, 0, thirdSectionWidth, height, 17);
    firstSectionRandomCircle.setInnerRadius(17);
    thirdSectionRandomCircle.setInnerRadius(10);
    swappedInnerRadiuses.push([firstSectionRandomCircle, thirdSectionRandomCircle]);
  }
  //Swap 1st and 3rd section
  for(var i = 0; i < 3; i++){
    var secondSectionRandomCircle = getVisibleUnSwappedRandomCircle(secondSectionStart, 0, secondSectionWidth, height, 25);
    var thirdSectionRandomCircle = getVisibleUnSwappedRandomCircle(thirdSectionStart, 0, thirdSectionWidth, height, 17);
    secondSectionRandomCircle.setInnerRadius(17);
    thirdSectionRandomCircle.setInnerRadius(25);
    swappedInnerRadiuses.push([secondSectionRandomCircle, thirdSectionRandomCircle]);
  }
};

function getVisibleUnSwappedRandomCircle(xOffset, yOffset, width, height, unSwappedRadius){
    while(true){
      var randomCircle = getRandomCircle(xOffset, yOffset, width, height);

      if(randomCircle.isVisible() && randomCircle.currentInnerRadius() == unSwappedRadius)
        return randomCircle;
    }
};

var pageSixIntervalTimer;
function loadPageSix(){
  hideAllPages();
  showPage(6);

  resetNonAudioPages();

  var rightPosOfText = Math.ceil(($('#content_container').offset().left + $('.page.active').first().width()) / BOX_WIDTH);

  for(var x = circleMatrix.length - 1; x >= 0 ; x--)
  {
    if(x < rightPosOfText)
    {
      for(var y = 0; y < circleMatrix[x].length; y++)
      {
        circleMatrix[x][y].setInnerColor(RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())]);;
        circleMatrix[x][y].setOuterColor(RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())]);

        if(circleMatrix[x][y].isVisible() &&
          (y == 0 || x == circleMatrix.length - 1 || !circleMatrix[x][y-1].isVisible() || !circleMatrix[x+1][y].isVisible() || !circleMatrix[x+1][y -1].isVisible()))
        {
          circleMatrix[x][y].colorOn();
          firstVisible = false;
        }
        else{
          circleMatrix[x][y].colorOff();
        }
      }
    }
    else if(x == rightPosOfText)
      for(var y = 0; y < circleMatrix[x].length; y++)
        circleMatrix[x][y].hide();
    else{
      for(var y = 0; y < circleMatrix[x].length; y++){
        circleMatrix[x][y].setInnerColor(BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())]);;
        circleMatrix[x][y].setOuterColor(BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())]);
        circleMatrix[x][y].colorOff();
      }
    }
  }

  pageSixIntervalTimer = setInterval(swapCircles, 2000);
};

function swapCircles(){
  var rightPosOfText = Math.ceil(($('#content_container').offset().left + $('.page.active').first().width()) / BOX_WIDTH);

  var circle1 = getRandomCircle(rightPosOfText + 1, 0, circleMatrix.length - rightPosOfText - 1, circleMatrix[0].length);
  circle1.svgSet.toFront();
  var circle1X = circle1.x, circle1Y = circle1.y;
  var circle1Coor = Circle.convertCoordinatesIntoMatrixIndex(circle1X, circle1Y);

  var loop = true;
  var circle2;
  while(loop){
    var newX = circle1Coor[0] + Math.round(2*Math.random()) - 1;
    var newY = circle1Coor[1] + Math.round(2*Math.random()) - 1;

    if(newX >= circleMatrix.length
      || newY >= circleMatrix.length
      || typeof circleMatrix[newX][newY] == 'undefined'
      || !circleMatrix[newX][newY].isVisible()
      || circleMatrix[newX][newY] == circle1
      )
      continue;

    circle2 = circleMatrix[newX][newY];
    loop = false;
  }
  var circle2X = circle2.x, circle2Y = circle2.y;
  circle2.svgSet.toFront();

  var circle1Anim = Raphael.animation({'cx': circle2X, 'cy': circle2Y}, 1000, 'ease-in', function(){
    circle1.colorOff();
  });
  var circle2Anim = Raphael.animation({'cx': circle1X, 'cy': circle1Y}, 1000, 'ease-in', function(){
    circle2.colorOff();
  });
  circle1.svgSet.stop().animate(circle1Anim);
  circle2.svgSet.stop().animateWith(circle1.svgSet, circle1Anim, circle2Anim);

  circle1.colorOn();
  circle2.colorOn();

  circle1.x = circle2X;
  circle1.y = circle2Y;
  var circle2Coor = Circle.convertCoordinatesIntoMatrixIndex(circle2X, circle2Y);
  circleMatrix[circle2Coor[0]][circle2Coor[1]] = circle1;

  circle2.x = circle1X;
  circle2.y = circle1Y;
  circleMatrix[circle1Coor[0]][circle1Coor[1]] = circle2;
}

function loadPageSeven(){
  hideAllPages();
  showPage(7);

  resetNonAudioPages();
  resetAllCircles();

  for(var x = 0; x < circleMatrix.length; x++){
    var hideHeight, innerColor, outerColor;
    if(x < Math.floor(circleMatrix.length/3)){
      hideHeight = 4;
      innerColor = BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())];
      outerColor = BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())];
      delay = 2000;
    }
    else if(x < 2*Math.floor(circleMatrix.length/3)){
      hideHeight = 2;
      innerColor = GREEN_COLORS[Math.floor(GREEN_COLORS.length  * Math.random())];
      outerColor = GREEN_COLORS[Math.floor(GREEN_COLORS.length  * Math.random())];
      delay = 8000;
    }
    else{
      hideHeight = 0;
      innerColor = RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())];
      outerColor = RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())];
      delay = 14000;
    }

    for(var y = 0; y < hideHeight; y++)
      circleMatrix[x][y].hide();

    if(hideHeight == circleMatrix[x].length)
      continue;

    circleMatrix[x][hideHeight].setInnerColor(innerColor);
    circleMatrix[x][hideHeight].setOuterColor(outerColor);

    circleMatrix[x][hideHeight].colorOn(1, delay);
  }
};


function resetNonAudioPages(){
  cancelAllTimers();

  hideAudioSourceCircle();

  hoverHandlerOn = false;
  clickHandlerOn = false;

  var leftTextOffsetInBoxes = Math.floor($('#content_container').offset().left / BOX_WIDTH);
  var textWidthInBoxes = Math.ceil($('.page.active').first().width() / BOX_WIDTH);
  var textHeightInBoxes = Math.ceil($('.page.active').first().height() / BOX_WIDTH);

  for(var x = 0; x < circleMatrix.length; x++)
    for(var y = 0; y < circleMatrix[x].length; y++){
      if(x >= leftTextOffsetInBoxes && x < leftTextOffsetInBoxes + textWidthInBoxes && y < textHeightInBoxes)
        circleMatrix[x][y].hide();
      else
        circleMatrix[x][y].show();
    }
};

function resetAllCircles(){
  for(var x = 0; x < circleMatrix.length; x++)
    for(var y = 0; y < circleMatrix[x].length; y++)
        circleMatrix[x][y].reset();
};

function setRandomColors(){
  for(var x = 0; x < circleMatrix.length; x++)
    for(var y = 0; y < circleMatrix[x].length; y++){
      circleMatrix[x][y].setInnerColor();
      circleMatrix[x][y].setOuterColor();
    }
};

function getRandomCircle(xOffset, yOffset, width, height){
      var randomXIndex = Math.round((width - 1)*Math.random());
      var randomYIndex = Math.round((height -1)*Math.random());
      return circleMatrix[xOffset+randomXIndex][yOffset + randomYIndex];
};

function getRandomVisibleCircle(xOffset, yOffset, width, height){
  while(true){
    var randomCircle = getRandomCircle(xOffset, yOffset, width, height);

    if(typeof randomCircle != 'undefined' && randomCircle.isVisible())
        return randomCircle;
  }
};

function hideAllPages(){
  $('.page').removeClass('active');
};

function showPage(pageNumber){
  $('#page_' + pageNumber).addClass('active');
}

function cancelAllTimers(){
  clearInterval(pageOneIntervalTimer);
  clearInterval(pageTwoIntervalTimer);
  clearInterval(pageFourIntervalTimer);
  clearInterval(pageFiveIntervalTimer);
  clearInterval(pageSixIntervalTimer);
};

function hideAudioSourceCircle(){
  audioSourceCircle.hide();
  audioSourceCircle.stopBroadcast();

  var coor = Circle.convertCoordinatesIntoMatrixIndex(audioSourceCircle.x, audioSourceCircle.y);
  if(circleMatrix[coor[0]][coor[1]] instanceof AudioSourceCircle){
    circleMatrix[coor[0]][coor[1]] = new Circle(audioSourceCircle.x, audioSourceCircle.y, svgElem);
    circleMatrix[coor[0]][coor[1]].init();
  }
};

function showAudioSourceCircle(){
  audioSourceCircle.show();
  audioSourceCircle.startBroadcast(1, 0.7);

  var coor = Circle.convertCoordinatesIntoMatrixIndex(audioSourceCircle.x, audioSourceCircle.y);
  if(!(circleMatrix[coor[0]][coor[1]] instanceof AudioSourceCircle)){
    circleMatrix[coor[0]][coor[1]].remove();
    circleMatrix[coor[0]][coor[1]] = audioSourceCircle;
  }
};
