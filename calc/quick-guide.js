// ======================== Quickstart Guide ========================

function closeQuickstartGuide() {
	$('#quickGuideOverlay').remove();
	$('.quickGuide').remove();
	$('body').removeClass('noScroll') // restore scrolling
}

function displayQuickstartGuide() {
	$('<div id="quickGuideOverlay" onclick="closeQuickstartGuide()"></div>').appendTo('body'); // overlay

	var o = '<div class="quickGuide">'
	o += '<p><span class="qgBold2">Quickstart Guide</p>'

	o += '<hr class="numPropSeparator">'

	o += '<p class="qgMedium">Phrase Box - enter any word, phrase or number</p>\n<ul><li><span class="qgBold">"Enter"</span> - add phrase to history table</li><li><span class="qgBold">"Up"</span> and <span class="qgBold">"Down"</span> arrow keys - select phrase from history table<br>Press <span class="qgBold">"Down"</span> to select previously entered phrase</li><li><span class="qgBold">"Delete"</span> - delete current phrase from history table</li><li>Additional Shortcuts:<br><span class="qgBold">"Home"</span> - clear history table<br><span class="qgBold">"End"</span> - shortcut for <span class="qgBold">"Enter As Words"</span> function</li></ul>'

	o += '<p class="qgMedium">Highlight Box - enter space delimited numbers</p>\n<ul><li><span class="qgBold">"Enter"</span> - activate filter (remove nonmatching phrases and ciphers)</li><li><span class="qgBold">"Delete"</span> - clear box contents (does not reset filter)<br><span class="qgNote">Note: Reset filter with an "X" button near the box</span></li><li>Additional Shortcuts:<br><span class="qgBold">"Insert"</span> - find all available matches<br><span class="qgBold">"Ctrl + Delete"</span> - reset filter and revert to initial history state<br><span class="qgNote">Note: History table is recalculated on each keystroke</span></li></ul>'

	o += '<p class="qgMedium">Enabled Ciphers Table</p>\n<ul><li><span class="qgBold">"Left Click"</span> on cipher name - choose cipher, display detailed word breakdown</li><li><span class="qgBold">"Right Click"</span> on cipher name - disable cipher</li><li><span class="qgBold">"Left Click"</span> on number - show number properties</li><li><span class="qgBold">"Right Click"</span> on number - show additional number properties</li></ul>'

	o += '<p class="qgMedium">Number Properties</p>\n<ul><li><span class="qgBold">"Ctrl"</span> key pressed, mouse over number - show number properties</li><li><span class="qgBold">"Shift"</span> key pressed, mouse over number - show additional number properties</li><li>All properties are supported only for values up to 10 million</li><li>Drag cursor across the tooltip to close it<br>Mobile devices - click on the tooltip first, then click outside to close<br><span class="qgNote">Note: Number Properties are available inside Enabled Ciphers Table and History Table</span></li></ul>'

	o += '<p class="qgMedium">Cipher Chart</p>\n<ul><li><span class="qgBold">"Left Click"</span> on letters/values to highlight cells</li></ul>'

	o += '<p class="qgMedium">History Table</p><ul><li><span class="qgBold">"Left Click"</span> on value - toggle blinking effect (temporary)</li><li><span class="qgBold">"Right Click"</span> on value - toggle cell visibility (temporary)</li><li><span class="qgBold">"Shift + Left Click"</span> on cipher name - disable cipher</li><li><span class="qgBold">"Shift + Left Click"</span> on phrase - delete phrase from history</li><li><span class="qgBold">"Ctrl + Left Click"</span> on phrase - load phrase into <span class="qgBold">Phrase Box</span></li><li><span class="qgBold">"Ctrl + Left Click"</span> on value (cell) - toggle highlighting for number<br>Highlighter always recalculates table, temporary effects are removed<br><span class="qgNote">Note: Click on cell, not on the number itself, otherwise you will open number properties</span></li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Options</p>'

	o += '<ul><li><span class="qgBold">"Number Calculation"</span><ul><li>Full (123 = 123) - <span class="qgBold">default</span></li><li>Reduced (123 = 1+2+3 = 6)</li><li>Off</li></ul></li>'

	o += '<li><span class="qgBold">"Enter As Words (Limit)"</span> - maximum phrase length for <span class="qgBold">"Enter As Words"</span> function</li>'

	o += '<li><span class="qgBold">Highlighter</span> has two different modes:<ul><li><span class="qgBold">"Cross Cipher Match"</span></li><li><span class="qgBold">"Same Cipher Match"</span><br><span class="qgNote">Note: If there is just one value, only "Cross Cipher Match" will pick that</span></li></ul></li>'

	o += '<li><span class="qgBold">"Show Only Matching"</span> - when highlighter is active, sets opacity of nonmatching values to zero</li>'

	o += '<li><span class="qgBold">"Letter/Word Count"</span> - show number of recognized (by current cipher) letters and words</li>'
	o += '<li><span class="qgBold">"Simple Result"</span> - display gematria of current phrase in text format</li>'
	o += '<li><span class="qgBold">"Word Breakdown"</span> - show detailed breakdown for current phrase</li>'
	o += '<li><span class="qgBold">"Cipher Chart"</span> - show a table of correspondences between letters and values for current cipher</li>'

	o += '<li><span class="qgBold">"Compact History"</span> - use vertical cipher names inside history table</li>'

	o += '<li><span class="qgBold">"Tiny History"</span> - no cipher names, seamless history table</li>'

	o += '<li><span class="qgBold">"Switch Ciphers (CSV)"</span> - enable previously selected ciphers on history file import</li>'

	o += '<li><span class="qgBold">"Matrix Code Rain"</span> - use dynamic background</li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Features</p>'

	o += '<p class="qgMedium">Color Controls</p>\n<ul><li>Change cipher colors (<span class="qgBold">HSL</span> - Hue, Saturation, Lightness)</li><li>Make sure to <span class="qgBold">"Export Ciphers"</span> before you make any modifications inside <span class="qgBold">"Edit Ciphers"</span> menu</li></ul>'

	o += '<p class="qgMedium">Edit Ciphers</p>\n<ul><li><span class="qgBold">"Left Click"</span> on cipher name in Enabled Ciphers Table to edit existing cipher</li><li>Cipher names are unique; if name matches, it means an existing cipher is modified</li><li>Existing cipher can be moved to a different category (it will be added as last item in that category)</li><li>Any cipher category can be created</li><li>Cells with individual letters or values can be modified</li><li><span class="qgBold">Unicode</span> characters are supported</li><li>Color controls are reset on any change in <span class="qgBold">"Edit Ciphers"</span> menu</li></ul>'

	o += '<p><span class="qgBold">"Find Matches"</span> - populate <span class="qgBold">Highlight Box</span> with numbers that match at least twice</p>'
	o += '<p><span class="qgBold">"Enter As Words"</span> - read text from <span class="qgBold">Phrase Box</span> one word at a time until a certain phrase length is reached, then move on to the next starting word, process is repeated until all words are entered into history table</p>'
	o += '<p><span class="qgBold">"Clear History"</span> - remove all entries from history table</p>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Export</p>'

	o += '<ul><li><span class="qgBold">"Print Cipher Chart", etc</span> - render correspondent element as an image (PNG), image preview is opened in a separate tab, make sure your browser allows this behavior</li>'

	o += '<li><span class="qgBold">"Import File"</span> - import a text file (one phrase per line), previously exported history or ciphers<br><span class="qgNote">Note: You can also drag and drop file into Phrase Box</span></li>'

	o += '<li><span class="qgBold">"Export History (CSV)"</span> - export phrases from current history table as a CSV file, semicolon is used as separator, first row contains cipher names</li>'

	o += '<li><span class="qgBold">"Export Ciphers"</span> - ciphers active at the time of export will become the new default ones on next import, file can have any name or extension<br><span class="qgNote">Note: You can edit file manually with a text editor, make sure to keep formatting<br>If you want to permanently change ciphers, you can download an offline version of calculator from GitHub repository and replace "ciphers.js" file inside "calc" directory<br>Online and offline versions are identical</span></li></ul>'

	o += '</div>'

	$(o).appendTo('body'); // guide
	$('body').addClass('noScroll') // prevent scrolling
}