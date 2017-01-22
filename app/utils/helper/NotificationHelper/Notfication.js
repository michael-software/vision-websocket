module.exports = class Notfication {
	constructor(title, message, image, action) {
		this.type = 'notification';
		this.title = title;
		this.message = message;

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