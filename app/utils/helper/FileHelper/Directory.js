const fs = require('fs');
const CustomNode = require('./Node');

module.exports =  class CustomDirectory extends CustomNode {
	constructor(pPath, dirInfo) {
		super(pPath, dirInfo);
	}
};