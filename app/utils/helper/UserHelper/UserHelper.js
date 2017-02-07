const User = require('./User');
const Tools = require('../../jui/Tools');
const PermissionHelper = require('../PermissionHelper/PermissionHelper');

class UserHelper {
	constructor(socketHelper, userList) {
		this.socketHelper = socketHelper;
		this._userList = userList;


		this.ACCESS_FILES = UserHelper.ACCESS_FILES;
		this.STOP_SERVER = UserHelper.STOP_SERVER;
		this.START_SERVER = UserHelper.START_SERVER;
		this.SERVER_NOTIFICATIONS = UserHelper.SERVER_NOTIFICATIONS;
		this.LOG_ACCESS = UserHelper.LOG_ACCESS;
		this.MODIFY_USERS = UserHelper.MODIFY_USERS;
	}

	getCurrentUser() {
		let loginHelper = this.socketHelper.getLoginHelper();

		if(loginHelper.currentUser) return loginHelper.currentUser;

		return new User({
			id: loginHelper.getId(),
			server: loginHelper.getServer(),
			username: loginHelper.getUsername()
		});
	}

	/**
	 * Returns a map contains the users
	 * @returns {Map}
	 */
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

	changePermission(user, key, value) {
		if(!user instanceof User) return Promise.reject('user is not of type user');
		if(!this.getCurrentUser().hasPermission(this.MODIFY_USERS)) return Promise.reject('no permission to modify user');

		value = !!value;

		if(value === user.hasPermission(key)) return Promise.resolve();


		value = value ? 1 : 0;

		if(PermissionHelper.isServerPermission(key)) {
			return this._updateServerPermission(user.getId(), key, value);
		} else if(PermissionHelper.isPermission(key)) {
			return this._updatePermission(user.getId(), key, value);
		}

		return Promise.reject();
	}

	_updatePermission(userid, key, value) {
		let databaseHelper = this.socketHelper.getDatabaseHelper();

		return databaseHelper.query({
			sql: 'CALL ##praefix##spSetPermission(?, ?, ?)',
			values: [userid, key, value]
		}).then(() => { // TODO: return value stored procedure
			return this._changePermission(userid, key, value);
		});

	}


	_updateServerPermission(userid, key, value) {
		let databaseHelper = this.socketHelper.getDatabaseHelper();

		databaseHelper.query({
			sql: 'SET @key = ?;',
			values: [key]
		});

		databaseHelper.query({
			sql: 'SET @s = CONCAT(\'UPDATE `##praefix##user_permissions_server` SET \', @key, \'=? WHERE user=?\');',
			values: [value, userid]
		});

		databaseHelper.query('PREPARE stmt FROM @s;');

		let retval = databaseHelper.query('EXECUTE stmt;').then((data) => {
			console.log(data.rows.affectedRows);

			if(data.rows.affectedRows === 1) {
				return this._changeServerPermission(userid, key, value);
			}
		});

		databaseHelper.query('DEALLOCATE PREPARE stmt;');

		return retval;
	}

	_changeServerPermission(userid, key, value) {
		for(let i = 0, z = this._userList.length; i < z; i++) {
			let element = this._userList[i];

			if(element.getId() === userid) {
				this._userList[i].user.permissions[key] = value;

				return Promise.resolve();
			}
		}

		return Promise.reject();
	}

	_changePermission(userid, key, value) {
		for(let i = 0, z = this._userList.length; i < z; i++) {
			let element = this._userList[i];

			if(element.getId() === userid) {
				if(value)
					this._userList[i].customPermissions.set(key, value);
				else
					this._userList[i].customPermissions.delete(key);

				return Promise.resolve();
			}
		}

		return Promise.reject();
	}
}

UserHelper.ACCESS_FILES = PermissionHelper.ACCESS_FILES;
UserHelper.STOP_SERVER = PermissionHelper.STOP_SERVER;
UserHelper.START_SERVER = PermissionHelper.START_SERVER;
UserHelper.SERVER_NOTIFICATIONS = PermissionHelper.SERVER_NOTIFICATIONS;
UserHelper.LOG_ACCESS = PermissionHelper.LOG_ACCESS;
UserHelper.MODIFY_USERS = PermissionHelper.MODIFY_USERS;


module.exports = UserHelper;