const JuiInputView = require('../abstract/JuiInputView');
const Tools = require('../Tools');

/**
 * An element that allows you to select a number with a SeekBar
 */
class Range extends JuiInputView {
	/**
	 * Creates a new Range element
	 * @param name {String} - The name of the element that will be used when sending data to the server
	 */
	constructor( name ) {
		super(name);

		if(name) {
			this.setProperty(JuiInputView.TYPE, 'range');
			this.setProperty(JuiInputView.NAME, name);
		}
	}

	/**
	 * Sets the value of the Range element
	 * @param value {int} - The numeric value of the element
	 * @returns {boolean} - Returns success or error
	 */
	setValue(value) {
		if(Tools.isNumeric(value)) {
			this.setProperty(JuiInputView.VALUE, parseFloat(value));
			return true;
		}

		return false;
	}

	/**
	 * Sets the minimal value of the Range element
	 * @param min {int} - The numeric minimal value of the element
	 * @returns {boolean} - Returns success or error
	 */
	setMin(min) {
		if(Tools.isNumeric(min)) {
			this.setProperty(JuiInputView.MIN, parseFloat(min));
			return true;
		}

		return false;
	}

	/**
	 * Sets the maximal value of the Range element
	 * @param max {int} - The numeric maximal value of the element
	 * @returns {boolean} - Returns success or error
	 */
	setMax(max) {
		if(Tools.isNumeric(max)) {
			this.setProperty(JuiInputView.MAX, parseFloat(max));
			return true;
		}

		return false;
	}

}


module.exports = Range;