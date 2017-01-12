let JuiView = require('../abstract/JuiView');

module.exports = class Headline extends JuiView {
	constructor( value ) {
		super();

		if(value) {
			this.setProperty(JuiView.TYPE, 'headline');
			this.setProperty(JuiView.VALUE, value);
		}
	}

	setAlign(align) {
		align = String(align).toLowerCase();

		if(align === 'left' || align === 'right' || align === 'center') {
			this.setProperty(JuiView.ALIGN, align);
		}
	}

	setShadow(shadow) {
		if(shadow) {
			this.setProperty(JuiView.SHADOW, shadow);
		}
	}

	setSize(size) {
		size = String(size).toLowerCase();

		if(size === 'small' || size === 'normal' || size === 'large' || ( size > 0 ) ) {
			this.setProperty(JuiView.SIZE, size);
		}
	}
};