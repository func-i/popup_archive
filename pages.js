$(function(){
  init();

  listenToScroll();
  scrollStopTimer = null;;
  $(window).scroll(function(){
   /* if(scrollStopTimer){
      clearTimeout(scrollStopTimer);
      scrollStopTimer = null;
    }

    listenToScroll();

    scrollStopTimer = setTimeout(scrollStopped, 500);*/
  });

  $('header a').click(function(){
    var pageNumber = $(this).data('page');
    gotoPage(pageNumber);
  });
});

var targetVerticalScroll, targetHorizontalScroll;
function listenToScroll(){
  var currentVerticalScroll = $(window).scrollTop();
  var bodyHeight = $('body').height();
  var pagesWidth = $('.page').width() * $('.page').length;

  var calculatedHorizontalScroll = -currentVerticalScroll * pagesWidth / bodyHeight;

  var distanceToScroll = Math.abs(calculatedHorizontalScroll - targetHorizontalScroll);
  var animationTime = distanceToScroll;

  $('#pages_container').animate({'left': calculatedHorizontalScroll}, animationTime);
  //$('#pages_container').css({'left': calculatedHorizontalScroll});

  targetHorizontalScroll = calculatedHorizontalScroll;
};

function scrollStopped(){
  var currentPage = Math.round(-targetHorizontalScroll / $('.page').width()) + 1;

  gotoPage(currentPage);
};

function init(){
  //Set the width of each page
  $('.page').width(window.innerWidth);

  //Load the SVG for each page
  loadPage1();
  loadPage2();
  loadPage3();
  loadPage4();
  loadPage5();
  loadPage6();
  loadPage7();
  loadPage8();
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
  $('#pages_container').animate({'left': currentOffset - pageOffset}, 1000, function(){});

  var bodyHeight = $('body').height();
  var pagesWidth = $('.page').width() * $('.page').length;
  var calculatedVerticalScroll = -(targetHorizontalScroll - pageOffset) * bodyHeight / pagesWidth;

  $(window).scrollTop(calculatedVerticalScroll);
}

function stopAll(){
  pauseSound();
  clearInterval(page2IntervalTimer);
  clearInterval(page3IntervalTimer);
  clearInterval(page5IntervalTimer);
  clearInterval(page6IntervalTimer);
  clearInterval(page7IntervalTimer);
};

var circleMatrices = new Array(8);
var circleMatrix;

function loadPage1(){
  loadSVGMatrix(1, true);

  circleMatrix = circleMatrices[0];

  //Replace random circle with AudioSource Circle
  var replaceCircleForAudio = getRandomCircle(1, 1, circleMatrix.length - 2, circleMatrix[0].length - 2);
  var audioSourceCircle =  new AudioSourceCircle(replaceCircleForAudio.x, replaceCircleForAudio.y, replaceCircleForAudio.svgElem, replaceCircleForAudio.circleMatrix);
  audioSourceCircle.init();
  audioSourceCircle.setupOnHover();
  audioSourceCircle.setupOnClick();
  audioSourceCircle.startBroadcast(1, 0.7);
  var coor = Circle.convertCoordinatesIntoMatrixIndex(audioSourceCircle.x, audioSourceCircle.y);
  circleMatrix[coor[0]][coor[1]].remove();
  circleMatrix[coor[0]][coor[1]] = audioSourceCircle;


  //Start Sound
  startSound(audioSourceCircle, $('#page_1 svg'));
};

function loadPage2(){
  loadSVGMatrix(2, false);

  circleMatrix = circleMatrices[1];

  //Blur circles
  var contentEl = $('#page_2 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / BOX_WIDTH);

  for(var x = 0; x < circleMatrix.length; x++){
    for(var y = 0; y < circleMatrix[x].length; y++)
    {

      if(typeof circleMatrix[x][y] == 'undefined')
        continue;

      var blur = 5 * (rightPositionOfContentInBoxes - x) / rightPositionOfContentInBoxes;
      if(blur > 0)
        circleMatrix[x][y].blur(blur);
    }
  }
}

function loadPage3(){
  loadSVGMatrix(3, false);

  circleMatrix = circleMatrices[2];
}

function loadPage4(){
  loadSVGMatrix(4, false);

  circleMatrix = circleMatrices[3];
};

function loadPage5(){
  loadSVGMatrix(5, false);

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
  loadSVGMatrix(6, false);

  circleMatrix = circleMatrices[5];

  resetPage6();
};

function loadPage7(){
  loadSVGMatrix(7, false);

  circleMatrix = circleMatrices[6];

  var contentEl = $('#page_7 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / BOX_WIDTH);

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
          circleMatrix[x][y].colorOn();
        }
        else
          circleMatrix[x][y].colorOff();
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

function loadPage8(){
  loadSVGMatrix(8, false);

  circleMatrix = circleMatrices[2];
};

function startPage1(){
  stopAll();

  circleMatrix = circleMatrices[0];

  playSound();
};

var pathQueue = [];
var page2IntervalTimer;
function startPage2(){
  stopAll();

  circleMatrix = circleMatrices[1];

  page2IntervalTimer = setInterval(connectRandomCircle, 2000);
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


  if(typeof circleMatrix[4][3] != 'undefined'){
    circleMatrix[4][3].grow(3, 1500);
    circleMatrix[4][3].callOnNeighbours(1, function(){
      this.innerCircle.stop().animate({'opacity': 0}, 1500);
      this.outerCircle.stop().animate({'opacity': 0}, 1500);
    });
  }

  if(typeof circleMatrix[9][1] != 'undefined'){
    circleMatrix[9][1].grow(3, 1500);
    circleMatrix[9][1].callOnNeighbours(1, function(){
      this.innerCircle.stop().animate({'opacity': 0}, 1500);
      this.outerCircle.stop().animate({'opacity': 0}, 1500);
    });
  }

  circleMatrix[4][3].startBroadcast(1, 0.7, 1000);
  circleMatrix[9][1].startBroadcast(1, 0.7, 1000);
};

var currentColoredColumnIndex;
var page5IntervalTimer;
function startPage5(){
  stopAll();

  circleMatrix = circleMatrices[4];

  currentColoredColumnIndex = undefined;
  page5IntervalTimer = setInterval(colorColumn, 1500);
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
      if(typeof circleMatrix[x][y] != 'undefined')
        circleMatrix[x][y].hide();

    if(typeof circleMatrix[x][hideHeight] == 'undefined' || hideHeight == circleMatrix[x].length)
      continue;

    circleMatrix[x][hideHeight].setInnerColor(innerColor);
    circleMatrix[x][hideHeight].setOuterColor(outerColor);

    circleMatrix[x][hideHeight].colorOn(1, delay);
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
        circleMatrix[x][y].setInnerRadius(innerRadius);
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
      var currentYIndex = Circle.convertCoordinatesIntoMatrixIndex(null, currentBubble.y)[1];

      if(currentYIndex == 0 || typeof circleMatrix[x][currentYIndex - 1] == 'undefined' || !circleMatrix[x][currentYIndex - 1].isVisible()){
        nextBubble = undefined;
      }
      else
        nextBubble = circleMatrix[x][currentYIndex - 1];

      currentBubble.reset(0.5);
    }

    if(typeof nextBubble != 'undefined'){
      nextBubble.grow(1, 700);

      var nextYIndex = Circle.convertCoordinatesIntoMatrixIndex(null, nextBubble.y)[1];

      if(0 == nextYIndex  || typeof circleMatrix[x][nextYIndex] == 'undefined' || !circleMatrix[x][nextYIndex].isVisible())
        nextBubble.sendBroadcast(1, 0.7)
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

function swapCircles(){
  var contentEl = $('#page_7 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / BOX_WIDTH);

  var circle1 = getRandomCircle(rightPositionOfContentInBoxes + 1, 0, circleMatrix.length - rightPositionOfContentInBoxes - 1, circleMatrix[0].length);
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
};

function loadSVGMatrix(pageNumber, handlerOn){
  var svgWidth = $('#page_' + pageNumber).width();
  var svgHeight = $('#page_' + pageNumber).height();
  var svgTopMargin = $('header').height();
  var svgElem = Raphael($('#page_' + pageNumber + ' .svg')[0], svgWidth, svgHeight);

  var contentEl = $('#page_' + pageNumber + ' .content');
  if(contentEl.length > 0){
    var leftContentOffsetInBoxes = getLeftPositionOfContentInBoxes(pageNumber);
    var contentWidthInBoxes = Math.ceil(contentEl.width() / BOX_WIDTH);
    var contentHeightInBoxes = Math.ceil(contentEl.height() / BOX_WIDTH);
  }

  var circleMatrix = circleMatrices[pageNumber - 1] = new Array();

  for(var x = BOX_WIDTH/2; x <= svgWidth; x += BOX_WIDTH)
  {
    circleMatrix.push(new Array());
    var coorX = circleMatrix.length - 1;

    for(var y = svgTopMargin + BOX_WIDTH/2; y <= svgHeight; y += BOX_WIDTH)
    {
      var coorY = circleMatrix[coorX].length;

      if(contentEl.length > 0 && coorX >= leftContentOffsetInBoxes && coorX < leftContentOffsetInBoxes + contentWidthInBoxes && coorY < contentHeightInBoxes){
        circleMatrix[coorX].push(undefined);
        continue;
      }

      circleMatrix[coorX].push(new Circle(x, y, svgElem, circleMatrix));

      circleMatrix[coorX][coorY].init();
      if(handlerOn){
        circleMatrix[coorX][coorY].setupOnHover();
        circleMatrix[coorX][coorY].setupOnClick();
      }
    }
  }
};

function connectRandomCircle(){
  if(pathQueue.length > 5){
    var removedPathArr = pathQueue.shift();
    removedPathArr[0].removePath(removedPathArr[2], removedPathArr[1]);
  }

  var contentEl = $('#page_2 .content');
  var rightPositionOfContentInBoxes = getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / BOX_WIDTH);

  var newConnectedCircle = getRandomVisibleCircle(rightPositionOfContentInBoxes, 0, circleMatrix.length - rightPositionOfContentInBoxes, circleMatrix[0].length);

  var connectFromCircle;
  if(pathQueue.length == 0){
    connectFromCircle = getRandomVisibleCircle(rightPositionOfContentInBoxes, 0, circleMatrix.length - rightPositionOfContentInBoxes, circleMatrix[0].length);
  }
  else{
    connectFromCircle = pathQueue[pathQueue.length - 1][1]
  }

  var path = connectFromCircle.connectNeighbourWithArc(newConnectedCircle);

  pathQueue.push([connectFromCircle, newConnectedCircle, path]);
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

function getVisibleUnSwappedRandomCircle(xOffset, yOffset, width, height, unSwappedRadius){
    while(true){
      var randomCircle = getRandomCircle(xOffset, yOffset, width, height);

      if(typeof randomCircle != 'undefined' && randomCircle.isVisible() && randomCircle.currentInnerRadius() == unSwappedRadius)
        return randomCircle;
    }
};


function getLeftPositionOfContentInBoxes(pageNumber){
  return Math.floor(($('#page_' + pageNumber + ' .content').offset().left - $('#page_' + pageNumber).offset().left) / BOX_WIDTH);
}

