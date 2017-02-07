const mysql        = require('mysql');
const Domain	   = require('domain');

class DatabaseHelper {
	constructor(config) {
		if(!config.database) {
			console.error("Config file has no database-section");

			return null;
		}

		this.connection = mysql.createConnection({
			host     : config.database.host,
			user     : config.database.user,
			password : config.database.password,
			database : config.database.database
		});

		this.praefix = config.database.praefix ? `${config.database.praefix}_` : null;

		this.connected = false;
		this.connecting = false;
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.connection.connect(null, (err) => {
				if(err) {
					return reject(err);
				}

				this.connected = true;
				return resolve();
			});

			setTimeout(reject, 10000);
		});
	}

	disconnect() {
		this.connected = false;
		this.connection.end();
	}

	setPlugin(pluginId) {
		this.plugin = pluginId;
	}

	query(value) {
		if(!this.isConnected() && !this.isConnecting()) {
			this.connecting = true;

			this.connect().then(() => {
				this.connecting = false;
				this.connected = true;
			}).catch((error) => {
				return Promise.reject(error);
			});
		}

		return this.executeQuery(value);
	}

	executeQuery(value) {
		return new Promise((resolve, reject) => {
			let domain = Domain.create();

			domain.on('error', (err) => {
				return reject(err);
			});

			domain.run(() => {
				if(value.sql) {
					if (value.sql.match(/##pluginDB##/g) && !this.plugin) throw "No plugin specified";

					value.sql = value.sql.replace(/##pluginDB##/g, `${this.praefix || ''}${this.plugin}`);
					value.sql = value.sql.replace(/##praefix##/g, `${this.praefix || ''}`);
				} else {
					if (value.match(/##pluginDB##/g) && !this.plugin) throw "No plugin specified";

					value = value.replace(/##pluginDB##/g, `${this.praefix || ''}${this.plugin}`);
					value = value.replace(/##praefix##/g, `${this.praefix || ''}`);
				}

				this.connection.query(value, (err, rows, fields) => {
					if (err) {
						return reject(err);
					}

					return resolve({
						rows: rows,
						fields: fields
					});
				});
			});
		});
	}

	isConnected() {
		return this.connected;
	}

	isConnecting() {
		return this.connecting;
	}

	setPraefix(praefix) {
		this.praefix = String(praefix) + '_';
	}
}

module.exports = DatabaseHelper;