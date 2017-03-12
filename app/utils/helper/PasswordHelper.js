const bcrypt = require('bcrypt');

module.exports = class PasswordHelper {
	static getHash(password, level=5) {

		return new Promise((resolve, reject) => {
			bcrypt.hash(password, level, function(err, hash) {
				if(err) return reject(err);

				return resolve(hash);
			});
		});
	}

	static compare(password, hash) {
		return bcrypt.compareSync(password, hash);
	}
};