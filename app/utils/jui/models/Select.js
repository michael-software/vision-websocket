let JuiInputView = require('../abstract/JuiInputView');

class Input extends JuiInputView {
	constructor( name ) {
		super(name);

		if(name) {
			this.setProperty(JuiInputView.TYPE, 'select');
			this.setProperty(JuiInputView.NAME, name);
		}
	}

	add(key, value) {
		if(key && value) {
			this.appendProperty(JuiInputView.VALUE, [String(key), String(value)]);
		} else if(key) {
			this.appendProperty(JuiInputView.VALUE, String(key));
		}
	}

}


module.exports = Input;