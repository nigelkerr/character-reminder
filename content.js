
var ACTIVE = 'kanji_that_you_know';
var MARKER = 'futoji_marker';
var kanji = null;
var kanjiregexp = null;
var kanjiclumpregexp = null;
var includeLinkText = true;

console.log("starting content.js");

function toggleHighlightKanji() {
    console.log("starting highlightKanji");

    if ( jQuery("."+ACTIVE).length ) {
	console.log("trying to remove");
	removeHighlightKanji();
    } else {
	console.log("trying to add");
	highlightKanji();
    }
}

function removeHighlightKanji() {
    jQuery("."+MARKER+"."+ACTIVE).each(function(index) {
	jQuery(this).replaceWith(this.textContent);
    });
}


function highlightKanji() {
    if ( kanjiregexp == null ) {
	console.log("no kanji regexp, quitting.");
	return;
    }

    var xPathPattern = '//*[not(ancestor-or-self::head) and not(ancestor::select) and not(ancestor-or-self::script) ' + (includeLinkText ? '' : ' and not(ancestor-or-self::a)') + ']/text()[normalize-space(.) != ""]';
    var foundNodes = {};
    try {
	var iterator = document.evaluate(xPathPattern, document.body, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	var nodeCtr = 100;
	var thisNode ;
	while (thisNode = iterator.iterateNext()) {
	    if (thisNode.textContent.match(/[\u3400-\u9FBF]/)) {
		if (hasKanjiToHighlight(thisNode.textContent) === true) {
		    foundNodes[nodeCtr] = thisNode;
		}
	    }
	    nodeCtr++;
	}
    } catch (e) {
	console.error( 'Error during XPath document iteration: ' + e );
	return;
    }

    for ( var nc in foundNodes ) {
	var node = foundNodes[nc];
	var newNode = null;
	console.log("trying to replace with a node.");
	do {
	    var result = kanjiclumpregexp.exec(node.textContent);
	    if ( result ) {
		console.log("found a match: " + result);
		node.splitText(result.index);
		var wrapNode = node.nextSibling;
		wrapNode.splitText(result[0].length);
		newNode = wrapNode.nextSibling;

		var span = document.createElement("span");
		jQuery(span).addClass( ACTIVE + " " + MARKER);
		span.textContent = result[0];
		var pNode = wrapNode.parentNode;
		pNode.insertBefore(span, wrapNode);
		pNode.removeChild(wrapNode);
	    } else {
		break;
	    }
	} while ( node = newNode );
    }
    console.log("done with highlightKanji");
}

function hasKanjiToHighlight(str) {
    console.log("Starting hasKanjiToHighlight");
    var foundKanji = str.match(/[\u3400-\u9FBF]/g);
    if (foundKanji) {
	for (var x = 0; x < foundKanji.length; x++) {
	    if (kanjiregexp.exec(foundKanji[x])) {
		console.log("found one hasKanjiToHighlight");
		return true;
	    }
	}
    } else {
	return null;
    }
    return false;
}

if ( document.body.innerText.match(/[\u3400-\u9FBF]/) ) {
    console.log("trying to call background page");
    chrome.extension.sendMessage({message: "kanji"}, function(response) {
	console.log("starting kanji callback handler with " + response);
	kanji = response.kanjilist;
	if ( kanji == null || kanji.length <= 0 ) {
	    console.log("got nothing back as kanji!");
	} else {
	    console.log("got back some kanji: " + kanji);
	    kanjiregexp = new RegExp("[" + kanji + "]");
	    kanjiclumpregexp = new RegExp("["+kanji+"]+");
	}
    });
}
