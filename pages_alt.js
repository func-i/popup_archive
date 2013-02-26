var isMovingCauseOfTimer = false;
var boxWidth = 100;

$(function(){
  init();

  var scrollStopTimer = null;
  $(window).scroll(function(){
    if(isMovingCauseOfTimer){
      isMovingCauseOfTimer = false;
      return true;
    }

    listenToScroll();

   if(scrollStopTimer){
      clearTimeout(scrollStopTimer);
      scrollStopTimer = null;
    }
    scrollStopTimer = setTimeout(scrollStopped, 400);
  });

  var resizeStopTimer = null;
  $(window).resize(function(){
    if(resizeStopTimer){
      clearTimeout(resizeStopTimer);
      resizeStopTimer = null;
    }
    resizeStopTimer = setTimeout(init, 400);
  });

  $('header a').click(function(){
    var pageNumber = $(this).data('page');
    gotoPage(pageNumber);
  });
});

function listenToScroll(){
  $('#pages_container').stop();

  var currentVerticalScroll = $(window).scrollTop();
  var bodyHeight = $('body').height() - window.innerHeight;
  var pagesWidth = $('.page').width() * ($('.page').length - 1);

  var calculatedHorizontalScroll = -pagesWidth * (currentVerticalScroll / bodyHeight);

  $('#pages_container').stop().animate({'left': calculatedHorizontalScroll}, 10);
};

function scrollStopped(){
  isMovingCauseOfTimer = true;

  var currentPage = Math.round(-$('#pages_container').offset().left / $('.page').width()) + 1;

  gotoPage(currentPage);
};

function init(){
  //Set the width of each page
  $('.page').width(window.innerWidth);

  //Load the SVG for each page
  initSVGMatrix();
  loadPage1();
  loadPage2();
  loadPage3();
  loadPage4();
  loadPage5();
  loadPage6();
  loadPage7();
  loadPage8();

  listenToScroll();
  if(lastStoredPage){
    var tmpPage = lastStoredPage;
    lastStoredPage = null;
    gotoPage(tmpPage);
  }
};

var lastStoredPage;
function gotoPage(pageNumber){
  switch(pageNumber){
    case 1:
      if(lastStoredPage != 1){
        startPage1();
        lastStoredPage = 1;
      }
      break;
     case 2:
      if(lastStoredPage != 2){
        startPage2();
        lastStoredPage = 2;
      }
      break;
    case 3:
      if(lastStoredPage != 3){
        startPage3();
        lastStoredPage = 3;
      }
      break;
    case 4:
      if(lastStoredPage != 4){
        startPage4();
        lastStoredPage = 4;
      }
      break;
    case 5:
      if(lastStoredPage != 5){
        startPage5();
        lastStoredPage = 5;
      }
      break;
    case 6:
      if(lastStoredPage != 6){
        startPage6();
        lastStoredPage = 6;
      }
      break;
     case 7:
      if(lastStoredPage != 7){
        startPage7();
        lastStoredPage = 7;
      }
      break;
    case 8:
      if(lastStoredPage != 8){
        startPage8();
        lastStoredPage = 8;
      }
      break;
  }

  var page = $('#page_' + pageNumber);
  var currentOffset = $('#pages_container').offset().left;
  var pageOffset = page.offset().left;
  $('#pages_container').stop().animate({'left': currentOffset - pageOffset}, 1000, function(){});

  var bodyHeight = $('body').height() - window.innerHeight;
  var pagesWidth = $('.page').width() * ($('.page').length - 1);
  var calculatedVerticalScroll = -bodyHeight * ((currentOffset - pageOffset) / pagesWidth);

  $(window).scrollTop(calculatedVerticalScroll);
}

function stopAll(){
  pauseSound();
  clearTimeout(page2Timer);
  clearInterval(page2IntervalTimer);
  clearInterval(page3IntervalTimer);
  resetPage4();
  clearInterval(page5IntervalTimer);
  resetPage5();
  clearInterval(page6IntervalTimer);
  clearInterval(page7IntervalTimer);
};

var circleMatrices;
var circleMatrix;

function loadPage1(){
  circleMatrix = circleMatrices[0];

  //Replace random circle with AudioSource Circle
/*  var replaceCircleForAudio = getRandomCircle(1, 1, circleMatrix.length - 2, circleMatrix[0].length - 2);
  var audioSourceCircle =  new AudioSourceCircle(replaceCircleForAudio.x, replaceCircleForAudio.y, replaceCircleForAudio.svgElem, replaceCircleForAudio.circleMatrix);
  audioSourceCircle.init();
  audioSourceCircle.setupOnHover();
  audioSourceCircle.setupOnClick();
  audioSourceCircle.startBroadcast(1, 0.7);
  var coor = Circle.convertCoordinatesIntoMatrixIndex(audioSourceCircle.x, audioSourceCircle.y);
  circleMatrix[coor[0]][coor[1]].remove();
  circleMatrix[coor[0]][coor[1]] = audioSourceCircle;*/


  //Start Sound
  //startSound(audioSourceCircle, $('#page_1 svg'));
};

function loadPage2(){};


function loadPage3(){};

function loadPage4(){};

function loadPage5(){
  circleMatrix = circleMatrices[4];

  for(var x = 0; x < circleMatrix.length; x++){
    var hideLength = Math.floor(circleMatrix[x].length*Math.random()) - 1;

    for(var y = 0; y <hideLength; y++){
      if(typeof circleMatrix[x][y] != 'undefined')
        circleMatrix[x][y].hide();
    }
  }
};

function loadPage6(){
  circleMatrix = circleMatrices[5];

  resetPage6();
};

function loadPage7(){
  circleMatrix = circleMatrices[6];

  var contentEl = $('#page_7 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  for(var x = circleMatrix.length - 1; x >= 0 ; x--)
  {

    for(var y = 0; y < circleMatrix[x].length; y++){
      if(typeof circleMatrix[x][y] == 'undefined')
        continue;

      if(x < rightPositionOfContentInBoxes)
      {
        circleMatrix[x][y].setInnerColor(RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())]);;
        circleMatrix[x][y].setOuterColor(RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())]);

        if(circleMatrix[x][y].isVisible() && (
            y == 0 ||
            x == circleMatrix.length - 1 ||
            typeof circleMatrix[x][y-1] == 'undefined' ||
            !circleMatrix[x][y-1].isVisible() ||
            typeof circleMatrix[x+1][y] == 'undefined' ||
            !circleMatrix[x+1][y].isVisible() ||
            typeof circleMatrix[x+1][y-1] == 'undefined' ||
            !circleMatrix[x+1][y -1].isVisible()
          ))
        {
          circleMatrix[x][y].lockColor().colorOn();
        }
        else{
          circleMatrix[x][y].colorOff();
        }
      }
      else if(x == rightPositionOfContentInBoxes)
        circleMatrix[x][y].hide();
      else{
        circleMatrix[x][y].setInnerColor(BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())]);;
        circleMatrix[x][y].setOuterColor(BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())]);
        circleMatrix[x][y].colorOff();
      }
    }
  }
};

function loadPage8(){};

function startPage1(){
  stopAll();

  circleMatrix = circleMatrices[0];

  playSound();
};

var pathQueue = [];
var page2IntervalTimer;
var page2Timer;
var page2CurrentBlur;
var lastConnectedCircle;
function startPage2(){
  stopAll();

  circleMatrix = circleMatrices[1];

  page2IntervalTimer = setInterval(connectRandomCircle, 2000);
  page2CurrentBlur = 0;
  blurCircles();
};

var bubbleArray;
var page3IntervalTimer;
function startPage3(){
  stopAll();

  circleMatrix = circleMatrices[2];

  //Bubble from bottom to top
  bubbleArray = bubbleArray || new Array(circleMatrix.length);
  page3IntervalTimer = setInterval(bubbleToTop, 500);
};

function startPage4(){
  stopAll();

  circleMatrix = circleMatrices[3];

  if(circleMatrix.length > 4 && circleMatrix[4].length > 3 && typeof circleMatrix[4][3] != 'undefined'){
    circleMatrix[4][3].removeClickHandler().removeHoverHandler().scale(5.5, 1500).lockColor().colorOn(1500).startBroadcast(1000, null, null, 0.7).callOnNeighbours(1, function(){
      this.hide(1500);
    });
  }

  if(circleMatrix.length > 9 && circleMatrix[9].length > 1 && typeof circleMatrix[9][1] != 'undefined'){
    circleMatrix[9][1].removeClickHandler().removeHoverHandler().scale(5.5, 1500).lockColor().colorOn(1500).startBroadcast(1000, null, null, 0.7).callOnNeighbours(1, function(){
      this.hide(1500);
    });
  }
};

function resetPage4(){
  circleMatrix = circleMatrices[3];

  if(circleMatrix.length > 4 && circleMatrix[4].length > 3 && typeof circleMatrix[4][3] != 'undefined')
    circleMatrix[4][3].reset().callOnNeighbours(1, function(){
      this.show();
    });

  if(circleMatrix.length > 9 && circleMatrix[9].length > 1 && typeof circleMatrix[9][1] != 'undefined')
    circleMatrix[9][1].reset().callOnNeighbours(1, function(){
      this.show();
    });
};

var currentColoredColumnIndex;
var page5IntervalTimer;
function startPage5(){
  stopAll();

  circleMatrix = circleMatrices[4];

  currentColoredColumnIndex = undefined;
  page5IntervalTimer = setInterval(colorColumn, 700);
};

function resetPage5(){
  circleMatrix = circleMatrices[4];

  if(typeof currentColoredColumnIndex != 'undefined'){
    for(var y = 0; y < circleMatrix[currentColoredColumnIndex].length; y++){
      if(typeof circleMatrix[currentColoredColumnIndex][y] != 'undefined')
        circleMatrix[currentColoredColumnIndex][y].colorOff();
    }

    currentColoredColumnIndex = undefined;
  }
};

var swappedInnerRadiuses;
var page6IntervalTimer;
function startPage6(){
  stopAll();

  circleMatrix = circleMatrices[5];

  resetPage6();

  swapRandomInnerRadiuses();

  page6IntervalTimer = setTimeout(returnSwappedRadiuses, 5000);
};

var page7IntervalTimer;
function startPage7(){
  stopAll();

  circleMatrix = circleMatrices[6];

  page7IntervalTimer = setInterval(swapCircles, 2000);
};

function startPage8(){
  stopAll();

  circleMatrix = circleMatrices[7];

  var hideHeight, innerColor, outerColor;
  for(var x = 0; x < circleMatrix.length; x++){
    if(x < Math.floor(circleMatrix.length/3)){
      hideHeight = circleMatrix[x].length - 1;
      innerColor = BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())];
      outerColor = BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())];
      delay = 2000;
    }
    else if(x < 2*Math.floor(circleMatrix.length/3)){
      hideHeight = Math.floor((circleMatrix[x].length - 1) / 2);
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
      if(typeof circleMatrix[x][y] != 'undefined')
        circleMatrix[x][y].hide();


    var colorNotOn = true;
    while(colorNotOn && hideHeight < circleMatrix[x].length){
      if(typeof circleMatrix[x][hideHeight] != 'undefined')
        colorNotOn = false
      else
        hideHeight++;
    }

    if(hideHeight == circleMatrix[x].length || typeof circleMatrix[x][hideHeight] == 'undefined')
      continue;

    circleMatrix[x][hideHeight].setInnerColor(innerColor);
    circleMatrix[x][hideHeight].setOuterColor(outerColor);

    circleMatrix[x][hideHeight].lockColor().colorOn(1000, null, null, delay);
  }
};

function resetPage6(){
  circleMatrix = circleMatrices[5];

  //Split the screen width in 3 and set size of innerRadius accordingly
  for(var x = 0; x < circleMatrix.length; x++){
    var innerRadius;
    if(x < Math.floor(circleMatrix.length/3)) innerRadius = 10;
    else if(x < 2*Math.floor(circleMatrix.length/3)) innerRadius = 25;
    else innerRadius = 17;

    for(var y = 0; y < circleMatrix[x].length; y++)
      if(typeof circleMatrix[x][y] != 'undefined')
        circleMatrix[x][y].setBaseInnerRadius(innerRadius);
  }
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
      if(currentBubble.matrixYIndex == 0 || typeof circleMatrix[x][currentBubble.matrixYIndex - 1] == 'undefined' || !circleMatrix[x][currentBubble.matrixYIndex - 1].isVisible()){
        nextBubble = undefined;
      }
      else
        nextBubble = circleMatrix[x][currentBubble.matrixYIndex - 1];

      currentBubble.reset(2000, null, null, 0.5);
    }

    if(typeof nextBubble != 'undefined'){
      nextBubble.scale(1.5, 700).colorOn();

      if(0 == nextBubble.matrixYIndex  || typeof circleMatrix[x][nextBubble.matrixYIndex] == 'undefined' || !circleMatrix[x][nextBubble.matrixYIndex].isVisible())
        nextBubble.sendBroadcast(nextBubble.currentOuterRadius(), boxWidth + nextBubble.currentOuterRadius(), 0.7);
    }

    bubbleArray[x] = nextBubble;
  }
};

function colorColumn(){
  if(typeof currentColoredColumnIndex != 'undefined'){
    for(var y = 0; y < circleMatrix[currentColoredColumnIndex].length; y++){
      if(typeof circleMatrix[currentColoredColumnIndex][y] != 'undefined')
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

function returnSwappedRadiuses(){
  if(swappedInnerRadiuses.length == 0) return;

  var randomIndex = Math.floor(swappedInnerRadiuses.length*Math.random());
  var swappedRadiuses = swappedInnerRadiuses[randomIndex];

  var circle1 = swappedRadiuses[0];
  var circle2 = swappedRadiuses[1];

  var circle1Radius = circle1.innerCircleRadius;
  var circle2Radius = circle2.innerCircleRadius;

  var circle1Fill = circle1.innerCircleColor;
  var circle2Fill = circle2.innerCircleColor;

  circle1.lockColor().colorOn();
  circle2.lockColor().colorOn();

  circle1.innerCircle.animate({opacity: 0}, 2000, function(){
    circle1.setBaseInnerRadius(circle2Radius).setInnerColor(circle2Fill);

    var swapAnim = Raphael.animation({opacity: 1}, 1000, function(){
      circle1.unlockColor().colorOff(1500);
    });

    circle1.innerCircle.animate(swapAnim.delay(2000));
  });

  circle2.innerCircle.animate({opacity: 0}, 2000, function(){
    circle2.setBaseInnerRadius(circle1Radius).setInnerColor(circle1Fill);

    var swapAnim = Raphael.animation({opacity: 1}, 1000, function(){
      circle2.unlockColor().colorOff(1500);
    });

    circle2.innerCircle.animate(swapAnim.delay(2000));
  });

  swappedInnerRadiuses.splice(randomIndex, 1);

  page6IntervalTimer = setTimeout(returnSwappedRadiuses, 7000);
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
  for(var i = 0; i < 2; i++){
    var firstSectionRandomCircle = getVisibleUnSwappedRandomCircle(firstSectionStart, 0, firstSectionWidth, height, 10);
    var secondSectionRandomCircle = getVisibleUnSwappedRandomCircle(secondSectionStart, 0, secondSectionWidth, height, 25);
    if(firstSectionRandomCircle == null || secondSectionRandomCircle == null)
      continue;
    firstSectionRandomCircle.setBaseInnerRadius(25);
    secondSectionRandomCircle.setBaseInnerRadius(10);
    swappedInnerRadiuses.push([firstSectionRandomCircle, secondSectionRandomCircle]);
  }
  //Swap 1st and 3rd section
  for(var i = 0; i < 2; i++){
    var firstSectionRandomCircle = getVisibleUnSwappedRandomCircle(firstSectionStart, 0, firstSectionWidth, height, 10);
    var thirdSectionRandomCircle = getVisibleUnSwappedRandomCircle(thirdSectionStart, 0, thirdSectionWidth, height, 17);
    if(firstSectionRandomCircle == null || thirdSectionRandomCircle == null)
      continue;
    firstSectionRandomCircle.setBaseInnerRadius(17);
    thirdSectionRandomCircle.setBaseInnerRadius(10);
    swappedInnerRadiuses.push([firstSectionRandomCircle, thirdSectionRandomCircle]);
  }
  //Swap 1st and 3rd section
  for(var i = 0; i < 2; i++){
    var secondSectionRandomCircle = getVisibleUnSwappedRandomCircle(secondSectionStart, 0, secondSectionWidth, height, 25);
    var thirdSectionRandomCircle = getVisibleUnSwappedRandomCircle(thirdSectionStart, 0, thirdSectionWidth, height, 17);
    if(secondSectionRandomCircle == null || thirdSectionRandomCircle == null)
      continue;
    secondSectionRandomCircle.setBaseInnerRadius(17);
    thirdSectionRandomCircle.setBaseInnerRadius(25);
    swappedInnerRadiuses.push([secondSectionRandomCircle, thirdSectionRandomCircle]);
  }
};

function swapCircles(){
  var contentEl = $('#page_7 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  var circle1 = getRandomCircle(rightPositionOfContentInBoxes + 1, 0, circleMatrix.length - rightPositionOfContentInBoxes - 1, circleMatrix[0].length);
  if(circle1 == null)
    return;
  circle1.svgSet.toFront();

  var loop = true;
  var circle2;
  while(loop){
    var newX = circle1.matrixXIndex + Math.round(2*Math.random()) - 1;
    var newY = circle1.matrixYIndex + Math.round(2*Math.random()) - 1;

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
  circle2.svgSet.toFront();

  circle1.colorOn().move(circle2.x, circle2.y, 1000, function(){
    circle1.colorOff(1000);
  });
  circle2.colorOn().move(circle1.x, circle1.y, 1000, function(){
    circle2.colorOff(1000);
  });

  var tmpX = circle1.x, tmpY = circle1.y;

  circle1.x = circle2.x;
  circle1.y = circle2.y;
  circle2.x = tmpX;
  circle2.y = tmpY;

  tmpX =  circle1.matrixXIndex, tmpY = circle1.matrixYIndex;
  circleMatrix[circle2.matrixXIndex][circle2.matrixYIndex] = circle1;
  circleMatrix[circle1.matrixXIndex][circle1.matrixYIndex] = circle2;
  circle1.matrixXIndex = circle2.matrixXIndex;
  circle1.matrixYIndex = circle2.matrixYIndex;
  circle2.matrixXIndex = tmpX;
  circle2.matrixYIndex = tmpY;
};

function initSVGMatrix(){
  if($('svg').length != 0)
    $('svg').remove();

  circleMatrices = new Array(8);

  var pageWidth = $('.page').width();
  boxWidth = 100;
  var numBoxWidthPerPage = Math.floor(pageWidth / boxWidth);
  boxWidth = pageWidth / numBoxWidthPerPage;

  var svgWidth = pageWidth * circleMatrices.length;
  var svgHeight = $('.page').height();
  var svgTopMargin = $('header').height();
  var svgElem = Raphael($('.svg')[0], svgWidth, svgHeight);

  for(var pageNumber = 0; pageNumber < circleMatrices.length; pageNumber++){
    var contentEl = $('#page_' + (pageNumber  + 1)+ ' .content');
    if(contentEl.length > 0){
      var leftContentOffsetInBoxes = getLeftPositionOfContentInBoxes(pageNumber + 1);
      var contentWidthInBoxes = Math.ceil(contentEl.width() / boxWidth);
      var contentHeightInBoxes = Math.ceil(contentEl.height() / boxWidth);
    }
    var circleMatrix = circleMatrices[pageNumber] = new Array();

    for(var pageX = boxWidth/2; pageX < pageWidth; pageX += boxWidth){

      circleMatrix.push(new Array());

      var xArrIndex = circleMatrix.length - 1;

      for(var pageY = svgTopMargin + boxWidth/2; pageY <= svgHeight; pageY += boxWidth)
      {
        var yArrIndex = circleMatrix[xArrIndex].length;

        if(contentEl.length > 0 && xArrIndex >= leftContentOffsetInBoxes && xArrIndex  < leftContentOffsetInBoxes + contentWidthInBoxes && yArrIndex < contentHeightInBoxes)
        {
          circleMatrix[xArrIndex].push(undefined);
          continue;
        }

        var circle = new Circle(svgElem, pageX + pageWidth*pageNumber, pageY, circleMatrix, xArrIndex, yArrIndex);
        circle.init();
        circle.setClickHandler(clickHandler);
        circle.setHoverHandler(hoverEnterHandler, hoverLeaveHandler);
        circleMatrix[xArrIndex].push(circle);
      }
    }
  }
};

function connectRandomCircle(){
  if(pathQueue.length > 5){
    var removedPathArr = pathQueue.shift();
    removedPathArr[0].removePath(removedPathArr[1], null, function(){
      if(!removedPathArr[0].hasConnectedPaths())
        removedPathArr[0].unlockColor().colorOff();
    });
  }

  var contentEl = $('#page_2 .content');
  var rightPositionOfContentInBoxes = getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  if(typeof lastConnectedCircle == 'undefined'){
    lastConnectedCircle = getRandomVisibleCircle(rightPositionOfContentInBoxes, 0, circleMatrix.length - rightPositionOfContentInBoxes, circleMatrix[0].length);
    lastConnectedCircle.lockColor().colorOn();
  }

  var newConnectedCircle = getRandomVisibleCircle(rightPositionOfContentInBoxes, 0, circleMatrix.length - rightPositionOfContentInBoxes, circleMatrix[0].length);
  newConnectedCircle.lockColor().colorOn(CONNECT_TIME);

  var path = lastConnectedCircle.connectNeighbourWithArc(newConnectedCircle, null, null, function(){
    newConnectedCircle.colorOn().colorOn();
  });

  pathQueue.push([lastConnectedCircle, path]);
  lastConnectedCircle = newConnectedCircle;
};

function blurCircles(){
  var contentEl = $('#page_2 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  page2CurrentBlur += 0.1;

  for(var x = 0; x < circleMatrix.length; x++){
    for(var y = 0; y < circleMatrix[x].length; y++)
    {

      if(typeof circleMatrix[x][y] == 'undefined')
        continue;

      var blur = page2CurrentBlur * (rightPositionOfContentInBoxes - x) / rightPositionOfContentInBoxes;
      if(blur > 0)
        circleMatrix[x][y].setBlur(blur);
    }
  }

  if(page2CurrentBlur < 10)
    page2Timer = setTimeout(blurCircles, 200);
};

function getRandomCircle(xOffset, yOffset, width, height){
    if(width <= 0 || height <= 0) return null;

    var randomXIndex = Math.round((width - 1)*Math.random());
    var randomYIndex = Math.round((height -1)*Math.random());

    if(xOffset + randomXIndex > circleMatrix.length ||
      yOffset + randomYIndex > circleMatrix[xOffset + randomXIndex].length)
    {
      return null;
    }

    return circleMatrix[xOffset+randomXIndex][yOffset + randomYIndex];
};

function getRandomVisibleCircle(xOffset, yOffset, width, height){
  var count = 50;
  while(count > 0){
    var randomCircle = getRandomCircle(xOffset, yOffset, width, height);

    if(randomCircle != null && typeof randomCircle != 'undefined' && randomCircle.isVisible())
        return randomCircle;

    count--;
  }

  return null;
};

function getVisibleUnSwappedRandomCircle(xOffset, yOffset, width, height, unSwappedRadius){
  var count = 50;
  while(count > 0){
    var randomCircle = getRandomCircle(xOffset, yOffset, width, height);

    if(randomCircle != null && typeof randomCircle != 'undefined' && randomCircle.isVisible() && randomCircle.innerCircleRadius == unSwappedRadius)
      return randomCircle;

    count--;
  }

  return null;
};


function getLeftPositionOfContentInBoxes(pageNumber){
  return Math.floor(($('#page_' + pageNumber + ' .content').offset().left - $('#page_' + pageNumber).offset().left) / boxWidth);
};

function clickHandler(){
  if(!this.isVisible()) return;

  var that = this;

  that.clickOn = true;

  that.scale(0.5).startBroadcast(null, null, that.currentOuterRadius()*5, 0.7).colorOn().callOnNeighbours(1, function()
  {
    var xDistance = this.x - that.x;
    var yDistance = this.y - that.y;
    var newXDistance = (boxWidth + this.currentOuterRadius()) * (xDistance == 0 ? 0 : yDistance == 0 ? 1 : 0.70710678119);
    var newYDistance = (boxWidth + this.currentOuterRadius()) * (yDistance == 0 ? 0 : xDistance == 0 ? 1 : 0.70710678119);
    var newXCoor = that.x + newXDistance * (xDistance == 0 ? 0 : xDistance / Math.abs(xDistance));
    var newYCoor = that.y + newYDistance * (yDistance == 0 ? 0 : yDistance / Math.abs(yDistance));

    this.move(newXCoor, newYCoor,  BROADCAST_NEIGHBOUR_MOVE_TIME, null, null, 'bounce').colorOn();
  });
};

function hoverEnterHandler(){
  if(!this.isVisible()) return;

  this.scale(1.5).lockColor().colorOn();
};

function hoverLeaveHandler(){
  if(!this.isVisible()) return;

  if(this.clickOn)
    this.callOnNeighbours(1, function(){
      this.reset();
    });

  this.unlockColor().reset();
  this.clickOn = false;
};

