let JuiView = require('../abstract/JuiView');

module.exports = class Image extends JuiView {
	constructor( src ) {
		super();

		this.setProperty(JuiView.TYPE, 'image');

		if(src) {
			this.setProperty(JuiView.VALUE, src);
		}
	}

	setSrc(src) {
		this.setProperty(JuiView.VALUE, src);
	}
};