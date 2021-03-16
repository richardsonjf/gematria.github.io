// Matrix code rain (HTML5 canvas)
				  
var optMatrixCodeRain = false

var code_rain; // var to clear interval
var height_html, canvas, ctx
var w, h, ypos

function initCodeRain() {

	height_html = $(window).height()

	canvas = document.getElementById("canv")
	ctx = canvas.getContext("2d")

	// set the width and height of the canvas
	w = canvas.width = document.body.offsetWidth
	h = canvas.height = height_html

	// draw a plain color rectangle of width and height same as that of the canvas
	ctx.fillStyle = "#161a22" // "#202020"
	ctx.fillRect(0, 0, w, h)

	cols = Math.floor(w / 14) + 1 // 20px
	ypos = Array(cols).fill(0)
}

function matrix() {

	// Draw a semitransparent black rectangle on top of previous drawing
	ctx.fillStyle = "#00000010"
	if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1) { // if not Firefox
		ctx.shadowColor = "rgba(0,0,0,0)" // reset blurred shadows for old characters
		ctx.shadowBlur = 0 // reset blurred shadows
	}
	ctx.fillRect(0, 0, w, h)

	// Set color and font in the drawing context
	ctx.fillStyle = "#002A00" // "#004400"
	ctx.font = "bold 18pt matrix-font" // monospace
	if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1) { // if not Firefox
		ctx.shadowColor = "rgba(0,255,0,0.2)"
		ctx.shadowBlur = 4
	}

	var matrixChars = [97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,
		48,49,50,51,52,53,54,55,56,57,36,43,45,42,47,61,37,34,39,35,38,95,40,41,44,46,59,58,63,33,92,124,123,125,60,62,91,93,94,126]
	var aLen = matrixChars.length // glyphs from matrix font
	
	// for each column put a random character at the end
	ypos.forEach((y, ind) => {

		// choose a random character from array
		text = String.fromCharCode(matrixChars[rndInt(0,aLen-1)])

		// x coordinate of the column, y coordinate is already given
		x = ind * 14 // 20px
		// render the character at (x, y)
		ctx.fillText(text, x, y)

		// randomly reset the end of the column if it's at least 100px high
		if (y > 100 + Math.random() * 10000) ypos[ind] = 0
		// otherwise just move the y coordinate for the column 20px down
		else ypos[ind] = y + 21 // 20px
	});
}

function rndInt(min, max) {  // inclusive
	return Math.floor(Math.random()*(max-min+1)+min)
}

function toggleCodeRain() {
	if (optMatrixCodeRain) {
		optMatrixCodeRain = false
		initCodeRain() // recalculate canvas size
		code_rain = setInterval(matrix, 50)
		document.getElementById("canv").style.display = ""
		return
	} else {
		optMatrixCodeRain = true
		clearInterval(code_rain)
		//ctx.fillStyle = "#161a22" // static bg
		//ctx.fillRect(0, 0, w, h)
		document.getElementById("canv").style.display = "none"
		return
	}
}

toggleCodeRain()