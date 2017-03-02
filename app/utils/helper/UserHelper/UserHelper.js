const User = require('./User');
const Tools = require('../../jui/Tools');
const PermissionHelper = require('../PermissionHelper/PermissionHelper');
const PasswordHelper = require('../PasswordHelper');

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


	/**
	 * Creates a new user when allowed and the username doesn't exist
	 * username {String} - The username of the new user
	 * password {String} - The password of the new user (will be hashed)
	 */
	createUser(username, password) {
		let currentUser = this.getCurrentUser();

		if(!currentUser) return Promise.resolve();

		if(!currentUser.hasPermission(PermissionHelper.MODIFY_USERS)) return Promise.reject();

		return PasswordHelper.getHash(password).then((hash) => {

			let databaseHelper = this.socketHelper.getDatabaseHelper();

			return databaseHelper.query({
				sql: 'CALL ##praefix##spCreateUser(?, ?)',
				values: [username, hash]
			}).then((data) => {

				if(!data || !data.rows || !data.rows[0] || !data.rows[0][0] || !data.rows[0][0].userId) return Promise.reject();

				const userId = data.rows[0][0].userId;

				let newUser = new User({
					id: userId,
					server: null,
					username: username.toLowerCase()
				});

				this._userList.push(newUser);
			});

		});
	}

	/**
	 * Returns the current logged in user
	 * @returns {User} - The current user
	 */
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


	/**
	 * Returns a user by an identification-variable
	 * @param identification {int,string} - Identification-variable (userid or username)
	 * @returns {User|null} - Returns the user or null (user not found)
	 */
	getUser(identification) {
		if(!identification) {
			return this.getCurrentUser();
		}

		if(Tools.isNumeric(identification)) {
			return this._userList.find(function(user) {
				return user.getId() == identification;
			});
		}

		if(Tools.isString(identification)) {
			return this._userList.find(function(user) {
				return user.getUsername() == identification;
			});
		}

		return null;
	}


	/**
	 * Change the permission of a user
	 * @param user {User} - A User-object that represents the user
	 * @param key {String} - The key of the permission that should be changed
	 * @param value - The value the permission should be. Will be converted to true or false
	 * @returns {Promise} - Promise that will be resolved or rejected
	 */
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


	/**
	 * Internal function to update custom permissions in the database without validation of current users permission
	 * @param userid {int} - Id of the user
	 * @param key {String} - The key of the permission that should be changed
	 * @param value {int} - The value the permission should be.
	 * @returns {Promise} - Promise that will be resolved or rejected
	 * @private
	 */
	_updatePermission(userid, key, value) {
		let databaseHelper = this.socketHelper.getDatabaseHelper();

		return databaseHelper.query({
			sql: 'CALL ##praefix##spSetPermission(?, ?, ?)',
			values: [userid, key, value]
		}).then(() => { // TODO: return value stored procedure
			return this._changePermission(userid, key, value);
		});

	}


	/**
	 * Internal function to update server-permissions in the database without validation of current users permission
	 * @param userid {int} - Id of the user
	 * @param key {String} - The key of the permission that should be changed
	 * @param value {int} - The value the permission should be.
	 * @returns {Promise} - Promise that will be resolved or rejected
	 * @private
	 */
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
			if(data.rows.affectedRows === 1) {
				return this._changeServerPermission(userid, key, value);
			}
		});

		databaseHelper.query('DEALLOCATE PREPARE stmt;');

		return retval;
	}


	/**
	 * Internal function to change a server permission in the server cache without validation of current users permission
	 * @param userid {int} - Id of the user
	 * @param key {String} - The key of the permission that should be changed
	 * @param value {int} - The value the permission should be.
	 * @returns {Promise} - Promise that will be resolved or rejected
	 * @private
	 */
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


	/**
	 * Internal function to change a custom permission in the server cache without validation of current users permission
	 * @param userid {int} - Id of the user
	 * @param key {String} - The key of the permission that should be changed
	 * @param value {int} - The value the permission should be.
	 * @returns {Promise} - Promise that will be resolved or rejected
	 * @private
	 */
	_changePermission(userid, key, value) {
		for(let i = 0, z = this._userList.length; i < z; i++) {
			let element = this._userList[i];

			if(element.getId() === userid) {
				if(value)
					this._userList[i].user.customPermissions.set(key, value);
				else
					this._userList[i].user.customPermissions.delete(key);

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