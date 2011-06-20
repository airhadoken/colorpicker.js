//steal/js colorpicker/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('colorpicker/scripts/build.html',{to: 'colorpicker'});
});
