// =========================== Export CSV ===========================

$(document).ready(function(){
	// change element style on drag-enter event
	$("body").on("dragenter", "#phraseBox", function () {
		$(this).addClass("dragOver");
	});
	$("body").on("dragleave", "#phraseBox", function () {
		$(this).removeClass("dragOver");
	});
});

var userHist = "" // user history table

function dropHandler(ev) {
	// console.log('File(s) dropped')
	$("#phraseBox").removeClass("dragOver")
	
	ev.preventDefault() // prevent default behavior (Prevent file from being opened)

	if (ev.dataTransfer.items) {
		// use DataTransferItemList interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.items.length; i++) {
			// if dropped items aren't files, reject them
			if (ev.dataTransfer.items[i].kind === 'file') {
				var file = ev.dataTransfer.items[i].getAsFile()
				console.log('... "FILE" file[' + i + '].name = ' + file.name)
				//console.log(file)
				//console.log(ev)
			}
		}
	} else {
		// use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name)
		}
	}
	
	var file = ev.dataTransfer.files[0] // first file
	importFileAction(file)
}

function importFileAction(file) {
	var reader = new FileReader()
	
	var sb = "" // string builder
	reader.onload = (event) => { // actions to perform after file is read
		file = event.target.result // full file contents
		userHist = file.split(/\r\n|\n/) // to string array, line break as separator

		if (typeof databaseMode !== 'undefined' && databaseMode) { exportHistoryCSV(userHist); return } // line by line, only phrases
		
		//userHist.forEach((line) => { // print line by line
		//	console.log(line)
		//})
		
		var uCiph = [] // user saved ciphers
		uCiph = userHist[0].split(";") // table header to array (user ciphers from CSV), semicolon separator
		
		// detect cipher.js, load user ciphers
		if (uCiph[0] == "// ciphers.js") {
			var ciph = file.match(/(?<=cipherList = \[)[\s\S]+/m, "") // match after "cipherList = [" till end of file, multiple line regex - [\s\S]+
			file = ciph[0].replace(/(\t|  +|\r|\n)/g, "").slice(10,-1) // remove tabs, consequtive spaces, line breaks - "new cipher" at start, last bracket
			ciph = file.split(",new cipher") // split string into array

			cipherList = []; cCat = []; defaultCipherArray = [] // clear arrays with previously defined ciphers, categories, default ciphers
			for (n = 0; n < ciph.length; n++) {
				cipherList.push(eval("new cipher("+ciph[n].slice(1,-1)+")")) // remove parethesis, evaluate string as javascript code
			}
			document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
			initCalc() // reinit
			updateTables() // update tables
			return
		}

		if (optLoadUserHistCiphers) { // enable ciphers from user CSV file
			disableAllCiphers()
			for (z = 0; z < cipherList.length; z++) { // enable cipher if it is available
				if (uCiph.indexOf(cipherList[z].cipherName) > -1) {
					cipherList[z].enabled = true
				}
			}
		}

		var uPhr = []
		var a = -1 // i > -1 to add all phrases, i > 0 to ignore first line (table header)
		if (uCiph[0] == "Word or Phrase") a = 0 // ignore table header if present


		for (i = userHist.length-1; i > a; i--) { // add lines in reverse order, so you don't have to read backwards
			uPhr = userHist[i].split(";") // user phrase, load as array
			addPhraseToHistory(uPhr[0], false) // load only phrase (first item), false flag doesn't update history
			//addPhraseToHistory(userHist[i], false) // false flag doesn't update history after a new phrase is added
			//console.log(i+": "+userHist[i])
		}
		
		updateTables() // update tables after all lines are added
	}

	reader.onerror = (event) => {
		alert(event.target.error.name)
	};

	reader.readAsText(file) // issue command to start reading file
}

function dragOverHandler(ev) {
	//console.log('File(s) in drop zone')
	ev.preventDefault() // Prevent default drag behavior (Prevent file from being opened)
}

function exportHistoryCSV(arr) {
	if (arr.length == 0) return
	
	var t = ""
	updateEnabledCipherCount()

	// table header (csv format, semicolon as separator)
	if (enabledCiphCount > 0) {
		t = "Word or Phrase"
		for (i = 0; i < cipherList.length; i++) {
			if (cipherList[i].enabled) {
				t += ";"+cipherList[i].cipherName // list of enabled ciphers
			}
		}
		t += "\n" // line break
	}
	
	// table contents
	for (i = 0; i < arr.length; i++) {
		t += arr[i].replace(";", "") // add phrase, remove semicolons (it is a separator)
		for (n = 0; n < cipherList.length; n++) {
			if (cipherList[n].enabled) {
				t += ";"+cipherList[n].calcGematria(arr[i]) // gematria value for each enabled cipher
			}
		}
		if (i+1 < arr.length) t += "\n" // line break, exclude last line
	}
	
	t = 'data:text/plain;charset=utf-8,'+encodeURIComponent(t) // format as text file
	download(getTimestamp()+"_gematria.txt", t); // download file
}

function download(fileName, fileData) {
	var element = document.createElement('a'); // create invisible <a> element
	//element.setAttribute('href', 'data:text/plain;charset=utf-8, '+encodeURIComponent(filedata));

	element.setAttribute('href', fileData)
	element.setAttribute('download', fileName) // <a href=fileData download=fileName>

	document.body.appendChild(element) // add element
	element.click() // click on element to start download
	document.body.removeChild(element) // remove element
}