let shorthands = require('../const/shorthands');
let JuiView = require('./JuiView');

class JuiClickView extends JuiView {
	setClick(action) {
		if(action)
			this.setProperty(shorthands.keys.click, action);
	}

	setLongClick(action) {
		if(action)
			this.setProperty(shorthands.keys.longclick, action);
	}
}


module.exports = JuiClickView;