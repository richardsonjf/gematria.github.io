// ================= Word Breakdown & Cipher Chart ==================

var breakCipher = "English Ordinal" // current cipher for breakdown
var bgCol = "var(--breakdown-bg-accent)" // breakdown table background color

function getSum(total, num) { // used to .reduce() array, adds all values
    return total + num;
}

function HeadLink(curCipher) { // change breakdown tables when mouse over/click
	var o = ""
	o += '<a class="cipherHoverLabel" onmouseover="javascript:updateWordBreakdown('
	o += "'" + curCipher.cipherName + "', false)"
	o += '" onmouseout="updateWordBreakdown()" href="javascript:updateWordBreakdown('
	o += "'" + curCipher.cipherName + "', true"
	o += ')">' + curCipher.cipherName + '</a>'
	return o
}

function updateWordBreakdown(impName = breakCipher, impBool = false, chartUpd = true) { // false - preview temporary (hover), true - lock breakdown to a specific cipher
	var x, curCipher, cSpot
	var o, oo, acw, acl

	updateEnabledCipherCount()
	$("#BreakTableContainer").removeClass("hideValue") // unhide breakdown
	$("#BreakdownDetails").attr("style", "") // reset padding (gematria card)

	if (impBool == true) breakCipher = impName // lock to a specific cipher
		
	if (!optShowCipherChart) $("#ChartSpot").attr("style", "border: none;"); // reset gradient for cipher chart
	if (enabledCiphCount == 0 || breakCipher == "" && impName == "") {
		document.getElementById("BreakdownSpot").innerHTML = ""
		document.getElementById("ChartSpot").innerHTML = ""
		$("#ChartSpot").attr("style", "border: none;"); // reset gradient for cipher chart
		return;
	}

	for (x = 0; x < cipherList.length; x++) {
		if (cipherList[x].cipherName == impName) {
			cSpot = x
			if (chartUpd) updateCipherChart(cipherList[x])
			break
		}
	}
	curCipher = cipherList[cSpot]
	curCipher.calcBreakdown(sVal())

	if (curCipher.sumArr.length > 0) {
		
		o = ""

		if (optLetterWordCount == true) {
			if (curCipher.LetterCount > 1) {acl = " letters, "} else {acl = " letter, "}
			if (curCipher.WordCount > 1) {acw = " words"} else {acw = " word"}
			o += '<div class="LetterCounts">' + curCipher.LetterCount + acl + curCipher.WordCount + acw + '</div>'
		}

		if (optSimpleResult == true) {
			var simplePhr = ""
			if (optAllowPhraseComments) {
				simplePhr = sValNoComments() // exclude text inside [...]
			} else {
				simplePhr = sVal() // display full phrase
			}
			o += '<div id="SimpleBreak">'
			o += '<div class="breakPhrase">' + simplePhr + ' = </div><div class="breakSum">' + curCipher.sumArr.reduce(getSum) + '</div>' // add all values in array
			o += '<div class="breakCipher"><font style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)"> (' + curCipher.cipherName + ')</font></div>'
		}

		if (optWordBreakdown == true && curCipher.cp.length <= 80 ) { // 80 character limit, calculated even if out of screen bounds
			var tdCount = 0; var wCount = 0;

			o += '</div><div id="BreakTableContainer"><table class="BreakTable">'
			// o += ' style="background: '+bgCol+' -webkit-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
			// o += 'background: '+bgCol+' -o-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
			// o += 'background: '+bgCol+' -moz-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
			// o += 'background: '+bgCol+' linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));">'
			o += '<tbody><tr>'
			for (x = 0; x < curCipher.cp.length; x++) {

				if (curCipher.cp[x] !== " ") {
					if (String(curCipher.cp[x]).substring(0, 3) == "num") {
						o += '<td class="BreakChar" style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + curCipher.cp[x].substring(3, curCipher.cp[x].length) + '</td>'
					} else {
						o += '<td class="BreakChar" style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + String.fromCharCode(curCipher.cp[x]) + '</td>'
					}
				} else {
					o += '<td class="BreakWordSum" rowspan="2">' + curCipher.sumArr[wCount] + '</td>'
					wCount++
				}
				tdCount++
			}
			o += '<td class="BreakPhraseSum" rowspan="2"><font style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + curCipher.sumArr.reduce(getSum) + '</font></td>'
			o += '</tr><tr>'
			tdCount++
			for (z = 0; z < x; z++) {
				if (curCipher.cv[z] !== " ") {
					o += '<td class="BreakVal">' + curCipher.cv[z] + '</td>'
				}
			}
			o += '</tr><tr><td colspan=' + tdCount + ' class="CipherEnd"><font style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + curCipher.cipherName + '</font></td></tr></table></div>'
		}
	} else {
		o = ""
	}

	document.getElementById("BreakdownSpot").innerHTML = o
	oo = 'background: '+bgCol+' -webkit-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	oo += 'background: '+bgCol+' -o-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	oo += 'background: '+bgCol+' -moz-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	oo += 'background: '+bgCol+' linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	$("#BreakTableContainer").attr("style", oo);

	if ( $(window).width() <= $("#BreakTableContainer").outerWidth() + 50 ) { // breakdown doesn't fit viewport
		$("#BreakTableContainer").addClass("hideValue") // hide element
	}
}

function updateCipherChart(curCipher) {

	if (optShowCipherChart == false) {
		document.getElementById("ChartSpot").innerHTML = ""
		return
	}

	var o = 'background: '+bgCol+' -webkit-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	o += 'background: '+bgCol+' -o-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	o += 'background: '+bgCol+' -moz-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	o += 'background: '+bgCol+' linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	o += 'min-height: 160px;' // avoid layout shift when Agrippa ciphers are active
	o += 'margin-top: 1em;'
	o += 'margin-bottom: 0.5em;'
	o += 'padding: 0.8em;'
	$("#ChartSpot").attr("style", o);

	o = '<table id="ChartTable" '
	
	// gradient table background based on cipher color
	// o += 'style="background: '+bgCol+' -webkit-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
	// o += 'background: '+bgCol+' -o-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
	// o += 'background: '+bgCol+' -moz-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
	// o += 'background: '+bgCol+' linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));">'
	o += '<tbody><tr>'

	o += '<td colspan="' + curCipher.cArr.length + '">'
	o += '<font style="font-size: 150%; font-weight: 500; color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + curCipher.cipherName + '</font>'
	o += '</td></tr><tr>'

	var halfL = curCipher.cArr.length / 2
	for (var x = 0; x < curCipher.cArr.length; x++) {
		if (x - halfL == 0 || x - halfL == 0.5) {
			o += '</tr><tr>'
			for (var y = 0; y < x; y++) { // 2nd row (values)
				o += '<td class="ChartVal">' + curCipher.vArr[y] + '</td>'
			}
			o += '</tr><tr>'
		}
		o += '<td class="ChartChar" font style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + String.fromCharCode(curCipher.cArr[x]) + '</td>'
	}
	if (curCipher.cArr.length % 2 == 1) { o += '<td class="ChartChar" font style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)"></td>' } // empty character cell to make even rows
	o += '</tr><tr>'
	for (y; y < x; y++) {
		o += '<td class="ChartVal">' + curCipher.vArr[y] + '</td>' // 4th row (values)
	}
	if (curCipher.cArr.length % 2 == 1) { o += '<td class="ChartVal"></td>' } // empty value cell to make even rows
	o += '</tr></tbody></table>'

	document.getElementById("ChartSpot").innerHTML = o
}

function updateCipherChartGemCard(impName = breakCipher) {

	if (optShowCipherChart == false) {
		document.getElementById("ChartSpot").innerHTML = ""
		return
	}

	var cSpot
	for (x = 0; x < cipherList.length; x++) {
		if (cipherList[x].cipherName == impName) { cSpot = x; break; }
	}
	curCipher = cipherList[cSpot]

	o = '<table id="ChartTable" '
	
	// gradient table background based on cipher color
	o += 'style="background: '+bgCol+' -webkit-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	o += 'background: '+bgCol+' -o-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	o += 'background: '+bgCol+' -moz-linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));'
	o += 'background: '+bgCol+' linear-gradient(0deg,hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 0.2), rgba(0,0,0,0.0));">'
	o += '<tbody><tr>'

	o += '<td colspan="' + curCipher.cArr.length + '">'
	o += '<font style="font-size: 150%; font-weight: 500; color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + curCipher.cipherName + '</font>'
	o += '</td></tr><tr>'

	var halfL = curCipher.cArr.length / 2
	for (var x = 0; x < curCipher.cArr.length; x++) {
		if (x - halfL == 0 || x - halfL == 0.5) {
			o += '</tr><tr>'
			for (var y = 0; y < x; y++) { // 2nd row (values)
				o += '<td class="ChartVal">' + curCipher.vArr[y] + '</td>'
			}
			o += '</tr><tr>'
		}
		o += '<td class="ChartChar" font style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)">' + String.fromCharCode(curCipher.cArr[x]) + '</td>'
	}
	if (curCipher.cArr.length % 2 == 1) { o += '<td class="ChartChar" font style="color: hsl('+curCipher.H+' '+curCipher.S+'% '+curCipher.L+'% / 1)"></td>' } // empty character cell to make even rows
	o += '</tr><tr>'
	for (y; y < x; y++) {
		o += '<td class="ChartVal">' + curCipher.vArr[y] + '</td>' // 4th row (values)
	}
	if (curCipher.cArr.length % 2 == 1) { o += '<td class="ChartVal"></td>' } // empty value cell to make even rows
	o += '</tr></tbody></table>'

	document.getElementById("ChartSpot").innerHTML = o
	$("#ChartTable").addClass("borderCipherTable") // cipher chart with borders

	o = 'border: none;' // clear div gradient background, remove border
	o += 'margin-top: 1em;'
	o += 'margin-bottom: 0.5em;'
	o += 'padding: 0.4em;'
	$("#ChartSpot").attr("style", o)
}