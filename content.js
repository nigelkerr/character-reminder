
var kanji = null;
var kanjiregexp = null;
var kanjiclumpregexp = null;
var includeLinkText = true;

console.log("starting content.js");

function highlightKanji() {
    console.log("starting highlightKanji");
    if ( kanjiregexp == null ) {
	console.log("no kanji regexp, quitting.");
	return;
    }

    var xPathPattern = '//*[not(ancestor-or-self::head) and not(ancestor::select) and not(ancestor-or-self::script)and not(ancestor-or-self::ruby)' + (includeLinkText ? '' : ' and not(ancestor-or-self::a)') + ']/text()[normalize-space(.) != ""]';
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
	alert('Error during XPath document iteration: ' + e );
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
		span.className = 'kanji_that_you_know';
		span.textContent = result[0];
		var pNode = wrapNode.parentNode;
		pNode.insertBefore(span, wrapNode);
		pNode.removeChild(wrapNode);
	    } else {
		break;
	    }
	} while ( node = newNode );
	node.textContent = node.textContent.replace(kanjiregexp, "<span class='kanji_that_you_know'>$&</span>")
    }
    console.log("done with highlightKanji");
}

function hasKanjiToHighlight(rubySubstr) {
    console.log("Starting hasKanjiToHighlight");
    var foundKanji = rubySubstr.match(/[\u3400-\u9FBF]/g);
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


chrome.extension.sendRequest({message: "kanji"}, function(response) {
    console.log("starting kanji callback handler with " + response);
    kanji = response.kanjilist;
    if ( kanji == null || kanji.length <= 0 ) {
	console.log("got nothing back as kanji!");
    } else {
	console.log("got back some kanji: " + kanji);
	kanjiregexp = new RegExp("[" + kanji + "]");
	kanjiclumpregexp = new RegExp("["+kanji+"]+");
    }
    // stolen from furigana injector 1.2.1!  ha!
    if (document.body.innerText.match(/[\u3400-\u9FBF]/)) {
	highlightKanji();
    }
});
