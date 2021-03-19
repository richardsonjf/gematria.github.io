// ============================= Logic ==============================

class cipher { // cipher constructor class
	constructor(ciphName, ciphCategory, col_H, col_S, col_L, ciphCharacterSet, ciphValues, diacriticsAsRegular = true, ciphEnabled = false) {
		this.cipherName = ciphName // cipher name
		this.cipherCategory = ciphCategory // cipher category
		this.H = col_H // hue
		this.S = col_S // saturation
		this.L = col_L // lightness
		this.cArr = ciphCharacterSet // character array
		this.vArr = ciphValues // value array
		this.diacriticsAsRegular = diacriticsAsRegular // if true, characters with diactritic marks have the same value as regular ones
		this.enabled = ciphEnabled // cipher state on/off
		this.cp = []; this.cv = []; this.sumArr = [] // cp - character position, cv - character value, sumArr - phrase gematria value
	}

	calcGematria(gemPhrase) { // calculate gematria of a phrase
		var i, ch_pos, cur_char
		var ch_calc // // charcode for calculation
		var gemValue = 0
		
		for (i = 0; i < gemPhrase.length; i++) {
			cur_char = gemPhrase.charCodeAt(i)

			if (this.diacriticsAsRegular) { // if characters with diacritic marks are treated as regular characters
				// .substring is faster than String.fromCharCode(cur_char)
				// get one current character, remove any diacritic marks, convert to lowercase and get charcode
				ch_calc = gemPhrase.substring(i,i+1).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().charCodeAt(0)
				// console.log(gemPhrase.substring(i,i+1)+" ("+gemPhrase.substring(i,i+1).charCodeAt(0)+
				// 	") -> "+String.fromCharCode(cur_char).normalize('NFD').replace(/[\u0300-\u036f]/g, "")+" ("+String.fromCharCode(cur_char).normalize('NFD').replace(/[\u0300-\u036f]/g, "").charCodeAt(0)+
				// 	") -> "+String.fromCharCode(cur_char).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()+" -> "+String.fromCharCode(cur_char).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().charCodeAt(0) )
			} else {
				ch_calc = gemPhrase.substring(i,i+1).toLowerCase().charCodeAt(0) // formatted charcode (lowercase) - for calculation
				// console.log(gemPhrase.substring(i,i+1)+" ("+gemPhrase.substring(i,i+1).charCodeAt(0)+
				// 	") -> "+String.fromCharCode(cur_char).toLowerCase()+" -> "+String.fromCharCode(cur_char).toLowerCase().charCodeAt(0) )
			}

			ch_pos = this.cArr.indexOf(ch_calc)
			if (ch_pos > -1) { // append value for each found character
				gemValue += this.vArr[ch_pos]
			}
		}

		if (optNumCalcMethod == "Reduced") { // add each digit separately
			for (i = 0; i < gemPhrase.length; i++) {
				cur_char = gemPhrase.charCodeAt(i)
				if (cur_char > 47 && cur_char < 58) { // 48 to 57, 0-9
					gemValue += cur_char - 48
				}
			}
		} else if (optNumCalcMethod == "Full") { // treat consecutive digits as one number
			var cur_num = ""
			var digitArr = [48,49,50,51,52,53,54,55,56,57] // 0-9
			var nArr = [0,1,2,3,4,5,6,7,8,9]
			for (i = 0; i < gemPhrase.length; i++) {
				cur_char = gemPhrase.charCodeAt(i)
				if (digitArr.indexOf(cur_char) > -1) {
					cur_num += String(nArr[digitArr.indexOf(cur_char)]) // append consecutive digits
				} else if (cur_num.length > 0 && cur_char !== 44) { // exclude comma as number separator
					gemValue += Number(cur_num) // add value of the number
					cur_num = "" // reset
				}
			}
			if (cur_num.length > 0) {
				gemValue += Number(cur_num) // add last number if present
			}
		}

		return gemValue
	}
	
	calcBreakdown(gemPhrase) { // character breakdown table
		var i, cIndex, wordSum //
		var lastSpace = true
		var n, nv // n - character for display, nv - charcode for calculation
		
		// character positions, character values, current number (if char is a digit)
		this.cp = []; this.cv = []; this.curNum = ""; this.LetterCount = 0

		this.sumArr = []; wordSum = 0
		for (i = 0; i < gemPhrase.length; i++) {

			n = gemPhrase.charCodeAt(i); // get charcode for each character in phrase

			if (this.diacriticsAsRegular) { // if characters with diacritic marks are treated as regular characters
				nv = gemPhrase.substring(i,i+1).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().charCodeAt(0)
				// console.log(gemPhrase.substring(i,i+1)+" ("+gemPhrase.substring(i,i+1).charCodeAt(0)+
				// 	") -> "+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "")+" ("+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "").charCodeAt(0)+
				// 	") -> "+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()+" -> "+String.fromCharCode(n).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().charCodeAt(0) )
			} else {
				nv = gemPhrase.substring(i,i+1).toLowerCase().charCodeAt(0) // formatted charcode (lowercase) - for calculation
				// console.log(gemPhrase.substring(i,i+1)+" ("+gemPhrase.substring(i,i+1).charCodeAt(0)+
				// 	") -> "+String.fromCharCode(n).toLowerCase()+" -> "+String.fromCharCode(n).toLowerCase().charCodeAt(0) )
			}

			if (n > 47 && n < 58) { // 0-9 digits
				if (optNumCalcMethod == "Full") {
					this.curNum = String(this.curNum) + String(n - 48) // append digits
					if (lastSpace == false) {
						this.cp.push(" ")
						this.cv.push(" ")
						this.sumArr.push(wordSum)
						wordSum = 0
						lastSpace = true
					}
				} else if (optNumCalcMethod == "Reduced") {
					this.cp.push("num" + String(n - 48))
					this.cv.push(n - 48)
					this.curNum = String(n - 48)
					wordSum += n - 48
					lastSpace = false
				}
				
			} else {
				if (optNumCalcMethod == "Full") {
					if (this.curNum.length > 0 & n !== 44) { // character is not "44" comma (digit separator)
						this.cp.push("num" + String(this.curNum), " ")
						this.cv.push(Number(this.curNum), " ")
						this.sumArr.push(Number(this.curNum))
						this.curNum = ""
					}
				}
				
				cIndex = this.cArr.indexOf(nv) // index of current character in phrase inside all character arrays available for current cipher
				if (cIndex > -1) {
					lastSpace = false
					wordSum += this.vArr[cIndex]
					this.cp.push(n)
					this.LetterCount++
					this.cv.push(this.vArr[cIndex])
				} else if (n !== 39 && lastSpace == false) { // 39 = '
					this.sumArr.push(wordSum)
					wordSum = 0
					this.cp.push(" ")
					this.cv.push(" ")
					lastSpace = true
				}
			}
		}
		if (lastSpace == false) {this.sumArr.push(wordSum)} // add number value to phrase gematria
		if (this.curNum !== "") {
			if (optNumCalcMethod == "Full") {
				this.cp.push("num" + String(this.curNum))
				this.cv.push(Number(this.curNum))
				this.sumArr.push(Number(this.curNum)) // value of full number
				if (this.sumArr.length > 1) {
					this.cp.push(" ")
					this.cv.push(" ")
				}
			}
		}
		if (this.sumArr.length > 1 && lastSpace == false) {
			this.cp.push(" ")
			this.cv.push(" ")
		}

		this.WordCount = this.sumArr.length // word count
	}

}