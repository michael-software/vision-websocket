module.exports = class {
	constructor(userObject, cpermissions) {
		this.user = userObject;
		this.user.customPermissions = new Map();
		this.user.groups = [];
		this.sockets = [];
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
		this.user.customPermissions.set(name, value === '1');
	}

	getCustomPermission(name) {
		this.user.customPermissions.get(name);
	}

	hasPermission(name) {
		if(this.user.customPermissions.has(name)) {
			return this.user.customPermissions.get(name);
		}

		if(this.user.permissions && this.user.permissions[name] !== undefined) {
			return (this.user.permissions[name] === 1);
		}

		return false;
	}

	addSocket( socketId ) {
		if(this.sockets.indexOf(socketId) === -1) {
			this.sockets.push(socketId);
			return true;
		}

		return false;
	}

	removeSocket( socketId ) {
		let index = this.sockets.indexOf(socketId);
		if(index !== -1) {
			this.sockets.splice(index, 1);
			return true;
		}

		return false;
	}

	getSockets() {
		return this.sockets;
	}

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