const mime = require('mime-db');
const CustomFile = require('./File');

let extensionMappings = new Map();

module.exports = class MimeHelper {
	static getMimeByFile(file) {
		if(!file.getExtension) return null;

		const extension = file.getExtension();

		if(extensionMappings.size == 0) MimeHelper.loadExtensions();

		if(!extensionMappings.has(extension)) return null;

		return extensionMappings.get(extension);
	}

	static loadExtensions() {
		Object.keys(mime).map((key) => {
			if(!mime.hasOwnProperty(key)) return;
			const mimeInfo = mime[key];
			if(!mimeInfo.extensions) return;

			mimeInfo.extensions.map((extension) => {
				extensionMappings.set(extension, key);
			});
		});
	}
};