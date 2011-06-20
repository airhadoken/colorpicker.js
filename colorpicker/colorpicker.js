/**
   colorpicker.js
   (C) 2011 Bradley Momberger.
   @version 1.0
   Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

   Notes:
   This is the colorpicker startup script.  It "ties" the fields controller and canvas controller
   together using the jQueryMX "tie" plugin from JavascriptMVC (http://javascriptmvc.com).  A model
   shared by both controllers signals each controller to call its "val" function every time either
   controller's element receives a "change" event.
*/
steal('//jquery/jquery',
      '//jquery/jquery.lang', 
      '//jquery/jquery.class', 
      '//jquery/jquery.controller',
	  '//jquery/jquery.model',
      '//jquery/jquery.tie'  ).css( 'colorpicker' )
  .controllers('//controllers/canvas', '//controllers/fields')
	.then(function(){
		var hsv = {hue : 0, saturation : 128, value : 128};
		$("#content").colorpicker_canvas({hsv : hsv});
		$("#fields").colorpicker_fields({hsv : hsv});

		$.Model("HSV");
		var hsvModel = new HSV({hsv : hsv});
		$("#content, #fields").tie(hsvModel, "hsv");
	});
	
