module.exports = class User {
	constructor(userObject, cpermissions) {
		this.user = userObject;
		this.user.customPermissions = new Map();
		this.user.groups = [];
		this.sockets = [];
	}

	/**
	 * Username of the user
	 * @returns {string|null} - Returns the username or null (empty user)
	 */
	getUsername() {
		if(this.user && this.user.username) {
			return this.user.username;
		}

		return null;
	}

	/**
	 * The server of the user
	 * @returns {string|null} - Returns (when available) the server
	 */
	getServer() {
		if(this.user && this.user.server) {
			return this.user.server;
		}

		return null;
	}

	/**
	 * Id of the user
	 * @returns {int|null} - Returns the id or null (empty user)
	 */
	getId() {
		if(this.user && this.user.id) {
			return this.user.id;
		}

		return null;
	}

	/**
	 * Returns the DisplayName of the user (first and last name or username)
	 * @returns {string|null} - Returns the display name or null (empty user)
	 */
	getDisplayName() {
		return this.getUsername();
	}

	/**
	 * @private
	 * Sets a custom permission
	 * @param name {string} - Name of the permission
	 * @param value {string|null} - Permission set or not (1 and 0)
	 */
	setCustomPermission(name, value) {
		this.user.customPermissions.set(name, value === '1');
	}

	/**
	 * Get the value of a custom permission
	 * @param name {string} - Name of the custom permission
	 * @returns {boolean|null} - Returns the value or null
	 */
	getCustomPermission(name) {
		return this.user.customPermissions.get(name);
	}

	/**
	 * Checks whether the user has a permission
	 * @param name {string} - Name of the permission
	 * @returns {boolean}
	 */
	hasPermission(name) {
		if(this.user.customPermissions.has(name)) {
			return this.user.customPermissions.get(name);
		}

		if(this.user.permissions && this.user.permissions[name] !== undefined) {
			return (this.user.permissions[name] === 1);
		}

		return false;
	}

	/**
	 * @private
	 * Adds a socketId to the user
	 * @param socketId {string} - socket.io socket id
	 * @returns {boolean} - Successful or not
	 */
	addSocket( socketId ) {
		if(this.sockets.indexOf(socketId) === -1) {
			this.sockets.push(socketId);
			return true;
		}

		return false;
	}

	/**
	 * @private
	 * Removes a socketId from the user
	 * @param socketId {string} - socket.io socket id
	 * @returns {boolean} - Successful or not
	 */
	removeSocket( socketId ) {
		let index = this.sockets.indexOf(socketId);
		if(index !== -1) {
			this.sockets.splice(index, 1);
			return true;
		}

		return false;
	}

	/**
	 * Get the socketIds of the user
	 * @returns {Array} - Array of socketIds
	 */
	getSockets() {
		return this.sockets;
	}

	/**
	 * Returns an object that represents the user. The object is not parseable by the user-class
	 * @returns {{}} - Object that represents the user and is JSON-parseable
	 */
	getObject() {
		return {
			id: this.getId(),
			username: this.getUsername(),
			groups: this.user.groups,
			permissions: this.user.permissions,
			customPermissions: [...this.user.customPermissions]
		};
	}
};