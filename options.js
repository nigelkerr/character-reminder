var storage = chrome.storage.sync;
var userinfo = "http://www.wanikani.com/api/v1/user/WANI_KANI_API_KEY/user-information";
var kanjilist = "http://www.wanikani.com/api/v1/user/WANI_KANI_API_KEY/kanji/";
var WKAK = "WANI_KANI_API_KEY";
var userlevel = 0;
var options_vars = ["wanikaniapi", "userentered", "wk1", "wk2", "wk3", "wk4", "wk5", "wk6", "wk7", "wk8", "wk9", "wk10", "wk11", "wk12", "wk13", "wk14", "wk15", "wk16", "wk17", "wk18", "wk19", "wk20", "wk21", "wk22", "wk23", "wk24", "wk25", "wk26", "wk27", "wk28", "wk29", "wk30", "wk31", "wk32", "wk33", "wk34", "wk35", "wk36", "wk37", "wk38", "wk39", "wk40", "wk41", "wk42", "wk43", "wk44", "wk45", "wk46", "wk47", "wk48", "wk49", "wk50" ];

function lock_wanikani() {
    jQuery('#check-wanikani').attr('disabled', 'disabled');
    jQuery('#refresh-wanikani').attr('disabled', 'disabled');
}
function unlock_wanikani() {
    jQuery('#check-wanikani').removeAttr('disabled');
    jQuery('#refresh-wanikani').removeAttr('disabled');
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
			 jQuery('.howdy').text("Howdy, " + data.user_information.username + "!");
			 userlevel = data.user_information.level;
		     }});
    }
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
			 jQuery('#wanikaniblocks').append('<div class="wk-lvl" id="wk'+ data.requested_information[0].level +'">'+kanji_with_stats(data)+'</div>');
		     }});
	lvl = lvl + 1;
    };
}

jQuery(document).ready(function () {

    jQuery("#wanikaniapi").change(check_wanikani);
    jQuery("#check-wanikani").click(check_wanikani);
    jQuery('#refresh-wanikani').click(refresh_wanikani);

    // get out the user-entered, and the wani-kani, if there are any.
    storage.get(options_vars, function(items) {
	console.log(items);
	if (items.wanikaniapi != null && items.wanikaniapi != '') {
	    jQuery('#wanikaniapi').val(items.wanikaniapi);
	    unlock_wanikani();
	}
	if ( items.userentered != null && items.userentered != '') {
	    jQuery('#userentered').val(items.userentered);
	}
	for ( var i = 0; i < 50; i++ ) {
	    var j = "wk" + i;
	    if ( j in items ) {
		jQuery('#wanikaniblocks').append('<div class="wk-lvl" id="'+j+'">'+items[j]+'</div>');
	    }
	}
    } );

    jQuery("button.save").bind('click', save_options);
});
