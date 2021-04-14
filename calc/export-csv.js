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
		
		//userHist.forEach((line) => { // print line by line
		//	console.log(line)
		//})
		
		var uCiph = [] // user saved ciphers
		uCiph = userHist[0].split(";") // table header to array (user ciphers from CSV), semicolon separator

		// detect database export mode
		if (uCiph[0] == "CREATE_GEMATRO_DB") {
			userHist.splice(0,1) // remove the first line
			exportHistoryCSV(userHist, true) // export database
			return
		}
		
		// detect cipher.js, load user ciphers
		if (uCiph[0] == "// ciphers.js") {
			if (dbLoaded) { // return if database is loaded
				alert("Cipher import is disabled!\nReload the page to unload the database.")
				return
			}
			var intHue = file.match(/(?<=interfaceHue = )\d+/) // consecutive digits
			if (intHue !== null) interfaceHue = Number(intHue[0]) // update hue if match is found, use first match

			var ciph = file.match(/(?<=cipherList = \[)[\s\S]+/m) // match after "cipherList = [" till end of file, multiple line regex - [\s\S]+
			file = ciph[0].replace(/(\t|  +|\r|\n)/g, "").slice(10,-1) // remove tabs, consequtive spaces, line breaks - "new cipher" at start, last bracket
			ciph = file.split(",new cipher") // split string into array

			cipherList = []; cCat = []; defaultCipherArray = [] // clear arrays with previously defined ciphers, categories, default ciphers
			for (n = 0; n < ciph.length; n++) {
				cipherList.push(eval("new cipher("+ciph[n].slice(1,-1)+")")) // remove parethesis, evaluate string as javascript code
			}
			document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
			initCalc() // reinit
			updateTables() // update tables
			updateInterfaceHue(true) // update interface color (first run)
			return
		}

		// detect previously exported matches
		if ( uCiph[0] == '======= Same Cipher Match =======' || uCiph[0] == '============ Cross Cipher Match ============' ) {
			var phrMatch
			for (i = userHist.length-1; i > -1; i--) { // add lines in reverse order, so you don't have to read backwards
				phrMatch = userHist[i].match(/^\".+\"/) // grab phrase between a quote in the beginning and the last quote found in line (with quotes)
				if (phrMatch !== null) {
					addPhraseToHistory(phrMatch[0].slice(1,-1), false) // remove quotes, load extracted phrase (first item), false flag doesn't update history
				}
			}
			updateTables() // update tables after all lines are added
			return
		}

		// detect database import
		if ( uCiph[0] == 'GEMATRO_DB' ) {
			// check validity of DB, rearranged/renamed/missing/extra ciphers invalidate the database
			var validDB = false
			if (uCiph.length == cipherList.length+1) { // matching amount of ciphers (+1 table header)
				validDB = true
				for (i = 1; i < uCiph.length; i++) { // compare cipher names
					if (cipherList[i-1].cipherName == uCiph[i]) { // names match, DB is valid
					} else {
						validDB = false // mismatch
						break // exit loop
					}
				}
			}
			if (validDB) {
				userDB = [] // clear previous DB
				var tmp = []
				for (i = 1; i < userHist.length; i++) { // ignore first line (cipher names)
					tmp = userHist[i].split(";") // current line to array, phrase at index 0
					// for (n = 1; n < tmp.length; n++) { tmp[n] = Number(tmp[n]) } // parse as numbers
					// it takes some 5 seconds instead of 1s, maybe better to convert number to string when search is performed
					userDB.push(tmp) // add phrase (no check for duplicates)
				}
				$("#queryDBbtn").removeClass("hideValue") // display query button
				$("#clearDBqueryBtn").removeClass("hideValue") // clear button
				$("#btn-export-db-query").removeClass("hideValue") // export button
				$("#edCiphBtn").addClass("hideValue") // hide "Edit Ciphers"
				closeAllOpenedMenus() // close "Edit Ciphers"
				console.log("Database loaded! ("+userDB.length+" entries)")
				dbLoaded = true // database loaded, disable cipher rearrangement
			} else {
				alert('Ciphers in database are different from ciphers used in calculator!\nFile was not loaded.')
			}
			return
		}

		// continue import of file as CSV history or plain text file
		if (optLoadUserHistCiphers && uCiph[0] == "Word or Phrase") { // switch to ciphers from imported CSV file
			disableAllCiphers()
			for (z = 0; z < cipherList.length; z++) { // enable cipher if it is available
				if (uCiph.indexOf(cipherList[z].cipherName) > -1) {
					cipherList[z].enabled = true
				}
			}
		}

		var uPhr = ''; var plainTxt = true
		var a = -1 // i > -1 to add all phrases, i > 0 to ignore first line (table header)
		if (uCiph[0] == "Word or Phrase") {
			a = 0  // ignore table header if present
			plainTxt = false // use substring to extract phrase from CSV later
		}


		for (i = userHist.length-1; i > a; i--) { // add lines in reverse order, so you don't have to read backwards
			uPhr = userHist[i] // load line, phrase with gematria
			if (!plainTxt) uPhr = uPhr.substring(0, uPhr.indexOf(';')) // CSV, get text before the first semicolon (faster)
			addPhraseToHistory(uPhr, false) // load phrase (first item), false flag doesn't update history
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

function exportHistoryCSV(arr, dbMode = false) {
	if (arr.length == 0) return
	
	var t = ""
	updateEnabledCipherCount()

	// table header (csv format, semicolon as separator)
	if (enabledCiphCount > 0) {
		t = "Word or Phrase"
		if (dbMode) t = "GEMATRO_DB"
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
	if (dbMode) {
		download(getTimestamp()+"_GEMATRO_DB.txt", t); // download database
	} else {
		download(getTimestamp()+"_gematria.txt", t); // download file
	}
}

function exportCurrentDBquery(arr) {
	if (arr.length == 0) return
	
	var t = ""

	// table header (csv format, semicolon as separator)
	t = "Word or Phrase"
	for (i = 0; i < gemArrCiph.length; i++) {
		t += ";"+cipherList[gemArrCiph[i]].cipherName // list of ciphers used in query
	}
	t += "\n" // line break
	
	// table contents
	for (i = 0; i < arr.length; i++) {
		t += arr[i][1].replace(";", "") // add phrase[1], remove semicolons (it is a separator)
		for (n = 2; n < arr[i].length; n++) { // values start at [2]
			t += ";"+arr[i][n] // retrieve gematria value for each cipher
		}
		if (i+1 < arr.length) t += "\n" // line break, exclude last line
	}
	
	t = 'data:text/plain;charset=utf-8,'+encodeURIComponent(t) // format as text file
	download(getTimestamp()+"_gematria_DB_query.txt", t); // download file
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