const fs = require('fs');
const path = require('path');
const __main = path.dirname( path.dirname(require.main.filename) );
const __files = path.join(__main, 'files');

const User = require('../UserHelper/User');

const PermissionHelper = require('../PermissionHelper/PermissionHelper');

const CustomFile = require('./File');
const CustomDirectory = require('./Directory');

class FileHelper {
	constructor(connectionHelper) {
		this.connectionHelper = connectionHelper;

		this.TYPE_PRIVATE = FileHelper.TYPE_PRIVATE;
	}

	static getServerFileDirectory() {
		return __files;
	}

	/**
	 * Returns the directory of the user
	 * @param {User|null} [user] - Specify a user or use the current user
	 * @returns {String} - Path to the directory
	 */
	getUserDirectory(user) {
		if(!user || !(user instanceof User) ) {
			let userId = this.connectionHelper.getUserHelper().getCurrentUser().getId();
			return path.join(FileHelper.getServerFileDirectory(), `user_${userId}`);
		} else {
			let userId = user.getId();
			return path.join(FileHelper.getServerFileDirectory(), `user_${userId}`);
		}
	}

	/**
	 * Returns the temporary directory of the user
	 * @param {User|null} [user] - Specify a user or use the current user
	 * @returns {String} - Path to the directory
	 */
	getUserTempDirectory(user) {
		return path.join(this.getUserDirectory(user), 'temp');
	}

	/**
	 * Returns the private file directory of the user
	 * @param {User|null} [user] - Specify a user or use the current user
	 * @returns {String} - Path to the directory
	 */
	getUserFileDirectory(user) {
		return path.join(this.getUserDirectory(user), 'files');
	}

	getFolderContent(type, pPath) {
		if(type === this.TYPE_PRIVATE) {
			pPath = pPath.replace(/\./g, '');
			pPath = path.normalize(pPath);

			const userPath = this.getUserFileDirectory();
			pPath = path.join(userPath, pPath);

			return new Promise((resolve, reject) => {
				const files = fs.readdirSync(pPath);

				let promiseArray = files.map((file) => {
					const filePath = path.join(pPath, file);

					return this.getFileOrFolder(filePath).catch(() => {
						return Promise.resolve();
					});
				});

				Promise.all(promiseArray).then((customFiles) => {
					resolve(customFiles);
				});
			});
		}

		return Promise.reject();
	}

	getFileOrFolder(path) {
		return new Promise((resolve, reject) => {
			const fileInfo = fs.lstatSync(path);

			if(fileInfo.isDirectory()) {
				return resolve( new CustomDirectory(path, fileInfo) );
			} else if(fileInfo.isFile()) {
				return resolve( new CustomFile(path, fileInfo) );
			}
		});
	}

	isAllowed(type) {
		if(type === FileHelper.TYPE_PRIVATE) {
			let user = this.connectionHelper.getUserHelper().getCurrentUser();

			return user.hasPermission(PermissionHelper.ACCESS_FILES);
		}

		return true;
	}

	getFile(type, name) {
		if(!this.isAllowed(type)) return null;

		let userFileDir = this.getUserFileDirectory();

		return new CustomFile(path.join(userFileDir, name));
	}

	move(from, to) {
		return new Promise((resolve, reject) => {
			try {
				let source = fs.createReadStream(from),
					destination = fs.createWriteStream(to);


				source.pipe(destination, {end: false});
				source.on("end", function () {
					fs.unlinkSync(from);


					return resolve(to);
				});
			} catch(error) {
				return reject(error);
			}
		});
	}

	static getParent(pPath, upper) {
		for(; upper > 0; upper--) {
			pPath = path.dirname(pPath);
		}

		return pPath;
	}
}

FileHelper.TYPE_PRIVATE = 'private';
FileHelper.TYPE_TEMP = 'temp';

module.exports = FileHelper;