// Save this script as `options.js`

var storage = chrome.storage.sync;

jQuery(document).ready(function () {

    storage.get("favorite_color", function(items) {
	console.log(items);
	if (!items.favorite_color) {
	    return;
	}
	var color = jQuery('#color').val();
	jQuery('#color').val(items.favorite_color);
    } );

    jQuery("button.save").bind('click', function () {
	var color = jQuery('#color').val();
	storage.set({"favorite_color":color}, 
		    function() { 
			jQuery("#status").text("Options Saved!");
			setTimeout(function() {
			    jQuery("#status").text('');
			}, 1750);
		    });
    });

});


storage.get("favorite_color", function(items) { console.log("JFC!!!"); });
