let JuiInputView = require('../abstract/JuiInputView');

class File extends JuiInputView {
	constructor( name ) {
		super(name);

		if(name) {
			this.setProperty(JuiInputView.TYPE, 'file');
			this.setProperty(JuiInputView.NAME, name);
		}
	}

	setMultiple(boolean) {
		if(boolean === false)
			this.setProperty(JuiInputView.MULTIPLE, false);
		else
			this.setProperty(JuiInputView.MULTIPLE, true);
	}
}


module.exports = File;