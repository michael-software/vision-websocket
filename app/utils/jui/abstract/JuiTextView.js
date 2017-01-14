let shorthands = require('../const/shorthands');
let JuiView = require('./JuiView');

class JuiTextView extends JuiView {

	/**
	 * Creates a new JuiInputView, which extends JuiView
	 * @param [value] {string} - The value of the element
	 */
	constructor(value) {
		super();

		this._element = {};

		if(value) {
			this.setProperty(JuiView.VALUE, name);
		}
	}

	/**
	 * Sets the alignment of the element
	 * @param align {String} - one of JuiTextView.<ALIGN CONSTANTS>
	 */
	setAlign(align) {
		align = String(align).toLowerCase();

		if(align === 'left' || align === 'right' || align === 'center') {
			this.setProperty(JuiView.ALIGN, align);
		}
	}

	/**
	 * Sets the shadow of the element
	 * @param shadow {{}} - Shadow object to be set
	 */
	setShadow(shadow) {
		if(shadow) {
			this.setProperty(JuiView.SHADOW, shadow);
		}
	}
}


module.exports = JuiTextView;