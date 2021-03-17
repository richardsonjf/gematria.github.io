function createExportControls() {
	
	var o = document.getElementById("calcOptionsPanel").innerHTML

	o += '<div class="dropdown">' // Options drop down hover menu
	o += '<button class="dropbtn">Export</button>'
	o += '<div class="dropdown-content">'

	o += '<input id="btn-print-cipher-png" class="intBtn" type="button" value="Print Cipher Chart" />' // cipher chart preview
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-history-png" class="intBtn" type="button" value="Print History Table" />' // history table preview
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-word-break-png" class="intBtn" type="button" value="Print Word Breakdown" />' // print word breakdown table
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-print-breakdown-details-png" class="intBtn" type="button" value="Print Gematria Card" />' // print detailed breakdown
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-history-png" class="intBtn" type="button" value="Export History (CSV)" />' // export history as CSV file
	o += '<div style="margin: 0.5em;"></div>'
	o += '<input id="btn-export-ciphers" class="intBtn" type="button" value="Export Ciphers" />' // export all available ciphers

	o += '</div></div>'
	document.getElementById("calcOptionsPanel").innerHTML = o
}

$(document).ready(function(){

	$("body").on("click", "#btn-print-cipher-png", function () { // for future elements
		openImageWindow("#ChartTable");
	});

	$("body").on("click", "#btn-print-history-png", function () {
		openImageWindow(".HistoryTable");
	});

	$("body").on("click", "#btn-print-word-break-png", function () {
		openImageWindow(".BreakTable");
	});

	$("body").on("click", "#btn-print-breakdown-details-png", function () {
		var o = $(".LetterCounts").text();
		var c_h, c_s, c_l = 0;
		for (i = 0; i < cipherList.length; i++) {
			if (cipherList[i].cipherName == breakCipher) { // current active cipher
				c_h = cipherList[i].H;
				c_s = cipherList[i].S;
				c_l = cipherList[i].L;
			}
		}
		//$(".LetterCounts").html('<span style="color: hsl('+c_h+' '+c_s+'% '+c_l+'% / 1.0); font-weight: 900; font-size: 200%;">Gematria</span><br><hr style="background-color: rgb(77,77,77); height: 2px; border: none;">' + $(".LetterCounts").text());
		$(".LetterCounts").html('<span style="color: hsl('+c_h+' '+c_s+'% '+c_l+'% / 1.0); font-weight: 900; font-size: 200%;">Gematria</span><br><hr style="background-color: rgb(77,77,77); height: 2px; border: none;">');
		openImageWindow("#BreakdownDetails", 1.5);
		//$(".LetterCounts").text(o); // restore original contents
	});

	$("body").on("click", "#btn-export-history-png", function () {
		exportHistoryCSV();
	});
	$("body").on("click", "#btn-export-ciphers", function () {
		exportCiphers();
	});
	
});

function openImageWindow(element, sRatio = window.devicePixelRatio) { // sRatio is scaling
	var imageURL,imgName, wnd, scl
	if ( $(element).length ) { // if specified element exists
		// if browser zoom level is more than passed value, use current zoom level
		if (typeof sRatio !== 'undefined' && sRatio < window.devicePixelRatio) { sRatio = window.devicePixelRatio}
		html2canvas($(element)[0], {allowTaint: true, backgroundColor: "rgba(22,26,34,1.0)", width: $(element).outerWidth(), height: $(element).outerHeight(), scale: sRatio} ).then((canvas) => { // e.g. html2canvas($("#ChartTable")[0]).then ...
			//allowTaint: true, backgroundColor: "rgba(27,30,40,1.0)" - render white bg as transparent
			//width: $(element).width(), height: $(element).height() - get proper element dimensions
			//console.log("done ... ");
			//$("#previewImage").append(canvas);
			
			imageURL = canvas.toDataURL("image/png"); // canvas to "data:image/png;base64, ..."
			imgName = getTimestamp()+".png"; // filename for download button

			wnd = window.open(""); // open new window
			// add download button and image data inside centered <div>
			wnd.document.body.innerHTML = "<div style='max-height: 100%; max-width: 100%; position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%);'><center><br><a href='"+imageURL+"' download='"+imgName+"' style='font-family: arial, sans-serif; color: #dedede' >Download</a></center><br><img src="+canvas.toDataURL("image/png")+"></div>";
			wnd.document.body.style.backgroundColor = "#000000"; // black background
		});
	} else {
		alert("Empty element cannot be printed!")
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