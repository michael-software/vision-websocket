const JuiView = require('./abstract/JuiView.js');

const Action = require('./models/Action.js');

const Text = require('./models/Text.js');
const Headline = require('./models/Headline.js');
const Input = require('./models/Input.js');
const Button = require('./models/Button.js');
const Checkbox = require('./models/Checkbox.js');
const File = require('./models/File.js');
const List = require('./models/List/List.js');
const Image = require('./models/Image.js');
const Select = require('./models/Select.js');
const Table = require('./models/Table/Table.js');
const Frame = require('./models/Frame.js');
const Range = require('./models/Range.js');
const Container = require('./models/Container.js');

const shorthands = require('./const/shorthands');

/**
 * Class that manages everything with JuiElements and put them in a document
 */
class JuiHelper {
	/**
	 * Creates a new JuiHelper
	 */
	constructor() {
		this._elements = [];

		this.Action = Action;

		this.Text = Text;
		this.Headline = Headline;
		this.Input = Input;
		this.Button = Button;
		this.Checkbox = Checkbox;
		this.File = File;
		this.List = List;
		this.Image = Image;
		this.Select = Select;
		this.Table = Table;
		this.Frame = Frame;
		this.Range = Range;
		this.Container = Container;
	}

	/**
	 * Get an JSON-Object representing the elements in jui-style
	 */
	getJson() {
		return JSON.stringify( this._elements );
	}

	/**
	 * Get the jui-elements
	 * @returns {Array} - Returns all elements added to the jui
	 */
	getArray() {
		return this._elements;
	}

	/**
	 * Adds a new element to the jui
	 * @param view {JuiView} - View that should be added
	 */
	add(view) {
		if(view instanceof JuiView) {
			this._elements.push( view.getArray() );
		}
	}

	/**
	 * Adds a new line to the jui
	 * @param count {int} - How many new lines should be inserted
	 */
	nline(count) {
		if(!count) count = 1;
		for(let i = 0; i < count; i++) {
			this._elements.push({ [shorthands.keys.type]: shorthands.values.type.nline });
		}
	}

	/**
	 * Adds a horizontal line to the jui
	 */
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
JuiHelper.List = List;
JuiHelper.Image = Image;
JuiHelper.Select = Select;
JuiHelper.Table = Table;
JuiHelper.Frame = Frame;
JuiHelper.Range = Range;
JuiHelper.Container = Container;

module.exports = JuiHelper;