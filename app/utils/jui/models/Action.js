module.exports = {
	submit: function(url) {
		return `submit(${url || ''})`;
	},

	openUrl: function(url) {
		if(url) return `openUrl(${url || ''})`;

		return null;
	}
};