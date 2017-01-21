module.exports = {
	/**
	 * Creates a submit action
	 * @param [url] {String} - Optional sets an url to which data will be send
	 * @returns {string} - Return an action-string that can be parsed by jui
	 */
	submit: function(url) {
		return `submit(${url || ''})`;
	},

	/**
	 * Creates an openUrl action
	 * @param url {String} - Sets the url that should be opened
	 * @returns {string} - Return an action-string that can be parsed by jui
	 */
	openUrl: function(url) {
		if(url) return `openUrl(${url || ''})`;

		return null;
	}
};