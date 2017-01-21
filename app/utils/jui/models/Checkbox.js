let JuiInputView = require('../abstract/JuiInputView');

/**
 * A Simple Input-Element that shows a Checkbox and a Label
 */
class Checkbox extends JuiInputView {
	/**
	 * Creates a new Checkbox element
	 * @param name {String} - The name of the element that will be used when sending data to the server
	 */
	constructor( name ) {
		super(name);

		this.setProperty(JuiInputView.TYPE, 'checkbox');
	}

	/**
	 * Set value of Checkbox
	 * @param value {boolean||null} - sets value (false: not checked, anything else: checked)
	 */
	setValue(value) {
		if(value === false) {
			this.setProperty(JuiInputView.VALUE, false);
		} else {
			this.setProperty(JuiInputView.VALUE, true);
		}
	}

	/**
	 * Set whether Checkbox is checked
	 * @param value {boolean||null} - sets value (false: not checked, anything else: checked)
	 */
	setChecked(value) {
		this.setValue(value);
	}
}


module.exports = Checkbox;