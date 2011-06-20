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
