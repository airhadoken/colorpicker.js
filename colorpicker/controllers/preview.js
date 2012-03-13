/**
   colorpicker/controllers/preview.js
   (C) 2012 Bradley Momberger.
   @version 1.1
   Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

   Notes:
   This is the preview pane controller.  If a values update comes in through the tie plugin (calling the
   val() function) it sets the background color property of the preview div.  It does not accept user
   input.
*/
steal("//jquery/jquery.controller").then(
	function(){
		$.Controller(
			"Colorpicker.Controllers.Preview", 
			{},
			{
				init : function()
				{
					this.val(this.options.hsl);
				},
				val: function(colorObj) 
				{
					this.element.css(
						"background-color",
						typeof colorObj.hue !== 'undefined'
							? ["hsl(",
							   colorObj.hue,
							   ",",
							   parseInt(colorObj.saturation * 100 / MagicNumbers.MAX_SATURATION),
							   "%,",
							   parseInt(colorObj.lightness * 100 / MagicNumbers.MAX_LIGHTNESS),
							   "%)"].join("")
							: ["rgb(",
							   colorObj.red,
							   ",",
							   colorObj.green,
							   ",",
							   colorObj.blue,
							   ")"].join("")
					);
				}
			});
	});