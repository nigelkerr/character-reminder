var storage = chrome.storage.sync;
var userinfo = "https://www.wanikani.com/api/v1/user/WANI_KANI_API_KEY/user-information";
var kanjilist = "https://www.wanikani.com/api/v1/user/WANI_KANI_API_KEY/kanji/";
var WKAK = "WANI_KANI_API_KEY";
var userlevel = 0;
var options_vars = ["wanikaniapi", "userentered", "wk1", "wk2", "wk3", "wk4", "wk5", "wk6", "wk7", "wk8", "wk9", "wk10", "wk11", "wk12", "wk13", "wk14", "wk15", "wk16", "wk17", "wk18", "wk19", "wk20", "wk21", "wk22", "wk23", "wk24", "wk25", "wk26", "wk27", "wk28", "wk29", "wk30", "wk31", "wk32", "wk33", "wk34", "wk35", "wk36", "wk37", "wk38", "wk39", "wk40", "wk41", "wk42", "wk43", "wk44", "wk45", "wk46", "wk47", "wk48", "wk49", "wk50" ];

function status(msg) {
    jQuery('#status').empty();
    jQuery('#status').append('<p>'+msg+'</p>');
}

function save_option(key) {
    var obj = {};
    if ( key == "wanikaniapi" || key == "userentered" ) {
	obj[key] = jQuery('#'+key).val();
    } else if ( key.match(/^wk[0-9]+$/) ) {
	obj[key] = jQuery('#'+key).text();
    } else {
	console.log("No such key " + key + " understood!");
	
	return;
    }

    storage.set(obj, 
		function() { 
		    console.log("saved " + key + " with " + obj);
		    //status("Saved an option: " + key + "=" + obj[key]);
		});
}

function save_userentered() {
    save_option("userentered");
}

function save_options() {

    var obj = {"wanikaniapi":jQuery('#wanikaniapi').val(),
		 "userentered":jQuery('#userentered').val()
		};
    jQuery('.wk-lvl').each( function(index) {
	console.log("trying to save the " + $(this).attr('id'));
	obj[$(this).attr('id')] = $(this).text();
    });

    console.log(obj);

    storage.set(obj, 
		function() { 
		    jQuery(".status").text("Options Saved!");
		    setTimeout(function() {
			jQuery(".status").text('');
		    }, 1750);
		});
}


function kanji_with_stats(data) {
    var k = data.requested_information;
    var retval = '';
    for ( var i = 0; i < k.length; i++ ) {
	var kanji = k[i];
	if ( kanji.stats != null ) {
	    retval = retval + kanji.character;
	}
    }
    return retval;
}

function refresh_wanikani() {
    jQuery('#wanikaniblocks').empty();
    var tmpkey = jQuery('#wanikaniapi').val();
    var tmpkanjilist = kanjilist.replace(WKAK, tmpkey);
    var still_good = true;
    var lvl = 1;
    var arr = [];
    while ( lvl <= userlevel && still_good ) {
	var tmpkanjilistlevel = tmpkanjilist + lvl;
	console.log("trying to hit " + tmpkanjilistlevel);
	jQuery.ajax({'cache': false,
		     'dataType': 'json',
		     'url': tmpkanjilistlevel, 
		     'error': function(jqXHR, textStatus, errorThrown) {
			 console.log(textStatus);
			 jQuery('.howdy').text("We didn't get a good response back, but an '"+textStatus+"' known as '"+errorThrown+"' instead. WK could be unhappy, or you may have not got the API Key quite right.");
			 still_good = false;
		     },
		     'success': function(data, textStatus, jqXHR) {
			 console.log(data);
			 jQuery('#wanikaniblocks').append('<div class="wk-block">Kanji from level '+data.requested_information[0].level+': <span class="wk-lvl" id="wk'+ data.requested_information[0].level +'">'+kanji_with_stats(data)+'</span></div>');
			 save_option("wk"+ data.requested_information[0].level)
		     }});
	lvl = lvl + 1;
    };
}

function check_wanikani() {
    console.log("trying to check wanikani for api key validity.");
    var tmpkey = jQuery('#wanikaniapi').val();
    console.log("tmpkey is " + tmpkey);
    if ( tmpkey != null && tmpkey != '' && tmpkey.match(/^[0-9a-f]{32}$/ )) {
	var tmpuserinfo = userinfo.replace(WKAK, tmpkey);
	console.log("tmpuserinfo url is " + tmpuserinfo);
	jQuery.ajax({'cache': false,
		     'dataType': 'json',
		     'url': tmpuserinfo, 
		     'error': function(jqXHR, textStatus, errorThrown) {
			 console.log(textStatus);
			 jQuery('.howdy').text("We didn't get a good response back, but an '"+textStatus+"' known as '"+errorThrown+"' instead. WK could be unhappy, or you may have not got the API Key quite right.");
		     },
		     'success': function(data, textStatus, jqXHR) {
			 console.log(data);
			 jQuery('.howdy').text("Howdy, " + data.user_information.username + ", of level " + data.user_information.level + "!");
			 status("WaniKani responded nicely to our ping!");
			 userlevel = data.user_information.level;
			 save_option("wanikaniapi");
			 refresh_wanikani();
		     }});
    } else {
	jQuery('.howdy').empty();
    }
}

jQuery(document).ready(function () {

    jQuery("#wanikaniapi").change(check_wanikani);
    jQuery("#wanikaniapi").keydown(check_wanikani);
    jQuery("#wanikaniapi").keyup(check_wanikani);
    jQuery("#wanikaniapi").keypress(check_wanikani);

    jQuery("#userentered").change(save_userentered);
    jQuery("#userentered").keydown(save_userentered);
    jQuery("#userentered").keyup(save_userentered);
    jQuery("#userentered").keypress(save_userentered);

    // get out the user-entered, and the wanikaniapi, if there are any.
    storage.get(options_vars, function(items) {
	console.log(items);
	if (items.wanikaniapi != null && items.wanikaniapi != '') {
	    jQuery('#wanikaniapi').val(items.wanikaniapi);
	    jQuery('#wanikaniapi').change();
	}
	if ( items.userentered != null && items.userentered != '') {
	    jQuery('#userentered').val(items.userentered);
	    jQuery('#userentered').change();
	}
	for ( var i = 0; i < 50; i++ ) {
	    var j = "wk" + i;
	    if ( j in items ) {
		jQuery('#wanikaniblocks').append('<div class="wk-block">Kanji from level '+i+': <span class="wk-lvl" id="'+j+'">'+items[j]+'</span></div>');
	    }
	}
    } );


});
