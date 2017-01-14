const JuiView = require('./abstract/JuiView.js');

const Action = require('./models/Action.js');

const Text = require('./models/Text.js');
const Headline = require('./models/Headline.js');
const Input = require('./models/Input.js');
const Button = require('./models/Button.js');
const Checkbox = require('./models/Checkbox.js');
const File = require('./models/File.js');

const shorthands = require('./const/shorthands');


class JuiHelper {
	constructor() {
		this._elements = [];

		this.Action = Action;

		this.Text = Text;
		this.Headline = Headline;
		this.Input = Input;
		this.Button = Button;
		this.Checkbox = Checkbox;
		this.File = File;
	}

	getJson() {
		return JSON.stringify( this._elements );
	}

	getArray() {
		return this._elements;
	}

	add(view) {
		if(view instanceof JuiView) {
			this._elements.push( view.getArray() );
		}
	}

	nline(count) {
		if(!count) count = 1;
		for(let i = 0; i < count; i++) {
			this._elements.push({ [shorthands.keys.type]: shorthands.values.type.nline });
		}
	}

	hline() {
		this._elements.push({ [shorthands.keys.type]: shorthands.values.type.hline });
	}
}

JuiHelper.Action = Action;

JuiHelper.Text = Text;
JuiHelper.Headline = Headline;
JuiHelper.Input = Input;
JuiHelper.Button = Button;
JuiHelper.Checkbox = Checkbox;
JuiHelper.File = File;

module.exports = JuiHelper;