module.exports = class Notfication {
	constructor(title, message) {
		this.type = 'notification';
		this.title = title;
		this.message = message;
	}
};