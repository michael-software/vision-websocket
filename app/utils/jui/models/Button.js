let JuiClickView = require('../abstract/JuiClickView');

module.exports = class Button extends JuiClickView {
	/**
	 * Creates a new Button
	 * @param value {String} - Value to set to the button
	 */
	constructor( value ) {
		super();

		if(value) {
			this.setProperty(JuiClickView.TYPE, 'button');
			this.setProperty(JuiClickView.VALUE, value);
		}
	}
};