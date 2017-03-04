const DatabaseHelper = require('../DatabaseHelper/DatabaseHelper');
const PermissionHelper = require('../PermissionHelper/PermissionHelper');
const User  = require('./User');

module.exports = function(config) {
	return new Promise((resolve, reject) => {
		let databaseHelper = new DatabaseHelper(config);

		databaseHelper.query(`SELECT
								    users.id as id,
								    users.username as username,
								    users.password as digesta1,
								    users.creationTime as creationTime,
								    
									permissions.access_files,
								    permissions.modify_users,
								    permissions.start_server,
								    permissions.stop_server,
								    permissions.server_notifications,
								    permissions.access_log,
								    permissions.manage_extensions,
								    
									GROUP_CONCAT(custom_permissions.name ORDER BY custom_permissions.id) AS cpermission_name,
									GROUP_CONCAT(custom_permissions.value ORDER BY custom_permissions.id) AS cpermission_value
		 						FROM ##praefix##users AS users
								LEFT JOIN \`##praefix##user_permissions_server\` AS permissions
									ON (users.id = permissions.user)
								LEFT JOIN \`##praefix##user_permissions\` AS custom_permissions
									ON (users.id = custom_permissions.user)
								GROUP BY
									users.id,
									permissions.access_files,
								    permissions.modify_users,
								    permissions.start_server,
								    permissions.stop_server,
								    permissions.server_notifications,
								    permissions.access_log,
								    permissions.manage_extensions
								
								`).then((data) => {
			let userArray = [];

			for(let i = 0, z = data.rows.length; i < z; i++) {
				let userData = data.rows[i];

				let user = new User({
					id: userData.id,
					username: userData.username,
					group: userData.group,
					permissions: {
						[PermissionHelper.ACCESS_FILES]: userData[PermissionHelper.ACCESS_FILES],
						[PermissionHelper.STOP_SERVER]: userData[PermissionHelper.STOP_SERVER],
						[PermissionHelper.MODIFY_USERS]: userData[PermissionHelper.MODIFY_USERS],
						[PermissionHelper.LOG_ACCESS]: userData[PermissionHelper.LOG_ACCESS],
						[PermissionHelper.SERVER_NOTIFICATIONS]: userData[PermissionHelper.SERVER_NOTIFICATIONS],
						[PermissionHelper.START_SERVER]: userData[PermissionHelper.START_SERVER],
						[PermissionHelper.MANAGE_EXTENSIONS]: userData[PermissionHelper.MANAGE_EXTENSIONS]
					}
				});


				let custom_permissions_name = userData.cpermission_name;
				let custom_permissions_value = userData.cpermission_value;

				if(custom_permissions_name) custom_permissions_name = custom_permissions_name.split(',');
				if(custom_permissions_value) custom_permissions_value = custom_permissions_value.split(',');

				if(custom_permissions_name && custom_permissions_value &&
					custom_permissions_name.length == custom_permissions_value.length) {

					for(let i = 0, z = custom_permissions_value.length; i < z; i++) {
						let permissionName = custom_permissions_name[i];
						let permissionValue = custom_permissions_value[i];

						user.setCustomPermission(permissionName, permissionValue);
					}
				}

				userArray.push(user);
			}

			resolve(userArray);
		});
	});
};