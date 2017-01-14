let shorthands = require('../const/shorthands');
let JuiView = require('./JuiView');

class JuiInputView extends JuiView {

	/**
	 * Creates a new JuiInputView, which extends JuiView
	 * @param name {string} - The name of the element that will be used when sending data to the server
	 */
	constructor(name) {
		super();

		this._element = {};

		if(name) {
			this._hasName = true;

			this.setProperty(JuiView.NAME, name);
		}
	}

	/**
	 * Sets the label of a JuiInputView
	 * @param value {String} - String that should be set as label
	 */
	setLabel(value) {
		this.setProperty(JuiView.LABEL, String(value));
	}


	/**
	 * Returns an element that represents the element in jui.
	 * Return null when element is not valid/does not exist
	 * @returns {{}|null}
	 */
	getArray() {
		if(this._hasName)
			return this._element;

		return null;
	}
}


module.exports = JuiInputView;