// There are special methods that allow to get the character for the code and back:

// str.codePointAt(pos)
// Returns a decimal number representing the code for the character at position pos:

// different case letters have different codes
alert( "Z".codePointAt(0) ); // 90
alert( "z".codePointAt(0) ); // 122
alert( "z".codePointAt(0).toString(16) ); // 7a (if we need a hexadecimal value)

// String.fromCodePoint(code)
// Creates a character by its numeric code

alert( String.fromCodePoint(90) ); // Z
alert( String.fromCodePoint(0x5a) ); // Z (we can also use a hex value as an argument)