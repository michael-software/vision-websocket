let JuiInputView = require('../abstract/JuiInputView');

module.exports = class Checkbox extends JuiInputView {
	constructor( name ) {
		super(name);

		this.setProperty(JuiInputView.TYPE, 'checkbox');
	}

	setValue(value) {
		if(value === false) {
			this.setProperty(JuiInputView.VALUE, false);
		} else {
			this.setProperty(JuiInputView.VALUE, true);
		}
	}

	setChecked(value) {
		this.setValue(value);
	}
};