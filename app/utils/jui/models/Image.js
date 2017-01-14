let JuiView = require('../abstract/JuiView');

module.exports = class Image extends JuiView {
	/**
	 * Creates an new Image-element
	 * @param src {String} - The source of an image-file
	 */
	constructor( src ) {
		super();

		this.setProperty(JuiView.TYPE, 'image');

		if(src) {
			this.setProperty(JuiView.VALUE, src);
		}
	}

	/**
	 * Sets the source of the element
	 * @param src {String} - The source of an image-file
	 */
	setSrc(src) {
		this.setProperty(JuiView.VALUE, src);
	}
};