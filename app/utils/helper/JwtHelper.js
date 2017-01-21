var jwt = require('jsonwebtoken');
const ALGORITHM = 'HS256';
const TOLERANCE = 2592000; // 30 days
const EXPIRES = 7200; // default: 7200

class JwtHelper {
	constructor(socketHelper) {
		if(socketHelper && socketHelper.getDatabaseHelper)
			this.socketHelper = socketHelper;
	}

	get(server, id, username) {
		let token = jwt.sign({
			sub: id,
			username: username
		}, 'secret', {
			algorithm: ALGORITHM,
			expiresIn: EXPIRES,
			audience: [server]
		});

		let signature = this._getSignature(token);
		if(signature) {
			return this._save(id, signature).then(() => {
				return token;
			});
		}

		return Promise.reject();
	}

	_getSignature(token) {
		let splitted = token.split('.');
		if(splitted && splitted.length == 3) {
			return splitted[2];
		}

		return null;
	}

	validate(token) {
		return new Promise((resolve, reject) => {
			if(!token) reject('no token');

			jwt.verify(token, 'secret', {
				algorithm: ALGORITHM,
				ignoreExpiration: false,
				clockTolerance: TOLERANCE
			}, (error, decoded) => {
				if(error instanceof jwt.TokenExpiredError) {
					console.warn('\x1b[31m', '[JWT] TokenExpiredError');

					return reject(error);
				} else if(error) {
					console.warn('\x1b[31m', '[JWT] error', error);

					return reject(error);
				}

				let timestamp = Date.now()/1000;
				if(decoded.exp && decoded.exp >= Math.round(timestamp)) {
					return resolve({
						id: decoded.sub,
						username: decoded.username
					});
				} else if(decoded.sub) {
					this.socketHelper.getDatabaseHelper().query({
						sql: "SELECT * FROM `jwt` WHERE user=? AND signature=? LIMIT 0,1",
						values: [decoded.sub, this._getSignature(token)]
					}).then((data) => {
						if(data && data.rows && data.rows[0]) {
							let row = data.rows[0];

							if(row.refused === 0) {
								return data;
							} else {
								return reject();
							}
						} else {
							return reject();
						}
					}).then((data) => {
						this._update(decoded).then((token) => {
							console.log('updated');

							return resolve({
								id: decoded.sub,
								username: decoded.username,
								token: token,
								server: decoded.aud[0]
							});
						}).catch((error) => {
							console.warn('\x1b[31m', 'token error', error);
						});
					}).catch((error) => {
						return reject(error);
					});
				}
			});
		});
	}

	_update(decoded) {
		if(decoded.aud && decoded.aud[0] && decoded.username && decoded.sub) {

			return this.get(decoded.aud[0], decoded.sub, decoded.username).then((token) => {
				// this.socketHelper.getSocket().emit('jwt_update', {
				// 	status: 200,
				// 	token: token,
				// 	server: decoded.aud,
				// 	username: decoded.sub
				// });

				this.socketHelper.getLoginHelper().setToken(token);

				return Promise.resolve(token);
			});
		} else {
			return Promise.reject();
		}
	}

	_save(userid, signature) {
		return this.socketHelper.getDatabaseHelper().query({
			sql: "INSERT INTO `jwt` (`name`, `signature`, `user`) VALUES (?, ?, ?)",
			values: ['Endgerät', signature, userid]
		}).then((data) => {
			return Promise.resolve(data);
		}).catch((error) => {
			console.warn('error', error);
		});
	}
}

module.exports = JwtHelper;