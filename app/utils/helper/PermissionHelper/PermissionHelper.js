const Permission = require('./Permission');


var keys = new Map();

class PermissionHelper {
	static isServerPermission(permission) {
		if(permission === PermissionHelper.ACCESS_FILES) return true;
		if(permission === PermissionHelper.STOP_SERVER) return true;
		if(permission === PermissionHelper.START_SERVER) return true;
		if(permission === PermissionHelper.SERVER_NOTIFICATIONS) return true;
		if(permission === PermissionHelper.LOG_ACCESS) return true;
		if(permission === PermissionHelper.MODIFY_USERS) return true;
		if(permission === PermissionHelper.MANAGE_EXTENSIONS) return true;

		return false;
	}

	static isPermission(key) {
		return keys.has(key);
	}

	static addPermission(permission) {
		if(permission instanceof Permission && permission.getId()) {
			keys.set(permission.getId(), permission);
			return true;
		}

		return false;
	}
}


PermissionHelper.ACCESS_FILES = 'access_files';
PermissionHelper.STOP_SERVER = 'stop_server';
PermissionHelper.START_SERVER = 'start_server';
PermissionHelper.SERVER_NOTIFICATIONS = 'server_notifications';
PermissionHelper.LOG_ACCESS = 'access_log';
PermissionHelper.MODIFY_USERS = 'modify_users';
PermissionHelper.MANAGE_EXTENSIONS = 'manage_extensions';


module.exports = PermissionHelper;