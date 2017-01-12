let JuiView = require('../abstract/JuiView');

module.exports = class Text extends JuiView {
	constructor( value ) {
		super();

		if(value) {
			this.setProperty(JuiView.TYPE, 'text');
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

	setAppearance(appearance) {
		appearance = String(appearance).toLowerCase();

		if(appearance === 'bold' || appearance === 'italic' || appearance === 'bolditalic') {
			this.setProperty(JuiView.APPEARANCE, appearance);
		}
	}
};