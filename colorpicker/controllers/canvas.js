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
					 defaults : {hsv : { hue : 0, saturation : 0, value : 0}}
	  }, 
	  {
	    //prototypes go here
	  init: function() {
	      this.context = this.find("canvas")[0].getContext('2d');
	      this._hue = this.options.hsv.hue;
	      this._saturation = this.options.hsv.saturation;
	      this._value = this.options.hsv.value;

	      this.updateMap();
		  this.drawCrosshair();
	      this.updateValueColumn();
		  this.drawValueArrow();
	  },
	      
	  val : function(hsv) {
		  console.log("canvas val called");
	      var oldHue = this._hue;
	      var oldSaturation = this._saturation;
	      var oldValue = this._value;

	      this._hue = hsv.hue;
	      this._saturation = hsv.saturation;
	      this._value = hsv.value;

		  this.updateMap();
		  this.drawCrosshair();
		  this.updateValueColumn();
		  this.drawValueArrow();

	      this.find(".crosshair")
		.each(
		      function() {
			this.left = hsv.hue;
			this.top = hsv.saturation;
		      });
	      this.find(".valueArrow")
		.each(
		      function() {
			this.top = hsv.value;
		      });
	      
	  },

	  updateMap : function() {
        var valuePct = this._value * 100 / this.Class.mapHeight;
	      for(var j = 0; j < this.Class.mapWidth; j++) {
			this.context.beginPath();
			this.context.rect(j, 0, 1, this.Class.mapHeight);
			//HSL expressed in hsl(degrees, pct, pct)
			var grad = this.context.createLinearGradient(j, this.Class.mapHeight, j+1, 0);
			grad.addColorStop(0, ["hsl(", j, ",0%,", valuePct, "%)"].join(""));
			grad.addColorStop(1, ["hsl(", j, ",100%,", valuePct, "%)"].join(""));
			this.context.fillStyle=grad;
			this.context.fill();
			this.context.closePath();
	      }
	   },

	   updateValueColumn : function() {
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
		  var valuePct = this._value * 100 / this.Class.mapHeight,
			crosshairColor = (valuePct + 50) % 100;
		  this.context.fillStyle = ["hsl(0,0%,", crosshairColor, "%)"].join("");
		  this.context.fillRect(this._hue - 1, (this.Class.mapHeight - this._saturation) + 3, 3, 5);
		  this.context.fillRect(parseInt(this._hue) + 3, this.Class.mapHeight - this._saturation - 1, 5, 3);
		  this.context.fillRect(this._hue - 1, this.Class.mapHeight - this._saturation - 7, 3, 5);
		  this.context.fillRect(this._hue - 7, this.Class.mapHeight - this._saturation - 1, 5, 3);
		},

		drawValueArrow : function() {
		  this.context.clearRect(this.Class.mapWidth + 10, 0, 8, this.Class.mapHeight);
		  this.context.beginPath();
		  this.context.moveTo(this.Class.mapWidth + 10, this.Class.mapHeight - this._value - 5);
		  this.context.lineTo(this.Class.mapWidth + 18, this.Class.mapHeight - this._value);
		  this.context.lineTo(this.Class.mapWidth + 10, this.Class.mapHeight - this._value + 5);
		  this.context.fillStyle = "hsl(0, 0%, 25%)";
		  this.context.fill();
		  this.context.closePath();
		},

	    "canvas click" : function(el, ev) {
		  var x = ev.clientX - el.offset().left;
		  var y = ev.clientY - el.offset().top;
		  if(x < this.Class.mapWidth) { //in the map
			this.element.trigger(
			   "change", 
			   {hue: x, saturation: this.Class.mapHeight - y, value: this._value}
			   );
		  } 
		  else if(x >= this.Class.mapWidth + 20 && x < this.Class.mapWidth + 40) { //in the value column
			this.element.trigger(
			  "change", 
			  {hue: this._hue, saturation: this._saturation, value: this.Class.mapHeight - y}
			  );
		  }
		}
    });
});
