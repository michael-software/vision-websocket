let JuiInputView = require('../abstract/JuiInputView');

/**
 * An element that let you select one of many defined options
 */
class Select extends JuiInputView {
	/**
	 * Creates a new Select-elemnt
	 * @param name - The name under that the value will be send to the server
	 */
	constructor( name ) {
		super(name);

		if(name) {
			this.setProperty(JuiInputView.TYPE, 'select');
			this.setProperty(JuiInputView.NAME, name);
		}
	}

	/**
	 * Adds a new entry to the Select element.
	 * @param {string} key - Text that will be send to server
	 * @param {string} [value] - Text that will be shown in Select element
	 */
	add(key, value) {
		if(key && value) {
			this.appendProperty(JuiInputView.VALUE, [String(key), String(value)]);
		} else if(key) {
			this.appendProperty(JuiInputView.VALUE, String(key));
		}
	}

}


module.exports = Select;