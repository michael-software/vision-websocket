const Actions = require('../const/Actions');

module.exports = {
	/**
	 * Creates a submit action
	 * @param [url] {String} - Optional sets an url to which data will be send
	 * @returns {{}} - Return an action-object that can be parsed by jui
	 */
	submit: function(url) {
		return {
			[Actions.FUNCTION_NAME]: 'submit',
			[Actions.FUNCTION_PARAMETER]: url ? [url] : null
		};
	},

	/**
	 * Creates an openUrl action
	 * @param url {String} - Sets the url that should be opened
	 * @returns {{} | null} - Return an action-object that can be parsed by jui
	 */
	openUrl: function(url) {
		if(url)
			return {
				[Actions.FUNCTION_NAME]: 'openUrl',
				[Actions.FUNCTION_PARAMETER]: url ? [url] : null
			};

		return null;
	}
};