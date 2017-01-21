const DatabaseHelper = require('../DatabaseHelper');
const User  = require('./User');

module.exports = function(config) {
	return new Promise((resolve, reject) => {
		let databaseHelper = new DatabaseHelper(config);

		databaseHelper.query(`SELECT
									users.*,
									permissions.*,
									GROUP_CONCAT(custom_permissions.permission_name ORDER BY custom_permissions.id) AS cpermission_name,
									GROUP_CONCAT(custom_permissions.value ORDER BY custom_permissions.id) AS cpermission_value
		 						FROM ##praefix##users AS users
								JOIN \`##praefix##user_permissions\` AS permissions
									ON (users.id = permissions.userid)
								JOIN \`##praefix##custom_user_permissions\` AS custom_permissions
									ON (users.id = custom_permissions.user)
								GROUP BY custom_permissions.user
								`).then((data) => {
			let userArray = [];

			for(let i = 0, z = data.rows.length; i < z; i++) {
				let userData = data.rows[i];

				let user = new User({
					id: userData.id,
					username: userData.username,
					group: userData.group,
					permissions: {
						access_files: userData.access_files,
						stop_server: userData.stop_server,
						modify_users: userData.modify_users,
						log_access: userData.log_access,
						server_notify: userData.server_notify,
						start_server: userData.start_server
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