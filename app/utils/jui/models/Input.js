let JuiInputView = require('../abstract/JuiInputView');

class Input extends JuiInputView {
	constructor( name ) {
		super(name);

		if(name) {
			this.setProperty(JuiInputView.TYPE, 'input');
			this.setProperty(JuiInputView.NAME, name);
		}
	}

	setPlaceholder(string) {
		this.setProperty(JuiInputView.PLACEHOLDER, String(string));
	}

	setPreset(string) {
		this.setProperty(JuiInputView.PRESET, String(string));
	}

}

Input.TEXTAREA 	= 'textarea';
Input.PASSWORD 	= 'password';
Input.NUMBER 	= 'number';
Input.COLOR 	= 'color';
Input.DATE 		= 'date';


module.exports = Input;