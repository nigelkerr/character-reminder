character-reminder
==================

A chrome plugin that will highlight characters that the user lists as
highlightable.  Original intent was to highlight Kanji that I am
supposed to know already in web pages, as inspiration.  I wish that I
had a firmer pedagogical basis than that.

Not very sophisticated.  Barely documented Owes a lot of inspiration and snippets of code to the very-sophisticated Furigana Injector (http://code.google.com/p/furigana-injector/).

Commentary and steering and such all welcome.

The extension ships with a default list of kanji I was suppoed to know as of this last commit of background.js.  When you visit
some page that has Kanji in the textContent of most normal elements, that character will be highlit by the color given
in content.css.

If you visit one of the WaniKani Kanji pages (see http://www.wanikani.com/), the developer console may have a message about
Kanji on the page that are listed as you supposedly knowing them.  This string you could cut-n-paste into background.js.

It would be nice if:

* Visiting wanikani.com's Kanji pages would auto-populate the known-Kanji list
* * or if their new API helped out (2012-12-08), we'll see
* The highlight color/effects could be user selectable
* One had the option to add additional Kanji to the list by hand in a configuration dialog
* Words and vocabulary could be highlit as well as just straight-up Kanji
* There was a better reason to use this plugin than "inspiration"!

