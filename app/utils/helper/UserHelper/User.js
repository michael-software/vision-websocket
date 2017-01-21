module.exports = class {
	constructor(userObject) {
		this.user = userObject;
	}

	getUsername() {
		if(this.user && this.user.username) {
			return this.user.username;
		}

		return null;
	}

	getServer() {
		if(this.user && this.user.server) {
			return this.user.server;
		}

		return null;
	}
};