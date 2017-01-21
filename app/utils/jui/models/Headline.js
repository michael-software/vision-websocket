let JuiTextView = require('../abstract/JuiTextView');

/**
 * Simple Headline that allows basic text styling
 */
class Headline extends JuiTextView {
	/**
	 * Creates a new Headline-element
	 * @param value {String} - Value of the element
	 */
	constructor( value ) {
		super();

		if(value) {
			this.setProperty(JuiTextView.TYPE, 'headline');
			this.setProperty(JuiTextView.VALUE, value);
		}
	}

	/**
	 * Sets the size of the text
	 * @param size {String} - one of Headline.<SIZE CONSTANTS>
	 */
	setSize(size) {
		size = String(size).toLowerCase();

		if(size === 'small' || size === 'normal' || size === 'large' || ( size > 0 ) ) {
			this.setProperty(JuiTextView.SIZE, size);
		}
	}
}

Headline.ALIGN_LEFT = 'left';
Headline.ALIGN_CENTER = 'center';
Headline.ALIGN_RIGHT = 'right';

Headline.SIZE_SMALL = 'small';
Headline.SIZE_NORMAL = 'normal';
Headline.SIZE_LARGE = 'large';

module.exports = Headline;