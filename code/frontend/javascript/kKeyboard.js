// =====================================================================
// LOOKUP TABLES
// =====================================================================

const kSpecialChar =
{
	// This list contains non-printable characters for which there is
	// no ASCII escape sequence.
	
	leftArrow:  -1,
	upArrow:    -2,
	rightArrow: -3,
	downArrow:  -4,
}

const kCharTable =
{
	// This contains the translation of keycodes to string characters,
	// contained within blocks representing modifiers. The format is
	// modifier : { keyCode : Character }. The "default" block is for 
	// keycodes when no modifier is applied.
	
	default : {
		8: "\b",
		9: "\t",
		13: "\n",
		32: " ",
		37: kSpecialChar.leftArrow,
		38: kSpecialChar.upArrow,
		39: kSpecialChar.rightArrow,
		40: kSpecialChar.downArrow,
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z",
		96: "0",
		97: "1",
		98: "2",
		99: "3",
		100: "4",
		101: "5",
		102: "6",
		103: "7",
		104: "8",
		105: "9",
		106: "*",
		107: "+",
		109: "-",
		110: ".",
		111: "/",
		186: ";",
		187: "=",
		188: ",",
		189: "-",
		190: ".",
		191: "/",
		192: "`",
		219: "[",
		220: "\\",
		221: "]",
		222: "'"
	},
	
	shift : {
		48: ")",
		49: "!",
		50: "@",
		51: "#",
		52: "$",
		53: "%",
		54: "^",
		55: "&",
		56: "*",
		57: "(",
		65: "A",
		66: "B",
		67: "C",
		68: "D",
		69: "E",
		70: "F",
		71: "G",
		72: "H",
		73: "I",
		74: "J",
		75: "K",
		76: "L",
		77: "M",
		78: "N",
		79: "O",
		80: "P",
		81: "Q",
		82: "R",
		83: "S",
		84: "T",
		85: "U",
		86: "V",
		87: "W",
		88: "X",
		89: "Y",
		90: "Z",
		106: "*",
		107: "+",
		109: "-",
		110: ".",
		111: "/",
		186: ":",
		187: "+",
		188: "<",
		189: "_",
		190: ">",
		191: "?",
		192: "~",
		219: "{",
		220: "|",
		221: "}",
		222: "\""
	}
};

// =====================================================================
// LOOKUP FUNCTION
// =====================================================================

function keyEventToChar(event)
{
	// Translate a keyboard window.event action into a character. If the
	// shift key is pressed, look up in the shift table. Fall back on
	// the default table if need be.
	if (event.shiftKey && typeof kCharTable.shift[event.keyCode] != 
		"undefined") 
		return kCharTable.shift[event.keyCode];
		
	// Return a character, or type "undefined" if none were found.
	return kCharTable.default[event.keyCode];
}