var storage = chrome.storage.sync;

var options_vars = ["userentered", "wk1", "wk2", "wk3", "wk4", "wk5", "wk6", "wk7", "wk8", "wk9", "wk10", "wk11", "wk12", "wk13", "wk14", "wk15", "wk16", "wk17", "wk18", "wk19", "wk20", "wk21", "wk22", "wk23", "wk24", "wk25", "wk26", "wk27", "wk28", "wk29", "wk30", "wk31", "wk32", "wk33", "wk34", "wk35", "wk36", "wk37", "wk38", "wk39", "wk40", "wk41", "wk42", "wk43", "wk44", "wk45", "wk46", "wk47", "wk48", "wk49", "wk50" ];

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponseCallback) {
    console.log("starting request listener");
    if ( request.message == "kanji" ) {
	chrome.pageAction.show(sender.tab.id);
	storage.get(options_vars, function(items) {
	    var bkanji = '';
	    console.log(items);
	    if ( items.userentered != null && items.userentered != '') {
		bkanji = bkanji + items.userentered;
	    }
	    for ( var i = 0; i < 50; i++ ) {
		var j = "wk" + i;
		if ( j in items ) {
		    bkanji = bkanji + items[j]
		}
	    }
	    console.log("sending back: " + bkanji);
	    sendResponseCallback({kanjilist: bkanji});
	});
    } else {
      console.log("Unexpected message value " + request.message + ", ignoring.");
    }
  }
);

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(tab.id, {code:"toggleHighlightKanji();"});
});
