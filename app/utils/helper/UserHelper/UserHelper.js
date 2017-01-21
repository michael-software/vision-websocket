const User = require('./User');
const Tools = require('../../jui/Tools');

module.exports = class UserHelper {
	constructor(socketHelper, userList) {
		this.socketHelper = socketHelper;
		this._userList = userList;
	}

	getCurrentUser() {
		let loginHelper = this.socketHelper.getLoginHelper();

		return new User({
			id: loginHelper.getId(),
			server: loginHelper.getServer(),
			username: loginHelper.getUsername()
		});
	}

	getUserList() {
		return this._userList;
	}

	getUser(identification) {
		if(Tools.isNumeric(identification)) {
			return this._userList.find(function(user) {
				return user.getId() == identification;
			});
		}

		return null;
	}
};