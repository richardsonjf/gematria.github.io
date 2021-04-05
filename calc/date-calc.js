// ======================== Date Calculator =========================

$(document).ready(function(){
	$("body").on("input", ".dateInput, .dateInputYear", function () {
		// id = $(this).attr('id');
		// val = $(this).val();
		// console.log('id:'+id+' value:'+val);
		offsetYMWD = [0,0,0,0] // reset offset controls
		$('#offsetY').val(0)
		$('#offsetM').val(0)
		$('#offsetW').val(0)
		$('#offsetD').val(0)
		endChkEnabled = true // allow to toggle checkbox
		$('#chkbox_incEndDate').prop("disabled", "")
		if ( $(this).val().length > 0 ) updDates(); // if input not empty
	});
	$("body").on("input", ".offsetDateInput", function () { // if input from add/subtract controls
		offY = Number( $('#offsetY').val() );
		offM = Number( $('#offsetM').val() );
		offW = Number( $('#offsetW').val() );
		offD = Number( $('#offsetD').val() );
		offsetYMWD[0] = offY; // store offset values
		offsetYMWD[1] = offM;
		offsetYMWD[2] = offW;
		offsetYMWD[3] = offD;
		// calculate offset from date 1, years and months first
		saved_d2 = new Date( saved_d1.getFullYear() + offY, saved_d1.getMonth() + offM, saved_d1.getDate());
		if (saved_d2.getDate() !== saved_d1.getDate()) {
			// if January 31st translated to March 3/2, subtract date from itself (3-3 or 2-2) to get February 28/29
			saved_d2 = new Date(saved_d2.getFullYear(), saved_d2.getMonth(), saved_d2.getDate() - saved_d2.getDate())
		}
		// calculate offset for weeks and days
		saved_d2 = new Date( saved_d2.getFullYear(), saved_d2.getMonth(), saved_d2.getDate() + (offW*7) + offD );

		endDate = 0 // exclude end date from calculation (makes no sense for offset mode)
		$('#chkbox_incEndDate').prop("checked", "") // uncheck box
		endChkEnabled = false // don't allow to toggle checkbox
		$('#chkbox_incEndDate').prop("disabled", "disabled")

		updDates(true); // date offset mode
	});
});

var saved_d1 = new Date() // initial value - current system time (today)
var saved_d2 = new Date(saved_d1) // initial value

var reset_d1 = new Date(saved_d1) // values for date reset
var reset_d2 = new Date(saved_d2)

var offsetYMWD = [0,0,0,0] // store values for date offset controls

var endDate = 0 // set to 1 to include end date
var endChkEnabled = true // can checkbox be toggled or not

function updDates(offsetMode = false) { // offsetMode - add/subtract

	// date 1
	var d1 = new Date($('#d1y').val(), $('#d1m').val()-1, $('#d1d').val()) // year, month, date
	saved_d1 = new Date(d1) // save date
	// $('#d1y').val(d1.getFullYear()) // update controls with valid values
	$('#d1m').val(d1.getMonth()+1)
	$('#d1d').val(d1.getDate())
	$('#d1full').text(monthNames(d1.getMonth())+' '+d1.getDate()+', '+d1.getFullYear()) // update date 1

	// date 2
	var d2
	if (!offsetMode) { // date was set by date 2 controls
		d2 = new Date($('#d2y').val(), $('#d2m').val()-1, $('#d2d').val()) // year, month, date
		saved_d2 = new Date(d2) // save date
	} else { // date was calculated (add/subtract controls)
		d2 = new Date(saved_d2) // use precalculated date
		$('#d2y').val(d2.getFullYear()) // update year
	}
	// $('#d2y').val(d2.getFullYear()) // update controls with valid values
	$('#d2m').val(d2.getMonth()+1)
	$('#d2d').val(d2.getDate())
	$('#d2full').text(monthNames(d2.getMonth())+' '+d2.getDate()+', '+d2.getFullYear()) // update date 2

	var d_min = new Date( Math.min(d1,d2) ) // dates used for calculation
	var d_max = new Date( Math.max(d1,d2) )
	d_max.setDate(d_max.getDate() + endDate) // +1 day to include end date if necessary

	// from Date 1 to Date 2 is:
	var o = '<span class="weekDayLabel">'+dayOfWeek(d_min.getDay())+',</span>'+' '
	o += '<span class="dateFullTable2">'+monthNames(d_min.getMonth())+' '+d_min.getDate()+', '+d_min.getFullYear()+'</span>'
	o += '<br>'
	o += dFmt(dayOfYear(d_min))+n_th(dayOfYear(d_min), d_min.getFullYear())+'<span style="font-weight: 400;"> day of the year / <span>'
	o += dFmt(daysLeftInYear(d_min))+'<span style="font-weight: 400;"> days remaining</span>'
	$('#d1full_t2').html(o)

	var o = '<span class="weekDayLabel">'+dayOfWeek(d_max.getDay())+',</span>'+' '
	o += '<span class="dateFullTable2">'+monthNames(d_max.getMonth())+' '+d_max.getDate()+', '+d_max.getFullYear()+'</span>'
	o += '<br>'
	o += dFmt(dayOfYear(d_max))+n_th(dayOfYear(d_max), d_max.getFullYear())+'<span style="font-weight: 400;"> day of the year / <span>'
	o += dFmt(daysLeftInYear(d_max))+'<span style="font-weight: 400;"> days remaining</span>'
	$('#d2full_t2').html(o)

	// date difference
	var YMWD_arr = getYMWDdiff(d_min, d_max) // functions sort dates as well
	var YMD_arr = getYMDdiff(d_min, d_max)
	var YWD_arr = getYWDdiff(d_min, d_max)
	var YD_arr = getYDdiff(d_min, d_max)
	var MWD_arr = getMWDdiff(d_min, d_max)
	var MD_arr = getMDdiff(d_min, d_max)
	var WD_arr = getWDdiff(d_min, d_max)

	$('#diff_YMWD').html( dFmt(YMWD_arr.Y)  + ' years ' + dFmt(YMWD_arr.M) + ' months ' + dFmt(MWD_arr.W) + ' weeks ' + dFmt(YMWD_arr.D) + ' days' )
	$('#diff_YMD').html( dFmt(YMD_arr.Y)  + ' years ' + dFmt(YMD_arr.M) + ' months ' + dFmt(YMD_arr.D) + ' days' )
	$('#diff_YWD').html( dFmt(YWD_arr.Y)  + ' years ' + dFmt(YWD_arr.W) + ' weeks ' + dFmt(YWD_arr.D) + ' days' )
	$('#diff_YD').html( dFmt(YD_arr.Y) + ' years ' + dFmt(YD_arr.D) + ' days' )
	$('#diff_MWD').html( dFmt(MWD_arr.M) + ' months ' + dFmt(MWD_arr.W) + ' weeks ' + dFmt(MWD_arr.D) + ' days' )
	$('#diff_MD').html( dFmt(MD_arr.M) + ' months ' + dFmt(MD_arr.D) + ' days' )
	$('#diff_WD').html( dFmt(WD_arr.W) + ' weeks ' + dFmt(WD_arr.D) + ' days' )
	$('#diff_D').html( dFmt(getDayDiff(d_max, d_min)) + ' days' )
}

function dFmt(val) { // style for numbers
	o = '<span class="durVal">'+val+'</span>'
	return o
}

function n_th(i, yr) { // number ordinal suffix - 1st, 2nd, etc, marked with asterisk on leap year
	var out;
	var j = i % 10
	var k = i % 100
	if (j == 1 && k != 11) {
		// return i + "st"
		out = "st"
	} else if (j == 2 && k != 12) {
		out = "nd"
	} else if (j == 3 && k != 13) {
		out = "rd"
	} else {
		out = "th"
	}
	if (isLeapYear(yr) && i >= 60) out += "*" // February 29th or March 1st
	return out
}

function toggleDateCalcMenu() {
	if (!dateCalcMenuOpened) {
		closeAllOpenedMenus()
		dateCalcMenuOpened = true

		var d2 = new Date(saved_d2) // load previously saved dates
		var d1 = new Date(saved_d1)

		var o = '<div class="dateCalcContainer">'

		// table with date selection
		o += '<table class="dateCalcTable"><tbody>'
		o += '<tr><td colspan=4><span id="d1full"></span></td></tr>' // full date 1

		o += '<tr>' // controls
		o += '<td><input id="d1m" class="dateInput" type="number" step="1" min="0" max="13" value="'+(d1.getMonth()+1)+'"></td>'
		o += '<td><input id="d1d" class="dateInput" type="number" step="1" min="0" max="32" value="'+d1.getDate()+'"></td>'
		o += '<td colspan=2 style="text-align: right;"><input id="d1y" class="dateInputYear" type="number" step="1" min="1" max="9999" value="'+d1.getFullYear()+'"></td>'
		o += '</tr>'

		o += '<tr style="line-height: 0.6em;">' // labels
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Month</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Day</span></td>'
		o += '<td colspan=2 style="padding-bottom: 0.5em;"><span class="dateInputLabel">Year</span></td>'
		o += '</tr>'

		o += '<tr><td colspan=4><span id="d2full"></span></td></tr>' // full date 2

		o += '<tr>' // controls
		o += '<td><input id="d2m" class="dateInput" type="number" step="1" min="0" max="13" value="'+(d2.getMonth()+1)+'"></td>'
		o += '<td><input id="d2d" class="dateInput" type="number" step="1" min="0" max="32" value="'+d2.getDate()+'"></td>'
		o += '<td colspan=2 style="text-align: right;"><input id="d2y" class="dateInputYear" type="number" step="1" min="1" max="9999" value="'+d2.getFullYear()+'"></td>'
		o += '</tr>'

		o += '<tr style="line-height: 0.6em;">' // labels
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Month</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Day</span></td>'
		o += '<td colspan=2 style="padding-bottom: 0.5em;"><span class="dateInputLabel">Year</span></td>'
		o += '</tr>'

		var endCheckedState = ""; var endDisabledState = "";
		if (endDate == 1) endCheckedState = "checked"
		if (!endChkEnabled) endCheckedState = "disabled"
		o += '<tr><td colspan=4 style="padding-bottom: 1.5em;"><input type="checkbox" id="chkbox_incEndDate" onclick="toggleEndDateCalc()" '+endCheckedState+' '+endDisabledState+'><span class="endDateLabel">Include End Date</span></td></tr>'

		// add/subtract date
		o += '<tr>'
		o += '<td colspan=2><span class="dateInputLabel">Add/Subtract</span></td>'
		o += '<td colspan=2><input class="intBtnResetDate" type="button" value="Reset All Dates" onclick="resetDateControls()"></td>'
		o += '</tr>'
		o += '<tr>'
		o += '<td><input id="offsetY" class="offsetDateInput" type="number" step="1" min="-9999" max="9999" value="'+offsetYMWD[0]+'"></td>'
		o += '<td><input id="offsetM" class="offsetDateInput" type="number" step="1" min="-9999" max="9999" value="'+offsetYMWD[1]+'"></td>'
		o += '<td><input id="offsetW" class="offsetDateInput" type="number" step="1" min="-9999" max="9999" value="'+offsetYMWD[2]+'"></td>'
		o += '<td><input id="offsetD" class="offsetDateInput" type="number" step="1" min="-9999999" max="9999999" value="'+offsetYMWD[3]+'"></td>'
		o += '</tr>'
		o += '<tr style="line-height: 0.6em;">' // labels
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Year</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Month</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Week</span></td>'
		o += '<td style="padding-bottom: 0.5em;"><span class="dateInputLabel">Day</span></td>'
		o += '</tr>'

		o += '</tbody></table>'

		// table with difference between dates
		o += '<div class="dateCalcBg">'

		o += '<table class="dateCalcTable2"><tbody>'
		o += '<tr style="line-height: 1em;"><td style="padding-bottom: 0.75em;"><span id="d1full_t2" class="dateDetailsText"></span></td></tr>' // Date 1
		o += '<tr style="line-height: 1em;"><td><span id="d2full_t2" class="dateDetailsText"></span></td></tr>' // Date 2
		o += '<tr><td style="padding: 0em 1em 0em 1em;"><hr class="numPropSeparator"></hr></td></tr>'
		o += '<tr><td><span id="diff_YMWD" class="dateDetailsText"></span></td></tr>'
		o += '<tr><td><span id="diff_YMD" class="dateDetailsText"></span></td></tr>'
		o += '<tr><td><span id="diff_YWD" class="dateDetailsText"></span></td></tr>'
		o += '<tr><td><span id="diff_YD" class="dateDetailsText"></span></td></tr>'
		o += '<tr><td><span id="diff_MWD" class="dateDetailsText"></span></td></tr>'
		o += '<tr><td><span id="diff_MD" class="dateDetailsText"></span></td></tr>'
		o += '<tr><td><span id="diff_WD" class="dateDetailsText"></span></td></tr>'
		o += '<tr><td><span id="diff_D" class="dateDetailsText"></span></td></tr>'
		o += '</tbody></table>'
		
		o += '</div>' // dateCalcBg

		o += '</div>' // dateCalcContainer

		document.getElementById("dateCalcMenuArea").innerHTML = o
		updDates() // update values
	} else {
		document.getElementById("dateCalcMenuArea").innerHTML = "" // close Date Calculator
		dateCalcMenuOpened = false
	}
}

function resetDateControls() {
	saved_d1 = new Date(reset_d1) // initial dates
	$('#d1y').val(saved_d1.getFullYear()) // update date1 controls
	$('#d1m').val(saved_d1.getMonth()+1)
	$('#d1d').val(saved_d1.getDate())

	saved_d2 = new Date(reset_d2)
	$('#d2y').val(saved_d2.getFullYear()) // update date2 controls
	$('#d2m').val(saved_d2.getMonth()+1)
	$('#d2d').val(saved_d2.getDate())

	endChkEnabled = true // allow to toggle checkbox
	$('#chkbox_incEndDate').prop("disabled", "") 
	endDate = 0 // exclude end date from calculation
	$('#chkbox_incEndDate').prop("checked", "") // uncheck box

	offsetYMWD = [0,0,0,0] // reset offset controls
	$('#offsetY').val(0)
	$('#offsetM').val(0)
	$('#offsetW').val(0)
	$('#offsetD').val(0)
	updDates() // update tables, true to reset date 2 controls
}

function toggleEndDateCalc() {
	if (endDate == 0) {
		endDate = 1
	} else {
		endDate = 0
	}
	updDates()
}

function isLeapYear(y) {
	return ( y%4 == 0 && y%100 != 0 ) || y%400 == 0;
}

function monthNames(m) {
	// var mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	return monthArr[m]
}

function dayOfYear(d) {
	tmp = new Date(d.getFullYear()-1, 11, 31) // previous year, Dec 31
	d_of_year = Math.round( (d - tmp) / 86400000 ) // day of the year
	return d_of_year
}

function daysLeftInYear(d) {
	tmp = new Date(d.getFullYear(), 11, 31) // this year, Dec 31
	d_left = Math.round( (tmp - d) / 86400000 ) // remaining days in year
	return d_left
}

function daysInMonth(m, y) { // amount of days in month for given year
	mDaysArr = [31,28,31,30,31,30,31,31,30,31,30,31] // 0 - January
	if ( m == 1 && ( (y%4 == 0 && y%100 != 0) || y%400 == 0 ) ) return 29 // if February on leap year
	return mDaysArr[m]
}

function dayOfWeek(n) {
	var dayArr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
	// var dayArr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	return dayArr[n]
}

function getYMWDdiff(d1, d2) { // year, month, week, day difference
	// console.clear()
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var m_diff = 0
	// if month of smaller date is greater, or if same month but day of smaller date is greater
	if ( d_min.getMonth() > d_max.getMonth() || (d_min.getMonth() == d_max.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // last year is not full
		m_diff = d_max.getMonth() - d_min.getMonth() + 12 // partial year
	} else {
		m_diff = d_max.getMonth() - d_min.getMonth()
	}

	// console.log('d_max.getMonth()-1:'+(d_max.getMonth()-1)+' d_max.getFullYear():'+d_max.getFullYear())
	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var WD_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
		// console.log('dPrevMonth:'+dPrevMonth)
		// console.log('tmp:'+tmp.toDateString()+' d_max:'+d_max.toDateString())
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	WD_diff = getWDdiff(d_max, tmp) // get remaining week, day difference

	return {Y: y_diff, M: m_diff, W: WD_diff.W, D: WD_diff.D} // object
}

function getYMDdiff(d1, d2) { // year, month, day difference
	// console.clear()
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var m_diff = 0
	// if month of smaller date is greater, or if same month but day of smaller date is greater
	if ( d_min.getMonth() > d_max.getMonth() || (d_min.getMonth() == d_max.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // last year is not full
		m_diff = d_max.getMonth() - d_min.getMonth() + 12 // partial year
	} else {
		m_diff = d_max.getMonth() - d_min.getMonth()
	}

	// console.log('d_max.getMonth()-1:'+(d_max.getMonth()-1)+' d_max.getFullYear():'+d_max.getFullYear())
	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var d_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
		// console.log('dPrevMonth:'+dPrevMonth)
		// console.log('tmp:'+tmp.toDateString()+' d_max:'+d_max.toDateString())
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	d_diff = getDayDiff(d_max, tmp) // get remaining day difference

	return {Y: y_diff, M: m_diff, D: d_diff} // object
}

function getYWDdiff(d1, d2) { // year, week, day difference
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var tmp;
	// if month of earlier date is greater or if same month and earlier date has a greater day of month
	if ( d_min.getMonth() > d_max.getMonth() || (d_max.getMonth() == d_min.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // decrement year difference
		// same month, day as d_min - use prev year of d_max, since diff is less than a full year
		tmp = new Date(d_max.getFullYear()-1, d_min.getMonth(), d_min.getDate())
	} else {
		// same month, day as d_min - use year of d_max since diff is more than a full year
		tmp = new Date(d_max.getFullYear(), d_min.getMonth(), d_min.getDate())
	}

	var WD_diff = getWDdiff(d_max, tmp) // get week, day difference
	return {Y: y_diff, W: WD_diff.W, D: WD_diff.D} // object
}

function getYDdiff(d1, d2) { // year, day difference
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	var tmp;
	// if month of earlier date is greater or if same month and earlier date has a greater day of month
	if ( d_min.getMonth() > d_max.getMonth() || (d_max.getMonth() == d_min.getMonth() && d_min.getDate() > d_max.getDate()) ) {
		y_diff-- // decrement year difference
		// same month, day as d_min - use prev year of d_max, since diff is less than a full year
		tmp = new Date(d_max.getFullYear()-1, d_min.getMonth(), d_min.getDate())
	} else {
		// same month, day as d_min - use year of d_max since diff is more than a full year
		tmp = new Date(d_max.getFullYear(), d_min.getMonth(), d_min.getDate())
	}

	var d_diff = getDayDiff(d_max, tmp) // get day difference
	return {Y: y_diff, D: d_diff} // object
}

function getMWDdiff(d1, d2) { // month, week, day difference
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	m_diff = y_diff * 12 // month difference (full years)
	m_diff += d_max.getMonth() - d_min.getMonth() // partial year

	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var WD_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	WD_diff = getWDdiff(d_max, tmp) // get remaining week, day difference

	return {M: m_diff, W: WD_diff.W, D: WD_diff.D} // object
}

function getMDdiff(d1, d2) { // month, day difference
	// console.clear()
	var d_min = new Date( Math.min(d1, d2) ) // earlier date
	var d_max = new Date( Math.max(d1, d2) ) // later date
	var y_diff = d_max.getFullYear() - d_min.getFullYear() // year difference

	m_diff = y_diff * 12 // month difference (full years)
	m_diff += d_max.getMonth() - d_min.getMonth() // partial year

	// console.log('d_max.getMonth()-1:'+(d_max.getMonth()-1)+' d_max.getFullYear():'+d_max.getFullYear())
	var dPrevMonth = daysInMonth(d_max.getMonth()-1, d_max.getFullYear()) // prev month from d_max

	var d_diff; var tmp;
	var prev_date = d_min.getDate(); // last day of previous month

	if ( d_min.getDate() > d_max.getDate() ) { // less than a month
		m_diff-- // last month is not full
		// if current day of month is greater than number of days in previous month, use max available day for prev month
		if ( d_min.getDate() > dPrevMonth ) prev_date = dPrevMonth
		tmp = new Date(d_max.getFullYear(), d_max.getMonth()-1, prev_date) // switch to previous month (d_max)
		// console.log('dPrevMonth:'+dPrevMonth)
		// console.log('tmp:'+tmp.toDateString()+' d_max:'+d_max.toDateString())
	} else { // more than a month
		tmp = new Date(d_max.getFullYear(), d_max.getMonth(), d_min.getDate()) // switch to d_min date for d_max
	}
	d_diff = getDayDiff(d_max, tmp) // get remaining day difference

	return {M: m_diff, D: d_diff} // object
}

function getWDdiff(d1, d2) { // week, day difference
	w_diff = Math.floor( Math.abs(d2-d1) / 604800000) // weeks should use Math.floor()
	d_diff = Math.round( (Math.abs(d2-d1) % 604800000) / 86400000 ) // days should use Math.round()
	return {W: w_diff, D: d_diff} // object
}

function getDayDiff(d1, d2) { // days
	return Math.round( Math.abs(d2-d1) / 86400000 )
}