const JuiView = require('../../abstract/JuiView');

class ButtonList extends JuiView {
	constructor() {
		super();

		this.setProperty(JuiView.TYPE, 'buttonlist');
	}

	add(value, image, click, longclick) {
		this.appendProperty(JuiView.VALUE, {
			value: [image, value],
			click: click,
			longclick: longclick
		});
	}
}


module.exports = ButtonList;