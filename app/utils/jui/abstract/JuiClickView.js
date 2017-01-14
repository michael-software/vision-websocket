let shorthands = require('../const/shorthands');
let JuiView = require('./JuiView');

class JuiClickView extends JuiView {
	/**
	 * Sets the click property of the JuiClickView
	 * @param action {*} - Action from JuiHelper.Action or custom action
	 */
	setClick(action) {
		if(action)
			this.setProperty(shorthands.keys.click, action);
	}

	/**
	 * Sets the longclick property of the JuiClickView
	 * @param action {*} - Action from JuiHelper.Action or custom action
	 */
	setLongClick(action) {
		if(action)
			this.setProperty(shorthands.keys.longclick, action);
	}
}


module.exports = JuiClickView;