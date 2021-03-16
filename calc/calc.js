// ============================== Init ==============================

// Layout
var cipherMenuColumns = 4 // number of columns for all available ciphers table
var enabledCiphColumns = 4 // number of columns for enabled ciphers table (for phrase)
var cipherMenuOpened = false // is cipher menu open

var enabledCiphCount = 0 // number of enabled ciphers
var cCat = []; // list of all available cipher categories

// Cipher colors
var origColors = [] // preserve original cipher colors
var chkboxColors = [] // individual cipher color modifiers
var globColors = [] // global color modifiers

var sHistory = [] // user search history (history table)
var optPhraseLimit = 5 // word limit to enter input as separate phrases, "End" key

var optTinyHistoryTable = false // tiny mode - hide cipher names, no break each 25 phrases
var optCompactHistoryTable = false // compact mode - vertical cipher names
var optLoadUserHistCiphers = true // load ciphers when CSV file is imported

var optNumCalcMethod = "Reduced" // "Reduced", "Full", "Off" or anything - default option to calculate 19 as 1+9
var optLetterWordCount = true // show word/letter count

// only one active, replace with a dropdown "Off", "Cross cipher match", "Same cipher match"
var optWeightedAutoHlt = false // color grade matches found with auto highlighter (most frequest is the brightest)
var optFiltSameCipherMatch = false; // filter shows only phrases that match in the same cipher
var optFiltCrossCipherMatch = true; // filter shows only ciphers that have matching values

// ========================= Options Menu ===========================

function createCalcOptionsMenu() {

	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">' // Options drop down hover menu
	o += '<button class="dropbtn">Options</button>'
	o += '<div class="dropdown-content-opt" style="width: 287px;">'

	o += create_NumCalc() // Number Calculation
	o += create_PL() // Phrase Limit (End)
	o += create_WB() // Word Breakdown

	// get checkbox states
	var WAHstate, SCMstate, CCMstate, THTstate, CHTstate, LUHCstate, SRstate, SCCstate, LWCstate, MCRstate = ""

	if (optWeightedAutoHlt) WAHstate = "checked" // Weighted Auto Highlighter
	if (optFiltSameCipherMatch) SCMstate = "checked" // Same Cipher Match
	if (optFiltCrossCipherMatch) CCMstate = "checked" // Cross Cipher Match
	if (optTinyHistoryTable) THTstate = "checked" // Tiny History
	if (optCompactHistoryTable) CHTstate = "checked" // Compact History
	if (optLoadUserHistCiphers) LUHCstate = "checked" // Load User Ciphers (CSV)

	if (optSimpleResult) SRstate = "checked" // Simple Result
	if (optShowCipherChart) SCCstate = "checked" // Cipher Chart
	if (optLetterWordCount) LWCstate = "checked" // Letter/Word Count
	if (!optMatrixCodeRain) MCRstate = "checked" // Matrix Code Rain

	o += '<div class="optionElement"><input type="checkbox" class="calcOptCheckbox" id="chkbox_WAH" name="Weighted Auto Highlighter" value="" onclick="conf_WAH()" '+WAHstate+'><span class="optionElementLabel">Weighted Auto Highlighter</span></div>'
	o += '<div class="optionElement"><input type="checkbox" class="calcOptCheckbox" id="chkbox_SCM" name="Same Cipher Match" value="" onclick="conf_SCM()" '+SCMstate+'><span class="optionElementLabel">Same Cipher Match</span></div>'
	o += '<div class="optionElement"><input type="checkbox" class="calcOptCheckbox" id="chkbox_CCM" name="Cross Cipher Match" value="" onclick="conf_CCM()" '+CCMstate+'><span class="optionElementLabel">Cross Cipher Match</span></div>'
	o += '<div class="optionElement"><input type="checkbox" class="calcOptCheckbox" id="chkbox_TH" name="Tiny History" value="" onclick="conf_TH()" '+THTstate+'><span class="optionElementLabel">Tiny History</span></div>'
	o += '<div class="optionElement"><input type="checkbox" class="calcOptCheckbox" id="chkbox_CH" name="Compact History" value="" onclick="conf_CH()" '+CHTstate+'><span class="optionElementLabel">Compact History</span></div>'
	o += '<div class="optionElement"><input type="checkbox" class="calcOptCheckbox" id="chkbox_LUC" name="Load User Ciphers (CSV)" value="" onclick="conf_LUC()" '+LUHCstate+'><span class="optionElementLabel">Load User Ciphers (CSV)</span></div>'

	o += '<div class="optionElement"><input type="checkbox" id="chkbox_SR" value="" onclick="conf_SR()" '+SRstate+'><span class="optionElementLabel">Simple Result</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_CC" value="" onclick="conf_CC()" '+SCCstate+'><span class="optionElementLabel">Cipher Chart</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_LWC" value="" onclick="conf_LWC()" '+LWCstate+'><span class="optionElementLabel">Letter/Word Count</span></div>'
	o += '<div class="optionElement"><input type="checkbox" id="chkbox_MCR" value="" onclick="conf_MCR()" '+MCRstate+'><span class="optionElementLabel">Matrix Code Rain</span></div>'

	o += '</div></div>'

	document.getElementById("calcOptionsPanel").innerHTML = o

	// set checkbox states
	if (optWeightedAutoHlt) document.getElementById("chkbox_WAH").checked = true // Weighted Auto Highlighter
	if (optFiltSameCipherMatch) document.getElementById("chkbox_SCM").checked = true // Same Cipher Match
	if (optFiltCrossCipherMatch) document.getElementById("chkbox_CCM").checked = true // Cross Cipher Match
	if (optTinyHistoryTable) document.getElementById("chkbox_TH").checked = true // Tiny History
	if (optCompactHistoryTable) document.getElementById("chkbox_CH").checked = true // Compact History
	if (optLoadUserHistCiphers) document.getElementById("chkbox_LUC").checked = true // Load User Ciphers (CSV)

	if (optSimpleResult) document.getElementById("chkbox_SR").checked = true // Simple Result
	if (optShowCipherChart) document.getElementById("chkbox_CC").checked = true // Cipher Chart
	if (optLetterWordCount) document.getElementById("chkbox_LWC").checked = true // Letter/Word Count
	if (!optMatrixCodeRain) document.getElementById("chkbox_MCR").checked = true // Matrix Code Rain
}

function conf_WAH() { // Weighted Auto Highlighter
	optWeightedAutoHlt = !optWeightedAutoHlt
	// only one option can be active
	if (optWeightedAutoHlt) {
		optFiltSameCipherMatch = false
		chkSCM = document.getElementById("chkbox_SCM")
		if (chkSCM != null) chkSCM.checked = false
		optFiltCrossCipherMatch = false
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM != null) chkCCM.checked = false
	}
	console.log(optWeightedAutoHlt)
}

function conf_SCM() { // Same Cipher Match
	optFiltSameCipherMatch = !optFiltSameCipherMatch
	if (optFiltSameCipherMatch) {
		optFiltCrossCipherMatch = false
		chkCCM = document.getElementById("chkbox_CCM")
		if (chkCCM != null) chkCCM.checked = false
		optWeightedAutoHlt = false
		chkWAH = document.getElementById("chkbox_WAH")
		if (chkWAH != null) chkWAH.checked = false
	}
	console.log(optFiltSameCipherMatch)
}

function conf_CCM() { // Cross Cipher Match
	optFiltCrossCipherMatch = !optFiltCrossCipherMatch
	if (optFiltCrossCipherMatch) {
		optFiltSameCipherMatch = false
		chkSCM = document.getElementById("chkbox_SCM")
		if (chkSCM != null) chkSCM.checked = false
		optWeightedAutoHlt = false
		chkWAH = document.getElementById("chkbox_WAH")
		if (chkWAH != null) chkWAH.checked = false
	}
	console.log(optFiltCrossCipherMatch)
}

function conf_TH() { // Tiny History
	optTinyHistoryTable = !optTinyHistoryTable
	if (optCompactHistoryTable) { // only one option is allowed
		optCompactHistoryTable = false
		if (chkbox_CH != null) chkbox_CH.checked = false
	}
	updateTables()
	console.log(optTinyHistoryTable)
}

function conf_CH() { // Compact History
	optCompactHistoryTable = !optCompactHistoryTable
	if (optTinyHistoryTable) { // only one option is allowed
		optTinyHistoryTable = false
		if (chkbox_TH != null) chkbox_TH.checked = false
	}
	updateTables()
	console.log(optCompactHistoryTable)
}

function conf_LUC() { // Load User Ciphers (CSV)
	optLoadUserHistCiphers = !optLoadUserHistCiphers
	console.log(optLoadUserHistCiphers)
}

function create_NumCalc() { // Number Calculation
	var ns = ""
	var nArr = ["Off", "Full", "Reduced"]
	var nArr2 = [" ", " (123 = 123)", " (123 = 1+2+3 = 6)"]
	ns += '<div class="optionElementDropdown"><span style="size: 80%">Number Calculation: </span>'
	ns += '<select id="numCalcBox" onchange="conf_NumCalc()">'
	for (x = 0; x < nArr.length; x++) {
		if (nArr[x] == optNumCalcMethod) {
			ns += '<option value="' + nArr[x] + '" selected="selected">' +  nArr[x] + nArr2[x] + '</option>'
		} else {
			ns += '<option value="' + nArr[x] + '">' +  nArr[x] + nArr2[x] + '</option>'
		}
	}
	ns += '</select></div>'
	return ns
}
function conf_NumCalc() { // Number Calculation
	var nCalc = document.getElementById("numCalcBox")
	optNumCalcMethod = nCalc.value
	updateWordBreakdown()
	updateTables()
}

function conf_SR() { // Simple Result
	optSimpleResult = !optSimpleResult
	updateWordBreakdown()
	element = document.getElementById("SimpleBreak")
	if (element !== null && optSimpleResult) element.classList.remove("hideValue")
	if (element !== null && !optSimpleResult) element.classList.add("hideValue")
}
function conf_CC() { // Cipher Chart
	optShowCipherChart = !optShowCipherChart
	updateWordBreakdown()
	element = document.getElementById("ChartSpot")
	element.classList.toggle("hideValue")
}
function conf_LWC() { // Letter/Word Count
	optLetterWordCount = !optLetterWordCount
	updateWordBreakdown()
	element = document.querySelector(".LetterCounts")
	if (element !== null && optLetterWordCount) element.classList.remove("hideValue")
	if (element !== null && !optLetterWordCount) element.classList.add("hideValue")
}
function conf_MCR() { // Matrix Code Rain
	toggleCodeRain()
}

function create_PL() { // Phrase Limit (End)
	var ns = ""
	var nArr = [1,2,3,4,5,6,7,8,9,10]
	ns += '<div class="optionElementDropdown"><span style="size: 80%">Phrase Limit (End): </span>'
	ns += '<select id="PhrLimitBox" onchange="conf_PL()">'
	for (x = 0; x < nArr.length; x++) {
		ns += '<option value="' + nArr[x] + '"'
		if (nArr[x] == optPhraseLimit) {ns += ' selected="selected"'}
		if (nArr[x] == 1) {ns += '>'+nArr[x]+' word</option>'}
		else {ns += '>'+nArr[x]+' words</option>'}
	}
	ns += '</select></div>'
	return ns
}
function conf_PL() {
	var pLimit = document.getElementById("PhrLimitBox")
	optPhraseLimit = pLimit.value
}

function create_WB() { // Word Breakdown
	var ns = ""
	// var nArr = ["Chart", "Classic", "Compact", "Off"]
	var nArr = ["Compact", "Off"]
	ns += '<div class="optionElementDropdown"><span>Word Breakdown: </span><select id="WBBox" onchange="conf_WB()">'
	for (x = 0; x < nArr.length; x++) {
		if (nArr[x] == optBreakdownType) {
			ns += '<option value="' + nArr[x] + '" selected="selected">' +  nArr[x] + '</option>'
		} else {
			ns += '<option value="' + nArr[x] + '">' +  nArr[x] + '</option>'
		}
	}
	ns += '</select></div>'
	return ns
}
function conf_WB() {
	var bdType = document.getElementById("WBBox")
	optBreakdownType = bdType.value
	updateWordBreakdown()
	element = document.getElementById("BreakTableContainer")
	if (element !== null) { 
		if (optBreakdownType == "Off") {
			element.classList.add("hideValue")
		} else {
			element.classList.remove("hideValue")

		}
	}
}

// ========================== Cipher Menu ===========================

function createColumnControls() { // add elements to adjust layout
	// var o = document.getElementById("colorCtrlPanel").innerHTML
	// document.getElementById("colorCtrlPanel").innerHTML = o
}

function updateCipherMenuLayout() {
	if (cipherMenuOpened) {
		createAvailCipherMenu()
		populateColorValues()
	}
}

function updateTables() {
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherName == breakCipher && !cipherList[i].enabled) { // if previous breakdown cipher is not enabled
			for (n = 0; n < cipherList.length; n++) {
				if (cipherList[n].enabled) {
					breakCipher = cipherList[n].cipherName // load first enabled cipher instead
					break
				}
			}
		}
	}
	//console.log(breakCipher)
	updateEnabledCiphTable() // update enabled cipher table
	updateHistoryTable() // update history table
	updateWordBreakdown(breakCipher, true) // update word breakdown and choose first enabled cipher
}

function createCiphCategories() { // create buttons for each cipher catergory
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">' // Options drop down hover menu
	o += '<button class="dropbtn">Ciphers</button>'
	o += '<div class="dropdown-content">'

	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Empty" onclick="disableAllCiphers()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Base" onclick="enableBaseCiphers()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="All (English)" onclick="enableAllCiphersEnglish()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="All" onclick="enableAllCiphers()">'

	// o += '<div style="margin: 0.6em;"></div>'
	o += '<hr style="background-color: rgb(77,77,77); height: 1px; border: none; margin: 0.75em;">'
	// o += '<center><span style="font-size: 80%; color: rgb(222,222,222); "> Categories: </span></center>'
	// o += '<div style="margin: 0.2em;"></div>'
	for (i = 0; i < cCat.length; i++) {
		o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="'+cCat[i]+'" onclick="toggleCipherCategory(&quot;'+cCat[i]+'&quot;)">'
	}
	o += '</div></div>'

/*	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Show/Hide" onclick="toggleCipherMenu()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Empty" onclick="disableAllCiphers()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Base" onclick="enableBaseCiphers()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Base+" onclick="enableBasePlusCiphers()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="All" onclick="enableAllCiphers()">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="All (English)" onclick="enableAllCiphersEnglish()">'
	o += '<span style="font-size: 80%; color: rgb(222,222,222);"> Categories: </span>'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="English (Special)" onclick="toggleCipherCategory(&quot;English (Special)&quot;)">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Sumerian" onclick="toggleCipherCategory(&quot;Sumerian&quot;)">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Agrippa" onclick="toggleCipherCategory(&quot;Agrippa&quot;)">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Kabbalah" onclick="toggleCipherCategory(&quot;Kabbalah&quot;)">'
	o += '<span style="font-size: 80%; color: rgb(222,222,222);"> Foreign: </span>'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Greek" onclick="toggleCipherCategory(&quot;Greek&quot;)">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Hebrew" onclick="toggleCipherCategory(&quot;Hebrew&quot;)">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Russian" onclick="toggleCipherCategory(&quot;Russian&quot;)">'
	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Custom" onclick="toggleCipherCategory(&quot;Custom&quot;)">'

	o += '</div></div>'*/
	document.getElementById("calcOptionsPanel").innerHTML = o
}

function toggleCipherMenu() { // show/hide all available ciphers menu
	if (!cipherMenuOpened) {
		createAvailCipherMenu()
		populateColorValues()
		cipherMenuOpened = true
	} else {
		document.getElementById("ciphMenu").innerHTML = "" // clear
		cipherMenuOpened = false
	}
}

function createAvailCipherMenu() { // create checkboxes to toggle each available cipher
	var cipher_columns = cipherMenuColumns
	if (document.getElementById("enabled_ciphers_columns") != null ) cipher_columns = document.getElementById("avail_ciphers_columns").value // update value
	
	document.getElementById("ciphMenu").innerHTML = "" // clear previous table
	
	var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
	var new_row_opened = false // condition to open new row inside table
	var ciph_in_row = 0 // count ciphers in current row

	var o = '<table class="ciphToggleContainer"><tbody>'
	
	for (i = 0; i < cipherList.length; i++) {
		cur_ciph_index++
		if (!new_row_opened) { // check if new row has to be opened
			o += '<tr>'
			new_row_opened = true
		}
		if (ciph_in_row < cipher_columns) { // until number of ciphers in row equals number of colums
			if (!cipherList[i].enabled) o += '<td><input type="checkbox" class="ciphCheckbox" id="cipher_chkbox'+i+'" name="cipher_chkbox_name'+i+'" value="" onclick="toggleCipher('+i+')"></td>'
			if (cipherList[i].enabled) o += '<td><input type="checkbox" class="ciphCheckbox" id="cipher_chkbox'+i+'" name="cipher_chkbox_name'+i+'" value="" onclick="toggleCipher('+i+')" checked></td>'
			o += '<td><label class="ciphCheckboxLabel" for="cipher_chkbox_name'+i+'">'+cipherList[i].cipherName+'</label></td>'
			o += '<td><input type="number" step="5" min="-360" max="360" value="0" class="col_slider" id="sliderHue'+i+'" oninput="changeCipherColors(&quot;sliderHue'+i+'&quot;, &quot;Hue&quot;, '+i+')"></td>'
			o += '<td><input type="number" step="2" min="-100" max="100" value="0" class="col_slider" id="sliderSaturation'+i+'" oninput="changeCipherColors(&quot;sliderSaturation'+i+'&quot;, &quot;Saturation&quot;, '+i+')"></td>'
			o += '<td><input type="number" step="2" min="-100" max="100" value="0" class="col_slider" id="sliderLightness'+i+'" oninput="changeCipherColors(&quot;sliderLightness'+i+'&quot;, &quot;Lightness&quot;, '+i+')"></td>'
			o += '<td><input type="number" step="0.02" min="-1.0" max="1.0" value="0" class="col_slider" id="sliderAlpha'+i+'" oninput="changeCipherColors(&quot;sliderAlpha'+i+'&quot;, &quot;Alpha&quot;, '+i+')"></td>'
			o += '<td><input type="text" value="" class="cipher_col_value" id="cipherHSLA'+i+'"></td>'
			ciph_in_row++
		}
		if (ciph_in_row == cipher_columns) { // check if row needs to be closed
			o += '</tr>'
			ciph_in_row = 0 // reset cipher count
			new_row_opened = false
		}
	}
	o += '</tbody></table>'
	
	document.getElementById("ciphMenu").innerHTML += o
}

// ========================= Color Functions ========================

function copyToClipboard(txt) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = txt;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function loadCustomCipherColors() { // load colors defined in custom-colors.js
	if (typeof ciphColors !== 'undefined') { // check if variable is declared
		if (ciphColors.length == cipherList.length) { // check correct length
			for (i = 0; i < cipherList.length; i++) {
				cipherList[i].H = ciphColors[i].H
				cipherList[i].S = ciphColors[i].S
				cipherList[i].L = ciphColors[i].L
				cipherList[i].A = ciphColors[i].A
			}
		} else {
			console.log("Incorrect number of ciphers is defined inside 'custom-colors.js' ...\nDefault colors are loaded.")
		}
	}
}

function initColorArrays() { // store original cipher colors and current modifier values
	var tmp = {}
	for (i = 0; i < cipherList.length; i++) {
		tmp = {H:cipherList[i].H, S:cipherList[i].S, L:cipherList[i].L, A:cipherList[i].A}
		origColors.push(tmp)
		tmp = {H:0, S:0, L:0, A:0}
		chkboxColors.push(tmp) // individual controls
	}
	globColors = {H:0, S:0, L:0, A:0}
}

function createColorControls() { // add global cipher color controls
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">' // Options drop down hover menu
	o += '<button class="dropbtn">Color</button>'
	o += '<div class="dropdown-content" style="width: 157px">'

	o += '<input id="toggleCatBtn" class="intBtn2" type="button" value="Color Controls" onclick="toggleCipherMenu()">'
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="copyColorsButton" class="intBtn2" type="button" value="Copy Colors" onclick="copyAllCipherColors()">'
	o += '<input id="copyColorsButton" class="intBtn2" type="button" value="Reset Colors" onclick="resetColorControls()">'
	o += '<div style="margin: 0.5em;"></div>'

	o += '<center>'
	o += '<span style="font-size: 90%; color: rgb(222,222,222);">Global HSLA: </span>'
	o += '<div style="margin: 0.1em;"></div>'
	o += '<table>'
	o += '<tr><td style="font-size: 80%;">Hue</td>'
	o += '<td><input type="number" step="5" min="-360" max="360" value="0" class="col_slider" id="globalSliderHue" oninput="changeCipherColors(&quot;globalSliderHue&quot;, &quot;Hue&quot;)"></td>'
	o += '</tr><tr><td style="font-size: 80%;">Saturation</td>'
	o += '<td><input type="number" step="2" min="-100" max="100" value="0" class="col_slider" id="globalSliderSaturation" oninput="changeCipherColors(&quot;globalSliderSaturation&quot;, &quot;Saturation&quot;)"></td>'
	o += '</tr><tr><td style="font-size: 80%;">Lightness</td>'
	o += '<td><input type="number" step="2" min="-100" max="100" value="0" class="col_slider" id="globalSliderLightness" oninput="changeCipherColors(&quot;globalSliderLightness&quot;, &quot;Lightness&quot;)"></td>'
	o += '</tr><tr><td style="font-size: 80%;">Alpha</td>'
	o += '<td><input type="number" step="0.02" min="-1.0" max="1.0" value="0" class="col_slider" id="globalSliderAlpha" oninput="changeCipherColors(&quot;globalSliderAlpha&quot;, &quot;Alpha&quot;)"></td>'
	
	// column controls
	o += '</tr><tr><td colspan=2><div style="margin: 0.4em;"></div></td>'
	o += '</tr><tr><td colspan=2 style="font-size: 90%; color: rgb(222,222,222); text-align: center;">Cipher Columns:<td>'

	o += '</tr><tr><td style="font-size: 80%;">Color Menu</td>'
	o += '<td><input type="number" step="1" min="1" max="10" value="'+cipherMenuColumns+'" class="col_slider" id="avail_ciphers_columns" oninput="updateCipherMenuLayout()"></td>'
	o += '</tr><tr><td style="font-size: 80%;">Active</td>'
	o += '<td><input type="number" step="1" min="1" max="10" value="'+enabledCiphColumns+'" class="col_slider" id="enabled_ciphers_columns" oninput="updateTables()"></td>'
	o += '</tr></table>'
	o += '</center>'


	o += '</div></div>'
	document.getElementById("calcOptionsPanel").innerHTML = o
}

function resetColorControls() { // set all color controls to zero
	if (document.getElementById("globalSliderHue") != null) document.getElementById("globalSliderHue").value = 0
	if (document.getElementById("globalSliderSaturation") != null) document.getElementById("globalSliderSaturation").value = 0
	if (document.getElementById("globalSliderLightness") != null) document.getElementById("globalSliderLightness").value = 0
	if (document.getElementById("globalSliderAlpha") != null) document.getElementById("globalSliderAlpha").value = 0
	globColors = {H:0, S:0, L:0, A:0} // reset global color modifier

	// reset values for individual colors
	chkboxColors = []
	var tmp_H, tmp_S, tmp_L
	var tmp = {H:0, S:0, L:0, A:0}
	for (i = 0; i < cipherList.length; i++) {
		chkboxColors.push(tmp)
		tmp_H = document.getElementById("sliderHue"+i)
		tmp_S = document.getElementById("sliderSaturation"+i)
		tmp_L = document.getElementById("sliderLightness"+i)
		tmp_A = document.getElementById("sliderAlpha"+i)
		if (tmp_H != null && tmp_S != null && tmp_L != null && tmp_A != null) { // if individual sliders are visible
			tmp_H.value = 0
			tmp_S.value = 0
			tmp_L.value = 0
			tmp_A.value = 0
		}
	}

	// update colors
	changeCipherColors("globalSliderHue", "Hue")
	changeCipherColors("globalSliderSaturation", "Saturation")
	changeCipherColors("globalSliderLightness", "Lightness")
	changeCipherColors("globalSliderAlpha", "Alpha")

	updateTables() // update
}

function copyAllCipherColors() {
	if (!cipherMenuOpened) { // open cipher menu if not opened
		createAvailCipherMenu()
		populateColorValues()
		cipherMenuOpened = true
	}

	// Simple output format
/*	var c_col, c_name, result = ""
	for (i = 0; i < cipherList.length; i++) {
		c_name = cipherList[i].cipherName
		c_col = document.getElementById("cipherHSLA"+i).value // HSLA box
		result += c_name+": "+c_col+"\n"
	}*/

	var c_col, tmp_HSLA
	var result = "var ciphColors = [\n" // open array
	for (i = 0; i < cipherList.length; i++) {
		c_col = document.getElementById("cipherHSLA"+i).value // HSLA box
		tmp_HSLA = c_col.split(", ") // split string into array by delimiter 
		//result += "    {H:"+tmp_HSLA[0]+", S:"+tmp_HSLA[1]+", L:"+tmp_HSLA[2]+", A:"+tmp_HSLA[3]+"}" // no padding, no color normalization
		result += "    {H:"+colFmt(tmp_HSLA[0], 'H')+"S:"+colFmt(tmp_HSLA[1], 'S')+"L:"+colFmt(tmp_HSLA[2], 'L')+"A:"+colFmt(tmp_HSLA[3], 'A')+"}" // create object
		if (i+1 < cipherList.length) result += ", // "+cipherList[i].cipherName+"\n" // new line if not last item
	}
	result += "  // "+cipherList[cipherList.length-1].cipherName // add last cipher name
	result += "\n]" // close array
	
	console.log(result)
	copyToClipboard(result)
	document.getElementById("ciphMenu").innerHTML = "" // close color menu
	cipherMenuOpened = false
	
	alert("Color values were copied to clipboard!")
}

function colFmt(val, mode) { // normalize HSLA color values
	if (mode == "H") {
		if (val < 0) { val = val % 360 + 360 } // fix 0-360 range
		else { val = val % 360 }
		val = String(val+",   ").substring(0,5) // padding
	} else if (mode == "S") {
		val = clampNum(val, 0, 100)
		val = String(val+",   ").substring(0,5)
	} else if (mode == "L") {
		val = clampNum(val, 0, 100)
		val = String(val+",   ").substring(0,5)
	} else if (mode == "A") { // for Alpha
		val = clampNum(val, 0, 1)
		val = val.toFixed(2) // 2 digits after decimal
		val = String(val+"   ").substring(0,4)
	}
	return val
}

function clampNum(number, min, max) { // clamp number within specified range
	return Math.max(min, Math.min(number, max))
}

function changeCipherColors(elem_id, col_mode, cipher_index) {
	var ciph_len, st_pos, cur_ciphColBox
	var curVal = Number(document.getElementById(elem_id).value) // current slider value
	if (cipher_index == undefined) { // no cipher_index, change all colors
		ciph_len = cipherList.length
		st_pos = 0
	} else { // else change individual color
		ciph_len = cipher_index+1
		st_pos = cipher_index
	}
	for (i = st_pos; i < ciph_len; i++) {
		if (col_mode == "Hue") {
			if (cipher_index == undefined) { globColors.H = curVal } // update global value modified
			else { chkboxColors[i].H = curVal } // update individual cipher value
			cipherList[i].H = origColors[i].H + chkboxColors[i].H + globColors.H
		} else if (col_mode == "Saturation") {
			if (cipher_index == undefined) { globColors.S = curVal }
			else { chkboxColors[i].S = curVal }
			cipherList[i].S = origColors[i].S + chkboxColors[i].S + globColors.S
		} else if (col_mode == "Lightness") {
			if (cipher_index == undefined) { globColors.L = curVal }
			else { chkboxColors[i].L = curVal }
			cipherList[i].L = origColors[i].L + chkboxColors[i].L + globColors.L
		} else if (col_mode == "Alpha") {
			if (cipher_index == undefined) { globColors.A = Number(curVal.toFixed(2)) }
			else { chkboxColors[i].A = Number(curVal.toFixed(2)) }
			cipherList[i].A = Number((origColors[i].A + chkboxColors[i].A + globColors.A).toFixed(2)) // 2 digits after decimal
		}
		cur_ciphColBox = document.getElementById("cipherHSLA"+i) // textbox with HSLA values for current color
		if (cur_ciphColBox != null) cur_ciphColBox.value = cipherList[i].H+", "+cipherList[i].S+", "+cipherList[i].L+", "+cipherList[i].A.toFixed(2)
	}
	updateTables() // update
	updateWordBreakdown() // update phrase/cipher breakdown table
}

function populateColorValues() { // update color controls for each individual cipher
	var tmp_H, tmp_S, tmp_L, tmp_A, tmp_HSLA
	for (i = 0; i < cipherList.length; i++) {
		tmp_H = document.getElementById("sliderHue"+i)
		tmp_S = document.getElementById("sliderSaturation"+i)
		tmp_L = document.getElementById("sliderLightness"+i)
		tmp_A = document.getElementById("sliderAlpha"+i)
		tmp_HSLA = document.getElementById("cipherHSLA"+i)
		if (tmp_H != null) tmp_H.value = chkboxColors[i].H
		if (tmp_S != null) tmp_S.value = chkboxColors[i].S
		if (tmp_L != null) tmp_L.value = chkboxColors[i].L
		if (tmp_A != null) tmp_A.value = chkboxColors[i].A // 2 digits after decimal
		if (tmp_HSLA != null) tmp_HSLA.value = cipherList[i].H+", "+cipherList[i].S+", "+cipherList[i].L+", "+cipherList[i].A.toFixed(2)
		//fixed not a function wtf
	}
}

// ====================== Enabled Cipher Table ======================

function getCipherCategories() {
	var c = ""
	for (i = 0; i < cipherList.length; i++) {
		c = cipherList[i].cipherCategory
		if (cCat.indexOf(c) == -1) cCat.push(c)
	}
}

function disableAllCiphers() {
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		cur_chkbox = document.getElementById("cipher_chkbox"+i)
		cipherList[i].enabled = false // if checkbox exists toggle state (next line)
		if (cur_chkbox != null) cur_chkbox.checked = false
	}
	updateTables() // update
}

function enableAllCiphers() {
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		cur_chkbox = document.getElementById("cipher_chkbox"+i)
		cipherList[i].enabled = true
		if (cur_chkbox != null) cur_chkbox.checked = true
	}
	updateTables() // update
}

function enableAllCiphersEnglish() {
	disableAllCiphers()
	var catArr = ["English", "English (Special)", "Kabbalah", "Custom"]
	for (n = 0; n < catArr.length; n++) {
		toggleCipherCategory(catArr[n], false) // don't update tables yet
	}
	updateTables() // update
}

function enableBaseCiphers() {
	disableAllCiphers()
	var ciphArr = ["English Ordinal", "Reverse Ordinal", "English Reduction", "Reverse Reduction"]
	for (n = 0; n < cipherList.length; n++) {
		if (ciphArr.indexOf(cipherList[n].cipherName) > -1) {
			cipherList[n].enabled = true // enable cipher
			cur_chkbox = document.getElementById("cipher_chkbox"+n)
			if (cur_chkbox != null) cur_chkbox.checked = true // update checkbox if present
		}
	}
	updateTables() // update
}

function toggleCipherCategory(ciph_cat, upd = true) {
	var on_first = false
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherCategory == ciph_cat && !cipherList[i].enabled) on_first = true // if one cipher is disabled
	}
	var cur_chkbox
	for (i = 0; i < cipherList.length; i++) {
		//console.log(cipherList[i].cipherCategory)
		if (cipherList[i].cipherCategory == ciph_cat) {
			cur_chkbox = document.getElementById("cipher_chkbox"+i)
			if (on_first) { // if one cipher is disabled, first enable all
				cipherList[i].enabled = true
				if (cur_chkbox != null) cur_chkbox.checked = true
			} else { // if all ciphers are enabled, disable all
				cipherList[i].enabled = false
				if (cur_chkbox != null) cur_chkbox.checked = false
			}
		}
	}
	if (upd) updateTables() // update
}

function toggleCipher(c_id, chk = false) {
	cipherList[c_id].enabled = !cipherList[c_id].enabled // toggle true/false
	if (chk) { // toggle checkbox state
		cur_chkbox = document.getElementById("cipher_chkbox"+c_id);
		if (cur_chkbox != null) cur_chkbox.checked = !cur_chkbox.checked; // update checkbox if visible
	}
	updateTables() // update
}

function updateEnabledCipherCount() {
	enabledCiphCount = 0 // number of enabled ciphers
	for (i = 0; i < cipherList.length; i++) { // count all enabled ciphers
		if (cipherList[i].enabled) enabledCiphCount++
	}
}

function sVal() {
	var phr = document.getElementById("phraseBox").value.trim() // get value
	// if (cipherList.find(o => o.cipherName.includes("RU") && o.enabled == true)) { // if Russian ciphers are enabled (otherwise "е=ё", "и=й")
	// 	return phr
	// }
	// phr = phr.normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove any diacritic marks (works as you type for word breakdown)
	return phr
}

function updateEnabledCiphTable() { // draws a table with phrase gematria for enabled ciphers (odd/even)
	document.getElementById("resultArea").innerHTML = "" // clear previous table
	
	updateEnabledCipherCount() // get number of enabled ciphers
	
	phr = sVal() // grab current phrase
	// if (enabledCiphCount == 0 || phr == "") return // no enabled ciphers, empty phraseBox
	
	if (document.getElementById("enabled_ciphers_columns") != null ) enabledCiphColumns = document.getElementById("enabled_ciphers_columns").value // number of columns in cipher table, update value
	var result_columns = enabledCiphColumns
	if (enabledCiphCount <= enabledCiphColumns) { result_columns = enabledCiphCount }
	// else if (enabledCiphCount > 6 && enabledCiphCount <= 20) { result_columns = 2 }
	// else { result_columns = 4 }

	var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
	var new_row_opened = false // condition to open new row inside table
	var odd_col = true // odd = "cipher name - value", even = "value - cipher name", used in each row
	//var n_of_rows = 0 // number of rows inside cipher table
	var last_row_elements = 0 // number of ciphers in the last row
	var ciph_in_row = 0 // count active ciphers in row
	
	var o = '<table class="phraseGemContainer"><tbody>'
	
	//n_of_rows = Math.ceil(cipherList.length / result_columns) // 6.0 => 6 rows, 6.25 => 7 rows
	last_row_elements = enabledCiphCount % result_columns
	
	for (i = 0; i < cipherList.length; i++) { // <= to include last row
		if (cipherList[i].enabled) { // for active ciphers
			cur_ciph_index++
			if (!new_row_opened) { // check if new row has to be opened
				o += '<tr>'
				odd_col = true // reset on each new row
				new_row_opened = true
			}
			if (ciph_in_row < result_columns) { // until number of ciphers in row equals number of colums
				if (odd_col) { // odd column, "cipher name - value"
					o += '<td class="phraseGemCiphName" style="color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / '+cipherList[i].A+');">'+HeadLink(cipherList[i])+'</td>'
					o += '<td class="phraseGemValueOdd" style="color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / '+cipherList[i].A+');">'+cipherList[i].calcGematria(phr)+'</td>'
					ciph_in_row++
					odd_col = false
					//console.log(cipherList[i].cipherName+": odd")
				} else if (!odd_col) { // even column, "value - cipher name"
					o += '<td class="phraseGemValueEven" style="color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / '+cipherList[i].A+');">'+cipherList[i].calcGematria(phr)+'</td>'
					o += '<td class="phraseGemCiphName" style="color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / '+cipherList[i].A+');">'+HeadLink(cipherList[i])+'</td>'
					ciph_in_row++
					odd_col = true
					//console.log(cipherList[i].cipherName+": even")
				}
				if (cur_ciph_index == enabledCiphCount && last_row_elements !== 0) { // last enabled cipher is added and last row is not fully populated
					for (n = 0; n < result_columns - last_row_elements; n++) { // for remaining empty cells in last row
						if (odd_col) {
							o += '<td class="phraseGemCiphName"></td>'
							o += '<td class="phraseGemValueOdd"></td>'
							odd_col = false
						} else if (!odd_col) {
							o += '<td class="phraseGemValueEven"></td>'
							o += '<td class="phraseGemCiphName"></td>'
							odd_col = true
						}
					}
				}
				if (ciph_in_row == result_columns) { // check if row needs to be closed
					o += '</tr>'
					ciph_in_row = 0 // reset cipher count
					new_row_opened = false
				}
			}
		}
	}
	o += '</tbody></table>'
	
	document.getElementById("resultArea").innerHTML += o
}

function updateEnabledCiphTable2() { // draws a table with phrase gematria for enabled ciphers
	document.getElementById("resultArea").innerHTML = "" // clear previous table
	
	updateEnabledCipherCount() // get number of enabled ciphers
	
	phr = sVal() // grab current phrase
	// if (enabledCiphCount == 0 || phr == "") return // no enabled ciphers, empty phraseBox
	
	var result_columns = document.getElementById("enabled_ciphers_columns").value // number of columns in cipher table, update value
	// if (enabledCiphCount <= 6) { result_columns = 1 }
	// else if (enabledCiphCount > 6 && enabledCiphCount <= 20) { result_columns = 2 }
	// else { result_columns = 4 }

	var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
	var new_row_opened = false // condition to open new row inside table
	var odd_col = true // odd = "cipher name - value", even = "value - cipher name", used in each row
	//var n_of_rows = 0 // number of rows inside cipher table
	var last_row_elements = 0 // number of ciphers in the last row
	var ciph_in_row = 0 // count active ciphers in row
	
	var o = '<table class="phraseGemContainer"><tbody>'
	
	//n_of_rows = Math.ceil(cipherList.length / result_columns) // 6.0 => 6 rows, 6.25 => 7 rows
	last_row_elements = enabledCiphCount % result_columns
	
	for (i = 0; i < cipherList.length; i++) { // <= to include last row
		if (cipherList[i].enabled) { // for active ciphers
			cur_ciph_index++
			if (!new_row_opened) { // check if new row has to be opened
				o += '<tr>'
				new_row_opened = true
			}
			if (ciph_in_row < result_columns) { // until number of ciphers in row equals number of colums
				o += '<td class="phraseGemCiphName" style="color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / '+cipherList[i].A+');">'+HeadLink(cipherList[i])+'</td>'
				o += '<td class="phraseGemValue" style="color: hsl('+cipherList[i].H+' '+cipherList[i].S+'% '+cipherList[i].L+'% / '+cipherList[i].A+');">'+cipherList[i].calcGematria(phr)+'</td>'
				ciph_in_row++
				if (cur_ciph_index == enabledCiphCount && last_row_elements !== 0) { // last enabled cipher is added and last row is not fully populated
					for (n = 0; n < result_columns - last_row_elements; n++) { // for remaining empty cells in last row
						o += '<td class="phraseGemCiphName"></td>'
						o += '<td class="phraseGemValue"></td>'
						odd_col = false
					}
				}
				if (ciph_in_row == result_columns) { // check if row needs to be closed
					o += '</tr>'
					ciph_in_row = 0 // reset cipher count
					new_row_opened = false
				}
			}
		}
	}
	o += '</tbody></table>'
	
	document.getElementById("resultArea").innerHTML += o
}

// =================== Phrase Box - History Table ===================

function phraseBoxKeypress(e) { // run on each keystroke inside text box - onkeydown="navHistory(event.keyCode) - from index.html
	var phrPos, pBox
	phr = sVal() // get phrase from SearchField
	pBox = document.getElementById("phraseBox")

	phrPos = sHistory.indexOf(phr) // position of phrase in History array
	switch (e) { // keypress event
		case 13: // Enter
			addPhraseToHistory(phr, true) // enter as single phrase
			if (!shiftIsPressed) pBox.value = "" // clear textbox on Enter, "Shift - Enter" preserves contents
			break
		case 38: // Up Arrow
			if (phrPos > 0) {
				phr = sHistory[phrPos - 1]
			}
			if (phr !== "") {pBox.value = phr; updateWordBreakdown(); updateTables()}
			break
		case 40: // Down Arrow
			if (phrPos > -1) {
				if (sHistory.length > (phrPos + 1)) {phr = sHistory[phrPos + 1]}
			} else {
				if (sHistory.length > 0) {phr = sHistory[0]}
			}
			if (phr !== "") {pBox.value = phr; updateWordBreakdown(); updateTables()}
			break
		case 46: // Delete - remove entries from history
			if (sHistory.length == 1) {
				sHistory = [] // reinitialize array if there is only one entry
				tArea = document.getElementById("HistoryTableArea")
				tArea.innerHTML = "" // clear table
			}
			if (phrPos > -1) {
				sHistory.splice(phrPos, 1) // if a match is found, delete entry
			}
			pBox.value = "" // empty text box, so the old value is not added again
			updateWordBreakdown() // update breakdown
			updateTables() // update enabled cipher and history table
			break
		case 36: // Home - clear all history
			sHistory = [] // reinitialize
			document.getElementById("HistoryTableArea").innerHTML = "" // clear history table
			break
		case 35: // End - parse sentence as separate words and phrases
			phr = phr.replace(/\t/g, " ") // replace tab with spaces
			phr = phr.replace(/ +/g, " ") // remove double spaces
			// phr = phr.replace(/(\.|,|:|;|\\|)/g, "") // remove special characters, last one is "|"
			
			wordArr = phr.split(" ") // split string to array, space delimiter
			phrLimit = optPhraseLimit // max phrase length
			var phrase
			// for (i = 0; i < wordArr.length; i++) { // phrases in normal order
				// k = 1 // init variable
				// phrase = wordArr[i]
				// addPhraseToHistory(phrase, false)
				// while (k < phrLimit && i+k < wordArr.length) { // add words to a phrase, check it is within array size
					// phrase += " "+wordArr[i+k]
					// addPhraseToHistory(phrase, false)
					// k++
				// }
			// }
			for (i = wordArr.length-1; i > -1; i--) { // add phrases in reverse order, so you don't have to read backwards
				k = 1 // init variable
				phrase = wordArr[i]
				addPhraseToHistory(phrase, false) // don't recalculate table yet
				while (k < phrLimit && i-k > -1) { // add words to a phrase, check it is within wordArr size
					phrase = wordArr[i-k]+" "+phrase
					addPhraseToHistory(phrase, false)
					k++
				}
			}
			updateHistoryTable() // update table only once after all phrases are added
			break
	}
}

function addPhraseToHistory(phr, upd) { // add new phrase to search history
	var phrPos
	if (phr !== "") { // if input is not empty
		if (Number(phr) > 0) { // if a number is entered, do not add it to history
		} else {
			phrPos = sHistory.indexOf(phr);
			if (phrPos > -1) { // if phrase is in history
				sHistory.splice(phrPos, 1) // first remove it from array
			}
			sHistory.unshift(phr) // insert it in the beginning
		}
	}
	if (upd) updateHistoryTable() // table update condition
}

function updateHistoryTable(hltBoolArr) {
	var ms, i, x, y, z, alpha, curCiph, gemVal, maxMatch
	var ciphCount = 0 // count enabled ciphers (for hltBoolArr)
	histTable = document.getElementById("HistoryTableArea")
	
	if (sHistory.length == 0) {return}

	ms = '<table class="HistoryTable"><tbody>'

	highlt = document.getElementById("highlightBox").value.replace(/ +/g," ") // get value of Highlight textbox, remove double spaces
	
	var hltMode = false // highlighting mode
	if (highlt !== "") {
		highlt_num = highlt.split(" "); // create array, space delimited numbers
		highlt_num = highlt_num.map(function (e) { // parse string array as integer array to exclude quotes
			return parseInt(e, 10); 
		});
		hltMode = true
	}

	for (x = 0; x < sHistory.length; x++) {

		if (x % 25 == 0 && !optTinyHistoryTable) {
			// ms += '<tr><td class="mP">Word or Phrase</td>'
			ms += '<tr class="cH"><td class="mP">Gematria</td>'
			for (z = 0; z < cipherList.length; z++) {
				if (cipherList[z].enabled) {
					if (optCompactHistoryTable) {
						ms += '<td class="hCV"><span class="hCV2" style="color: hsl('+cipherList[z].H+' '+cipherList[z].S+'% '+cipherList[z].L+'% / '+cipherList[z].A+');">'+cipherList[z].cipherName+'</span></td>' // color of cipher displayed in the table
					} else {
						ms += '<td class="hC" style="color: hsl('+cipherList[z].H+' '+cipherList[z].S+'% '+cipherList[z].L+'% / '+cipherList[z].A+');">'+cipherList[z].cipherName+'</td>' // color of cipher displayed in the table
					}
				}
			}
			ms += "</tr>"
		}

		ciphCount = 0 // reset enabled cipher count (for hltBoolArr)

		ms += '<tr><td class="hP">' + sHistory[x] + '</td>' // hP - history phrase
		var col = "" // value color

		for (y = 0; y < cipherList.length; y++) {
			if (cipherList[y].enabled) {
				curCiph = cipherList[y]
				gemVal = curCiph.calcGematria(sHistory[x]) // value only
				
				//phrase x, cipher y
				col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+curCiph.A+')' // default value color
				//col_bg = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+curCiph.A/17+')' // background gradient color

				// if highlight mode is on
				if (hltMode) {
					// if optWeightedAutoHlt doesn't populate freq[], hltBoolArr was passed and value inside hltBoolArr is not active
					//freq.length == 0 && 
					if ( typeof hltBoolArr !== 'undefined' && hltBoolArr[x][ciphCount] == false ) {
						alpha = curCiph.A * 0.2
						col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alpha+')'
						//col_bg = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alpha/17+')' // background gradient color
					// if cross cipher match and doesn't include number or - freq[] is empty, hltBoolArr was not passed and value is not present in highlight box
					// freq.length == 0 && 
					} else if ( (optFiltCrossCipherMatch && !highlt_num.includes(gemVal)) || (freq.length == 0 && typeof hltBoolArr == 'undefined' && !highlt_num.includes(gemVal)) ) {
						alpha = curCiph.A * 0.2
						col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alpha+')'
						//col_bg = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alpha/17+')' // background gradient color
					// if cross cipher match and value is not present in highlight box
					// } else if ( optFiltCrossCipherMatch && !highlt_num.includes(gemVal) ) {
					// 	alpha = curCiph.A * 0.3
					// 	col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alpha+')'
					// if weighted auto highlighter mode, frequency array is not empty
					} else if ( optWeightedAutoHlt && freq.length !== 0 ) {
						if ( !highlt_num.includes(gemVal) ) { // if highlight mode is on and current value doesn't match
							alpha = 0 // invisible
							//col_bg = 'transparent'
						}
						maxMatch = freq[freq.length-1][1]; // last value, array is sorted
						for (i = 0; i < freq.length; i++) { // weighted coloring
							if (freq[i][0] == gemVal) {
								alpha = freq[i][1]/maxMatch // if max - value 1.0
								alpha = alpha*alpha*alpha // less significant values are darker, "gamma curve"
								//col_bg = 'transparent'
							}
						}
						//col = 'hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alpha+')'
						col = 'hsl(120 100% 50% / '+alpha+')' // green
					}
				}
				ciphCount++ // next position in hltBoolArr
				// value including tooltip with colored cipher name and phrase
				ms += '<td class="tC"><span style="color: '+col+'" class="gV"> '+gemVal+' </span></td>'
				//ms += '<td class="tC" style="background: linear-gradient(90deg, '+col_bg+', transparent);"><span style="color: '+col+'">'+gemSum+'</span></td>'
				//ms += '<td class="tC histValTooltip"><span style="color: '+col+'">'+gemSum+'</span><span class="histValTooltipTxt"><span style="color: '+col+'">'+cipherList[y].cipherName+'</span><br><br>'+sHistory[x]+'</span></td>'
			}
		}
		ms += '</tr>'
	}

	ms += '</tbody></table>'
	histTable.innerHTML = ms
}