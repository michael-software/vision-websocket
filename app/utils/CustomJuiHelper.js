const JuiHelper = require('./jui/JuiHelper.js');

const ButtonList = require('./jui/custom/models/ButtonList.js');
const JuiViewBuilder = require('./jui/custom/JuiViewBuilder.js');

const Actions = require('./jui/const/actions');

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

		let parameters = [name];

		if(view) {
			parameters.push(view);

			if(parameter)
				parameters.push(parameter);
		}

		return {
			[Actions.FUNCTION_NAME]: "openPlugin",
			[Actions.FUNCTION_PARAMETER]: parameters
		};
	}

	return null;
};

CustomJuiHelper.Action.downloadFile = function(path) {
	if(path) {
		return {
			[Actions.FUNCTION_NAME]: "downloadFile",
			[Actions.FUNCTION_PARAMETER]: [path]
		};
	}

	return null;
};


CustomJuiHelper.Action.openMedia = function(type, path) {
	if(type && path) {
		return {
			[Actions.FUNCTION_NAME]:"openMedia",
			[Actions.FUNCTION_PARAMETER]:[type, path]
		};
	}

	return null;
};

module.exports = CustomJuiHelper;