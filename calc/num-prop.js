// ========================= Initialization =========================

var primeNums = [] // list of primes
populatePrimeNumbers(10000000) // 10 million is ~4.98MB, ~300ms
var triangularNums = populateTriangularNumbers(10000000)
var fibonacciNums = populateFibonacciNumbers(10000000)
var starNums = populateStarNumbers(10000000)

// ======================= Number Properties ========================

$(document).ready(function() {

	var showTooltip = function(event) {
		// if (ctrlIsPressed || navigator.maxTouchPoints > 1) { // support for mobile devices
		if (ctrlIsPressed && navigator.maxTouchPoints < 1) { // desktop only
			$('div.numPropTooltip').remove(); // old tooltip
			val = $(this).text().trim() // remove spaces
			$('<div class="numPropTooltip" data-number="'+val+'">'+listNumberProperties(val)+'</div>').appendTo('body');
			changeTooltipPosition(event);
		}
		if (shiftIsPressed && navigator.maxTouchPoints < 1) { // additional properties
			$('div.numPropTooltip').remove(); // old tooltip
			val = $(this).text().trim() // remove spaces
			$('<div class="numPropTooltip" data-number="'+val+'_alt" style="max-width: unset;">'+listNumberPropertiesAlt(val)+'</div>').appendTo('body');
			changeTooltipPosition(event);
		}
	};

	var changeTooltipPosition = function(event, wasClicked = false) {
		if (ctrlIsPressed || shiftIsPressed || wasClicked == true) { // if modifier keys were used or opened with click
			var tW = $('div.numPropTooltip').outerWidth() // tooltip dimensions
			var tH = $('div.numPropTooltip').outerHeight()
			var wndW = $(window).width() // viewport dimensions
			var wndH = $(window).height()
			var viewportW = $(document).scrollLeft() // window scroll position
			var viewportH = $(document).scrollTop()
			var coordX = event.pageX // cursor coordinates
			var coordY = event.pageY
			var tooltipX = 0; var tooltipY = 0; // final tooltip coordinates
			//console.log("X:"+coordX+" Y:"+coordY)

			if (coordX + tW + 8 + 35 < viewportW + wndW) { // X position
				tooltipX = coordX + 8; // follow cursor position
			} else { // if outside of visible viewport
				tooltipX = viewportW + wndW - tW - 35 // display at furthest visible position
			}

			if (coordY + tH + 8 + 35 < viewportH + wndH) { // Y position
				tooltipY = coordY + 8;
			} else {
				tooltipY = viewportH + wndH - tH - 35
			}

			// bottom right corner, out of viewport
			if (coordX + tW + 8 + 35 > viewportW + wndW && coordY + tH + 8 + 35 > viewportH + wndH) {
				tooltipX = event.pageX - tW - 27 // display to the left and above of cursor
				tooltipY = event.pageY - tH - 27
			}

			$('div.numPropTooltip').css({top: tooltipY, left: tooltipX});
		}
		if (navigator.maxTouchPoints > 1) { // for mobile devices
			var tooltipX = event.pageX - 8;
			var tooltipY = event.pageY + 8;
			$('div.numPropTooltip').css({top: tooltipY, left: tooltipX});
		}
	};

	var hideTooltip = function() {
		$('div.numPropTooltip').remove();
	};

	// numbers inside enabled ciphers and history tables
	$("body").on("mouseenter", ".numProp, .gV", showTooltip);
	$("body").on("mousemove", ".numProp, .gV", changeTooltipPosition);
	// $("body").on("mouseleave", ".numProp, .gV", hideTooltip)
	$("body").on("mouseleave", "div.numPropTooltip", hideTooltip);

	var showTooltipClick = function(event) {
		$('div.numPropTooltip').remove(); // old tooltip
		val = $(this).text().trim() // remove spaces
		$('<div class="numPropTooltip" data-number="'+val+'">'+listNumberProperties(val)+'</div>').appendTo('body');
		changeTooltipPosition(event, true); // a click was issued
	}
	var showTooltipClickAlt = function(event) {
		$('div.numPropTooltip').remove(); // old tooltip
		val = $(this).text().trim() // remove spaces
		$('<div class="numPropTooltip" data-number="'+val+'_alt" style="max-width: unset;">'+listNumberPropertiesAlt(val)+'</div>').appendTo('body');
		changeTooltipPosition(event, true);
		return false; // no context menu
	};

	$("body").on("click", ".numProp", showTooltipClick);
	$("body").on("contextmenu", ".numProp", showTooltipClickAlt);

});

function listNumberProperties(val) {
	var dv = getNumDivisors(val) // divisors
	var pf = getNumFactorization(val) // prime factorization

	var o = '<table class="numPropTable"><tbody>'

	o += '<tr><td class="numValLabel">'+val+'</td></tr>'
	o += '<tr><td><hr class="numPropSeparator"></td></tr>'

	o += '<tr><td class="numPropLabel">Prime</td></tr>'
	o += '<tr><td class="npLine">'+getNumProp(val, primeNums)+'</td></tr>'
	o += '<tr><td class="numPropLabel">Fibonacci</td></tr>'
	o += '<tr><td class="npLine">'+getNumProp(val, fibonacciNums)+'</td></tr>'
	o += '<tr><td class="numPropLabel">Triangular</td></tr>'
	o += '<tr><td class="npLine">'+getNumProp(val, triangularNums)+'</td></tr>'
	o += '<tr><td class="numPropLabel">Star</td></tr>'
	o += '<tr><td class="npLine">'+getNumProp(val, starNums)+'</td></tr>'

	o += '<tr><td><hr class="numPropSeparator"></td></tr>'

	o += '<tr><td class="numPropLabel">Numerology</td></tr>'
	o += '<tr><td>'+val+' &#10148; '+reduceNumber(val)+'</td></tr>'

	o += '<tr><td><hr class="numPropSeparator"></td></tr>'

	o += '<tr><td class="numPropLabel">Factorization</td></tr>'
	o += '<tr><td>'+pf[0]
	for (n = 1; n < pf.length; n++) {
	 	o += ' x '+pf[n]
	}
	o += '</td></tr>'
	o += '<tr><td class="numPropLabel">Divisors</td></tr>'
	o += '<tr><td>'+dv[1]
	for (n = 2; n < dv.length; n++) {
	 	o += ', '+dv[n]
	}
	o += '</tr><td><b>'+'&#931;'+'</b>'+' '+dv[0]+' ('+(dv.length-1)+')</td></tr>'

	o += '</tbody></table>'

	return o
}

function listNumberPropertiesAlt(val) {
	var pm = getNumPermutations(val) // number permutations

	var o = '<table class="numPropTable"><tbody>'

	o += '<tr><td colspan=2 class="numValLabel">'+val+'</td></tr>'
	o += '<tr><td colspan=2><hr class="numPropSeparator"></td></tr>'

	o += '<tr><td colspan=2 class="numPropLabel">Number Bases</td><tr>'
	o += '<tr><td><span class="numPropBaseLabel">base2</span></td><td class="numPropBaseValue"><span class="numPropValPad">'+numBaseXtoY(val, 10, 2)+'</span></td></tr>'
	// o += '<tr><td><span class="numPropBaseLabel">base3</span></td><td class="numPropBaseValue"><span class="numPropValPad">'+numBaseXtoY(val, 10, 3)+'</span></td></tr>'
	o += '<tr><td><span class="numPropBaseLabel">base8</span></td><td class="numPropBaseValue"><span class="numPropValPad">'+numBaseXtoY(val, 10, 8)+'</span></td></tr>'
	o += '<tr><td><span class="numPropBaseLabel">base16</span></td><td class="numPropBaseValue"><span class="numPropValPad">'+numBaseXtoY(val, 10, 16)+'</span></td></tr>'
	o += '<tr><td><span class="numPropBaseLabel">base36</span></td><td class="numPropBaseValue"><span class="numPropValPad">'+numBaseXtoY(val, 10, 36)+'</span></td></tr>'
	o += '<tr><td><span class="numPropBaseLabel">base60</span></td><td class="numPropBaseValue"><span class="numPropValPad">'+numBaseXtoY(val, 10, 60, ":")+'</span></td></tr>'
	// o += '<tr><td><span class="numPropBaseLabel">base7 (+1)</span></td><td class="numPropBaseValue"><span class="numPropValPad">'+incEachDigit(numBaseXtoY(val, 10, 7), 1, "-")+'</span></td></tr>'

	o += '<tr><td colspan=2><hr class="numPropSeparator"></td></tr>'

	o += '<tr><td colspan=2 class="numPropLabel">Permutations</td></tr>'
	o += '<tr><td colspan=2 style="max-width: 200px">'+pm[0][0]
	for (n = 1; n < pm[0].length; n++) {
	 	o += ', '+pm[0][n]
	}
	o += '</td></tr>'
	o += '<tr><td colspan=2><b>'+'&#931;'+'</b>'+'<span class="numPropValPad">'+pm[1]+'</span></td></tr>'

	o += '<tr><td colspan=2><hr class="numPropSeparator"></td></tr>'

	o += '<tr><td colspan=2 class="numPropLabel">Roman Numerals</td></tr>'
	o += '<tr><td colspan=2>'+getRomanNumerals(val)+'</td></tr>'

	o += '</tbody></table>'

	return o
}

function getNumProp(val, searchArr) {
	var out = ''; var cur = ''; var prev = 'n/a - '; var next = ' - n/a'; var n_th = '<br><span class="npSmall">&#10095; n/a &#10094;</span>'
	var ind = searchArr.indexOf(parseInt(val)) // integer value

	if (ind > -1) {
		cur = searchArr[ind]+' ('+(ind+1)+')' // find current value in array, display position
	} else {
		cur = 'n/a'
	}

	if (ind > 0) { // use previous item in array if index is valid
		prev = searchArr[ind-1]+' ('+ind+') - '
	} else if (ind !== 0) { // can't be first element
		for (i = 0; i < searchArr.length; i++) { // find number below "val" in array
			if (searchArr[i] > val) {
				if (searchArr[i-1] !== undefined) prev = searchArr[i-1]+' ('+i+') - ' // use previous index if within bounds
				break // end loop
			}
		}
	}

	if (ind !== -1 && searchArr[ind+1] !== undefined) {
		next = ' - '+searchArr[ind+1]+' ('+(ind+2)+')' // use next item in array if match was found
	} else {
		for (i = 0; i < searchArr.length; i++) { // find number above "val" in array
			if (searchArr[i] > val) {
				next = ' - '+searchArr[i]+' ('+(i+1)+')'
				break // end loop
			}
		}
	}

	if (searchArr[parseInt(val)-1] !== undefined) {
		n_th = '<br><span class="npSmall">'+searchArr[parseInt(val)-1]+' ('+parseInt(val)+')</span>'
	}

	out = prev+cur+next+n_th
	return out
}

// ========================== Calculation ===========================

function populateTriangularNumbers(n) { // inclusive - 1,3,6,10
	var arr = []; var tmp = 0; var count = 0
	for (i = 0; i < n-1; i++) {
		tmp = 0; count = 0
		while (count < i+1) { count++; tmp += count; }
		if (tmp <= n) { arr.push(tmp) } else { return arr }
	}
	return arr
}

function populateFibonacciNumbers(n) { // inclusive - 1,1,2,3
	var arr = [1,1]; var tmp = 0
	for (i = 2; i < n; i++) {
		tmp = arr[i-1]+arr[i-2]
		if (tmp <= n) { arr.push(tmp) } else { return arr }
	}
	return arr
}

function populateStarNumbers(n) { // inclusive - 1,13,37,73
	var arr = []; var tmp = 0
	for (i = 1; i < n; i++) {
		tmp = 6*i*(i-1)+1
		if (tmp <= n) { arr.push(tmp) } else { return arr }
	}
	return arr
}

function getNumDivisors(val) { // first element is sum of all divisors
	var i
	if (val == 0 || val >= 10000000) return ["n/a","n/a"]
	var arr = [1]; var sum = 1
	for (i = 2; i <= val; i++) {
		if (val%i == 0) { arr.push(i); sum += i; } // if remainder is zero
	}
	arr.unshift(sum) // sum of all divisors goes first
	return arr
}

function getNumFactorization(val) {
	var i
	if (val < 2 || val >= 10000000) return ["n/a"]
	var arr = []; var p = 0
	for (i = 0; i < primeNums.length; i++) {
		p = primeNums[i] // prime
		if (p <= val) {
			while (val%p == 0) {
				arr.push(p) // add prime factor
				val /= p // continue division
			}
		} else {
			break
		}
	}
	return arr
}

// Find primes using sieve method

var sieve = [] // boolen array for sieving method
var sieve_len = 0 // sieve size
var nextstartindex = 2 // start with wirst prime number 2, sieve[2] represents state of number 2
var currentfalseindex = 0

function populatePrimeNumbers(n) { // inclusive - 2,3,5,7
	sieve = []; primeNums = [] // reinit
	nextstartindex = 2 // start with the first prime number 2, sieve[2] represents state of number 2
	currentfalseindex = 0

	sieve = new Array(n).fill(false) // initialize number sieve, "true" means number was checked and is composite
	sieve[0] = sieve[1] = true // boolean array sieve[x] represents number "x" itself, we start check from first prime "2" or sieve[2]
	sieve_len = n // set sieve length

	// prime seeking function, starts with 2 as prime, checks all 2n, the first number from the start which was not checked is the new prime
	while (getFirstFalseIndexSieve() > -1){ // while "false" (not checked) is found in sieve
		var x = currentfalseindex // x = 2, sieve[x] represents number "x"
		primeNums.push(x) // "x" is prime
		var y = x
		while (y+x <= n){ // while all numbers divisible by "x" are less or equal than "n", mark them as checked,
			y+=x // 2 -> 4,6,8... ; 3 -> 6,9,12...
			sieve[y] = true // mark number as checked (composite)
		}
	}
	sieve = [] // clear sieve
}

function getFirstFalseIndexSieve() { // for prime search
	for (i = nextstartindex; i <= sieve_len; i++) {
		if (!sieve[i]) {
			currentfalseindex = i // save current index, not to check again
			nextstartindex = i + 1 // save nextstartindex, no need to check every time from the start of array
			return i
		}
	}
	return -1 // if cycle is finished and no false values are found
}

function numBaseXtoY (num, x, y, separator = "") { // convert number from one base to another (x <= 16, y = any integer)

	if (num == 0) return num

	var i
	var baseDigits = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f',
	'g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
	var newBase = [] // array for new base digits

	if (x !== 10) { // convert to base10 if necessary
		num_str = num.toString()
		len = num_str.length
		pow = 0 // raise to power
		num = 0
		for (i = 0; i < len; i++) {
			// choose last digit, replace with decimal equivalent from array, multiply result by base raised to power
			num += baseDigits.indexOf(num_str.substring(len-i-1,len-i).toLowerCase()) * Math.pow(x, pow)
			pow++ // increment power for tens, hundrends, etc.
		}
	}

	var remainder = 0
	while (num > 0) { // convert to a different base
		remainder = num%y // modular division by new base
		num = Math.floor(num/y) // round down division result to integer
		newBase.unshift(remainder) // add to the beginning of array
	}

	var out = ""
	if ( (y > 16 && y !== 36) && separator == "") separator = ":" // if no separator was specified for base16+, use colon

	for (i = 0; i < newBase.length; i++) { // join digits (characters)
		if (y <= 16 || y == 36) {
			out += baseDigits[newBase[i]].toUpperCase() + separator
		} else if (y > 16 && y <= 99) {
			out += ("00" + newBase[i]).slice(-2) + separator // leading zeroes
		} else if (y > 100 && y <= 999) {
			out += ("000" + newBase[i]).slice(-3) + separator
		} else {
			out += newBase[i] + separator // no leading zeroes for other cases
		}
	}
	if (separator !== "") out = out.slice(0,-1) // remove last separator if separators were used
	return out
}

function incEachDigit(num, inc, separator = "") { // 314 + 1 -> 425
	var i; var res = ""
	num = num.toString()
	for (i = 0; i < num.length; i++) { // increment each digit
		res += (parseInt(num.substring(i,i+1)) + inc).toString() + separator
	}
	if (separator !== "") res = res.slice(0,-1) // remove last separator if present
	return res
}

function reduceNumber(num) { // digital root of a number
	num = parseInt(num), 10
	var droot = num; var d = 0; var i
	while (num > 9 && num !== 11 && num !== 22 && num !== 33) { // not single digit and not a master number
		droot = 0 // reset droot
		for (i = 0; i < String(num).length; i++) {
			d = Number(String(num).slice(i, i+1))
			droot += d // add all digits one by one
		}
		num = droot
	}
	return droot
}

function getRomanNumerals(num) {
	var i; var res = ""
	if (num == 0 || num >= 4000) return "n/a"
	var roman = [[1000, 'M'],[900, 'CM'],[500, 'D'],
		[400, 'CD'],[100, 'C'],[90, 'XC'],
		[50, 'L'],[40, 'XL'],[10, 'X'],
		[9, 'IX'],[5, 'V'],[4, 'IV'],[1, 'I']]
	for (i = 0; i < roman.length; i++) {
		while ( num >= roman[i][0] ) {
			res += roman[i][1] // append character
			num -= roman[i][0] // subtract found value
		}
	}
	return res;
}

var permutator = (inputArr) => { // list all possible permutations
	let result = [];
	const permute = (arr, m = []) => {
		if (arr.length === 0) {
			result.push(m)
		} else {
			for (let i = 0; i < arr.length; i++) {
				let curr = arr.slice();
				let next = curr.splice(i, 1);
				permute(curr.slice(), m.concat(next))
			}
		}
	}
	permute(inputArr)
	return result;
}

function getNumPermutations(n) {
	if (n == 0 || n >= 10000) return [["n/a"],"n/a"]
	var i, m
	var num = ""; var sum = 0
	var tmp = n.toString().split("") // number to array with separate digits
	tmp = permutator(tmp) // get permutations

	var permArr = [] // unique permutations
	for (i = 0; i < tmp.length; i++) {
		num = "" // reset
		for (m = 0; m < tmp[i].length; m++) {
			num += tmp[i][m] // array to string
		}
		if (permArr.indexOf(num) == -1) {
			permArr.push(num) // add unique permutation
			sum += parseInt(num) // add to total
		}
	}
	permArr = permArr.map(function (e) { return parseInt(e, 10); }) // parse string array as integer array to exclude quotes
	permArr.sort(function(a, b) { return a - b; }) // sort ascending order, "b - a" for descending sort
	return [permArr, sum] // [0] - array with permutations, [1] - total 
}