// =====================================================================
// BASE FUNCTION
// =====================================================================

function kLineEdit(text, width, height, x, y)
{
	// Store the button properties from function parameters.
	this.x = optionalParameter(0, x);
	this.y = optionalParameter(0, y);
	this.baseWidth  = width;
	this.baseHeight = height;
	this.width  = width;
	this.height = height;
	this.text   = text;
	
	// Default options.
	this.cursorPosition = this.text.length;
	this.cursorVisible = false;
	this.displayedTextOffset = 0;
	this.displayedTextData = 0;
	this.style = getStyle(kStyle.lineEdit);
}

// =====================================================================
// DRAW FUNCTION
// =====================================================================

kLineEdit.prototype.draw = 
function(canvas)
{
	// Calculate the width we have for the text.
	var textWidth = this.width - 2 * this.style.padding;
	
	// If the cursor is *before* the displayed text, change the offset
	// so the cursor remains in view.
	if (this.cursorPosition < this.displayedTextOffset)
		this.displayedTextOffset = this.cursorPosition;
	
	// If the cursor is *after* the displayable text, change the offset
	// so that the cursor remains in view.
	while (this.cursorPosition > this.displayedTextOffset + 
		canvas.wrapTextToWidth(this.text.substring(
		this.displayedTextOffset), textWidth, this.style).phrase.length)
		this.displayedTextOffset++;
	
	// Draw the box containing the text.
	canvas.drawRoundedRectangle(this.x, this.y, this.width, 
		this.height, 5, this.style);
	
	// Draw the text.
	this.displayedTextData = canvas.drawBoundedText(this.x + 
		this.style.padding, this.y, textWidth, this.height, 
		this.text.substring(this.displayedTextOffset), this.style);
	
	// Draw the cursor
	this.drawCursor(canvas, this.displayedTextData.geometry);
}

kLineEdit.prototype.drawCursor = 
function(canvas, textGeometry)
{
	// If there's no text data, or cursors shouldn't be visible, abort.
	if (textGeometry.length == 0 || this.cursorVisible == false)
		return;
	
	// If we're in the range of known characters.
	else if (this.cursorPosition - this.displayedTextOffset 
		< textGeometry[0].length) {
		var geometry = textGeometry[0][this.cursorPosition 
			- this.displayedTextOffset];
		canvas.drawLine(geometry.x, geometry.y, 1, 
			geometry.height, kStyle.textCursor);
	} 
	
	// If we're after the last character, there's a special case.
	else {
		var geometry = textGeometry[0][textGeometry[0].length - 1];
		canvas.drawLine(geometry.x + geometry.width, geometry.y, 1, 
			geometry.height, kStyle.textCursor);
	}
}

// =====================================================================
// FIND MOUSE/KEYBOARD ACTIVE AREA
// =====================================================================

kLineEdit.prototype.getActiveArea = 
function()
{
	return { x:this.x, y:this.y, width:this.width, height:this.height };
}

// =====================================================================
// MOUSE/KEYBOARD INTERACTION
// =====================================================================

kLineEdit.prototype.onClick = 
function(mouseX, mouseY)
{
	// If we haven't acquired text geometry data, abort.
	if (this.displayedTextData == 0 || 
		this.displayedTextData.geometry.length == 0 ||
		this.displayedTextData.geometry[0].length == 0) 
		return;

	// Create a shortcut and the variables we'll use.
	var geometry = this.displayedTextData.geometry[0];
	var closestX = Math.abs(geometry[0].x - mouseX);
	var closestIndex = 0;
	
	// Find the offset that's the closest to the mouse.
	for (var i = 0; i < geometry.length; i++) {
		if (Math.abs(geometry[i].x - mouseX) < closestX) {
			closestX = Math.abs(geometry[i].x - mouseX);
			closestIndex = i;
		}
		if (Math.abs(geometry[i].x+geometry[i].width-mouseX)<closestX) {
			closestIndex = i+1;
		}
	}
	
	// Update the cursor to the new position.
	this.cursorPosition = this.displayedTextOffset + closestIndex;
}

kLineEdit.prototype.onFocus = 
function(mouseX, mouseY)
{
	this.cursorVisible = true;
}

kLineEdit.prototype.onBlur = 
function(mouseX, mouseY)
{
	this.cursorVisible = false;
}

kLineEdit.prototype.onKey = 
function(mouseX, mouseY, character)
{
	// User presses a key on the keyboard. Apply the action at the
	// given cursor position.
	
	// Increase / decrease cursor position with arrow keys.
	if (character == kSpecialChar.rightArrow && 
		this.cursorPosition < this.text.length)
		this.cursorPosition++;
	
	else if (character == kSpecialChar.leftArrow && 
		this.cursorPosition - 1 >= 0)
		this.cursorPosition--;	
	
	// Backspace deletes the character before the cursor.
	else if (character == kSpecialChar.backspace && 
		this.cursorPosition > 0) {
		this.text = this.text.substring(0, this.cursorPosition-1) + 
			this.text.substring(this.cursorPosition);
		this.cursorPosition--;
	}
	
	// Delete removes the character after the cursor.
	else if (character == kSpecialChar.delete && 
		this.cursorPosition < this.text.length) {
		this.text = this.text.substring(0, this.cursorPosition) + 
			this.text.substring(this.cursorPosition+1);
	}
	
	// All special characters and newlines are ignored past this point.
	if (character < 0 || character == "\n") return;
		
	// Append the character to the text and update the cursor position.
	this.text = this.text.substring(0, this.cursorPosition) + 
		character + this.text.substring(this.cursorPosition);
	this.cursorPosition++;
}
