/**
   colorpicker.js
   (C) 2011-2012 Bradley Momberger.
   @version 1.1
   Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

   Notes:
   This is the colorpicker startup script.  It "ties" the fields controller and canvas controller
   together using the jQueryMX "tie" plugin from JavascriptMVC (http://javascriptmvc.com).  A model
   shared by both controllers signals each controller to call its "val" function every time either
   controller's element receives a "change" event.
*/
			window.MagicNumbers = {
			  MAX_LIGHTNESS : 255,
			  MAX_SATURATION : 255,
			  MAX_HUE : 359,
			  MAX_RED : 255,
			  MAX_GREEN : 255,
			  MAX_BLUE : 255
			};

steal('//jquery/jquery',
      '//jquery/jquery.lang', 
      '//jquery/jquery.class', 
      '//jquery/jquery.controller',
	  '//jquery/jquery.model',
      '//jquery/jquery.tie'  ).css( 'colorpicker' )
  .controllers('controllers/canvas', 'controllers/fields', 'controllers/preview')
	.then(function(){
		var hsl = {hue : 0, saturation : 128, lightness : 128};
		$("#content").colorpicker_canvas({hsl : hsl});
		$("#fields").colorpicker_fields({hsl : hsl});
		$("#preview").colorpicker_preview({hsl : hsl});

		$.Model("HSL");
		var hslModel = new HSL({hsl : hsl});
		$("#content, #fields, #preview").tie(hslModel, "hsl");
	});
	
