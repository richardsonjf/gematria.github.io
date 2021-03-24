// ========================== Edit Ciphers ==========================

$(document).ready(function(){

	// click on cipher name in enabled ciphers table to load existing cipher
	$("body").on("click", ".cipherHoverLabel", function () {
		if (editCiphersMenuOpened) { // if menu is opened
			var curCiphName = $(this).html();
			var cID = 0; // current cipher ID
			for (i = 0; i < cipherList.length; i++) { // get cipher ID
				if (cipherList[i].cipherName == curCiphName) { cID = i; break; }
			}
			document.getElementById("custCipherNameInput").value = cipherList[cID].cipherName;
			document.getElementById("custCipherCatInput").value = cipherList[cID].cipherCategory;

			var charsArr = cipherList[cID].cArr; // get cipher charcodes
			var tmp = "";
			for (i = 0; i < charsArr.length; i++) {
				tmp += String.fromCharCode(charsArr[i]);
			}
			document.getElementById("custCipherAlphabet").value = tmp;

			var valsArr = cipherList[cID].vArr; // get cipher values
			tmp = "";
			for (i = 0; i < valsArr.length; i++) {
				tmp += valsArr[i]+",";
			}
			document.getElementById("custCipherGlobVals").value = tmp.slice(0,-1); // remove last comma

			var IDMstate = "";
			if (cipherList[cID].diacriticsAsRegular == true) { // check diacritics flag
				IDMstate = "checked"; // checkbox state
				ignoreDiarciticsCustom = true;
			} else {
				ignoreDiarciticsCustom = false;
			}
			var o = '<input type="checkbox" id="chkbox_IDM" value="" onclick="conf_IDM()" '+IDMstate+'><span class="optionElementLabel">Ignore Diacritical Marks (é=e)</span>';
			document.getElementById("diacrChkbox").innerHTML = o; // update element
			
			createIndLetterControls(); // update
			checkCustCipherName(); // redraw button (add/update)
		}
	});

});

var ignoreDiarciticsCustom = true

function toggleEditCiphersMenu() {

	if (!editCiphersMenuOpened) {

		editCiphersMenuOpened = true
		document.getElementById("editCiphersMenuArea").innerHTML = "" // clear previous table
		
		var o = '<div class="editCiphersContainer">'

		o += '<table class="custCipherMainTable"><tbody>'
		o += '<tr><td style="text-align: center; padding: 0em 1em 1em 0em;"><input id="custCipherNameInput" type="text" autocomplete="off" oninput="checkCustCipherName()" placeholder="Cipher Name"></td>'
		o += '<td style="text-align: center; padding: 0em 0em 1em 0em;"><input id="custCipherCatInput" type="text" autocomplete="off" placeholder="Category"></td></tr>'
		o += '<tr><td colspan=2><input id="custCipherAlphabet" type="text" autocomplete="off" oninput="createIndLetterControls()" placeholder="Characters (abc)"></td></tr>'
		o += '<tr><td colspan=2><textarea id="custCipherGlobVals" type="text" autocomplete="off" oninput="createIndLetterControls()" placeholder="Values (1,2,3)"></textarea></td></tr>'
		o += '</tbody></table>'

		var IDMstate = ""
		if (ignoreDiarciticsCustom) IDMstate = "checked" // checkbox state
		o += '<div id="diacrChkbox"><input type="checkbox" id="chkbox_IDM" value="" onclick="conf_IDM()" '+IDMstate+'><span class="optionElementLabel">Ignore Diacritical Marks (é=e)</span></div>'
		
		o += '<div id="custCipherIndCtrls"></div>' // individual characters controls
		o += '<div id="custCipherButtonArea"><input class="intBtn2" type="button" value="Add New Cipher" onclick="addNewCipherAction()"></div>' // buttons
		o += '</div>'

		document.getElementById("editCiphersMenuArea").innerHTML += o // add element to page
	} else {
		document.getElementById("editCiphersMenuArea").innerHTML = "" // clear
		editCiphersMenuOpened = false
	}
}

function conf_IDM() { // ignore diacritical marks
	ignoreDiarciticsCustom = !ignoreDiarciticsCustom // toggle
	createIndLetterControls() // update
}

function checkCustCipherName() { // redraw add/update cipher button
	var custName = document.getElementById("custCipherNameInput").value.trim() // remove spaces from both ends
	var updFlag = false
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherName == custName) { updFlag = true; break; }
	}

	var o = ""
	if (updFlag) { // cipher exists
		o += '<input class="intBtn2" type="button" value="Update Existing Cipher" onclick="addNewCipherAction()">'
		o += '<input class="intBtn2" type="button" value="Delete Cipher" onclick="deleteCipherAction()">'
		document.getElementById("custCipherButtonArea").innerHTML = o
	} else {
		o += '<input class="intBtn2" type="button" value="Add New Cipher" onclick="addNewCipherAction()">'
		document.getElementById("custCipherButtonArea").innerHTML = o
	}
}

function createIndLetterControls() {
	var alphabet = document.getElementById("custCipherAlphabet").value
	alphabet = alphabet.toLowerCase().replace(/\t/g,"").replace(/ /g,"") // to lowercase, remove tabs and spaces
	if (ignoreDiarciticsCustom) alphabet = alphabet.normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove diacritics
	document.getElementById("custCipherAlphabet").value = alphabet

	var customChars = alphabet.split("") // string to array
	// console.log(JSON.stringify(customChars))

	var alphabetValues = document.getElementById("custCipherGlobVals").value
	alphabetValues = alphabetValues.replace(/\t/g,",").replace(/ /g,",") // replace tabs and spaces with comma
	document.getElementById("custCipherGlobVals").value = alphabetValues

	var customVals = alphabetValues.split(",") // string to array
	if (customVals[0] == "" && customVals.length == 1) {
		customVals = [] // empty array
	} else {
		customVals = customVals.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
	}

	var cur_ciph_index = 0 // index of current of enabled cipher that will be added to the table (total # of ciphers added so far + 1)
	var new_row_opened = false // condition to open new row inside table
	var charsInCurRow = 0 // count ciphers in current row

	var charsInRow = 10

	var o = '<table class="custCipherTable"><tbody>'
	
	var tmpValues = []
	var curCharVal = 0
	for (i = 0; i < customChars.length; i++) {

		
		if (typeof customVals[i] !== 'undefined' && customVals[i] !== "") { // read from array if available
			curCharVal = customVals[i];
		} else {
			curCharVal = i+1 // use default values - 1,2,3...
			if (customVals.length > 0) { customVals.push(curCharVal); } else { customVals = [curCharVal]; } // add value
			tmpValues = JSON.stringify(customVals).slice(1,-1)
			document.getElementById("custCipherGlobVals").value = tmpValues // update box with new value
		}

		cur_ciph_index++
		if (!new_row_opened) { // check if new row has to be opened
			o += '<tr>'
			new_row_opened = true
		}
		var chk = ""
		if (charsInCurRow < charsInRow) { // until number of ciphers in row equals number of columns
			o += '<td><table class="custCharIndTable"><tbody>'
			// o += '<tr><td><span id="custChar'+i+'" class="custCharIndLabel">'+customChars[i]+'</span></td></tr>'
			o += '<tr><td class="custCharIndLabel"><input id="custChar'+i+'" type="text" autocomplete="off" oninput="changeIndLetter('+i+')" class="custCharInd" value="'+customChars[i]+'"></input></td></tr>'
			o += '<tr><td><input id="chVal'+i+'" type="text" autocomplete="off" oninput="changeIndLetterValue('+i+')" class="custCharIndValue" value="'+curCharVal+'"></input></div></center></td></tr>'
			o += '</tbody></table></td>'
			charsInCurRow++
		}
		if (charsInCurRow == charsInRow) { // check if row needs to be closed
			o += '</tr>'
			charsInCurRow = 0 // reset character count
			new_row_opened = false
		}
	}
	o += '</tbody></table>'

	document.getElementById("custCipherIndCtrls").innerHTML = o
}

function changeIndLetterValue(id) { // update char value from individual input box
	// var alphabetLen = document.getElementById("custCipherAlphabet").value.length // get n of chars
	// var valArr = []; var tmpVal = 0;

	// for (i = 0; i < alphabetLen; i++) {
	// 	tmpVal = document.getElementById("chVal"+i+"").value // read values for each char
	// 	valArr.push(parseInt(tmpVal))
	// }

	// var curIdVal = document.getElementById("chVal"+id+"").value // get value for current char
	// valArr[id] = parseInt(curIdVal) // update value for current char

	// tmpVal = JSON.stringify(valArr).slice(1,-1) // convert to string
	// document.getElementById("custCipherGlobVals").value = tmpVal // update box with new values

	var alphabetValues = document.getElementById("custCipherGlobVals").value
	var valArr = alphabetValues.split(",") // string to array
	valArr = valArr.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes

	var curIdVal = document.getElementById("chVal"+id+"").value // get value for current char
	valArr[id] = parseInt(curIdVal) // update value for current char

	tmpVal = JSON.stringify(valArr).slice(1,-1) // convert to string
	document.getElementById("custCipherGlobVals").value = tmpVal // update box with new values
}

function changeIndLetter(id) { // update char from individual box
	var curIdChar = document.getElementById("custChar"+id+"").value.toLowerCase().substring(0,1) // get current char, to lowercase, one char only
	if (ignoreDiarciticsCustom) curIdChar = curIdChar.normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove diacritics

	if (curIdChar !== "") { // if not empty
		document.getElementById("custChar"+id+"").value = curIdChar // replace box with first lowercase character

		var alphabet = document.getElementById("custCipherAlphabet").value
		var customChars = alphabet.split("") // string to array

		customChars[id] = curIdChar // update current char
		tmpChar = JSON.stringify(customChars).slice(1,-1).replace(/\"/g, "").replace(/,/g, "") // convert to string, remove brackets, remove quotes, commas
		document.getElementById("custCipherAlphabet").value = tmpChar // update box with new characters
	}
}

function addNewCipherAction() { // update existing cipher if ID is specified
	var custName = document.getElementById("custCipherNameInput").value.trim()
	// console.log(custName)
	var custCat = document.getElementById("custCipherCatInput").value
	// console.log(custCat)

	var alphabet = document.getElementById("custCipherAlphabet").value
	var charsArr = []; var tmp = 0 // array with charcodes
	alphabet = alphabet.split("")

	for (i = 0; i < alphabet.length; i++) {
		tmp = alphabet[i].replace(/\"/g, "").charCodeAt(0) // remove quotes, get charcode
		charsArr.push(tmp)
	}
	// console.log(charsArr)

	var alphabetValues = document.getElementById("custCipherGlobVals").value
	var valArr = alphabetValues.split(",") // string to array
	valArr = valArr.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
	valArr = valArr.splice(0, charsArr.length) // use assigned values only (remove all extra)
	// console.log(valArr)

	// check if cipher has to be replaced/updated
	var replaceID = -1
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].cipherName == custName) { replaceID = i; break; } // if name matches existing cipher
	}

	var custCipher
	if (replaceID > -1) { // cipher needs to be updated (retain colors)
		custCipher = new cipher(custName, custCat, cipherList[replaceID].H, cipherList[replaceID].S, cipherList[replaceID].L, charsArr, valArr, ignoreDiarciticsCustom, true)
		cipherList[replaceID] = custCipher // replace existing cipher
	} else { // use random colors
		custCipher = new cipher(custName, custCat, rndInt(0, 360), rndInt(30, 68), rndInt(51, 65), charsArr, valArr, ignoreDiarciticsCustom, true)
		cipherList.push(custCipher) // add new cipher
	}

	document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
	initCalc() // reinit
	updateTables() // update tables
}

function deleteCipherAction() {
	var curCiphName = document.getElementById("custCipherNameInput").value.trim() // remove spaces
	for (i = 0; i < cipherList.length; i++) { // get cipher ID
		if (cipherList[i].cipherName == curCiphName) { cipherList.splice(i,1); break; } // remove cipher
	}
	document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
	initCalc() // reinit
	updateTables() // update tables
}