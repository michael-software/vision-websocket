const User = require('./User');

module.exports = class UserHelper {
	constructor(socketHelper) {
		this.socketHelper = socketHelper;
	}

	getCurrentUser() {
		let loginHelper = this.socketHelper.getLoginHelper();

		return new User({
			server: loginHelper.getServer(),
			username: loginHelper.getUsername()
		});
	}
};