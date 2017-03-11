const fs = require('fs');
const CustomNode = require('./Node');

module.exports =  class CustomFile extends CustomNode {
	constructor(pPath, fileInfo) {
		super(pPath, fileInfo);
	}

	getContent() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.getPath(), (err, data) => {
				if(err) return reject();

				return resolve(data);
			});
		});
	}
};