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
	o += '<input id="btn-export-matches-txt" class="intBtn" type="button" value="Export Matches (TXT)">' // export available same/cross cipher matches
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-db-query" class="intBtn hideValue" type="button" value="Export DB Query (CSV)">' // export database query
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
		var fileName = sHistory[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").replace(/["|']/g, "")+
			"_"+getTimestamp()+"_table.png";
		openImageWindow(".HistoryTable", fileName);
	});

	$("body").on("click", "#btn-print-word-break-png", function () {
		// phrase-with-spaces_English-Ordinal_190_breakdown.png
		for (var i = 0; i < cipherList.length; i++) { if (cipherList[i].cipherName == breakCipher) break; } // get current cipher index
		var fileName = sVal().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").replace(/["|']/g, "")+
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
		// $(".LetterCounts").html('<span style="color: hsl('+c_h+' '+c_s+'% '+c_l+'% / 1); font-weight: 500; font-size: 200%;">Gematria</span><br><hr style="background-color: rgb(105,105,105); height: 2px; border: none;">');
		//$("#BreakdownDetails").attr("style", "padding-top: 1.25em;"); // more padding
		$(".LetterCounts").html('<br><hr style="background-color: rgb(105,105,105); height: 2px; border: none;">');
		$("#BreakdownDetails").attr("style", "padding-top: 0.75em;"); // more padding
		updateCipherChartGemCard(); // redraw cipher chart for current cipher (with borders)

		// phrase-with-spaces_English-Ordinal_190_card.png
		var fileName = sVal().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").replace(/["|']/g, "")+
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
	$("body").on("click", "#btn-export-matches-txt", function () {
		exportHighlighterMatches(sHistory);
	});
	$("body").on("click", "#btn-export-db-query", function () {
		exportCurrentDBquery(queryResult);
	});
	$("body").on("click", "#btn-export-ciphers", function () {
		exportCiphers();
	});
	
});

function openImageWindow(element, imgName = "", sRatio = window.devicePixelRatio, refresh = false) { // sRatio is scaling, refresh - update the image only
	var imageDataURL, wnd, scl
	if ( $(element).length ) { // if specified element exists
		// if browser zoom level is more than passed value, use current zoom level
		if (typeof sRatio !== 'undefined' && sRatio < window.devicePixelRatio) { sRatio = window.devicePixelRatio}
		html2canvas($(element)[0], {allowTaint: true, backgroundColor: calcBGhtml2canvas(), width: $(element).outerWidth(), height: $(element).outerHeight(), scale: sRatio} ).then((canvas) => { // e.g. html2canvas($("#ChartTable")[0]).then ...
			//allowTaint: true, backgroundColor: "rgba(22,26,34,1.0)" - render white bg as transparent
			//width: $(element).width(), height: $(element).height() - get proper element dimensions
			//console.log("done ... ");
			//$("#previewImage").append(canvas);
			
			imageDataURL = canvas.toDataURL("image/png"); // canvas to "data:image/png;base64, ..."
			if (imgName == "" || imgName.length >= 200) imgName = getTimestamp()+".png"; // filename for download button (200 char limit)

			// add download button and image data inside centered <div>
			//wnd = window.open(""); // open new window
			//wnd.document.body.innerHTML = "<div style='max-height: 100%; max-width: 100%; position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);'><center><br><a href='"+imageDataURL+"' download='"+imgName+"' style='font-family: arial, sans-serif; color: #dedede' >Download</a></center><br><img src="+canvas.toDataURL("image/png")+"></div>";
			//wnd.document.body.style.backgroundColor = "#000000"; // black background
			if (!refresh) {
				showPrintImagePreview(imageDataURL, imgName, element, sRatio) // show preview panel
			} else {
				$('#imgData').attr("src", imageDataURL) // update image only
				$('#downImgBtn').attr("onclick", "download('"+imgName+"', '"+imageDataURL+"')")
			}
		});
	}
}

function showPrintImagePreview(imageDataURL, imgName, element, sRatio) {
	$('<div id="darkOverlay" onclick="closePrintImagePreview()"></div>').appendTo('body'); // overlay

	var o = '<div class="printImageContainer">'
	o += '<center><div class="prevBtnArea">'
	o += '<input id="downImgBtn" type="button" value="Save Image" onclick="download(&#39;'+imgName+'&#39;, &#39;'+imageDataURL+'&#39;)">' // &#39; - single quote
	o += '<input class="refreshImgBtn" type="button" value="Refresh" onclick="openImageWindow(&#39;'+element+'&#39;, &#39;'+imgName+'&#39;, +&#39;'+sRatio+'&#39;, true);">'
	o += '</div></center>'
	o += '<div class="imgDataArea"><img id="imgData" src="'+imageDataURL+'"></div>'
	o += '</div>'

	$(o).appendTo('body'); // preview image
	$('body').addClass('noScroll') // prevent scrolling

	btnH = Math.ceil( $('.prevBtnArea').outerHeight() )
	o = 'height: calc(100% - '+btnH+'px);'
	$('.imgDataArea').attr("style", o)
}

function closePrintImagePreview() {
	$('#darkOverlay').remove();
	$('.printImageContainer').remove();
	$('body').removeClass('noScroll') // restore scrolling
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

	out += "interfaceHue = "+interfaceHue+"\n" // save current interface color
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

function exportHighlighterMatches(histArr) { // highlighter mode controls export mode
	if (optFiltCrossCipherMatch) {
		exportCrossCipherMatches(histArr)
	} else if (optFiltSameCipherMatch) {
		exportSameCipherMatches(histArr)
	}
}

function exportSameCipherMatches(histArr) {
	var pVal = [] // 2d array, all phrase values in one cipher for each existing cipher (use index to get cipher name, use index to get phrase)
	var tmp = [] // gematria values for one phrase (all ciphers)
	var g

	for (n = 0; n < cipherList.length; n++) { // for each enabled cipher
		tmp = [] // reset array
		for (i = 0; i < histArr.length; i++) { // for each phrase
			if (cipherList[n].enabled) {
				g = cipherList[n].calcGematria(histArr[i]) // gematria for current phrase in one cipher
			} else {
				g = 0 // value for disabled ciphers
			}
			tmp.push(g) // separate phrase array
		}
		pVal.push(tmp) // add cipher with gematria, pVal[0][1] is cipherList[0], histArr[1]
	}

	var searchArr = [] // list of numbers that occur twice or more
	var matchArr = [] // array with matches within one cipher
	var o = '======= Same Cipher Match =======\n\n\n' // build string for output

	for (p = 0; p < pVal.length; p++) { // for each cipher
		searchArr = [] // reset
		matchArr = countMatches(pVal[p]) // 2d array, number/amount of matches in one cipher

		for (i = 0; i < matchArr.length; i++) { // for all available matches
			if (matchArr[i][1] >= 2) searchArr.push(matchArr[i][0]) // add those that occur twice or more
		}

		searchArr.sort(function(a, b) { // sort ascending order
			return a - b; //  b - a, for descending sort
		});
		if (searchArr[0] == 0) searchArr.splice(0,1) // remove zero (value for disabled ciphers)

		for (i = 0; i < searchArr.length; i++) { // for each valid match
			o += searchArr[i] + ' (' + cipherList[p].cipherName + ')' // 30 (English Ordinal)
			o += '\n================================='
			for (n = 0; n < pVal[p].length; n++) { // for each value in current cipher
				if (pVal[p][n] == searchArr[i]) { // if gematria equals current searched number
					o += '\n"' + histArr[n] + '"' // add "phrase"
				}
			}
			o += '\n\n\n' // number added, new lines
		}
	}

	o = o.substring(0, o.length-3) // remove last new lines

	o = 'data:text/plain;charset=utf-8,'+encodeURIComponent(o) // format as text file
	download(getTimestamp()+"_Same_Cipher_Match_gematria.txt", o); // download file
}

function exportCrossCipherMatches(histArr) { // maybe use highlighter mode to control behavior
	var allVal = [] // all gematria in one array
	var pVal = [] // 2d array, phrase [0], gematria value in cipher
	var tmp = [] // gematria values for one phrase (all ciphers)
	var g

	for (i = 0; i < histArr.length; i++) { // for each phrase
		tmp = [histArr[i]] // reset array, add phrase at index 0
		for (n = 0; n < cipherList.length; n++) { // for each existing cipher
			if (cipherList[n].enabled) {
				g = cipherList[n].calcGematria(histArr[i]) // gematria for current cipher
			} else {
				g = 0 // zero value for disabled ciphers
			}
			tmp.push(g) // separate phrase array
			allVal.push(g) // all gematria array
		}
		pVal.push(tmp) // add phrase with gematria, cipher indices are offset +1
	}

	var matchArr = countMatches(allVal) // 2d array, number/amount of matches
	var searchArr = [] // list of numbers that occur twice or more

	for (i = 0; i < matchArr.length; i++) { // for all available matches
		if (matchArr[i][1] >= 2) searchArr.push(matchArr[i][0]) // add those that occur twice or more
	}
	
	searchArr.sort(function(a, b) { // sort ascending order
		return a - b; //  b - a, for descending sort
	});
	if (searchArr[0] == 0) searchArr.splice(0,1) // remove zero (value for disabled ciphers)

	var nP = true // new phrase flag (used to add cipher names to existing matches)
	var o = '============ Cross Cipher Match ============\n\n\n' // build string for output
	for (i = 0; i < searchArr.length; i++) { // for each valid match
		o += searchArr[i] // number
		o += '\n============================================'
		for (n = 0; n < pVal.length; n++) { // for each phrase
			nP = true // new phrase
			for (m = 0; m < pVal[n].length; m++) { // for each gematria value
				if (pVal[n][m] == searchArr[i] && nP) { // if gematria equals searched number
					o += '\n"' + pVal[n][0] + '" (' + cipherList[m-1].cipherName + ')' // "phrase" (English Ordinal)
					nP = false // current phrase was added
				} else if (pVal[n][m] == searchArr[i] && !nP) { // same phrase, different cipher match
					o += ', (' + cipherList[m-1].cipherName + ')' // , (Reverse Ordinal)
				}
			}
		}
		o += '\n\n\n' // number added, new lines
	}
	o = o.substring(0, o.length-3) // remove last new lines

	o = 'data:text/plain;charset=utf-8,'+encodeURIComponent(o) // format as text file
	download(getTimestamp()+"_Cross_Cipher_Match_gematria.txt", o); // download file
}

// ======================== Color Conversion ========================
// ------------ html2canvas has no support of HSL values ------------

function calcBGhtml2canvas() {
	var element = document.querySelector('body')
	var compStyles = window.getComputedStyle(element)
	var bodyBg = compStyles.getPropertyValue('--body-bg-accent') // ' hsl(222 22% 16%)'
	var colArr = bodyBg.trim().split(" ") // remove leading/trailing spaces, split to array, space as delimiter
	for (i = 0; i < colArr.length; i++) {
		colArr[i] = Number( colArr[i].replace(/[^\d|^\.]/g, '') ) // remove anything that is not a digit or a literal dot, parse as number
	}
	return HSLtoRGB(colArr[0], colArr[1], colArr[2]) // rgb(32,37,50)
}

function HSLtoRGB(h, s, l) {
	var hsv = HSLtoHSV(h, s, l)
	return HSVtoRGB(hsv.h, hsv.s, hsv.v)
}

function HSLtoHSV(h, s, l) {
	h = h / 360, s = s / 100, l = l / 100;
	var _h = h,
		_s,
		_v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	_v = (l + s) / 2;
	_s = (2 * s) / (l + s);

	return {
		h: _h * 360,
		s: _s * 100,
		v: _v * 100
	};
}

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	h = h / 360, s = s / 100, v = v / 100;

	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return 'rgb('+Math.round(r * 255)+','+Math.round(g * 255)+','+Math.round(b * 255)+')'
}