import TokenType from "./TokenType.js";
import Token from "./Token.js";
import ReservedKeywords from "./ReservedKeywords.js";




const source = `
// this is a comment
(( )){} // grouping stuff
!*+-/=<> <= == // operators
"blah"
1
4.69
ident
var
or
`;


const startTime = performance.now();


let start = 0;
let current = 0;
let line = 1;

const tokens = [];

while(!isAtEnd()) {
	start = current;

	const char = source.charAt(current++);
	switch(char) {
		case "(":
			addToken(TokenType.LEFT_PAREN, null);
			break;
		case ")":
			addToken(TokenType.RIGHT_PAREN, null);
			break;
		case "{":
			addToken(TokenType.LEFT_BRACE, null);
			break;
		case "}":
			addToken(TokenType.RIGHT_BRACE, null);
			break;
		case ",":
			addToken(TokenType.COMMA, null);
			break;
		case ".":
			addToken(TokenType.DOT, null);
			break;
		case "-":
			addToken(TokenType.MINUS, null);
			break;
		case "+":
			addToken(TokenType.PLUS, null);
			break;
		case ";":
			addToken(TokenType.SEMICOLON, null);
			break;
		case "*":
			addToken(TokenType.STAR, null);
			break;

		case "!":
			addToken(match("=") ? TokenType.BANG_EQUAL : TokenType.BANG, null);
			break;
		case "=":
			addToken(match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, null);
			break;
		case "<":
			addToken(match("=") ? TokenType.LESS_EQUAL : TokenType.LESS, null);
			break;
		case ">":
			addToken(match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER, null);
			break;
		case "/":
			if(match("/")) {
				while(peek() !== "\n" && !isAtEnd()) {
					current++;
				}
			}
			else {
				addToken(TokenType.SLASH, null);
			}
			break;
		case "\"":
			while(peek() !== "\"") {
				if(isAtEnd()) {
					throw new Error(`Unterminated string at line #${line}`);
				}

				if(peek() === "\n") {
					line++;
				}

				current++;
			}

			// Skip over closing double-quote
			current++;

			// Trim the surrounding quotes
			const stringValue = source.substring(start + 1, current - 1);
			addToken(TokenType.STRING, stringValue);

			break;

		// Ignore whitespace, fallthrough
		case " ":
		case "\r":
		case "\t":
			break;

		// Next line, do after handling strings
		case "\n":
			line++;
			break;

		default:
			if(isDigit(char)) {
				while(isDigit(peek())) {
					current++;
				}

				if(peek() === "." && isDigit(peekNext())) {
					// Consume the "."
					current++;

					while(isDigit(peek())) {
						current++;
					}
				}

				addToken(TokenType.NUMBER, parseFloat(source.substring(start, current)));
			}
			else if(isAlpha(char)) {
				while(isAlphaNumeric(peek())) {
					current++;
				}

				const text = source.substring(start, current);
				let keyword = ReservedKeywords[text];
				if(keyword === undefined) {
					keyword = TokenType.IDENTIFIER;
				}

				addToken(keyword, null);
			}
			else {
				throw new Error(`Unexpected character at line #${line}`);
			}
	}
}

tokens.push(new Token(TokenType.EOF, "", null, line));

const endTime = performance.now() - startTime;
console.log(`Finished lexing in ${endTime.toString().slice(0, endTime.toString().indexOf(".") + 4)}ms`);


console.log("tokens:", tokens);


/**
 * @param {string} char
 * @returns {boolean}
 */
function isDigit(char) {
	return char.match(/\d/) !== null;
}

/**
 * @param {string} char
 * @returns {boolean}
 */
function isAlpha(char) {
	return char.match(/[a-zA-Z_]/) !== null;
}

/**
 * @param {string} char
 * @returns {boolean}
 */
function isAlphaNumeric(char) {
	return char.match(/[a-zA-Z0-9_]/) !== null;
}

/**
 * @returns {string}
 */
function peek() {
	if(isAtEnd()) {
		return "\0";
	}

	return source.charAt(current);
}

/**
 * @returns {string}
 */
function peekNext() {
	if(current + 1 >= source.length) {
		return "\0";
	}

	return source.charAt(current + 1);
}

/**
 * @returns {boolean}
 */
function isAtEnd() {
	return current >= source.length;
}

/**
 * @param {string} expected
 * @returns {boolean}
 */
function match(expected) {
	if(isAtEnd() || source.charAt(current) !== expected) {
		return false;
	}

	current++;

	return true;
}

/**
 * @param {TokenType} tokenType
 * @param {null} literal
 * @returns {void}
 */
function addToken(tokenType, literal) {
	const text = source.substring(start, current);
	tokens.push(new Token(tokenType, text, literal, line));
}
