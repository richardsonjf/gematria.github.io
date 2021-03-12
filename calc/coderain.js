// Matrix code rain (HTML5 canvas)

var height_html = $(window).height();

const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");

// set the width and height of the canvas
const w = canvas.width = document.body.offsetWidth;
const h = canvas.height = height_html;

// draw a plain color rectangle of width and height same as that of the canvas
ctx.fillStyle = "#202020"; // "#202020"
ctx.fillRect(0, 0, w, h);

const cols = Math.floor(w / 14) + 1; // 20px
const ypos = Array(cols).fill(0);

var code_rain; // var to clear interval
var code_rain_active = false; // current state (bugfix for 'Option' menu)
if (!opt_MatrixCodeRain) code_rain_active = true; // if code rain is initially disabled
  
function matrix() {

	// Draw a semitransparent black rectangle on top of previous drawing
	ctx.fillStyle = "#00000010"; // "#0001"
	ctx.shadowColor = "rgba(0,0,0,0)"; // reset blurred shadows for old characters
	ctx.shadowBlur = 0; // reset blurred shadows
	ctx.fillRect(0, 0, w, h);

	// Set color and font in the drawing context
	ctx.fillStyle = "#003300"; // "#004400"
	ctx.font = "bold 15pt matrix-font"; // monospace
	ctx.shadowColor = "rgba(0,255,0,0.2)";
	ctx.shadowBlur = 4;

	//var matrixChars = [48,49,50,51,52,53,54,55,56,57];
	var matrixChars = [97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,48,49,50,51,52,53,54,55,56,57,36,43,45,42,47,61,37,34,39,35,38,95,40,41,44,46,59,58,63,33,92,124,123,125,60,62,91,93,94,126]; // glyphs from matrix font
	var aLen = matrixChars.length;
	
	// for each column put a random character at the end
	ypos.forEach((y, ind) => {
		// generate a random character

		//const text = String.fromCharCode(Math.random() * 128);
		const text = String.fromCharCode(matrixChars[rndInt(0,aLen-1)]);

		// x coordinate of the column, y coordinate is already given
		const x = ind * 14; // 20px
		// render the character at (x, y)
		ctx.fillText(text, x, y);

		// randomly reset the end of the column if it's at least 100px high
		if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
		// otherwise just move the y coordinate for the column 20px down,
		else ypos[ind] = y + 18; // 20px
	});
}

function toggle_code_rain() {
	if (opt_MatrixCodeRain && !code_rain_active) {
		code_rain = setInterval(matrix, 50)
		document.getElementById("canv").style.display = ""
		code_rain_active = true
	} else if (!opt_MatrixCodeRain && code_rain_active) {
		clearInterval(code_rain);
		ctx.fillStyle = "#202020" // static bg
		ctx.fillRect(0, 0, w, h)
		document.getElementById("canv").style.display = "none"
		code_rain_active = false
	}
}

function rndInt(min, max) {  // inclusive
	return Math.floor(Math.random()*(max-min+1)+min);
}

toggle_code_rain(); // check if enabled by default on page load