module.exports = class Notfication {
	constructor(title, message, plugin, image, action) {
		this.type = 'notification';
		this.title = title;
		this.message = message;
		this.plugin = plugin;

		if(action) {
			this.action = action;
		}
	}

	setClick(action) {
		if(action) {
			this.action = action;
		}
	}
};