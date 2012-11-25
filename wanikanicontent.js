
console.log("Starting wanikanicontent.js");

function scrapeKnownKanjiList() {
    var found = [];
    $("li.character-item").not(".locked").each( function(index) {
	    $(this).find("span.character").each( function (index) { found.push(this.textContent); } );
    });
    return found.join('');
}

console.log("scaped from this page: " + scrapeKnownKanjiList() );
