let JuiView = require('../abstract/JuiView');
let Text = require('../models/Text');
let Tools = require('../Tools');

const shorthands = require('../const/shorthands');

/**
 * An element that can contain multiple other elements
 */
class Container extends JuiView {
	/**
	 * Creates a new container-element
	 */
	constructor() {
		super();

		this.setProperty(JuiView.TYPE, 'container');
	}

	/**
	 * Adds a view to the Container
	 * @param view {JuiView, string} - The view that should be added
	 * @returns {boolean} - Returns success or error
	 */
	add(view) {
		if(view instanceof JuiView) {
			this.appendProperty(JuiView.VALUE, view.getArray());

			return true;
		} else if(Tools.isString(view)) {
			this.appendProperty(JuiView.VALUE, new Text(String(view)).getArray());
		}

		return false;
	}

	/**
	 * Adds a new line to the jui
	 * @param [count] {int} - How many new lines should be inserted (default = 1)
	 */
	nline(count) {
		if(!count) count = 1;
		for(let i = 0; i < count; i++) {
			this.appendProperty(JuiView.VALUE, { [shorthands.keys.type]: shorthands.values.type.nline });
		}
	}
}

module.exports = Container;