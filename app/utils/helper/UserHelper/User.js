module.exports = class {
	constructor(userObject, cpermissions) {
		this.user = userObject;
		this.customPermissions = new Map();
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

	getId() {
		if(this.user && this.user.id) {
			return this.user.id;
		}

		return null;
	}

	getDisplayName() {
		return this.getUsername();
	}

	setCustomPermission(name, value) {
		this.customPermissions.set(name, value === '1');
	}

	getCustomPermission(name) {
		this.customPermissions.get(name);
	}

	hasPermission(name) {
		if(this.customPermissions.has(name)) {
			return this.customPermissions.get(name);
		}

		if(this.permissions && this.permissions[name] !== undefined) {
			return this.permissions[name];
		}

		return false;
	}
};