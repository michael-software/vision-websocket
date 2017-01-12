const SocketHelper = require('./SocketHelper.js');
const mysql        = require('mysql');
const Domain	   = require('domain');

class DatabaseHelper {
	constructor(socketHelper) {
		if(socketHelper.getLoginHelper) { /* TODO: is function ? */
			this._socketHelper = socketHelper;
			this.connection = mysql.createConnection({
				host     : '192.168.2.107',
				user     : 'local',
				password : '123456',
				database : 'vision'
			});

			// this.connection = mysql.createConnection({
			// 	host     : '127.0.0.1',
			// 	user     : 'local',
			// 	password : '123456',
			// 	database : 'vision'
			// });
		}
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.connection.connect(null, resolve);

			setTimeout(reject, 10000);
		});
	}

	disconnect() {
		this.connection.end();
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

	get() {

	}
}

module.exports = DatabaseHelper;