let shorthands = require('../const/shorthands');
let JuiView = require('./JuiView');

class JuiInputView extends JuiView {

	constructor(name) {
		super();

		this._element = {};

		if(name) {
			this._hasName = true;

			this.setProperty(JuiView.NAME, name);
		}
	}

	setLabel(value) {
		this.setProperty(JuiView.LABEL, String(value));
	}

	getArray() {
		if(this._hasName)
			return this._element;

		return null;
	}
}


module.exports = JuiInputView;