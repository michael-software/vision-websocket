const fs = require('fs');

module.exports =  class CustomFile {
	constructor(pPath) {
		this.path = pPath;
	}

	getPath() {
		return this.path;
	}

	getContent() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, (err, data) => {
				if(err) return reject();

				return resolve(data);
			});
		});
	}
};