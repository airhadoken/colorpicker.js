/**
   colorpicker/controllers/fields.js
   (C) 2011 Bradley Momberger.
   @version 1.0
   Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

   Notes:
   This is the controller for the form fields.  It listens to changes coming from the tie plugin
   (calling the val() function below) and for changes when values are typed into the fields
   themselves.
*/
steal("//jquery/jquery.controller", "//jquery/jquery.view", "//jquery/jquery.view.ejs", "//jquery/jquery.controller.view")
  .views("//colorpicker/views/fields/list.ejs", "//colorpicker/views/fields/show.ejs")
.then(
function(){
  $.Controller("Colorpicker.Controllers.Fields", {
      hslFields : { 
		 hue : "Hue (degrees)", 
		 saturation : "saturation (0-" + MagicNumbers.MAX_SATURATION + ")", 
		 lightness : "lightness (0-" + MagicNumbers.MAX_LIGHTNESS + ")"
	  },
      rgbFields : {	 
				 red : "red (0-" + MagicNumbers.MAX_RED + ")",
				 green : "green (0-" + MagicNumbers.MAX_GREEN + ")",
				 blue : "blue (0-" + MagicNumbers.MAX_BLUE + ")"
	  },
	  init : function() { 
	     this._super.apply(this, arguments); 
         this.fields = $.extend({}, this.hslFields, this.rgbFields) 
	  }
				
	},
    {
	    init : function(hsl)
		{
          var self = this;
		 	$(self.element).html( $.View(
			  "//colorpicker/views/fields/list.ejs",
			  { fieldNames: this.Class.fields}));
			this.val(hsl);
		},
		'input keyup' : function(el, ev) { this["input change"](el, ev); },
		'input change' : function(el, ev) 
		{
		  if($(el).is("#red,#green,#blue")) {
			   this.element.trigger("change", 
									{red: this.find("#red").val(),
										green: this.find("#green").val(),
										blue: this.find("#blue").val()});
		  } else {
			  this.element.trigger("change", 
					   {hue : this.find("#hue").val(), 
						   saturation : this.find("#saturation").val(), 
						   lightness : this.find("#lightness").val()});
		  }
		},

		val : function(colorObj)
		{
		  if(colorObj.hue != null) {
			this.find("#hue").val(colorObj.hue);
			this.find("#saturation").val(colorObj.saturation);
			this.find("#lightness").val(colorObj.lightness);
			var rgb = this.convertHSLtoRGB(colorObj);
			this.find("#red").val(rgb.r);
			this.find("#green").val(rgb.g);
			this.find("#blue").val(rgb.b);
		  }
		  else if(colorObj.red != null) {
			this.find("#red").val(colorObj.red);
			this.find("#green").val(colorObj.green);
			this.find("#blue").val(colorObj.blue);
			var hsl = this.convertRGBtoHSL(colorObj);
			this.find("#hue").val(hsl.hue);
			this.find("#saturation").val(hsl.saturation);
			this.find("#lightness").val(hsl.lightness);			
		  }
		},

		convertHSLtoRGB : function(hsl) {
		var lightnessFrac = +(hsl.lightness) / (MagicNumbers.MAX_LIGHTNESS),
		  saturationFrac = +(hsl.saturation) / (MagicNumbers.MAX_SATURATION),
		  chroma = (1 - Math.abs(2 * lightnessFrac - 1)) * saturationFrac,
		  hprime = +(hsl.hue) / 60,
		  intermediate = chroma * (1 - Math.abs(hprime % 2 - 1)),
		  lightnessMatcher = lightnessFrac - chroma / 2,
		  X = parseInt((lightnessMatcher + intermediate) * 255),
		  C = parseInt((chroma + lightnessMatcher) * 255),
		  L = parseInt(lightnessMatcher * 255),
		  candidates = [
		  {r:C,g:X,b:L},
		  {r:X,g:C,b:L},
		  {r:L,g:C,b:X},
		  {r:L,g:X,b:C},
		  {r:X,g:L,b:C},
		  {r:C,g:L,b:X}
		  ];
		  return candidates[Math.floor(hprime)] || {r:0,g:0,b:0};
		  },

		convertRGBtoHSL : function(rgb) {
			var rFrac = +(rgb.red) / (MagicNumbers.MAX_RED),
			  gFrac = +(rgb.green) / (MagicNumbers.MAX_GREEN),
			  bFrac = +(rgb.blue) / (MagicNumbers.MAX_BLUE),
			  max = Math.max(rFrac, gFrac, bFrac),
			  min = Math.min(rFrac, gFrac, bFrac),
			  chroma = max - min,
			  hPrime = chroma === 0 ? 3.0 //should be NaN but why bother 
			  : max === rFrac ? ((gFrac - bFrac) / chroma % 6)
			  : max === gFrac ? ((bFrac - rFrac) / chroma + 2)
			  : ((rFrac - gFrac) / chroma + 4),
			  hue = Math.floor((hPrime < 0 ? 1 + hPrime : hPrime) * (MagicNumbers.MAX_HUE + 1) / 6),
			  lightness = (max + min) / 2,
			  saturation = chroma === 0 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1));
			return {hue : hue, 
				    lightness : Math.floor(lightness * MagicNumbers.MAX_LIGHTNESS), 
				saturation : Math.floor(saturation * MagicNumbers.MAX_SATURATION)};
	    },
		convertRGBtoYIQ : function(rgb) {
			var rFrac = +(rgb.red) / (MagicNumbers.MAX_RED + 1),
			  gFrac = +(rgb.green) / (MagicNumbers.MAX_GREEN + 1),
			  bFrac = +(rgb.blue) / (MagicNumbers.MAX_BLUE + 1);
			  return { y : 0.299 * rFrac + 0.587 * gFrac + 0.114 * bFrac,
					   i : 0.595716 * rFrac - 0.274453 * gFrac - 0.321263 * bFrac,
					   q : 0.211456 * rFrac - 0.522591 * gFrac + 0.311135 * bFrac};
	    }
	});
});
