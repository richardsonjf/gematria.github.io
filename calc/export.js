// ========================== Export Menu ===========================

function createExportMenu() {
	
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">' // Options drop down hover menu
	o += '<button class="dropbtn">Export</button>'
	o += '<div class="dropdown-content">'

	o += '<input id="btn-print-cipher-png" class="intBtn" type="button" value="Print Cipher Chart">' // cipher chart preview
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-history-png" class="intBtn" type="button" value="Print History Table">' // history table preview
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-word-break-png" class="intBtn" type="button" value="Print Word Breakdown">' // print word breakdown table
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-breakdown-details-png" class="intBtn" type="button" value="Print Gematria Card">' // print detailed breakdown
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-num-props-png" class="intBtn" type="button" value="Print Number Properties">' // print number properties
	
	o += '<hr style="background-color: rgb(77,77,77); height: 1px; border: none; margin: 0.75em;">'

	o += '<input type="file" id="importFileDummy" style="display: none;">' // dummy item for file import
	o += '<label for="importFileDummy" class="intBtn" style="text-align: center; box-sizing: border-box;">Import File</label>' // import file
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-history-png" class="intBtn" type="button" value="Export History (CSV)">' // export history as CSV file
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-ciphers" class="intBtn" type="button" value="Export Ciphers">' // export all available ciphers

	o += '</div></div>'
	document.getElementById("calcOptionsPanel").innerHTML = o
}

$(document).ready(function(){

	$("body").on("click", "#btn-print-cipher-png", function () { // for future elements
		// English-Ordinal_cipher.png
		var fileName = breakCipher.replace(/ /g, "-")+"_cipher.png";
		openImageWindow("#ChartSpot", fileName);
	});

	$("body").on("click", "#btn-print-history-png", function () {
		// phrase-with-spaces_2021-03-26_10-23-52_table.png
		var fileName = sHistory[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")+
			"_"+getTimestamp()+"_table.png";
		openImageWindow(".HistoryTable", fileName);
	});

	$("body").on("click", "#btn-print-word-break-png", function () {
		// phrase-with-spaces_English-Ordinal_190_breakdown.png
		for (var i = 0; i < cipherList.length; i++) { if (cipherList[i].cipherName == breakCipher) break; } // get current cipher index
		var fileName = sVal().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")+
			"_"+breakCipher.replace(/ /g, "-")+"_"+cipherList[i].calcGematria(sVal())+"_breakdown.png";
		openImageWindow("#BreakTableContainer", fileName);
	});

	$("body").on("click", "#btn-print-breakdown-details-png", function () {
		var o = $(".LetterCounts").text();
		var i, c_h, c_s, c_l = 0;
		for (i = 0; i < cipherList.length; i++) {
			if (cipherList[i].cipherName == breakCipher) { // current active cipher
				c_h = cipherList[i].H;
				c_s = cipherList[i].S;
				c_l = cipherList[i].L;
				break;
			}
		}
		$(".LetterCounts").html('<span style="color: hsl('+c_h+' '+c_s+'% '+c_l+'% / 1); font-weight: 500; font-size: 200%;">Gematria</span><br><hr style="background-color: rgb(105,105,105); height: 2px; border: none;">');
		$("#BreakdownDetails").attr("style", "padding-top: 1.25em;"); // more padding
		updateCipherChartGemCard(); // redraw cipher chart for current cipher (with borders)

		// phrase-with-spaces_English-Ordinal_190_card.png
		var fileName = sVal().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")+
			"_"+breakCipher.replace(/ /g, "-")+"_"+cipherList[i].calcGematria(sVal())+"_card.png";
		openImageWindow("#BreakdownDetails", fileName, 1.5); // scale 1.5x
	});

	$("body").on("click", "#btn-num-props-png", function () {
		// 123_number_properties.png OR 123_alt_number_properties.png
		var curNum = document.querySelector('.numPropTooltip').dataset.number // current number
		var fileName = curNum+"_number_properties.png";
		openImageWindow(".numPropTooltip", fileName);
	});

	$("body").on("change", "#importFileDummy", function(){
		var file = document.querySelector("#importFileDummy").files[0];
		importFileAction(file);
	});
	$("body").on("click", "#btn-export-history-png", function () {
		exportHistoryCSV(sHistory);
	});
	$("body").on("click", "#btn-export-ciphers", function () {
		exportCiphers();
	});
	
});

function openImageWindow(element, imgName = "", sRatio = window.devicePixelRatio) { // sRatio is scaling
	var imageURL, wnd, scl
	if ( $(element).length ) { // if specified element exists
		// if browser zoom level is more than passed value, use current zoom level
		if (typeof sRatio !== 'undefined' && sRatio < window.devicePixelRatio) { sRatio = window.devicePixelRatio}
		html2canvas($(element)[0], {allowTaint: true, backgroundColor: "rgba(32,37,50,1.0)", width: $(element).outerWidth(), height: $(element).outerHeight(), scale: sRatio} ).then((canvas) => { // e.g. html2canvas($("#ChartTable")[0]).then ...
			//allowTaint: true, backgroundColor: "rgba(22,26,34,1.0)" - render white bg as transparent
			//width: $(element).width(), height: $(element).height() - get proper element dimensions
			//console.log("done ... ");
			//$("#previewImage").append(canvas);
			
			imageURL = canvas.toDataURL("image/png"); // canvas to "data:image/png;base64, ..."
			if (imgName == "" || imgName.length >= 200) imgName = getTimestamp()+".png"; // filename for download button (200 char limit)

			wnd = window.open(""); // open new window
			// add download button and image data inside centered <div>
			wnd.document.body.innerHTML = "<div style='max-height: 100%; max-width: 100%; position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);'><center><br><a href='"+imageURL+"' download='"+imgName+"' style='font-family: arial, sans-serif; color: #dedede' >Download</a></center><br><img src="+canvas.toDataURL("image/png")+"></div>";
			wnd.document.body.style.backgroundColor = "#000000"; // black background
		});
	}
}

function getTimestamp() {
	var ts = new Date().toISOString() // 2016-02-18T23:59:48.039Z
	var re = new RegExp(":", 'g') // replace ":" with "-"
	var re2 = new RegExp("\\..*?$", 'g') // remove all after dot
	ts = ts.replace("T", "_").replace(re, "-").replace(re2, "") // format
	return ts
}

/*$("body").on("click", "#btn-save-png", function () {
	console.log("download");
	var imageData = getCanvas.toDataURL("image/png");
	// Now browser starts downloading it instead of just showing it
	var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");
	// $("#btn-Convert-Html2Image").attr("download", Date.now()+".png").attr("href", newData); // for <a> element
	download(Date.now()+".png", newData);
});*/

function listAllCiphers() { // print cipher names/index to console
	for (i = 0; i < cipherList.length; i++) {
		console.log(i+": "+cipherList[i].cipherName)
	}
}

function exportCiphers() {
	var out =
		'// ciphers.js\n'+
		'\n'+
		'/*\n'+
		'new cipher(\n'+
			'\t"English Ordinal", // cipher name\n'+
			'\t"English", // category\n'+
			'\t120, 57, 36, // hue, saturation, lightness\n'+
			'\t[97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122], // lowercase characters\n'+
			'\t[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], // values\n'+
			'\ttrue, // characters with diacritic marks have the same value as regular ones, default is "true"\n'+
			'\ttrue // enabled state, default is "false"\n'+
		')\n'+
		'*/\n\n'

	out += "cipherList = [\n"
	for (i = 0; i < cipherList.length; i++) {
		
		var cArr_ = []
		var vArr_ = []
		
		// Read list of characters
		for (m = 0; m < cipherList[i].cArr.length; m++) {
			// cArr_.push(String.fromCharCode(cipherList[i].cArr[m])) // character
			cArr_.push(cipherList[i].cArr[m]) // charcode
		}
		
		// Read values for each character
		for (m = 0; m < cipherList[i].vArr.length; m++) {
			vArr_.push(cipherList[i].vArr[m])
		}
		
		out +=
			'\tnew cipher(\n'+
			'\t\t"'+cipherList[i].cipherName+'",\n'+
			'\t\t"'+cipherList[i].cipherCategory+'",\n'+
			'\t\t'+cipherList[i].H+', '+cipherList[i].S+', '+cipherList[i].L+',\n'+
			'\t\t'+JSON.stringify(cArr_)+',\n'+
			'\t\t'+JSON.stringify(vArr_)+',\n'+
			'\t\t'+cipherList[i].diacriticsAsRegular+',\n'+
			'\t\t'+cipherList[i].enabled+'\n'+
			'\t),\n'
	}
	out = out.substring(0, out.length-2) + '\n]' // remove last comma and new line, close array
	console.log(out)

	out = 'data:text/js;charset=utf-8,'+encodeURIComponent(out) // format as text file
	// ciphers_2021-03-26_10-23-52.js
	download("ciphers_"+getTimestamp()+".js", out); // download file
}