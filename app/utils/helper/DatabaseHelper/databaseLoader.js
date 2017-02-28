const DatabaseHelper = require('./DatabaseHelper');
const PasswordHelper = require('../PasswordHelper');

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

	if(tables.indexOf('users') === -1) {
		promiseArray.push( createUsersTable(databaseHelper) );
	}

	if(tables.indexOf('jwt') === -1) {
		promiseArray.push( createJwtTable(databaseHelper) );
	}

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

function createUsersTable(databaseHelper) {
	return databaseHelper.query(`
		CREATE TABLE IF NOT EXISTS ##praefix##users
		(
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			name VARCHAR(255) NOT NULL,
			password VARCHAR(512) NOT NULL,
			user INT NOT NULL,
			state TINYINT DEFAULT 0 NOT NULL,
			creationTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			CONSTRAINT jwt__users_id_fk
				FOREIGN KEY (user)
				REFERENCES users (id)
				ON DELETE CASCADE
		);
	`);
}

function createJwtTable(databaseHelper) {
	return databaseHelper.query(`
		CREATE TABLE IF NOT EXISTS ##praefix##jwt
		(
			id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
			name VARCHAR(255) DEFAULT 'Device' NOT NULL,
			signature VARCHAR(512) NOT NULL,
			user INT NOT NULL,
			refused TINYINT DEFAULT 0,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`);
}

function createUserPermissionsTable(databaseHelper) {
	return Promise.resolve().then(() => {
		return databaseHelper.query(`
			CREATE TABLE IF NOT EXISTS ##praefix##user_permissions
			(
				id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
				name VARCHAR(128) NOT NULL,
				value INT DEFAULT 0,
				user INT NOT NULL,
				CONSTRAINT user_permissions_users_id_fk
					FOREIGN KEY (user)
					REFERENCES users (id)
					ON DELETE CASCADE,
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
			CONSTRAINT user_to_groups__users_id_fk
				FOREIGN KEY (user)
				REFERENCES users (id)
				ON DELETE CASCADE,
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
			CONSTRAINT user_permissions_server__users_id_fk
				FOREIGN KEY (user)
				REFERENCES users (id)
				ON DELETE CASCADE
		);
	`);
}

function createStoredProcedures(databaseHelper) {
	return databaseHelper.query(`DROP PROCEDURE IF EXISTS ##praefix##spSetPermission;`).then(() => {
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
	}).then(() => {
		return databaseHelper.query(`DROP PROCEDURE IF EXISTS ##praefix##spCreateUser;`);
	}).then(() => {
		return databaseHelper.query(`
			CREATE PROCEDURE ##praefix##spCreateUser(IN username VARCHAR(255), IN password VARCHAR(512))
			  BEGIN
				DECLARE userId INT DEFAULT (SELECT id
				  FROM ##praefix##users
				  WHERE LOWER(username)=LOWER(username)
				  LIMIT 0,1);
			
				IF userId IS NOT NULL THEN
				  SELECT -1;
				ELSE
				  INSERT INTO ##praefix##users
					  (username, password)
					VALUES
					  (username, password);
			 	  
			 	  SET userId = LAST_INSERT_ID();
			 	  
			 	  INSERT INTO ##praefix##user_permissions_server
			 	  		(user)
			 	  	VALUES
			 	  		(userId);
			 	  		
				  SELECT userId as userId;
				END IF;
			  END;`);
	});
}

function createEntries(databaseHelper, tables) {
	return Promise.resolve(tables).then(() => {
		return PasswordHelper.getHash('123456');
	}).then((hash) => {
		return databaseHelper.query(`
			SELECT Id from ##praefix##users WHERE LOWER(username)=LOWER('root') LIMIT 0,1;
		`).then((data) => {
			if(data.rows.length === 0) {
				return databaseHelper.query(`
					CALL ##praefix##spCreateUser('root', '${hash}');
				`).then((data) => {
					if(!data.rows[0] || !data.rows[0][0] || !data.rows[0][0].userId || data.rows[0][0].userId <= 0) return Promise.reject();

					const userId = data.rows[0][0].userId;

					return databaseHelper.query(`
						CALL ##praefix##spSetPermission('${userId}', 'use_plg_server', '1');
					`)
				});
			}
		});
	});
}