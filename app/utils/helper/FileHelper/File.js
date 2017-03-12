const fs = require('fs');
const path = require('path');
const CustomNode = require('./Node');
const MimeHelper = require('./MimeHelper');

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

	getExtension() {
		return path.extname(this.getPath()).slice(1).toLowerCase();
	}

	getMimeType() {
		return MimeHelper.getMimeByFile(this);
	}
};