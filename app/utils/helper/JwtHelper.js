var jwt = require('jsonwebtoken');
const ALGORITHM = 'HS256';
const TOLERANCE = 2592000; // 30 days

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
			expiresIn: 7200
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
		console.log('token', token);

		return new Promise((resolve, reject) => {
			if(!token) reject('no token');

			jwt.verify(token, 'secret', {
				algorithm: ALGORITHM,
				ignoreExpiration: false,
				clockTolerance: TOLERANCE
			}, function(error, decoded) {
				if(error instanceof jwt.TokenExpiredError) {
					console.log('[JWT] TokenExpiredError');

					return reject(error);
				} else if(error) {
					console.log('[JWT] error', error);

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
						sql: "SELECT * FROM `jwt` WHERE user=? AND signature=?",
						values: [decoded.sub, this._getSignature(token)]
					}).then((data) => {
						console.log('Expired:', data);
					}).catch((error) => {
						reject(error);
					});
				}
			});
		});
	}

	_save(userid, signature) {
		return this.socketHelper.getDatabaseHelper().query({
			sql: "INSERT INTO `jwt` (`name`, `signature`, `user`) VALUES (?, ?, ?)",
			values: ['Endgerät', signature, userid]
		}).then((data) => {
			console.log(data);
		}).catch((error) => {
			console.log('error', error);
		});
	}
}

module.exports = JwtHelper;