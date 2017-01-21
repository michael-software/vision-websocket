const fs = require('fs');

const DEFAULT_CONFIG = `{
	"database": {
		"host": "localhost",
		"user": "root",
		"password": "",
		"database": "vision"
	},
	"ports": {
		"websocket": 3000
	}
}`;

module.exports = function() {
	return new Promise((resolve, reject) => {
		fs.readFile(`./config.json`, function read(err, data) {
			if (err) {
				if(err.code === 'ENOENT') {
					var fs = require('fs');
					fs.writeFile("./config.json", DEFAULT_CONFIG, function(err) {
						if(err) {
							return reject(err);
						}

						return resolve(JSON.parse(DEFAULT_CONFIG));
					});
				} else {
					return reject(err);
				}
			} else {
				try {
					data = JSON.parse(data);

					if(!data.database) return reject();

					return resolve(data);
				} catch (error) {
					//console.warn(error);
				}
			}
		});
	});
};