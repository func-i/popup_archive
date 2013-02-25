function Circle(svgElem, x, y, circleMatrix, xArrIndex, yArrIndex) {
  this.x = x;
  this.y = y;
  this.svgElem = svgElem;
  this.circleMatrix = circleMatrix;
  this.matrixXIndex = xArrIndex;
  this.matrixYIndex = yArrIndex;
};

Circle.prototype.init = function(){
  this.setInnerColor();
  this.setOuterColor();
  this.setBaseInnerRadius();
  this.setBaseOuterRadius();

  this.draw();
  return this;
};

Circle.prototype.setInnerColor = function(color){
  this.innerCircleColor = color != null  ? color : COLORS[Math.floor(COLORS.length  * Math.random())];

  if(this.isColorOn)
    this.colorOn();

  return this;
};

Circle.prototype.setOuterColor = function(color){
  this.outerCircleColor = color != null  ? color : COLORS[Math.floor(COLORS.length  * Math.random())];

  if(this.isColorOn)
    this.colorOn();

  return this;
};

Circle.prototype.setBaseInnerRadius = function(radius){
  this.innerCircleRadius = radius != null  ? radius : ((MAX_INNER_CIRCLE_RADIUS - MIN_INNER_CIRCLE_RADIUS) * Math.random() + MIN_INNER_CIRCLE_RADIUS);
  this.scale();
  return this;
};

Circle.prototype.setBaseOuterRadius = function(radius){
  this.outerCircleRadius = radius != null  ?  radius : OUTER_CIRCLE_RADIUS;
  this.scale();
  return this;
};

Circle.prototype.hide = function(hideTime, callback, easing, delay){
  this.setOpacity(0, hideTime, callback, easing, delay);
  this.isHidden = true;
  return this;
};

Circle.prototype.show = function(showTime, callback, easing, delay){
  this.setOpacity(1, showTime, callback, easing, delay);
  this.isHidden = false;
  return this;
};

Circle.prototype.remove = function(){
  this.svgSet.remove();
  delete this;
};

Circle.prototype.isVisible = function(){
  return !this.isHidden;
};

Circle.prototype.addClickHandler = function(callback){
  var that = this;
  this.svgSet.click(function(){callback.call(that);});
  return this;
};

Circle.prototype.addHoverHandler = function(hoverInCallback, hoverOutCallback){
  var that = this;
  this.svgSet.hover(function(){hoverInCallback.call(that);}, function(){hoverOutCallback.call(that);});
  return this;
};

Circle.prototype.draw = function(){
  this.innerCircle = this.svgElem.circle(this.x, this.y, this.innerCircleRadius);
  this.innerCircle.attr({
    stroke: "none",
    fill: "E0DCDC"
  });

  this.outerCircle = this.svgElem.circle(this.x, this.y, OUTER_CIRCLE_RADIUS);
  this.outerCircle.attr({
    "stroke": "E0DCDC",
    "stroke-width": OUTER_CIRCLE_STROKE_WIDTH
  });

  hoverArea = this.svgElem.rect(this.x - boxWidth/2, this.y-boxWidth/2, boxWidth, boxWidth);
  hoverArea.attr({stroke: "none",
          fill:   "#f00",
          "fill-opacity": 0
  });

  this.svgSet = this.svgElem.set();
  this.svgSet.push(this.outerCircle, this.innerCircle, hoverArea);

  return this;
};

Circle.prototype.scale = function(scale, scaleTime, callback, easing, delay){
  if(typeof this.innerCircle == 'undefined' || typeof this.outerCircle == 'undefined')
    return this;

  scale = scale != null ? scale : 1;
  scaleTime = scaleTime != null ? scaleTime : GROWTH_TIME;
  easing = easing != null ? easing : "easeIn";
  delay = delay != null  ? delay : null;


  if(this.scaleAnimations){
    this.innerCircle.stop(this.scaleAnimations[0]);
    this.outerCircle.stop(this.scaleAnimations[1]);
  }

  this.scaleAnimations = new Array(2);
  this.scaleAnimations[0] = Raphael.animation({r: this.innerCircleRadius * scale}, scaleTime, easing, callback);
  this.innerCircle.animate(this.scaleAnimations[0].delay(delay));
  this.scaleAnimations[1] = Raphael.animation({r: this.outerCircleRadius * scale}, scaleTime, easing, callback);
  this.outerCircle.animate(this.scaleAnimations[1].delay(delay));

  return this;
};

Circle.prototype.colorOn = function(colorTime, callback, easing, delay){
  if(typeof this.innerCircle == 'undefined' || typeof this.outerCircle == 'undefined')
    return this;

  colorTime = colorTime != null ? colorTime : COLOR_TIME;
  easing = easing != null  ? easing : "easeIn";
  delay = delay != null  ? delay : null;

  if(this.colorAnimations){
    this.innerCircle.stop(this.colorAnimations[0]);
    this.outerCircle.stop(this.colorAnimations[1]);
  }

  this.colorAnimations = new Array(2);
  this.colorAnimations[0] = Raphael.animation({fill: this.innerCircleColor}, colorTime, easing, callback);
  this.innerCircle.animate(this.colorAnimations[0].delay(delay));
  this.colorAnimations[1] = Raphael.animation({stroke: this.outerCircleColor}, colorTime, easing, callback);
  this.outerCircle.animate(this.colorAnimations[1].delay(delay));

  this.isColorOn = true;

  return this;
};

Circle.prototype.colorOff = function(colorTime, callback, easing, delay){
  if(typeof this.innerCircle == 'undefined' || typeof this.outerCircle == 'undefined')
    return this;

  colorTime = colorTime != null  ? colorTime : COLOR_TIME;
  easing = easing != null  ? easing : "easeIn";

  if(this.colorAnimations){
    this.innerCircle.stop(this.colorAnimations[0]);
    this.outerCircle.stop(this.colorAnimations[1]);
  }

  this.colorAnimations = new Array(2);
  this.colorAnimations[0] = Raphael.animation({fill: "#E0DCDC"}, colorTime, easing, callback);
  this.innerCircle.animate(this.colorAnimations[0].delay(delay));
  this.colorAnimations[1] = Raphael.animation({stroke: "#E0DCDC"}, colorTime, easing, callback);
  this.outerCircle.animate(this.colorAnimations[1].delay(delay));

  this.isColorOn = false;

  return this;
};

Circle.prototype.setOpacity = function(opacity, opacityTime, callback, easing, delay){
  if(typeof this.innerCircle == 'undefined' || typeof this.outerCircle == 'undefined')
    return this;

  opacity = opacity != null  ? opacity : 1;
  opacityTime = opacityTime != null  ? opacityTime : COLOR_TIME;
  easing = easing != null  ? easing : "easeIn";
  delay = delay != null  ? delay : null;

  if(this.opacityAnimations){
    this.innerCircle.stop(this.opacityAnimations[0]);
    this.outerCircle.stop(this.opacityAnimations[1]);
  }

  this.opacityAnimations = new Array(2);
  this.opacityAnimations[0] = Raphael.animation({'opacity': opacity}, opacityTime, easing, callback);
  this.innerCircle.animate(this.opacityAnimations[0].delay(delay));
  this.opacityAnimations[1] = Raphael.animation({'opacity': opacity}, opacityTime, easing, callback);
  this.outerCircle.animate(this.opacityAnimations[1].delay(delay));

  return this;
};

Circle.prototype.move = function(x, y,  moveTime, callback, easing, delay){
  if(typeof this.innerCircle == 'undefined' || typeof this.outerCircle == 'undefined')
    return this;

  x =  x != null  ? x : this.x;
  y = y != null  ? y : this.y;
  moveTime = moveTime != null  ? moveTime : COLOR_TIME;
  easing = easing != null  ? easing : "easeIn";
  delay = delay != null  ? delay : null;

  if(this.moveAnimation){
    this.svgSet.stop(this.moveAnimation);
  }

  this.moveAnimation = Raphael.animation({'cx': x, 'cy': y}, moveTime, easing, callback);
  this.svgSet.animate(this.moveAnimation.delay(delay));

  return this;
};

Circle.prototype.sendBroadcast = function(startRadius, endRadius, startOpacity, color, width, broadcastTime, callback, easing, delay){
  startRadius = startRadius != null  ? startRadius : this.currentOuterRadius();
  endRadius = endRadius != null  ? endRadius : this.currentOuterRadius() * 3;
  startOpacity = startOpacity != null  ? startOpacity : 1;
  broadcastTime = broadcastTime != null  ? broadcastTime : BROADCAST_TIME_PER_BOX * (endRadius - startRadius) / boxWidth;
  color = color != null  ? color : this.outerCircle.attr('stroke');
  width = width != null  ? width : BROADCAST_STROKE_WIDTH;
  easing = easing != null  ? easing : "linear";
  delay = delay != null  ? delay : null;

  var pos = this.currentPosition();
  var broadcastCircle = this.svgElem.circle(pos[0], pos[1], startRadius);
  broadcastCircle.attr({
    "stroke": color,
    "stroke-width": width,
    'opacity': startOpacity
  });

  var broadcastAnim = Raphael.animation({r: endRadius, opacity: 0}, broadcastTime, easing, function(){
    if(typeof callback == 'function')
      callback();
    this.remove();
  });
  broadcastCircle.animate(broadcastAnim.delay(delay));

  return this;
};

Circle.prototype.startBroadcast = function(broadcastFrequency, startRadius, endRadius, startOpacity, color, width, broadcastTime, broadcastCallback, easing, delay){
  broadcastFrequency = broadcastFrequency != null  ? broadcastFrequency : BROADCAST_FREQUENCY;

  var that = this;
  that.stopBroadcast();
  that.sendBroadcast(startRadius, endRadius, startOpacity, color, width, broadcastTime, broadcastCallback, null, easing);
  that.broadcastTimer = setInterval(function(){that.sendBroadcast(startRadius, endRadius, startOpacity, color, width, broadcastTime, broadcastCallback, null, easing, delay)}, broadcastFrequency);

  return this;
};

Circle.prototype.stopBroadcast = function(){
  clearInterval(this.broadcastTimer);
  return this;
};

Circle.prototype.connectNeighbourWithArc = function(neighbour, strokeColor, connectTime, callback, easing, delay){
  strokeColor = strokeColor != null  ? strokeColor : CONNECT_COLOR;
  connectTime = connectTime != null  ? connectTime : CONNECT_TIME;
  easing = easing !=null  ? easing : "easeIn";
  delay = delay != null  ? delay : null;

  var path = this.svgElem.path("M" + this.x + " " + this.y);
  path.attr('stroke', strokeColor);

  var curveString =
    "M" + this.x + " " + this.y +
    "S" + (this.x + neighbour.x)/2 + " " + Math.floor((this.y + neighbour.y)/2 + (this.y - neighbour.y)/2*Math.random()) + " " + neighbour.x + " " + neighbour.y;
  var pathAnimation = Raphael.animation({'path': curveString}, connectTime, easing, callback);
  path.animate(pathAnimation.delay(delay));

  (this.connectedPaths = this.connectedPaths || []).push([path, neighbour]);
  (neighbour.connectedPaths = neighbour.connectedPaths || []).push([path, this]);

  neighbour.innerCircle.toFront();
  this.innerCircle.toFront();

  return path;
};

Circle.prototype.removeConnectedPaths = function(removeTime, callback, easing, delay){
  if(typeof this.connectedPaths == 'undefined') return this;

  var that = this;
  $.each($.extend(true, [], this.connectedPaths), function(i, pathArr)
  {
    that.removePath(pathArr[0], removeTime, callback, easing, delay);
  });

  return this;
};

Circle.prototype.removePath = function(path, removeTime, callback, easing, delay){
  removeTime = removeTime != null  ? removeTime : RESET_TIME;
  easing = easing != null  ? easing : "easeIn";

  var that = this;
  var pathAnimation = Raphael.animation({'opacity': 0}, removeTime, easing, function(){
      path.remove();
      if(typeof callback == 'function')
        callback.call(this);
  });
  path.animate(pathAnimation.delay(delay));

  if(typeof this.connectedPaths == 'undefined')
    return this;

  var indexOf = null;
  $.each(this.connectedPaths, function(index, pathArr){
    if(pathArr[0] == path)
      indexOf = index;
  });
  if(indexOf == null)
    return this;
  var pathArr = this.connectedPaths.splice(indexOf, 1)[0];
  var neighbour = pathArr[1];

  if(typeof neighbour == 'undefined' || typeof neighbour.connectedPaths == 'undefined')
    return this;
  indexOf = null;
  $.each(neighbour.connectedPaths, function(index, neighbourPathArr){
    if(neighbourPathArr[0] == path)
      indexOf = index;
  });
  neighbour.connectedPaths.splice(indexOf, 1);

  return this;
};

Circle.prototype.getConnectedPaths = function(){
  return this.connectedPaths;
}

Circle.prototype.setBlur = function(blurSize){
  this.innerCircle.blur(blurSize);
  this.outerCircle.blur(blurSize);
  return this;
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

Circle.prototype.reset = function(resetTime, callback, easing, scale, x, y, delay){
  resetTime = resetTime != null  ? resetTime : RESET_TIME;

  this.scale(scale, resetTime, null, easing, delay).colorOff(resetTime, null, easing, delay).move(x, y, resetTime, null, easing, delay).removeConnectedPaths(resetTime, callback, easing, delay).stopBroadcast().setBlur('none');
  this.clickOn = false;

  return this;
};

Circle.prototype.callOnNeighbours = function(arrayDistanceToCall, functionToCall){
  arrayDistanceToCall = arrayDistanceToCall != null  ? arrayDistanceToCall : 1

  //STARTING TOP LEFT CORNER OF NEIGHBOURS, LOOP THROUGH EACH LEVEL
  for(var xLevel = -arrayDistanceToCall; xLevel <= arrayDistanceToCall; xLevel++)
  {
    var xIndex = this.matrixXIndex + xLevel;
    if(xIndex < 0 || xIndex > this.circleMatrix.length - 1 || typeof this.circleMatrix[xIndex] == 'undefined') continue;

    for(var yLevel = -arrayDistanceToCall; yLevel <= arrayDistanceToCall; yLevel++)
    {
      var yIndex = this.matrixYIndex + yLevel;
      if(yIndex < 0 || yIndex > this.circleMatrix[xIndex].length - 1 || typeof this.circleMatrix[xIndex][yIndex] == 'undefined') continue;

      if(xLevel == 0 && yLevel == 0) continue;

      functionToCall.apply(this.circleMatrix[xIndex][yIndex], []);
    }
  }

  return this;
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
