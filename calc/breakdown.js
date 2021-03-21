// ================= Word Breakdown & Cipher Chart ==================

var optLetterCount = true // 6 letters, 1 word
var optSimpleResult = true // Simple Result - phrase = 67 (English Ordinal)
var optBreakdownType = "Enabled" // "Enabled", "Disabled"
var optShowCipherChart = true // cipher breakdown chart
var breakCipher = "English Ordinal" // current cipher for breakdown

var bgCol = "rgb(26,30,40)" // breakdown table background color

function getSum(total, num) { // used to .reduce() array, adds all values
    return total + num;
}

function HeadLink(impCipher) { // change breakdown tables when mouse over/click
	var o = ""
	o += '<a class="cipherHoverLabel" onmouseover="javascript:updateWordBreakdown('
	o += "'" + impCipher.cipherName + "', false)"
	o += '" onmouseout="updateWordBreakdown()" href="javascript:updateWordBreakdown('
	o += "'" + impCipher.cipherName + "', true"
	o += ')">' + impCipher.cipherName + '</a>'
	return o
}

function updateWordBreakdown(impName = breakCipher, impBool = false, chartUpd = true) { // false - preview temporary (hover), true - lock breakdown to a specific cipher
	var x, aCipher, cSpot
	var o, acw, acl

	updateEnabledCipherCount()

	if (impBool == true) breakCipher = impName // lock to a specific cipher
	if (enabledCiphCount == 0 || breakCipher == "" && impName == "") {
		document.getElementById("BreakdownSpot").innerHTML = ""
		document.getElementById("ChartSpot").innerHTML = ""
		return;
	}

	for (x = 0; x < cipherList.length; x++) {
		if (cipherList[x].cipherName == impName) {
			cSpot = x
			if (chartUpd) updateCipherChart(cipherList[x])
			break
		}
	}
	aCipher = cipherList[cSpot]
	aCipher.calcBreakdown(sVal())

	if (aCipher.sumArr.length > 0) {
		
		o = ""

		if (optLetterCount == true) {
			if (aCipher.LetterCount > 1) {acl = " letters, "} else {acl = " letter, "}
			if (aCipher.WordCount > 1) {acw = " words"} else {acw = " word"}
			o = '<div class="LetterCounts">' + aCipher.LetterCount + acl + aCipher.WordCount + acw + '</div>'
		}

		if (optSimpleResult == true) {
			o += '<div id="SimpleBreak">'
			o += '<div class="breakPhrase">' + sVal() + ' = </div><div class="breakSum">' + aCipher.sumArr.reduce(getSum) + '</div>' // add all values in array
			o += '<div class="breakCipher"><font style="color: hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 1)"> (' + aCipher.cipherName + ')</font></div>'
		}

		if (optBreakdownType == "Enabled" && aCipher.cp.length <= 60) {
			var tdCount = 0; var wCount = 0;

			o += '</div><div id="BreakTableContainer"><table class="BreakTable"'
			o += ' style="background: '+bgCol+' -webkit-linear-gradient(0deg,hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
			o += 'background: '+bgCol+' -o-linear-gradient(0deg,hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
			o += 'background: '+bgCol+' -moz-linear-gradient(0deg,hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
			o += 'background: '+bgCol+' linear-gradient(0deg,hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 0.2), rgba(0,0,0,0.0));">'
			o += '<tbody><tr>'
			for (x = 0; x < aCipher.cp.length; x++) {

				if (aCipher.cp[x] !== " ") {
					if (String(aCipher.cp[x]).substring(0, 3) == "num") {
						o += '<td class="BreakChar" style="color: hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 1)">' + aCipher.cp[x].substring(3, aCipher.cp[x].length) + '</td>'
					} else {
						o += '<td class="BreakChar" style="color: hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 1)">' + String.fromCharCode(aCipher.cp[x]) + '</td>'
					}
				} else {
					o += '<td class="BreakWordSum" rowspan="2">' + aCipher.sumArr[wCount] + '</td>'
					wCount++
				}
				tdCount++
			}
			o += '<td class="BreakPhraseSum" rowspan="2"><font style="color: hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 1)">' + aCipher.sumArr.reduce(getSum) + '</font></td>'
			o += '</tr><tr>'
			tdCount++
			for (z = 0; z < x; z++) {
				if (aCipher.cv[z] !== " ") {
					o += '<td class="BreakVal">' + aCipher.cv[z] + '</td>'
				}
			}
			o += '</tr><tr><td colspan=' + tdCount + ' class="CipherEnd"><font style="color: hsl('+aCipher.H+' '+aCipher.S+'% '+aCipher.L+'% / 1)">' + aCipher.cipherName + '</font></td></tr></table></div>'
		}
	} else {
		o = ""
	}

	document.getElementById("BreakdownSpot").innerHTML = o
}

function updateCipherChart(impCipher) {

	if (optShowCipherChart == false) {
		document.getElementById("ChartSpot").innerHTML = ""
		return
	}

	var o = '<table id="ChartTable" '
	
	// gradient table background based on cipher color
	o += 'style="background: '+bgCol+' -webkit-linear-gradient(0deg,hsl('+impCipher.H+' '+impCipher.S+'% '+impCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
	o += 'background: '+bgCol+' -o-linear-gradient(0deg,hsl('+impCipher.H+' '+impCipher.S+'% '+impCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
	o += 'background: '+bgCol+' -moz-linear-gradient(0deg,hsl('+impCipher.H+' '+impCipher.S+'% '+impCipher.L+'% / 0.2), rgba(0,0,0,0.0)); '
	o += 'background: '+bgCol+' linear-gradient(0deg,hsl('+impCipher.H+' '+impCipher.S+'% '+impCipher.L+'% / 0.2), rgba(0,0,0,0.0));">'
	o += '<tbody><tr>'

	o += '<td colspan="' + impCipher.cArr.length + '">'
	o += '<font style="font-size: 150%; font-weight: 500; color: hsl('+impCipher.H+' '+impCipher.S+'% '+impCipher.L+'% / 1)">' + impCipher.cipherName + '</font>'
	o += '</td></tr><tr>'

	var halfL = impCipher.cArr.length / 2
	for (var x = 0; x < impCipher.cArr.length; x++) {
		if (x - halfL == 0 || x - halfL == 0.5) {
			o += '</tr><tr>'
			for (var y = 0; y < x; y++) { // 2nd row (values)
				o += '<td class="ChartVal">' + impCipher.vArr[y] + '</td>'
			}
			o += '</tr><tr>'
		}
		o += '<td class="ChartChar" font style="color: hsl('+impCipher.H+' '+impCipher.S+'% '+impCipher.L+'% / 1)">' + String.fromCharCode(impCipher.cArr[x]) + '</td>'
	}
	if (impCipher.cArr.length % 2 == 1) { o += '<td class="ChartChar" font style="color: hsl('+impCipher.H+' '+impCipher.S+'% '+impCipher.L+'% / 1)"></td>' } // empty character cell to make even rows
	o += '</tr><tr>'
	for (y; y < x; y++) {
		o += '<td class="ChartVal">' + impCipher.vArr[y] + '</td>' // 4th row (values)
	}
	if (impCipher.cArr.length % 2 == 1) { o += '<td class="ChartVal"></td>' } // empty value cell to make even rows
	o += '</tr></tbody></table>'

	document.getElementById("ChartSpot").innerHTML = o
}