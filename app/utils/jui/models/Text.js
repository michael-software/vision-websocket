let JuiTextView = require('../abstract/JuiTextView');

class Text extends JuiTextView {
	/**
	 * Creates a new Text-element
	 * @param value {String} - Value of the element
	 */
	constructor( value ) {
		super();

		if(value) {
			this.setProperty(JuiTextView.TYPE, 'text');
			this.setProperty(JuiTextView.VALUE, value);
		}
	}

	/**
	 * Sets the appearance of the text
	 * @param appearance {String} - one of Text.<APPEARANCE CONSTANTS>
	 */
	setAppearance(appearance) {
		appearance = String(appearance).toLowerCase();

		if(appearance === 'bold' || appearance === 'italic' || appearance === 'bolditalic') {
			this.setProperty(JuiTextView.APPEARANCE, appearance);
		}
	}
}


Text.APPEARANCE_BOLD = 'bold';
Text.APPEARANCE_ITALIC = 'italic';
Text.APPEARANCE_BOLDITALIC = 'bolditalic';


module.exports = Text;