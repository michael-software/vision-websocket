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

		}).then((config) => {
			this.registerCleanup(config);

			return config;
		});
	}

	registerCleanup(config) {
		process.on('exit', this.cleanup.bind(this,{config: config, exit: true}));
		process.on('SIGINT', this.cleanup.bind(this, {config: config, exit: true}));
	}

	cleanup(options) {
		const {userList} = options.config;
		const fileHelper = new FileHelper(null);

		console.info('\x1b[36m%s\x1b[0m', 'Cleaning temporary folders');

		userList.map((user) => {
			const tmpFolder = fileHelper.getUserTempDirectory(user);

			this.deleteFolderRecursive(tmpFolder);
		});

		if (options.exit) process.exit();
	}

	deleteFolderRecursive (path) {
		if( fs.existsSync(path) ) {
			fs.readdirSync(path).forEach(function(file,index){
				var curPath = path + "/" + file;
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					this.deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});

			try {
				fs.rmdirSync(path);
			} catch(e) {
				if(e.code == 'ENOTEMPTY') this.deleteFolderRecursive(path);
			}
		}
	};

};