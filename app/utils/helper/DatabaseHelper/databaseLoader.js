const DatabaseHelper = require('./DatabaseHelper');

module.exports = function(config) {
	if(!config.database || !config.database.database) {
		return Promise.reject('Bad Config-File');
	}

	let databaseHelper = new DatabaseHelper(config);

	return databaseHelper.query(`SHOW TABLES`).then((data) => {
		let fieldName = data.fields[0].name;
		let rows = data.rows;
		let tables = [];

		for(let i = 0, z = rows.length; i < z; i++) {
			tables.push(rows[i][fieldName]);
		}


		return tables;
	}).then((tables) => {
		return createTables(databaseHelper, tables).then(() => {
			return tables;
		});
	}).then((tables) => {
		return createStoredProcedures(databaseHelper).then(()  => {
			return tables;
		});
	}).then((tables) => {
		return createEntries(databaseHelper, tables).then(() => {
			return tables;
		});
	}).then((tables) => {
		databaseHelper.disconnect();
		return tables;
	});
};

function createTables(databaseHelper, tables) {
	let promiseArray = [];

	if(tables.indexOf('user_permissions') === -1) {
		promiseArray.push( createUserPermissionsTable(databaseHelper) );
	}

	if(tables.indexOf('groups') === -1) {
		promiseArray.push( createGroupsTable(databaseHelper) );
	}

	if(tables.indexOf('user_to_groups') === -1) {
		promiseArray.push( createUserToGroupsTable(databaseHelper) );
	}

	if(tables.indexOf('user_permissions_server') === -1) {
		promiseArray.push( createUserPermissionsServerTable(databaseHelper) );
	}

	return Promise.all(promiseArray);
}

function createUserPermissionsTable(databaseHelper) {
	return Promise.resolve.then(() => {
		return databaseHelper.query(`
			CREATE TABLE IF NOT EXISTS ##praefix##user_permissions
			(
				id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
				name VARCHAR(128) NOT NULL,
				value INT DEFAULT 0,
				user INT NOT NULL,
				CONSTRAINT user_permissions_users_id_fk FOREIGN KEY (user) REFERENCES users (id),
				CONSTRAINT user_permissions_uindex UNIQUE (name, user)
			);
		`);
	}).then(() => {

	});
}

function createGroupsTable(databaseHelper) {
	return databaseHelper.query(`
		CREATE TABLE IF NOT EXISTS ##praefix##groups
		(
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			name VARCHAR(128) NOT NULL
		);
	`);
}

function createUserToGroupsTable(databaseHelper) {
	return databaseHelper.query(`
		CREATE TABLE IF NOT EXISTS ##praefix##user_to_groups
		(
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			user INT NOT NULL,
			\`group\` INT NOT NULL,
			CONSTRAINT user_to_groups__users_id_fk FOREIGN KEY (user) REFERENCES users (id),
			CONSTRAINT user_to_groups__user_groups_fk FOREIGN KEY (\`group\`) REFERENCES groups (id)
		);
	`);
}

function createUserPermissionsServerTable(databaseHelper) {
	return databaseHelper.query(`
		CREATE TABLE IF NOT EXISTS ##praefix##user_permissions_server
		(
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			value INT DEFAULT 0,
			user INT NOT NULL,
			access_files INT DEFAULT 0,
			access_log INT DEFAULT 0,
			modify_users INT DEFAULT 0,
			start_server INT DEFAULT 0,
			stop_server INT DEFAULT 0,
			server_notifications INT DEFAULT 0,
			CONSTRAINT user_permissions_server__users_id_fk FOREIGN KEY (user) REFERENCES users (id)
		);
	`);
}

function createStoredProcedures(databaseHelper) {
	databaseHelper.query(`DROP PROCEDURE IF EXISTS ##praefix##spSetPermission;`);
	return databaseHelper.query(`
	CREATE PROCEDURE ##praefix##spSetPermission(IN userid INT, IN permissionName VARCHAR(128), IN permissionValue INT)
	  BEGIN
		DECLARE entryId INT DEFAULT (SELECT id
		  FROM ##praefix##user_permissions
		  WHERE user=userid
				AND name=permissionName
		  LIMIT 0,1);
	
		IF entryId IS NOT NULL THEN
		  UPDATE ##praefix##user_permissions
			SET value=permissionValue
			WHERE id=entryId;
		ELSE
		  INSERT INTO ##praefix##user_permissions
			  (user, name, value)
			VALUES
			  (userid, permissionName, permissionValue);
		END IF;
	  END;`);
}

function createEntries(databaseHelper, tables) {
	return Promise.resolve(tables);
}