const SocketHelper = require('./SocketHelper.js');
const mysql        = require('mysql');
const Domain	   = require('domain');

class DatabaseHelper {
	constructor(config, socketHelper) {
		console.log(config);

		this.connection = mysql.createConnection({
			host     : config.database.host,
			user     : config.database.user,
			password : config.database.password,
			database : config.database.database
		});
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.connection.connect(null, (err) => {
				if(err) {
					return reject(err);
				}

				return resolve();
			});

			setTimeout(reject, 10000);
		});
	}

	disconnect() {
		this.connection.end();
	}

	setPlugin(pluginId) {
		this.plugin = pluginId;
	}

	query(value) {
		return new Promise((resolve, reject) => {
			this.connect().then(() => {
				let domain = Domain.create();

				domain.on('error', (err) => {
					return reject(err);
				});

				domain.run(() => {
					this.connection.query(value, (err, rows, fields) => {
						if (err) throw err;

						resolve({
							rows: rows,
							fields: fields
						});
					});
				});


			}).catch((error) => {
				reject(error);
			});
		});
	}

	setPraefix(praefix) {
		this.praefix = String(praefix) + '_';
	}
}

module.exports = DatabaseHelper;