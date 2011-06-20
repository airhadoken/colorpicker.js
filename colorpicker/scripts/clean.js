//steal/js colorpicker/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/clean',function(){
	steal.clean('colorpicker/colorpicker.html',{indent_size: 1, indent_char: '\t'});
});
