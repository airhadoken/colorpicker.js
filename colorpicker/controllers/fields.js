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
steal("//jquery/jquery.controller")
.then(
function(){
  $.Controller("Colorpicker.Controllers.Fields", {

	},
    {
	    init : function(hsv)
		{
		  this.val(hsv);
		},
		'input keyup' : function() { this["input change"]() },
		'input change' : function() 
		{
		  this.element.trigger("change", 
					   {hue : this.find("#hue").val(), 
						   saturation : this.find("#saturation").val(), 
						   value : this.find("#value").val()});
		},

		val : function(hsv)
		{
		  this.find("#hue").val(hsv.hue);
		  this.find("#saturation").val(hsv.saturation);
		  this.find("#value").val(hsv.value);
		}
	});
});
