const path = require('path');
const __main = path.dirname( path.dirname(require.main.filename) );
const __files = path.join(__main, 'files');

const PermissionHelper = require('../PermissionHelper/PermissionHelper');

const CustomFile = require('./File');

class FileHelper {
	constructor(connectionHelper) {
		this.connectionHelper = connectionHelper;

		this.TYPE_PRIVATE = FileHelper.TYPE_PRIVATE;
	}

	static getServerFileDirectory() {
		return __files;
	}

	getUserDirectory() {
		let userId = this.connectionHelper.getUserHelper().getCurrentUser().getId();

		return path.join(FileHelper.getServerFileDirectory(), `user_${userId}`);
	}

	getUserFileDirectory() {
		return path.join(this.getUserDirectory(), 'files');
	}

	isAllowed(type) {
		if(type === FileHelper.TYPE_PRIVATE) {
			let user = this.connectionHelper.getUserHelper().getCurrentUser();

			return user.hasPermission(PermissionHelper.ACCESS_FILES);
		}

		return true;
	}

	getFile(type, name) {
		if(!this.isAllowed(type)) return null;

		let userFileDir = this.getUserFileDirectory();

		return new CustomFile(path.join(userFileDir, name));
	}
}

FileHelper.TYPE_PRIVATE = 'private';

module.exports = FileHelper;