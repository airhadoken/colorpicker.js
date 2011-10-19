/**
   colorpicker/controllers/canvas.js
   (C) 2011 Bradley Momberger.
   @version 1.0
   Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

   Notes:
   This is the canvas controller.  It handles all the drawing routines and listens for clicks
   on the canvas.  If a values update comes in through the tie plugin (calling the val() function)
   it redraws the canvas with a new colormap and crosshair/arrow in the right places.  On a click
   it packages up the new values and triggers a change on the canvas to alert the tie plugin.
*/
steal('//jquery/jquery.controller')
  .then(function(){
	$.Controller("Colorpicker.Controllers.Canvas", {
	    //statics go here
	    mapWidth : 360,
	    mapHeight : 256,
					 defaults : {hsv : { hue : 0, saturation : 0, lightness : 0}}
	  }, 
	  {
	    //prototypes go here
	  init: function() {
	      this.context = this.find("canvas")[0].getContext('2d');
	      this._hue = this.options.hsv.hue;
	      this._saturation = this.options.hsv.saturation;
	      this._lightness = this.options.hsv.lightness;

	      this.updateMap();
		  this.drawCrosshair();
	      this.updateLightnessColumn();
		  this.drawLightnessArrow();
	  },
	      
	  val : function(colorObj) {
	      var oldHue = this._hue;
	      var oldSaturation = this._saturation;
	      var oldLightness = this._lightness;

		  var hsv = colorObj.hue != null ? colorObj : $("#fields").controller().convertRGBtoHSL(colorObj);

	      this._hue = hsv.hue;
	      this._saturation = hsv.saturation;
	      this._lightness = hsv.lightness;

		  this.context.clearRect(0, 0, this.find("canvas").width(), this.find("canvas").height());
		  this.updateMap();
		  this.drawCrosshair();
		  this.updateLightnessColumn();
		  this.drawLightnessArrow();	      
	  },

	  updateMap : function() {
        var lightnessPct = this._lightness * 100 / this.Class.mapHeight;
	      for(var j = 0; j < this.Class.mapWidth; j++) {
			this.context.beginPath();
			this.context.rect(j, 0, 1, this.Class.mapHeight);
			//HSL expressed in hsl(degrees, pct, pct)
			var grad = this.context.createLinearGradient(j, this.Class.mapHeight, j+1, 0);
			grad.addColorStop(0, ["hsl(", j, ",0%,", lightnessPct, "%)"].join(""));
			grad.addColorStop(1, ["hsl(", j, ",100%,", lightnessPct, "%)"].join(""));
			this.context.fillStyle=grad;
			this.context.fill();
			this.context.closePath();
	      }
	   },

	   updateLightnessColumn : function() {
	      this.context.beginPath();
	      this.context.rect(this.Class.mapWidth + 20, 0, 20, this.Class.mapHeight);
	      var grad = this.context.createLinearGradient(
					     this.Class.mapWidth + 30, 
					     this.Class.mapHeight, 
					     this.Class.mapWidth + 30, 
					     0);
		  var satPct = this._saturation * 100 / this.Class.mapHeight;
	      grad.addColorStop(0, ["hsl(", this._hue, ",", satPct, "%,0%)"].join(""));
		  grad.addColorStop(0.5, ["hsl(", this._hue, ",",satPct, "%,50%)"].join(""));
	      grad.addColorStop(1, ["hsl(", this._hue, ",", satPct, "%,100%)"].join(""));
			this.context.fillStyle=grad;
			this.context.fill();
	    },

		drawCrosshair : function() {
		  var lightnessPct = this._lightness * 100 / this.Class.mapHeight,
			crosshairColor = (lightnessPct + 50) % 100;
		  this.context.fillStyle = ["hsl(0,0%,", crosshairColor, "%)"].join("");
		  this.context.fillRect(this._hue - 1, (this.Class.mapHeight - this._saturation) + 3, 3, 5);
		  this.context.fillRect(parseInt(this._hue) + 3, this.Class.mapHeight - this._saturation - 1, 5, 3);
		  this.context.fillRect(this._hue - 1, this.Class.mapHeight - this._saturation - 7, 3, 5);
		  this.context.fillRect(this._hue - 7, this.Class.mapHeight - this._saturation - 1, 5, 3);
		},

		drawLightnessArrow : function() {
		  //this.context.clearRect(this.Class.mapWidth + 10, 0, 8, this.Class.mapHeight);
		  this.context.beginPath();
		  this.context.moveTo(this.Class.mapWidth + 10, this.Class.mapHeight - this._lightness - 5);
		  this.context.lineTo(this.Class.mapWidth + 18, this.Class.mapHeight - this._lightness);
		  this.context.lineTo(this.Class.mapWidth + 10, this.Class.mapHeight - this._lightness + 5);
		  this.context.fillStyle = "hsl(0, 0%, 25%)";
		  this.context.fill();
		  this.context.closePath();
		},

		"canvas mousedown" : function(el, ev) { 
		  var x = ev.pageX - el.offset().left;
		  if(x < this.Class.mapWidth)
		        this.Class.dragging = "map"; 
		  else if(x >= this.Class.mapWidth + 20 && x < this.Class.mapWidth + 40)
			 this.Class.dragging = "column";
		  else
			this.Class.dragging = false;
		  this["canvas mousemove"](el, ev); 
		},
	    "canvas mouseup" : function() { this.Class.dragging = false; },

	    "canvas mousemove" : function(el, ev) {
		  if(this.Class.dragging) {
		  var x = ev.pageX - el.offset().left;
		  var y = ev.pageY - el.offset().top;
		  if(this.Class.dragging === "map") { //in the map
			this.element.trigger(
			   "change", 
			   {hue: Math.min(x, this.Class.mapWidth), 
				   saturation: Math.max(0, this.Class.mapHeight - y), 
				   lightness: this._lightness}
			   );
		  } 
		  else if(this.Class.dragging === "column") { //in the value column
			this.element.trigger(
			  "change", 
			  {hue: this._hue, saturation: this._saturation, lightness: Math.max(0, this.Class.mapHeight - y)}
			  );
		  }
		}
		}
    });
});
