const fs = require('fs');
const path = require('path');

const __main = path.dirname( path.dirname(require.main.filename) );

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
		fs.readFile(`${__main}/config.json`, function read(err, data) {
			if (err) {
				if(err.code === 'ENOENT') {
					var fs = require('fs');
					fs.writeFile(`${__main}/config.json`, DEFAULT_CONFIG, function(err) {
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