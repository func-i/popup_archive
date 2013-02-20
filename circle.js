var svgElem;

Raphael.fn.arrow = function (x, y, length, height, width) {
  return this.path(
    "M" + x + " " + y +
    "L" + (x - length) + " " + (y - height/2) +
    "L" + (x - width) + " " + y +
    "L" + (x - length) + " " + (y + height /2) +
    "L" + x  + " " + y
  );
};

/*!
 * Raphael Blur Plugin 0.1
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function () {
    if (typeof(Raphael.idGenerator) == 'undefined')
      Raphael.idGenerator = 0;

    if (Raphael.vml) {
        var reg = / progid:\S+Blur\([^\)]+\)/g;
        Raphael.el.blur = function (size) {
            var s = this.node.style,
                f = s.filter;
            f = f.replace(reg, "");
            if (size != "none") {
                s.filter = f + " progid:DXImageTransform.Microsoft.Blur(pixelradius=" + (+size || 1.5) + ")";
                s.margin = Raphael.format("-{0}px 0 0 -{0}px", Math.round(+size || 1.5));
            } else {
                s.filter = f;
                s.margin = 0;
            }
        };
    } else {
        var $ = function (el, attr) {
            if (attr) {
                for (var key in attr) if (attr.hasOwnProperty(key)) {
                    el.setAttribute(key, attr[key]);
                }
            } else {
                return document.createElementNS("http://www.w3.org/2000/svg", el);
            }
        };
        Raphael.el.blur = function (size) {
            // Experimental. No WebKit support.
            if (size != "none") {
                var fltr = $("filter"),
                    blur = $("feGaussianBlur");
                fltr.id = "r" + (Raphael.idGenerator++).toString(36);
                $(blur, {stdDeviation: +size || 1.5});
                fltr.appendChild(blur);
                this.paper.defs.appendChild(fltr);
                this._blur = fltr;
                $(this.node, {filter: "url(#" + fltr.id + ")"});
            } else {
                if (this._blur) {
                    this._blur.parentNode.removeChild(this._blur);
                    delete this._blur;
                }
                this.node.removeAttribute("filter");
            }
        };
    }
})();

function Circle(x, y, svgEl) {
  this.x = x;
  this.y = y;
  svgElem = svgEl;
};

Circle.prototype.init = function(){
  this.innerCircleRadius = (MAX_INNER_CIRCLE_RADIUS - MIN_INNER_CIRCLE_RADIUS) * Math.random() + MIN_INNER_CIRCLE_RADIUS;

  this.draw();
  this.setupOnHover();
  this.setupOnClick();

  this.outerCircleColor = COLORS[Math.floor(COLORS.length  * Math.random())];
  this.innerCircleColor = COLORS[Math.floor(COLORS.length  * Math.random())];
};

Circle.prototype.hide = function(){
  this.svgSet.hide();
};

Circle.prototype.show = function(){
  this.svgSet.show();
  this.reset();
};

Circle.prototype.isVisible = function(){
  return this.innerCircle.node.style.display !== 'none'
}

Circle.prototype.remove = function(){
  this.svgSet.remove();
  delete this;
};

Circle.prototype.setupOnClick = function(){
    var that = this;
    this.svgSet.click(function(){
      if(!clickHandlerOn) return

      that.clickOn = true;
      that.outerCircle.stop().animate({r: MAX_GROWTH_RADIUS - CLICK_DECREASE_IN_RADIUS}, CLICK_TIME);
      that.innerCircle.stop().animate({r: OUTER_CIRCLE_RADIUS - CLICK_DECREASE_IN_RADIUS}, CLICK_TIME);
      that.pushNeighbours(BOX_WIDTH + OUTER_CIRCLE_RADIUS);
      that.startBroadcast(null, 0.7);
    });
};

Circle.prototype.setupOnHover = function(){
    var that = this;
    this.svgSet.hover(function() {
      if(!hoverHandlerOn) return

      that.grow();
    },
    function() {
      if(!hoverHandlerOn) return

      if(that.clickOn) that.resetNeighbours();
      that.reset();
    });
};

Circle.prototype.grow = function(scale, growthTime){
  scale = scale || 1;
  growthTime = growthTime || GROWTH_TIME;

  this.outerCircle.stop().toFront().animate({r: MAX_GROWTH_RADIUS*scale}, growthTime, 'easeIn');
  this.innerCircle.stop().toFront().animate({r: OUTER_CIRCLE_RADIUS*scale}, growthTime,'easeIn');
  this.colorOn();
};

Circle.prototype.blur = function(size){
  this.outerCircle.blur(size);
  this.innerCircle.blur(size);
};

Circle.prototype.unblur = function(){
  this.outerCircle.blur('none');
  this.innerCircle.blur('none');
};


Circle.prototype.draw = function(){
  this.innerCircle = svgElem.circle(this.x, this.y, this.innerCircleRadius);
  this.innerCircle.attr({
    stroke: "none",
    fill: "E0DCDC"
  });

  this.outerCircle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS);
  this.outerCircle.attr({
    "stroke": "E0DCDC",
    "stroke-width": OUTER_CIRCLE_STROKE_WIDTH
  });

  hoverArea = svgElem.rect(this.x - BOX_WIDTH/2, this.y-BOX_WIDTH/2, BOX_WIDTH, BOX_WIDTH);
  hoverArea.attr({stroke: "none",
          fill:   "#f00",
          "fill-opacity": 0});

  this.svgSet = svgElem.set();
  this.svgSet.push(this.outerCircle, this.innerCircle, hoverArea);
};

Circle.prototype.currentPosition = function(){
    return [this.innerCircle.attr('cx'), this.innerCircle.attr('cy')];
};

Circle.prototype.currentOuterRadius = function(){
  return this.outerCircle.attr('r');
};

Circle.prototype.currentInnerRadius = function(){
  return this.innerCircle.attr('r');
};

Circle.prototype.colorOn = function(opacity, delay){
  opacity = opacity || 1;
  delay = delay || 0;

  var outerAnim = Raphael.animation({stroke: this.outerCircleColor, 'opacity': opacity}, COLOR_TIME);
  this.outerCircle.animate(outerAnim.delay(delay));
  var innerAnim = Raphael.animation({fill: this.innerCircleColor, 'opacity': opacity}, COLOR_TIME);
  this.innerCircle.animate(innerAnim.delay(delay));

//  this.svgSet.toFront();

  this.isColorOn = true;
};

Circle.prototype.colorOff = function(delay){
  delay = delay || 0;

  var outerAnim = Raphael.animation({stroke: '#E0DCDC', 'opacity': 1}, RESET_TIME);
  this.outerCircle.animate(outerAnim.delay(delay));
  var innerAnim = Raphael.animation({fill: "#E0DCDC", 'opacity': 1}, RESET_TIME);
  this.innerCircle.animate(innerAnim.delay(delay));

  this.isColorOn = false;
};

Circle.prototype.connectNeighbourWithArc = function(neighbour){
  var path =svgElem.path("M" + this.x + " " + this.y);
  path.attr('stroke', CONNECT_COLOR);

  neighbour.innerCircle.toFront();
  this.innerCircle.toFront();

  this.colorOn();

  var curveString =
    "M" + this.x + " " + this.y +
    "S" + (this.x + neighbour.x)/2 + " " + Math.floor((this.y + neighbour.y)/2 + (this.y - neighbour.y)/2*Math.random()) + " " + neighbour.x + " " + neighbour.y;
  path.animate({path: curveString}, CONNECT_TIME, function(){
    neighbour.colorOn();
  });

  (this.connectedPaths = this.connectedPaths || []).push([path, neighbour]);
  (neighbour.connectedPaths = neighbour.connectedPaths || []).push([path, this]);

  return path;
};

Circle.prototype.connectNeighbourWithLine = function(neighbour){
  var path =svgElem.path("M" + this.x + " " + this.y);
  path.attr('stroke', CONNECT_COLOR);

  neighbour.innerCircle.toFront();
  this.innerCircle.toFront();

  this.colorOn();

  var lineString =
    "M" + this.x + " " + this.y +
    "L" + neighbour.x + " " + neighbour.y;
  path.animate({path: lineString}, CONNECT_TIME, function(){
    neighbour.colorOn();
  });

  (this.connectedPaths = this.connectedPaths || []).push([path, neighbour]);
  (neighbour.connectedPaths = neighbour.connectedPaths || []).push([path, this]);

  return path;
};

Circle.prototype.removeConnectedPaths = function(){
  if(typeof this.connectedPaths == 'undefined') return;

  var that = this;
  $.each(this.connectedPaths, function(i, pathArr)
  {
    that.removePath(pathArr[0], pathArr[1]);
  });

  this.colorOff();

  this.connectedPaths = [];
};

Circle.prototype.removePath = function(neighbour, path){
  if(neighbour.connectedPaths.length == 1){
    neighbour.colorOff();
  }

  if(this.connectedPaths.length == 1){
    this.colorOff();
  }

  path.animate({opacity: 0}, RESET_TIME);

  var indexOf;
  $.each(this.connectedPaths, function(index, pathArr){
    if(pathArr[0] == path)
      indexOf = index;
  });
  this.connectedPaths.splice(indexOf, 1);

  indexOf = null;
  $.each(neighbour.connectedPaths, function(index, neighbourPathArr){
    if(neighbourPathArr[0] == path)
      indexOf = index;
  });
  neighbour.connectedPaths.splice(indexOf, 1);

  path.remove();
};

Circle.prototype.pushNeighbours = function(desiredRadius){
  var that = this;
  this.callOnNeighbours(1, function(){ this.pushed(that, desiredRadius)});
};

Circle.prototype.pushed = function(pusher, desiredDistance){
  var xDistance = this.x - pusher.x;
  var yDistance = this.y - pusher.y;

  var newXDistance = desiredDistance * (xDistance == 0 ? 0 : yDistance == 0 ? 1 : 0.70710678119);
  var newYDistance = desiredDistance * (yDistance == 0 ? 0 : xDistance == 0 ? 1 : 0.70710678119);

  var newXCoor = pusher.x + newXDistance * (xDistance == 0 ? 0 : xDistance / Math.abs(xDistance));
  var newYCoor = pusher.y + newYDistance * (yDistance == 0 ? 0 : yDistance / Math.abs(yDistance));

  var anim = Raphael.animation({'cx': newXCoor, 'cy': newYCoor}, BROADCAST_NEIGHBOUR_MOVE_TIME, 'bounce');
  this.svgSet.stop().animate(anim);

  this.colorOn(BROADCAST_NEIGHBOUR_OPACITY);
};

Circle.prototype.resetNeighbours = function(){
    this.callOnNeighbours(3, function(){this.reset()});
};

Circle.prototype.reset = function(scaleFactor){
  scaleFactor = scaleFactor || 1;

  this.outerCircle.stop().animate({r: OUTER_CIRCLE_RADIUS*scaleFactor}, RESET_TIME);
  this.innerCircle.stop().animate({r: this.innerCircleRadius*scaleFactor}, RESET_TIME);
  this.colorOff();

  this.svgSet.animate({
    cx: this.x,
    cy: this.y
  }, RESET_TIME);

  this.clickOn = false;

  this.stopBroadcast();
  this.removeConnectedPaths();
};

Circle.prototype.startBroadcast = function(numberOfNeighbours, opacity, broadcastFrequency){
  numberOfNeighbours = numberOfNeighbours || MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS;
  opacity = opacity || 1;
  broadcastFrequency = broadcastFrequency || BROADCAST_FREQUENCY;

  var that = this;
  that.stopBroadcast();
  that.sendBroadcast(numberOfNeighbours, opacity);
  that.broadcastTimer = setInterval(function(){that.sendBroadcast(numberOfNeighbours, opacity)}, broadcastFrequency);
};

Circle.prototype.stopBroadcast = function(){
  clearInterval(this.broadcastTimer);
};

Circle.prototype.sendBroadcast = function(numberOfNeighbours, opacity){
  numberOfNeighbours = numberOfNeighbours || MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS;
  opacity = opacity || 1;

  var pos = this.currentPosition();
  var broadcastCircle = svgElem.circle(pos[0], pos[1], this.currentOuterRadius());
  broadcastCircle.attr({
    "stroke": this.outerCircle.attr('stroke'),
    "stroke-width": BROADCAST_STROKE_WIDTH,
    'opacity': opacity
  });

  broadcastCircle.animate({
    r: numberOfNeighbours * BOX_WIDTH,
    opacity: 0
  }, BROADCAST_TIME_PER_BOX * numberOfNeighbours, function(){
    this.remove();
  });

  var that = this;
  this.callOnNeighbours(2, function(){
    this.setDelayedAnimationFromBroadcast(that)
  });
};


Circle.prototype.setDelayedAnimationFromBroadcast = function(broadcastSender){
  //Precompute broadcast effect on neighbours
  //using linear easing, broadcast wave radius at time t =>
  //r(t) = (MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS * BOX_WIDTH - broadcastSender.outerCircle.attr('r")) * t / BROADCAST_TIME + broadcastSender.outerCircle.attr('r")
  //solving for t, given a radius R=>
  //t = (R - broadcastSender.outerCircle.attr('r")) * BROADCAST_TIME / (MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS * BOX_WIDTH - broadcastSender.outerCircle.attr('r"))
  var maxDistance = MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS * BOX_WIDTH;
  var distanceFromSender =  Math.sqrt((this.x - broadcastSender.x)*(this.x - broadcastSender.x) + (this.y - broadcastSender.y)*(this.y - broadcastSender.y));
  var timeUntilWaveArrives = (distanceFromSender - broadcastSender.currentOuterRadius())*BROADCAST_TIME_PER_BOX*MAX_BROADCAST_RADIUS_IN_BOX_WIDTHS / (maxDistance - broadcastSender.currentOuterRadius());

  //var anim = Raphael.animation({cx: this.outerCircle.attr('cx'), cy: this.outerCircle.attr('cy')}, 1000, 'bounce');
  //this.svgSet.animate(anim.delay(timeUntilWaveArrives));
  var opacity = (maxDistance - distanceFromSender)/maxDistance;
  //this.colorOn(opacity, timeUntilWaveArrives);
 // this.vibrateOn(timeUntilWaveArrives);
  //this.colorOff(timeUntilWaveArrives+200);
};

Circle.prototype.callOnNeighbours = function(maxDegreesOfSeperation, functionToCall){
  maxDegreesOfSeperation = maxDegreesOfSeperation || 1

  var args = [];
  for(var i = 2; i < arguments.length; i++)
  {
    args.push(arguments[i]);
  }

  var xIndex = this.x/BOX_WIDTH - 0.5;
  var yIndex = this.y/BOX_WIDTH - 0.5;

  //STARTING TOP LEFT CORNER OF NEIGHBOURS, LOOP THROUGH EACH LEVEL
  for(var xLevel = -maxDegreesOfSeperation; xLevel <= maxDegreesOfSeperation; xLevel++){
    if(xIndex + xLevel < 0 || xIndex + xLevel > circleMatrix.length - 1 || typeof circleMatrix[xIndex + xLevel] == 'undefined') continue;

    for(var yLevel = -maxDegreesOfSeperation; yLevel <= maxDegreesOfSeperation; yLevel++){
      if(yIndex + yLevel < 0 || yIndex + yLevel > circleMatrix[xIndex + xLevel].length - 1 || typeof circleMatrix[xIndex + xLevel][yIndex + yLevel] == 'undefined') continue;

      if(xLevel == 0 && yLevel == 0) continue;

      functionToCall.apply(circleMatrix[xIndex + xLevel][yIndex + yLevel], args);
    }
  }
};

Circle.prototype.vibrateOn = function(delay){
  delay = delay || 0;

  var that = this;
  this.vibrateAnimation = Raphael.animation(
    {
      cx: this.currentPosition[0] + 5,
      cy: this.currentPosition[1] + 5
    },
    200, 'linear',
    function(){
      that.svgSet.animate(
        {
          cx: that.currentPosition[0] - 5,
          cy: that.currentPosition[1] - 5
        },
        200, 'linear',
        function(){
          that.vibrateOn();
        }
      )
    }
  );
  this.svgSet.stop().animate(this.vibrateAnimation.delay(delay));
};

Circle.prototype.vibrateOff = function(delay){
  delay = delay || 0;

  this.svgSet.stop(this.vibrateAnimation);
};

function AudioSourceCircle(x, y, svgEl){
  Circle.call(this, x, y, svgEl);
};

AudioSourceCircle.prototype = new Circle();

AudioSourceCircle.prototype.constructor = AudioSourceCircle;

AudioSourceCircle.prototype.init = function(){
  Circle.prototype.init.call(this);

  this.innerCircleRadius = MAX_INNER_CIRCLE_RADIUS*2/3;

  this.outerCircleColor = COLORS[1];
  this.innerCircleColor = COLORS[1];
};

AudioSourceCircle.prototype.draw = function(){
  this.svgSet = svgElem.set();
  this.onHoverSet = svgElem.set();
  this.normalSet = svgElem.set();

  this.innerCircle = svgElem.circle(this.x, this.y, this.innerCircleRadius);
  this.innerCircle.attr({stroke: "none", fill: "E0DCDC"});
  this.svgSet.push(this.innerCircle);
  this.onHoverSet.push(this.innerCircle);
  this.normalSet.push(this.innerCircle);

  this.outerCircle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS);
  this.outerCircle.attr({"stroke": "E0DCDC", "stroke-width": OUTER_CIRCLE_STROKE_WIDTH});
  this.svgSet.push(this.outerCircle);
  this.normalSet.push(this.outerCircle);

  var circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS + 10);
  circle.attr({"stroke": COLORS[1], "stroke-width": 1});
  circle.hide();
  this.svgSet.push(circle);
  this.onHoverSet.push(circle);

  circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+13);
  circle.attr({"stroke": COLORS[1], "stroke-width": 2});
  circle.hide();
  this.svgSet.push(circle);
  this.onHoverSet.push(circle);

  circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+20);
  circle.attr({"stroke": COLORS[1], "stroke-width": 3, 'opacity': 0.5});
  circle.hide();
  this.svgSet.push(circle);
  this.onHoverSet.push(circle);

  circle = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+25);
  circle.attr({"stroke": COLORS[1], "stroke-width": 1, 'opacity': 0.5});
  circle.hide();
  this.svgSet.push(circle);
  this.onHoverSet.push(circle);

  this.outerCircleOnHover = svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS+35);
  this.outerCircleOnHover.attr({"stroke": COLORS[1], "stroke-width": 1, 'opacity': 0.2});
  this.outerCircleOnHover.hide();
  this.svgSet.push(this.outerCircleOnHover);
  this.onHoverSet.push(this.outerCircleOnHover);

  hoverArea = svgElem.rect(this.x - BOX_WIDTH/2, this.y-BOX_WIDTH/2, BOX_WIDTH, BOX_WIDTH);
  hoverArea.attr({stroke: "none", fill:   "#f00", "fill-opacity": 0});
  this.svgSet.push(hoverArea);
  this.normalSet.push(hoverArea);
  this.onHoverSet.push(hoverArea);

  this.arrowSet = svgElem.set();
  var arrow = svgElem.arrow(this.x + BOX_WIDTH - 10, this.y, 20, 70, 10).attr({'fill': '#000', opacity: 0});
  this.arrowSet.push(arrow);
  this.svgSet.push(arrow);

  arrow = svgElem.arrow(this.x + BOX_WIDTH - 25, this.y, 20, 70, 10).attr({'fill': '#000', opacity: 0});
  this.arrowSet.push(arrow);
  this.svgSet.push(arrow);

  this.svgSet.attr({cursor: "pointer"});
};

AudioSourceCircle.prototype.currentOuterRadius = function(){
  if($(this.outerCircleOnHover.node).css('display') == 'none')
    return this.outerCircle.attr('r');
  else
    return this.outerCircleOnHover.attr('r');
};

AudioSourceCircle.prototype.setupOnHover = function(){
  var that = this;

  this.svgSet.hover(function(){
   if(!hoverHandlerOn) return

   // that.onMouseEnter();
   that.onClick();
  },
  function(){
    if(!hoverHandlerOn) return

    if(that.clickOn) that.resetNeighbours();
    that.reset();
  });
};

AudioSourceCircle.prototype.setupOnClick = function(){
    var that = this;
    this.svgSet.click(function(){
      if(!clickHandlerOn) return

      that.onClick();
    });
};

AudioSourceCircle.prototype.onClick = function(){
  this.onMouseEnter();

  this.clickOn = true;
//  this.innerCircle.stop().animate({r: this.innerCircleRadius - CLICK_DECREASE_IN_RADIUS}, CLICK_TIME);
  this.arrowSet.stop().animate({opacity: 1}, BROADCAST_NEIGHBOUR_MOVE_TIME);

  this.pushNeighbours(BOX_WIDTH + OUTER_CIRCLE_RADIUS);
};

AudioSourceCircle.prototype.onMouseEnter = function(){
  this.normalSet.hide();
  this.onHoverSet.show();

  this.svgSet.stop();

  this.colorOn();

  this.startBroadcast(3, 0.7);
};

AudioSourceCircle.prototype.reset = function(){
  this.onHoverSet.hide();
  this.normalSet.show();

  this.innerCircle.stop().animate({r: this.innerCircleRadius}, RESET_TIME);
  this.arrowSet.stop().animate({opacity: 0}, RESET_TIME, 'ease-out');
  this.colorOff();

  this.svgSet.animate({
    cx: this.x,
    cy: this.y
  }, RESET_TIME);

  this.clickOn = false;

  this.startBroadcast(1, 0.7);
};

