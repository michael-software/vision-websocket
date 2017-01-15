let JuiView = require('../abstract/JuiView');

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
	 * @param view {JuiView} - The view that should be added
	 * @returns {boolean} - Returns success or error
	 */
	add(view) {
		if(view instanceof JuiView) {
			this.appendProperty(JuiView.VALUE, view.getArray());

			return true;
		}

		return false;
	}
}

module.exports = Container;