var catArr = []; gemArr = []
var cipherArray = [];
var openCiphers = ["English Ordinal", "Full Reduction", "Reverse Ordinal", "Reverse Full Reduction"]
var ciphersOn = []; allCiphers = []; sHistory = []
var opt_NumCalculation = "Reduced"
var primeArr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 
103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251]
var ignoreArr = [1456, 1457, 1458, 1459, 1460, 1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471, 1472, 1473]

var customvalues = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26] // English Custom
//var customcharset = [];

function Gem_Launch() {
	Set_Categories()
	Build_Ciphers()
}

class cipher {
	constructor(impName, impOrder, impR, impG, impB, impMod1 = "", impMod2 = "", impMod3 = "", impMod4 = "", impMod5 = "") {
		var x, y, xMod
		var impMods = []
		this.cArr = []; this.cArr2 = []; this.cArr3 = []
		this.vArr = []; this.vArr2 = []; this.vArr3 = []
		this.Nickname = impName; this.cp = []; this.cv = []; this.sumArr = []; this.RGB = []
		impMods[0] = impMod1
		impMods[1] = impMod2
		impMods[2] = impMod3
		impMods[3] = impMod4
		impMods[4] = impMod5
		this.RGB = [impR, impG, impB]
		this.R = [impR]
		this.G = [impG]
		this.B = [impB]

		switch (impOrder) {
			case "English":
				for (y = 0; y < 26; y++) {
					this.cArr[y] = (y + 97)
					this.cArr2[y] = (y + 65)
				}
				Build_GemVals(this)
				break;
			case "Jewish":
				this.cArr = [97, 98, 99, 100, 101, 102, 103, 104, 105, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 120, 121, 122, 106, 118, 38, 119]
				this.cArr2 = [65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 88, 89, 90, 74, 86, 38, 87]
				Build_GemVals(this)
				break;
			case "Hebrew G":
				this.cArr = [1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1499, 1500, 1502, 1504, 1505, 1506, 1508, 1510, 1511, 1512, 1513, 1514, 1498, 1501, 1503, 1507, 1509]
				for (y = 0; y < 22; y++) {
					this.vArr.push(y + 1)
				}
				this.vArr[22] = 11; this.vArr[23] = 13; this.vArr[24] = 14; this.vArr[25] = 17; this.vArr[26] = 18
				break;
			case "Hebrew Soffits":
				this.cArr = [1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1499, 1500, 1502, 1504, 1505, 1506, 1508, 1510, 1511, 1512, 1513, 1514, 1498, 1501, 1503, 1507, 1509]
				Build_GemVals(this)
				break;
			case "Greek":
				this.cArr = [913, 914, 915, 916, 917, 988, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 984, 929, 931, 932, 933, 934, 935, 936, 937, 993]
				this.cArr2 = [945, 946, 947, 948, 949, 989, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 985, 961, 963, 964, 965, 966, 967, 968, 969, 993]
				this.cArr3 = [940, 941, 942, 943, 962, 972, 973, 974, 986, 987, 902, 904, 905, 906, 908, 910, 911, 7952, 8000, 8150, 8058, 8166]
				this.vArr3 = [1, 5, 8, 10, 20, 16, 22, 26, 6, 6, 1, 5, 7, 10, 16, 22, 26, 5, 16, 9, 22, 22]
				Build_GemVals(this)
				break;
			case "Greek24":
				this.cArr = [913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937]
				this.cArr2 = [945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 963, 964, 965, 966, 967, 968, 969]
				this.cArr3 = [940, 941, 942, 943, 962, 972, 973, 974, 986, 987, 902, 904, 905, 906, 908, 910, 911, 7952, 8000, 8150, 8058, 8166]
				this.vArr3 = [1, 5, 8, 10, 18, 16, 22, 26, 6, 6, 1, 5, 7, 10, 16, 22, 26, 5, 16, 9, 22, 22]
				Build_GemVals(this)
				break;
			case "Chald":
				for (y = 0; y < 26; y++) {
					this.cArr[y] = (y + 97)
					this.cArr2[y] = (y + 65)
				}
				this.vArr = [1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7]
				this.vArr2 = [1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7]
				break;
			case "Keypad":
				for (y = 0; y < 26; y++) {
					this.cArr[y] = (y + 97)
					this.cArr2[y] = (y + 65)
				}
				this.vArr = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9]
				this.vArr2 = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9]
				break;
			case "Fibonacci":
				for (y = 0; y < 26; y++) {
					this.cArr[y] = (y + 97)
					this.cArr2[y] = (y + 65)
				}
				this.vArr = [1,1,2,3,5,8,13,21,34,55,89,144,233,233,144,89,55,34,21,13,8,5,3,2,1,1]
				this.vArr2 = [1,1,2,3,5,8,13,21,34,55,89,144,233,233,144,89,55,34,21,13,8,5,3,2,1,1]
				break;
			case "Russian":
				this.cArr = [1072,1073,1074,1075,1076,1077,1105,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103]
				this.cArr2 = [1040,1041,1042,1043,1044,1045,1025,1046,1047,1048,1049,1050,1051,1052,1053,1054,1055,1056,1057,1058,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071] // caps
				Build_GemVals(this)
				break;
			case "Korean":
				this.cArr = [12593,12596,12599,12601,12609,12610,12613,12615,12616,12618,12619,12620,12621,12622,12623,12625,12627,12629,12631,12635,12636,12640,12641,12643]
				Build_GemVals(this)
				break;
		}

		if (impMods.indexOf("Exception") > -1) {this.Exception = true}
		if (impMods.indexOf("Reverse") > -1) {this.Reverse_Order()}
		if (impMods.indexOf("SeptenaryNum") > -1) {this.Make_Septenary()}
		if (impMods.indexOf("ALW") > -1) {this.Make_ALW()}
		if (impMods.indexOf("KFW") > -1) {this.Make_KFW()}
		if (impMods.indexOf("LCH") > -1) {this.Make_LCH()}
		if (impMods.indexOf("Bacon") > -1) {this.Make_Bacon()}
		if (impMods.indexOf("Baconis") > -1) {this.Make_Baconis()}
		if (impMods.indexOf("SatanicNum") > -1) {this.Make_Satanic()}
		if (impMods.indexOf("FullReduction") > -1) {this.Reduce_Full()}
		if (impMods.indexOf("SingleReduction") > -1) {this.Reduce_Single()}
		if (impMods.indexOf("Extend") > -1) {this.Extend()}
		if (impMods.indexOf("PrimeNum") > -1) {this.Make_Primes()}
		if (impMods.indexOf("TriangleNum") > -1) {this.Make_Trigonal()}
		if (impMods.indexOf("SquareNum") > -1) {this.Make_Squares()}
		if (impMods.indexOf("SumerianNum") > -1) {this.Make_Sumerian()}
		if (impMods.indexOf("KeyNum") > -1) {this.Make_KeyAlt()}
		if (impMods.indexOf("BaconSimple") > -1) {this.Make_BaconSimple()}
		if (impMods.indexOf("BaconReverse") > -1) {this.Make_BaconReverse()}
		if (impMods.indexOf("BaconShort") > -1) {this.Make_BaconShort()}
		if (impMods.indexOf("BaconKaye") > -1) {this.Make_BaconKaye()}
		if (impMods.indexOf("ModernKaye") > -1) {this.Make_ModernKaye()}
		if (impMods.indexOf("IlluminatiNovice") > -1) {this.Make_IlluminatiNovice()}
		if (impMods.indexOf("IlluminatiReverse") > -1) {this.Make_IlluminatiReverse()}
		if (impMods.indexOf("BeatusOrdinal") > -1) {this.Make_BeatusOrdinal()}
		if (impMods.indexOf("BeatusReduction") > -1) {this.Make_BeatusReduction()}
		if (impMods.indexOf("BeatusExtended") > -1) {this.Make_BeatusExtended()}
		if (impMods.indexOf("RussianE") > -1) {this.Make_RussianE()}
		if (impMods.indexOf("RussianRevE") > -1) {this.Make_RussianRevE()}
		if (impMods.indexOf("EnglishCustom") > -1) {this.Make_CustomCipher()}
		//if (impMods.indexOf("KoreanOrdinal") > -1) {this.Make_KoreanOrdinal()}
	}

	Gematria(impVal, impType, wLink = false, impHistory = false) {
		var cIndex, x, z, tStr, GemTotal
		GemTotal = 0; this.cp = []; this.cv = []
		for (x = 0; x < impVal.length; x++) {
			z = impVal.charCodeAt(x);
			cIndex = this.cArr.indexOf(z)
			if (cIndex > -1) {GemTotal += this.vArr[cIndex]} else {
				cIndex = this.cArr2.indexOf(z)
				if (cIndex > -1) {GemTotal += this.vArr2[cIndex]} else {
					cIndex = this.cArr3.indexOf(z)
					if (cIndex > -1) {GemTotal += this.vArr3[cIndex]}
				}
			}
		}

		if (opt_NumCalculation == "Reduced") {
			for (x = 0; x < impVal.length; x++) {
				z = impVal.charCodeAt(x);
				if (z > 47 && z < 58) {
					GemTotal += z - 48
				}
			}
		} else if (opt_NumCalculation == "Full" || NumberArray() == true) {
			var curNum = ""
			var kArr = [48,49,50,51,52,53,54,55,56,57]
			var nArr = [0,1,2,3,4,5,6,7,8,9]
			for (x = 0; x < impVal.length; x++) {
				z = impVal.charCodeAt(x);
				if (kArr.indexOf(z) > -1)  {
					curNum = String(curNum) + String(nArr[kArr.indexOf(z)])
				} else if (curNum.length > 0 && z !== 44) {
					GemTotal += Number(curNum)
					curNum = ""
				}
			}
			if (curNum.length > 0) {
				GemTotal += Number(curNum)
			}
		}

		if (GemTotal > 999999) {
			return ">1 mil"
		} else if (impType == 1) {
			return GemTotal
		} else {
			if (impHistory == false && GemTotal > 0 && GemTotal < 10000000) {
				if (wLink == true || this.Nickname == breakCipher) {
					tStr = '<a href="javascript:Open_Properties(' + GemTotal + ')" onmouseover="javascript:Populate_Breakdown('
					tStr += "'" + this.Nickname + "', false"
					tStr += ')" onmouseout="Populate_Breakdown()">' + GemTotal + '</a>'
				} else if (wLink == "NoHeader" && impHistory == false) {
					tStr = '<a href="javascript:Populate_Breakdown('
					tStr += "'" + this.Nickname + "', true"
					tStr += ')" onmouseover="javascript:cipherHead_mouseOver('
					tStr += "'" + this.Nickname + "', false"
					tStr += ')" onmouseout="Populate_Breakdown()">' + GemTotal + '</a>'
				} else {
					tStr = GemTotal
				}
			} else {
				tStr = GemTotal
			}

			if (impHistory == false && opt_Reduce == true && GemTotal > 0) {
				tStr += '<font style="font-size: 50%"><BR>' + ReducedNum(GemTotal, true) + '</font>'
			}
			return tStr
		}
	}

	Breakdown(impVal) {
		var x, z, cIndex, wordSum
		var lastSpace = true
		
		this.cp = []; this.cv = []; this.curNum = ""; this.LetterCount = 0

		this.sumArr = []; wordSum = 0
		for (x = 0; x < impVal.length; x++) {

			z = impVal.charCodeAt(x);

			if (z > 47 && z < 58) {
				if (opt_NumCalculation == "Full") {
					this.curNum = String(this.curNum) + String(z - 48)
					if (lastSpace == false) {
						this.cp.push(" ")
						this.cv.push(" ")
						this.sumArr.push(wordSum)
						wordSum = 0
						lastSpace = true
					}
				} else if (opt_NumCalculation == "Reduced") {
					this.cp.push("num" + String(z - 48))
					this.cv.push(z - 48)
					this.curNum = String(z - 48)
					wordSum += z - 48
					lastSpace = false
				}

			} else {
				if (opt_NumCalculation == "Full") {
					if (this.curNum.length > 0 & z !== 44) {
						this.cp.push("num" + String(this.curNum), " ")
						this.cv.push(Number(this.curNum), " ")
						this.sumArr.push(Number(this.curNum))
						this.curNum = ""
					}
				}
				
				if (ignoreArr.indexOf(z) == -1) {
					cIndex = this.cArr.indexOf(z)
					if (cIndex > -1) {lastSpace = false; wordSum += this.vArr[cIndex]; this.cp.push(z); this.LetterCount++; this.cv.push(this.vArr[cIndex])} else {
						cIndex = this.cArr2.indexOf(z)
						if (cIndex > -1) {lastSpace = false; wordSum += this.vArr2[cIndex]; this.cp.push(z); this.LetterCount++; this.cv.push(this.vArr2[cIndex])} else {
							cIndex = this.cArr3.indexOf(z)
							if (cIndex > -1) {lastSpace = false; wordSum += this.vArr3[cIndex]; this.cp.push(z); this.LetterCount++; this.cv.push(this.vArr3[cIndex])
							} else if (z !== 39 && lastSpace == false) {
								this.sumArr.push(wordSum)
								wordSum = 0
								this.cp.push(" ")
								this.cv.push(" ")
								lastSpace = true
							}
						}
					}
				}
			}
		}
		if (lastSpace == false) {this.sumArr.push(wordSum)}
		if (this.curNum !== "") {
			if (opt_NumCalculation == "Full") {
				this.cp.push("num" + String(this.curNum))
				this.cv.push(Number(this.curNum))
				this.sumArr.push(Number(this.curNum))
				if (this.sumArr.length > 1) {this.cp.push(" "); this.cv.push(" ")}
			}
		}
		if (this.sumArr.length > 1 && lastSpace == false) {this.cp.push(" "); this.cv.push(" ")}

		this.WordCount = this.sumArr.length
	}

	Make_Bacon() {
		var tempArr = []
		var tempArr2 = []
		var x
		for (x = 0; x < this.vArr.length; x++) {
			tempArr.push(this.vArr[x])
			tempArr2.push(this.cArr[x])
		}
		for (x = 0; x < this.vArr2.length; x++) {
			tempArr.push(this.vArr2[x] + this.cArr2.length)
			tempArr2.push(this.cArr2[x])
		}
		this.vArr2 = []; this.cArr2 = []
		for (x = 0; x < tempArr.length; x++) {
			this.vArr[x] = tempArr[x]
			this.cArr[x] = tempArr2[x]
		}
	}
	Make_Baconis() {
		var tempArr = []
		var tempArr2 = []
		var x
		for (x = 0; x < this.vArr.length; x++) {
			tempArr.push((this.vArr2[x] * 2) - 1)
			tempArr.push(this.vArr[x] * 2)
			tempArr2.push(this.cArr2[x])
			tempArr2.push(this.cArr[x])
		}
		this.vArr2 = []; this.cArr2 = []
		for (x = 0; x < tempArr.length; x++) {
			this.vArr[x] = tempArr[x]
			this.cArr[x] = tempArr2[x]
		}
	}

	Reverse_Order() {
		this.cArr.reverse()
		this.cArr2.reverse()
	}

	Reduce_Full() {
		var x, tDig

		for (x = 0; x < this.vArr.length; x++) {
			tDig = this.vArr[x]
			while (isReduced(tDig, this.Exception) === false) {
				tDig = ReducedNum(tDig)
			}
			this.vArr[x] = tDig
		}

		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				tDig = this.vArr2[x]
				while (isReduced(tDig, this.Exception) === false) {
					tDig = ReducedNum(tDig)
				}
				this.vArr2[x] = tDig
			}
		}

		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				tDig = this.vArr3[x]
				while (isReduced(tDig, this.Exception) === false) {
					tDig = ReducedNum(tDig)
				}
				this.vArr3[x] = tDig
			}
		}
	}

	Reduce_Single() {
		var x, tDig

		for (x = 0; x < this.vArr.length; x++) {
			tDig = this.vArr[x]
			if (isReduced(tDig, this.Exception) === false) {
				this.vArr[x] = ReducedNum(tDig, false, true)
			}
		}
		for (x = 0; x < this.vArr2.length; x++) {
			tDig = this.vArr2[x]
			if (isReduced(tDig, this.Exception) === false) {
				this.vArr2[x] = ReducedNum(tDig, false, true)
			}
		}
		for (x = 0; x < this.vArr3.length; x++) {
			tDig = this.vArr3[x]
			if (isReduced(tDig, this.Exception) === false) {
				this.vArr3[x] = ReducedNum(tDig, false, true)
			}
		}
	}
	Extend() {
		var tDig, numZero, x
		for (x = 0; x < this.vArr.length; x++) {
			tDig = String(this.vArr[x])
			if (tDig > 9) {numZero = Number(tDig.substring(0, 1))} else {numZero = 0}
			while (tDig > 9) {
				tDig = ReducedNum(tDig, false, true)
				if (tDig > 9) {numZero++}
			}
			this.vArr[x] = tDig * (Math.pow(10, numZero))
		}
		for (x = 0; x < this.vArr2.length; x++) {
			tDig = String(this.vArr2[x])
			if (tDig > 9) {numZero = Number(tDig.substring(0, 1))} else {numZero = 0}
			while (tDig > 9) {
				tDig = ReducedNum(tDig, false, true)
				if (tDig > 9) {numZero++}
			}
			this.vArr2[x] = tDig * (Math.pow(10, numZero))
		}
		for (x = 0; x < this.vArr3.length; x++) {
			tDig = String(this.vArr3[x])
			if (tDig > 9) {numZero = Number(tDig.substring(0, 1))} else {numZero = 0}
			while (tDig > 9) {
				tDig = ReducedNum(tDig, false, true)
				if (tDig > 9) {numZero++}
			}
			this.vArr3[x] = tDig * (Math.pow(10, numZero))
		}
	}
	Fold() {
		var x
		if (this.vArr.length = 26) {
			for (x = 13; x < this.vArr.length; x++) {
				this.vArr[x] = 13 - [x - 13]
			}
			if (this.vArr2.length > 0) {
				if (this.vArr2.length = 26) {
					for (x = 13; x < this.vArr2.length; x++) {
						this.vArr2[x] = 13 - [x - 13]
					}
				}
			}
		}
		if (this.vArr.length = 27) {
			for (x = 14; x < this.vArr.length; x++) {
				this.vArr[x] = 13 - [x - 14]
			}
			if (this.vArr2.length > 0) {
				if (this.vArr2.length = 26) {
					for (x = 14; x < this.vArr2.length; x++) {
						this.vArr2[x] = 13 - [x - 14]
					}
				}
			}
		}
	}
	Make_Satanic() {
		var x
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] += 35
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] += 35
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] += 35
			}
		}
	}
	Make_ALW() {
		this.cArr = [97, 108, 119, 104, 115, 100, 111, 122, 107, 118, 103, 114, 99, 110, 121, 106, 117, 102, 113, 98, 109, 120, 105, 116, 101, 112]
		this.cArr2 = [65, 76, 87, 72, 83, 68, 79, 90, 75, 86, 71, 82, 67, 78, 89, 74, 85, 70, 81, 66, 77, 88, 73, 84, 69, 80]
	}
	Make_KFW() {
		this.cArr = [107, 102, 119, 114, 109, 100, 121, 116, 97, 118, 113, 104, 99, 120, 111, 106, 101, 108, 103, 98, 115, 110, 105, 122, 117, 112]
		this.cArr2 = [75, 70, 87, 82, 77, 68, 89, 84, 65, 86, 81, 72, 67, 88, 79, 74, 69, 76, 71, 66, 83, 78, 73, 90, 85, 80]
	}
	Make_LCH() {
		var x
		this.cArr = [105, 108, 99, 104, 112, 97, 120, 106, 119, 116, 111, 103, 102, 101, 114, 115, 113, 107, 121, 122, 98, 109, 118, 100, 110, 117]
		this.cArr2 = [73, 76, 67, 72, 80, 65, 88, 74, 87, 84, 79, 71, 70, 69, 82, 83, 81, 75, 89, 90, 66, 77, 86, 68, 78, 85]
		for (x = 0; x < this.cArr.length; x++) {
			this.vArr[x] = x
			this.vArr2[x] = x
		}
	}
	Make_Primes() {
		var x
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] = primeArr[this.vArr[x] - 1]
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] = primeArr[this.vArr2[x] - 1]
			}
		}
		if (this.vArr3.length > 0) { 
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] = primeArr[this.vArr3[x] - 1]
			}
		}
	}
	Make_Trigonal() {
		var x
		this.vArr[0] = 1
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] = this.vArr[x] * (this.vArr[x] + 1) / 2
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] = this.vArr2[x] * (this.vArr2[x] + 1) / 2
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] = this.vArr3[x] * (this.vArr3[x] + 1) / 2
			}
		}
	}
	Make_Squares() {
		var x
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] = this.vArr[x] * this.vArr[x]
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] = this.vArr2[x] * this.vArr2[x]
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] = this.vArr3[x] * this.vArr3[x]
			}
		}
	}
	Make_Sumerian() {
		var x
		for (x = 0; x < this.vArr.length; x++) {
			this.vArr[x] = this.vArr[x] * 6
		}
		if (this.vArr2.length > 0) {
			for (x = 0; x < this.vArr2.length; x++) {
				this.vArr2[x] = this.vArr2[x] * 6
			}
		}
		if (this.vArr3.length > 0) {
			for (x = 0; x < this.vArr3.length; x++) {
				this.vArr3[x] = this.vArr3[x] * 6
			}
		}
	}
	Make_Septenary() {
		this.vArr = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1]
		if (this.vArr2.length > 0) {
			this.vArr2 = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1]
		}
	}
	Make_KeyAlt() {
		this.vArr = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 0, 7, 7, 8, 8, 8, 9, 9, 9, 0]
		this.vArr2 = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 0, 7, 7, 8, 8, 8, 9, 9, 9, 0]
	}
	Make_BaconSimple() {
		this.vArr = [1,2,3,4,5,6,7,8,9,9,10,11,12,13,14,15,16,17,18,19,20,20,21,22,23,24]
		this.vArr2 = [1,2,3,4,5,6,7,8,9,9,10,11,12,13,14,15,16,17,18,19,20,20,21,22,23,24]
	}
	Make_BaconReverse() {
		this.vArr = [24,23,22,21,20,19,18,17,16,16,15,14,13,12,11,10,9,8,7,6,5,5,4,3,2,1]
		this.vArr2 = [24,23,22,21,20,19,18,17,16,16,15,14,13,12,11,10,9,8,7,6,5,5,4,3,2,1]
	}
	Make_BaconShort() {
		this.vArr = [1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6]
		this.vArr2 = [1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,1,2,2,3,4,5,6]
	}
	Make_BaconKaye() {
		this.vArr = [27,28,29,30,31,32,33,34,35,35,10,11,12,13,14,15,16,17,18,19,20,20,21,22,23,24]
		this.vArr2 = [27,28,29,30,31,32,33,34,35,35,10,11,12,13,14,15,16,17,18,19,20,20,21,22,23,24]
	}
	Make_ModernKaye() {
		this.vArr = [27,28,29,30,31,32,33,34,35,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
		this.vArr2 = [27,28,29,30,31,32,33,34,35,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
	}
	Make_IlluminatiNovice() {
		this.vArr = [12,11,10,9,8,7,6,5,4,4,3,2,1,13,14,15,16,17,18,19,20,20,21,22,23,24]
		this.vArr2 = [12,11,10,9,8,7,6,5,4,4,3,2,1,13,14,15,16,17,18,19,20,20,21,22,23,24]
	}
	Make_IlluminatiReverse() {
		this.vArr = [24,23,22,21,20,19,18,17,16,16,15,14,13,1,2,3,4,5,6,7,8,8,9,10,11,12]
		this.vArr2 = [24,23,22,21,20,19,18,17,16,16,15,14,13,1,2,3,4,5,6,7,8,8,9,10,11,12]
	}
	Make_BeatusOrdinal() {
		this.vArr = [1,2,3,4,5,6,7,8,9,9,10,11,12,13,14,15,16,17,18,19,20,20,20,21,22,23]
		this.vArr2 = [1,2,3,4,5,6,7,8,9,9,10,11,12,13,14,15,16,17,18,19,20,20,20,21,22,23]
	}
	Make_BeatusReduction() {
		this.vArr = [1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,1,2,2,2,3,4,5]
		this.vArr2 = [1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,1,2,2,2,3,4,5]
	}
	Make_BeatusExtended() {
		this.vArr = [1,2,3,4,5,6,7,8,9,9,10,20,30,40,50,60,70,80,90,100,200,200,200,300,400,500]
		this.vArr2 = [1,2,3,4,5,6,7,8,9,9,10,20,30,40,50,60,70,80,90,100,200,200,200,300,400,500]
	}
	Make_RussianE() {
		this.vArr = [1,2,3,4,5,6,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]
		this.vArr2 = [1,2,3,4,5,6,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]
	}
	Make_RussianRevE() {
		this.vArr = [33,32,31,30,29,28,28,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]
		this.vArr2 = [33,32,31,30,29,28,28,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]
	}
	Make_CustomCipher() {
		// if array is empty, populate it with Ordinal values
		this.vArr = customvalues
		this.vArr2 = customvalues
	}

}

function Build_GemVals(impCipher) {
	var x
	for (x = 0; x < impCipher.cArr.length; x++) {
		impCipher.vArr[x] = (x + 1)
	}
	if (impCipher.cArr2.length > 0) {
		for (x = 0; x < impCipher.cArr2.length; x++) {
			impCipher.vArr2[x] = (x + 1)
		}
	}
}

function Populate_Sums(impVal) {
	var x, gSum
	gemArr = []

	for (x = 0; x < ciphersOn.length; x++) {
		gemArr[x] = ciphersOn[x].Gematria(impVal, 1)
		if (opt_Headers == true) {
			gSum = ciphersOn[x].Gematria(impVal, 2, true)
		} else {
			gSum = ciphersOn[x].Gematria(impVal, 2, "NoHeader")
		}
		document.getElementById(ciphersOn[x].Nickname + "_Sum").innerHTML = gSum
	}
}

function Open_Properties(impNum) {
	if (impNum > 0 && impNum < 10000000) {
		window.open("http://www.gematrinator.com/calculator/numberProperties.php?Number=" + impNum, "Properties of " + impNum, "height=480,width=750")
	}
}

function GetTriangular(impNum) {
	var x
	x = (impNum * (impNum + 1) / 2)
	return x
}

function ReducedNum(impNum, impBool = false, impSingle = false) {
	var x, s
	var cn = 0
	var x, cn

	if (impSingle == true) {
		for (x = 0; x < String(impNum).length; x++) {
			s = Number(String(impNum).slice(x, x + 1))
			cn += s
		}
		return cn
	}

	while (impNum > 9) {
		if (impBool == true) {
			if (impNum == 11 || impNum == 22 || impNum == 33) {
				return impNum
			}
		}
		cn = 0
		for (x = 0; x < String(impNum).length; x++) {
			s = Number(String(impNum).slice(x, x + 1))
			cn += s
		}
		impNum = cn
	}

	return impNum
}
function isReduced(impNum, impOpt = false) {
	if (impNum < 10) {
		return true
	} else if (impOpt === true) {
		if (impNum === 11 || impNum === 22 || impNum === 33) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}
			
function Build_Ciphers() {
	var key

	for (key in cipherArray) {
		switch (key) {
			case "Full Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 88, 125, 254, "FullReduction"); break;
			case "Single Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 140, 171, 227, "SingleReduction"); break;
			case "Full Reduction KV": allCiphers[allCiphers.length] = new cipher(key, "English", 97, 195, 244, "FullReduction", "Exception"); break;
			case "Single Reduction KV": allCiphers[allCiphers.length] = new cipher(key, "English", 70, 175, 244, "SingleReduction", "Exception"); break;
			case "English Ordinal": allCiphers[allCiphers.length] = new cipher(key, "English", 0, 186, 0); break;
			case "English Extended": allCiphers[allCiphers.length] = new cipher(key, "English", 218, 226, 0, "Extend"); break;
			case "Francis Bacon": allCiphers[allCiphers.length] = new cipher(key, "English", 150, 244, 77, "Bacon"); break;
			case "Franc Baconis": allCiphers[allCiphers.length] = new cipher(key, "English", 93, 187, 88, "Baconis"); break;
			case "Satanic": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 0, 0, "SatanicNum"); break;

			case "Reverse Full Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 100, 226, 226, "Reverse", "FullReduction"); break;
			case "Reverse Single Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 100, 216, 209, "Reverse", "SingleReduction"); break;
			case "Reverse Full Reduction EP": allCiphers[allCiphers.length] = new cipher(key, "English", 101, 224, 194, "Reverse", "FullReduction", "Exception"); break;
			case "Reverse Single Reduction EP": allCiphers[allCiphers.length] = new cipher(key, "English", 110, 226, 156, "Reverse", "SingleReduction", "Exception"); break;
			case "Reverse Ordinal": allCiphers[allCiphers.length] = new cipher(key, "English", 80, 235, 21, "Reverse"); break;
			case "Reverse Extended": allCiphers[allCiphers.length] = new cipher(key, "English", 253, 255, 119, "Reverse", "Extend"); break;
			case "Reverse Francis Bacon": allCiphers[allCiphers.length] = new cipher(key, "English", 163, 255, 88, "Reverse", "Bacon"); break;
			case "Reverse Franc Baconis": allCiphers[allCiphers.length] = new cipher(key, "English", 111, 193, 121, "Reverse", "Baconis"); break;
			case "Reverse Satanic": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 51, 51, "Reverse", "SatanicNum"); break;

			case "Jewish Reduction": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction"); break;
			case "Jewish Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 154, 121, 227); break;
			case "Jewish": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 153, 102, 255, "Extend"); break;
			//case "Reverse Jewish": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 153, 102, 255, "Reverse", "Extend"); break;

			case "ALW Kabbalah": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 64, 0, "ALW"); break;
			case "KFW Kabbalah": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 88, 0, "KFW"); break;
			case "LCH Kabbalah": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 93, 73, "LCH"); break;

			case "English Sumerian": allCiphers[allCiphers.length] = new cipher(key, "English", 169, 208, 142, "SumerianNum"); break;
			case "Reverse English Sumerian": allCiphers[allCiphers.length] = new cipher(key, "English", 220, 208, 148, "Reverse", "SumerianNum"); break;
			case "Primes": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 204, 111, "PrimeNum"); break;
			case "Trigonal": allCiphers[allCiphers.length] = new cipher(key, "English", 231, 180, 113, "TriangleNum"); break;
			case "Squares": allCiphers[allCiphers.length] = new cipher(key, "English", 228, 216, 96, "SquareNum"); break;
			case "Reverse Primes": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 209, 145, "Reverse", "PrimeNum"); break;
			case "Reverse Trigonal": allCiphers[allCiphers.length] = new cipher(key, "English", 238, 191, 112, "Reverse", "TriangleNum"); break;
			case "Reverse Squares": allCiphers[allCiphers.length] = new cipher(key, "English", 240, 225, 112, "Reverse", "SquareNum"); break;

			case "Septenary": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 153, 77, "SeptenaryNum"); break;
			case "Chaldean": allCiphers[allCiphers.length] = new cipher(key, "Chald", 166, 166, 99); break;
			case "Keypad": allCiphers[allCiphers.length] = new cipher(key, "Keypad", 255, 126, 255); break;
			case "Fibonacci": allCiphers[allCiphers.length] = new cipher(key, "Fibonacci", 233, 202, 148); break;
			//case "Telephone-No QZ": allCiphers[allCiphers.length] = new cipher(key, "Telephone", 255, 153, 255, "PhoneNum"); break;

			case "Hebrew Reduction": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "FullReduction"); break;
			case "Hebrew Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 209, 36); break;
			case "Hebrew Gematria": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 227, 93, "Extend"); break;
			case "Hebrew Soffits": allCiphers[allCiphers.length] = new cipher(key, "Hebrew Soffits", 255, 251, 156, "Extend"); break;

			/*case "Hebrew Primes": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "PrimeNum"); break;
			case "Hebrew Trigonal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "TriangleNum"); break;
			case "Hebrew Squares": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "SquareNum"); break;

			case "Hebrew Reverse Reduction": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "FullReduction", "Reverse"); break;
			case "Hebrew Reverse Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 209, 36, "Reverse"); break;
			case "Hebrew Reverse Gematria": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 227, 93, "Extend", "Reverse"); break;
			case "Hebrew Reverse Soffits": allCiphers[allCiphers.length] = new cipher(key, "Hebrew Soffits", 255, 251, 156, "Extend", "Reverse"); break;

			case "Hebrew Reverse Primes": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "PrimeNum", "Reverse"); break;
			case "Hebrew Reverse Trigonal": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "TriangleNum", "Reverse"); break;
			case "Hebrew Reverse Squares": allCiphers[allCiphers.length] = new cipher(key, "Hebrew G", 255, 189, 2, "SquareNum", "Reverse"); break;
*/
			case "Greek Reduction": allCiphers[allCiphers.length] = new cipher(key, "Greek", 156, 201, 171, "FullReduction"); break;
			case "Greek Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Greek", 149, 199, 139); break;
			case "Greek Isopsephy": allCiphers[allCiphers.length] = new cipher(key, "Greek", 139, 200, 163, "Extend"); break;
			case "Greek Ordinal 24": allCiphers[allCiphers.length] = new cipher(key, "Greek24", 200, 200, 40); break;

			/*case "Jewish Reduction Prime": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction", "PrimeNum"); break;
			case "Jewish Reduction Trigonal": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction", "TriangleNum"); break;
			case "Jewish Reduction Square": allCiphers[allCiphers.length] = new cipher(key, "Jewish", 159, 99, 197, "FullReduction", "SquareNum"); break
*/
			case "RU Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Russian", 0, 186, 0); break;
			case "RU Extended": allCiphers[allCiphers.length] = new cipher(key, "Russian", 218, 226, 0, "Extend"); break;
			case "RU Full Reduction": allCiphers[allCiphers.length] = new cipher(key, "Russian", 88, 125, 254, "FullReduction"); break;
			case "RU Single Reduction": allCiphers[allCiphers.length] = new cipher(key, "Russian", 140, 171, 227, "SingleReduction"); break;
			case "RU Sumerian": allCiphers[allCiphers.length] = new cipher(key, "Russian", 169, 208, 142, "SumerianNum"); break;

			case "RU Reverse Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Russian", 80, 235, 21, "Reverse"); break;
			case "RU Reverse Extended": allCiphers[allCiphers.length] = new cipher(key, "Russian", 253, 255, 119, "Reverse", "Extend"); break;
			case "RU Reverse Full Reduction": allCiphers[allCiphers.length] = new cipher(key, "Russian", 100, 226, 226, "Reverse", "FullReduction"); break;
			case "RU Reverse Single Reduction": allCiphers[allCiphers.length] = new cipher(key, "Russian", 100, 216, 209, "Reverse", "SingleReduction"); break;
			case "RU Reverse Sumerian": allCiphers[allCiphers.length] = new cipher(key, "Russian", 220, 208, 148, "Reverse", "SumerianNum"); break;
			
			// case "RU Ordinal E": allCiphers[allCiphers.length] = new cipher(key, "Russian", 0, 128, 0, "RussianE"); break;
			// case "RU Reverse Ordinal E": allCiphers[allCiphers.length] = new cipher(key, "Russian", 80, 160, 20, "RussianRevE"); break;
			
			case "Bacon Simple": allCiphers[allCiphers.length] = new cipher(key, "English", 80, 235, 21, "BaconSimple"); break;
			case "Bacon Reverse": allCiphers[allCiphers.length] = new cipher(key, "English", 0, 186, 0, "BaconReverse"); break;
			case "Bacon Short": allCiphers[allCiphers.length] = new cipher(key, "English", 100, 216, 209, "BaconShort"); break;
			case "Bacon Kaye": allCiphers[allCiphers.length] = new cipher(key, "English", 220, 93, 73, "BaconKaye"); break;
			case "Modern Kaye": allCiphers[allCiphers.length] = new cipher(key, "English", 230, 153, 163, "ModernKaye"); break;
			case "Illuminati Novice": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 255, 29, "IlluminatiNovice"); break;
			case "Illuminati Reverse": allCiphers[allCiphers.length] = new cipher(key, "English", 255, 189, 2, "IlluminatiReverse"); break;
			case "Beatus of Liebana": allCiphers[allCiphers.length] = new cipher(key, "English", 148, 0, 211, "BeatusExtended"); break;
			case "Beatus Reduction": allCiphers[allCiphers.length] = new cipher(key, "English", 153, 50, 204, "BeatusReduction"); break;
			case "Beatus Ordinal": allCiphers[allCiphers.length] = new cipher(key, "English", 186, 85, 211, "BeatusOrdinal"); break;
			
			case "English Custom": allCiphers[allCiphers.length] = new cipher(key, "English", 224, 224, 32, "EnglishCustom"); break;
			
			case "KR Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Korean", 0, 186, 0); break;
			case "KR Reverse Ordinal": allCiphers[allCiphers.length] = new cipher(key, "Korean", 80, 235, 21, "Reverse"); break;

		}
	}

	Build_Open_Ciphers()
}

function Set_Categories() {
	catArr = ["English", "English (Special)", "Reverse", "Jewish", "Kabbalah", "Mathematical", "Other", "Foreign", "Russian", "Korean", "Custom"]

	cipherArray["English Ordinal"] = "English"
	cipherArray["Full Reduction"] = "English"
	cipherArray["Single Reduction"] = "English"
	cipherArray["Full Reduction KV"] = "English"
	cipherArray["Single Reduction KV"] = "English"
	cipherArray["English Extended"] = "English"
	cipherArray["Francis Bacon"] = "English"
	cipherArray["Franc Baconis"] = "English"
	cipherArray["Satanic"] = "English"

	cipherArray["Reverse Ordinal"] = "Reverse"
	cipherArray["Reverse Full Reduction"] = "Reverse"
	cipherArray["Reverse Single Reduction"] = "Reverse"
	cipherArray["Reverse Full Reduction EP"] = "Reverse"
	cipherArray["Reverse Single Reduction EP"] = "Reverse"
	cipherArray["Reverse Extended"] = "Reverse"
	cipherArray["Reverse Francis Bacon"] = "Reverse"
	cipherArray["Reverse Franc Baconis"] = "Reverse"
	cipherArray["Reverse Satanic"] = "Reverse"

	cipherArray["Jewish Reduction"] = "Jewish"
	cipherArray["Jewish Ordinal"] = "Jewish"	
	cipherArray["Jewish"] = "Jewish"
	//cipherArray["Reverse Jewish"] = "Jewish"
	//cipherArray["Jewish Reduction Prime"] = "Jewish"
	//cipherArray["Jewish Reduction Trigonal"] = "Jewish"
	//cipherArray["Jewish Reduction Square"] = "Jewish"

	cipherArray["ALW Kabbalah"] = "Kabbalah"
	cipherArray["KFW Kabbalah"] = "Kabbalah"
	cipherArray["LCH Kabbalah"] = "Kabbalah"

	cipherArray["English Sumerian"] = "Mathematical"
	cipherArray["Reverse English Sumerian"] = "Mathematical"
	cipherArray["Primes"] = "Mathematical"
	cipherArray["Trigonal"] = "Mathematical"
	cipherArray["Squares"] = "Mathematical"
	cipherArray["Reverse Primes"] = "Mathematical"
	cipherArray["Reverse Trigonal"] = "Mathematical"
	cipherArray["Reverse Squares"] = "Mathematical"

	cipherArray["Septenary"] = "Other"
	cipherArray["Chaldean"] = "Other"
	cipherArray["Keypad"] = "Other"
	cipherArray["Fibonacci"] = "Other"
	//cipherArray["Telephone-No QZ"] = "Other"

	cipherArray["Hebrew Reduction"] = "Foreign"
	cipherArray["Hebrew Ordinal"] = "Foreign"
	cipherArray["Hebrew Gematria"] = "Foreign"
	cipherArray["Hebrew Soffits"] = "Foreign"

	/*cipherArray["Hebrew Primes"] = "Foreign"
	cipherArray["Hebrew Trigonal"] = "Foreign"
	cipherArray["Hebrew Squares"] = "Foreign"
	cipherArray["Hebrew Reverse Reduction"] = "Foreign"
	cipherArray["Hebrew Reverse Ordinal"] = "Foreign"
	cipherArray["Hebrew Reverse Gematria"] = "Foreign"
	cipherArray["Hebrew Reverse Soffits"] = "Foreign"
	cipherArray["Hebrew Reverse Primes"] = "Foreign"
	cipherArray["Hebrew Reverse Trigonal"] = "Foreign"
	cipherArray["Hebrew Reverse Squares"] = "Foreign"*/
	
	cipherArray["Greek Reduction"] = "Foreign"
	cipherArray["Greek Ordinal"] = "Foreign"
	cipherArray["Greek Isopsephy"] = "Foreign"
	cipherArray["Greek Ordinal 24"] = "Foreign"
	
	cipherArray["RU Ordinal"] = "Russian"
	cipherArray["RU Full Reduction"] = "Russian"
	cipherArray["RU Single Reduction"] = "Russian"
	cipherArray["RU Sumerian"] = "Russian"

	cipherArray["RU Reverse Ordinal"] = "Russian"
	cipherArray["RU Reverse Full Reduction"] = "Russian"
	cipherArray["RU Reverse Single Reduction"] = "Russian"
	cipherArray["RU Reverse Sumerian"] = "Russian"
	
	cipherArray["RU Extended"] = "Russian"
	cipherArray["RU Reverse Extended"] = "Russian"

	// cipherArray["RU Ordinal E"] = "Russian"
	// cipherArray["RU Reverse Ordinal E"] = "Russian"
	
	cipherArray["Bacon Simple"] = "English (Special)"
	cipherArray["Bacon Reverse"] = "English (Special)"
	cipherArray["Bacon Short"] = "English (Special)"
	cipherArray["Bacon Kaye"] = "English (Special)"
	cipherArray["Modern Kaye"] = "English (Special)"
	cipherArray["Illuminati Novice"] = "English (Special)"
	cipherArray["Illuminati Reverse"] = "English (Special)"
	cipherArray["Beatus of Liebana"] = "English (Special)"
	cipherArray["Beatus Reduction"] = "English (Special)"
	cipherArray["Beatus Ordinal"] = "English (Special)"
	
	cipherArray["KR Ordinal"] = "Korean"
	cipherArray["KR Reverse Ordinal"] = "Korean"
	
	cipherArray["English Custom"] = "Custom"
	

}

function Add_Cipher(impName, impBool = true) {
	var x, q

	q = 0
	for (x = 0; x < allCiphers.length; x++) {
		if (allCiphers[x].Nickname == impName) {
			openCiphers.splice(q, 0, impName)
		} else if (openCiphers.indexOf(allCiphers[x].Nickname) > -1) {
			q++
		}
	}

	Build_Open_Ciphers()
	Open_History() // update table
	
	if (impBool == true) {breakCipher = impName; Populate_Breakdown()}
}
function Remove_Cipher(impName) {
	var x

	x = openCiphers.indexOf(impName)
	if (x > -1) {
		openCiphers.splice(x, 1)
	}
	Build_Open_Ciphers()
	if (breakCipher == impName) {
		if (openCiphers.length > 0) {breakCipher = openCiphers[0]} else {breakCipher = ""}
		Populate_Breakdown()
	}
	
	Open_History() // update table
}
function Add_AllCiphers(impBool = false) {
	var x, q, cN, z

	for (x = 0; x < allCiphers.length; x++) {
		q = 0
		cN = allCiphers[x].Nickname
		if (openCiphers.indexOf(cN) == -1 && cN.indexOf("Hebrew") == -1 && cN.indexOf("Greek") == -1
		&& cN.indexOf("RU") == -1 && cN.indexOf("Custom") == -1 &&
		cN.indexOf("Bacon Simple") == -1 && cN.indexOf("Bacon Reverse") == -1 && cN.indexOf("Bacon Short") == -1 && cN.indexOf("Kaye") == -1 && cN.indexOf("Illuminati") == -1 &&
		cN.indexOf("Beatus") == -1 && cN.indexOf("KR") == -1) {
			for (z = 0; z < allCiphers.length; z++) {
				if (allCiphers[z].Nickname == cN) {
					openCiphers.splice(q, 0, cN)
					break;
				} else if (openCiphers.indexOf(allCiphers[z].Nickname) > -1) {
					q++
				}
			}
		}
	}

	Build_Open_Ciphers()
	if (impBool == true) {
		Open_Ciphers()
	} else {
		Populate_MenuBar()
	}
	Open_History() // update table
}
function Add_BaseCiphers(impBool = false) {
	var x, q, cN, z
	var baseCiphers = ["English Ordinal", "Full Reduction", "Reverse Ordinal", "Reverse Full Reduction"]

	openCiphers = []
	for (z = 0; z < allCiphers.length; z++) {
		if (baseCiphers.indexOf(allCiphers[z].Nickname) > -1) {
			openCiphers.push(allCiphers[z].Nickname)
		}
	}

	Build_Open_Ciphers()
	if (impBool == true) {
		Open_Ciphers()
	} else {
		Populate_MenuBar()
	}
	Open_History() // update table
}
function No_Ciphers(impBool = false) {
	var z
	var baseCiphers = []

	openCiphers = []
	for (z = 0; z < allCiphers.length; z++) {
		if (baseCiphers.indexOf(allCiphers[z].Nickname) > -1) {
			openCiphers.push(allCiphers[z].Nickname)
		}
	}

	Build_Open_Ciphers()
	if (impBool == true) {
		Open_Ciphers()
	} else {
		Populate_MenuBar()
	}
	
	document.getElementById("Gematria_Table").innerHTML = "" // empty cipher table
	Open_History() // update table
}
function Add_RussianCiphers(impBool = false) {
	var x, q, cN, z
	var baseCiphers = ["RU Ordinal", "RU Full Reduction", "RU Single Reduction", "RU Sumerian", "RU Reverse Ordinal", "RU Reverse Full Reduction", "RU Reverse Single Reduction", "RU Reverse Sumerian", "RU Extended", "RU Reverse Extended"]

	openCiphers = []
	for (z = 0; z < allCiphers.length; z++) {
		if (baseCiphers.indexOf(allCiphers[z].Nickname) > -1) {
			openCiphers.push(allCiphers[z].Nickname)
		}
	}

	Build_Open_Ciphers()
	if (impBool == true) {
		Open_Ciphers()
	} else {
		Populate_MenuBar()
	}
	Open_History() // update table
}
function FindSpot(impName) {
	for (x = 0; x < allCiphers.length; x++) {
		if (allCiphers[x].Nickname == impName) {
			return x;
		}
	}
}

function Slide_Cipher(impDir) {
	var x, y, z, q, tempCipher

	if (breakCipher == "") {return;}

	x = FindSpot(breakCipher)
	q = openCiphers.indexOf(breakCipher)
	if (impDir == "up") {
		if (q > 0) {openCiphers.splice(q, 1); openCiphers.splice(q - 1, 0, breakCipher)}
	} else {
		if (q !== openCiphers.length - 1) {openCiphers.splice(q, 1); openCiphers.splice(q + 1, 0, breakCipher)}
	}

	switch (impDir.toLowerCase()) {
		case "up":
			for (z = x - 1; z > -1; z--) {
				if (isCipherOn(allCiphers[z].Nickname) > -1) {
					allCiphers.splice(z, 0, allCiphers[x])
					allCiphers.splice(x + 1, 1)
					break;
				}
			}
			break;
		case "down":
			for (z = x + 1; z < allCiphers.length; z++) {
				if (isCipherOn(allCiphers[z].Nickname) > -1) {
					allCiphers.splice(z + 1, 0, allCiphers[x])
					allCiphers.splice(x, 1)
					break;
				}
			}
			break;
	}

	RestoreField()
	Build_Open_Ciphers()
}

function Build_Open_Ciphers() {
	var x, z

	ciphersOn = []

	for (x = 0; x < openCiphers.length; x++) {
		for (z = 0; z < allCiphers.length; z++) {
			if (allCiphers[z].Nickname == openCiphers[x]) {
				ciphersOn[ciphersOn.length] = allCiphers[z]
				break;
			}
		}
	}

	Build_Table(opt_Headers)
}