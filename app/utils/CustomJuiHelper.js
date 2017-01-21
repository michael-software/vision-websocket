const JuiHelper = require('./jui/JuiHelper.js');

const ButtonList = require('./jui/custom/models/ButtonList.js');

class CustomJuiHelper extends JuiHelper {
	constructor() {
		super();

		this.ButtonList = ButtonList;
	}
}

CustomJuiHelper.ButtonList = ButtonList;
CustomJuiHelper.Action.openPlugin = function(name, view, parameter) {
	if(name) {
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