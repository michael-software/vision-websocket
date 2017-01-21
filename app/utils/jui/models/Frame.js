const JuiView = require('../abstract/JuiView');

/**
 * A frame that can display HTML or a website by url
 */
class Frame extends JuiView {
	/**
	 * Creates a new Frame-element
	 */
	constructor(value) {
		super();

		this.setProperty(JuiView.TYPE, 'frame');

		if(value) this.setValue(value);
	}

	/**
	 * Sets html content of the frame
	 * @param html {String} - The HTML-String that should be loaded in the Frame
	 */
	setHtml(html) {
		if(html) {
			this.removeProperty(JuiView.VALUE);
			this.setProperty(JuiView.HTML, html);
		}
	}

	/**
	 * Sets the content of the Frame
	 * @param value {String} - Url or HTML-String which represents the content of the frame
	 * @param [isHtml] {Boolean} - Sets the value as HTML
	 */
	setValue(value, isHtml) {
		if(isHtml === true)
			this.setHtml(value);
		else if (value) {
			this.removeProperty(JuiView.HTML);
			this.setProperty(JuiView.VALUE, value);
		}
	}
}

module.exports = Frame;