const JuiHelper = require('./jui/JuiHelper.js');

const ButtonList = require('./jui/custom/models/ButtonList.js');
const JuiViewBuilder = require('./jui/custom/JuiViewBuilder.js');

class CustomJuiHelper extends JuiHelper {
	constructor() {
		super();

		this.ButtonList = ButtonList;
	}
}

CustomJuiHelper.ButtonList = ButtonList;
CustomJuiHelper.Action.openPlugin = function(name, view, parameter) {
	if(name) {
		if(name instanceof JuiViewBuilder) {
			name = name.getPluginId();
		}

		let retval = `openPlugin('${name}'`;

		if(view) {
			retval += `,'${view}'`;

			if(parameter)
				retval += `,'${parameter}'`;
		}

		return `${retval})`;
	}

	return null;
};

module.exports = CustomJuiHelper;