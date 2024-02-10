export default class Token {
	/**
	 * @param {TokenType} tokenType
	 * @param {string} lexeme
	 * @param {any} literal
	 * @param {number} line
	 * @constructor
	 */
	constructor(tokenType, lexeme, literal, line) {
		this.tokenType = tokenType;
		this.lexeme = lexeme;
		this.literal = literal;
		this.line = line;
	}

	toString() {
		return `${this.tokenType} ${this.lexeme} ${this.literal}`;
	}
}