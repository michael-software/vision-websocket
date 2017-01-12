let JuiClickView = require('../abstract/JuiClickView');

module.exports = class Button extends JuiClickView {
	constructor( value ) {
		super();

		if(value) {
			this.setProperty(JuiClickView.TYPE, 'button');
			this.setProperty(JuiClickView.VALUE, value);
		}
	}
};