const fs = require('fs');

const configLoader = require('./configLoader');
const pluginLoader = require('./PluginHelper/pluginLoader');
const userLoader = require('./UserHelper/userLoader');
const databaseLoader = require('./DatabaseHelper/databaseLoader');
const FileHelper = require('./FileHelper/FileHelper');

module.exports = class ServerHelper {
	constructor() {

	}

	init() {
		return new Promise((resolve, reject) => {

			if (!fs.existsSync(FileHelper.getServerFileDirectory())){
				fs.mkdirSync(FileHelper.getServerFileDirectory());
			}

			configLoader().then((config) => {

				if(!config) return reject();

				return databaseLoader(config).then(() => {
					return Promise.resolve(config);
				});

			}).then((config) => {
				let pluginPromise = pluginLoader();
				let userPromise = userLoader(config);

				Promise.all([pluginPromise, userPromise]).then((data) => {
					if(data[0] && data[1]) {
						return resolve({
							config: config,
							pluginList: data[0],
							userList: data[1]
						});
					}

					return reject();
				}).catch((error) => {
					return reject(error);
				});
			});

		});
	}
};