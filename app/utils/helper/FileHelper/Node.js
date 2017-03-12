const fs = require('fs');
const path = require('path');

module.exports =  class CustomNode {
	constructor(pPath, pInfo) {
		this.path = pPath;

		this.info = pInfo;
	}

	isDirectory() {
		if(this.info) {
			return this.info.isDirectory();
		}

		return null;
	}

	isFile() {
		if(this.info) {
			return this.info.isFile();
		}

		return null;
	}

	getName(extension) {
		return path.basename(this.getPath(), extension);
	}

	getPath() {
		return this.path;
	}
};