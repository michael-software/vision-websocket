const fs            = require('fs');
const fetch         = require('node-fetch');
const FormData      = require('form-data');

const PluginHelper          = require('./PluginHelper/PluginHelper.js');
const SearchHelper          = require('./SearchHelper.js');
const UploadHelper          = require('./UploadHelper.js');
const NotificationHelper    = require('./NotificationHelper/NotificationHelper.js');
const UserHelper            = require('./UserHelper/UserHelper.js');
const LoginHelper           = require('./LoginHelper.js');
const FileHelper            = require('./FileHelper/FileHelper.js');

class ConnectionHelper {
	constructor(server) {
		this.loginHelper = new LoginHelper(this);
		this.uploadHelper = new UploadHelper(this);
		this.pluginHelper = new PluginHelper(this, server.pluginList);
		this.searchHelper = new SearchHelper(this);
		this.userHelper = new UserHelper(this, server.userList);
		this.serverConfig = server.config;
		this.fileHelper = new FileHelper(this);
	}

	disconnect() {
		this.uploadHelper.removeAll();
	}

	getPlugins() {
		return this.pluginHelper.getPluginList(this.getUserHelper().getCurrentUser());
	}

	getPlugin(data) {
		console.info('requestPlugin', data);

		if(data && data.name) {
			return this.pluginHelper.getPlugin(data.name, data.view, data.param, data.formData);
		}
	}

	getSearch(data) {
		if(data && data.query) {
			return this.searchHelper.getSearch(data.query);
		}
	}

	getFileHelper() {
		return this.fileHelper;
	}

	getPluginHelper() {
		return this.pluginHelper;
	}

	getLoginHelper() {
		return this.loginHelper;
	}

	getUserHelper() {
		return this.userHelper;
	}

	getUploadHelper() {
		return this.uploadHelper;
	}

	getSearchHelper() {
		return this.searchHelper;
	}

	getDatabaseHelper() {
		let DatabaseHelper = require('./DatabaseHelper/DatabaseHelper.js');

		return new DatabaseHelper(this.serverConfig, this);
	}

	getNotificationHelper() {
		//return new NotificationHelper(this.socket, this.serverConfig, this.userHelper);
	}

	async(obj) {
		if(obj.plugin && obj.action) {
			let formData = new FormData();
			formData.append('plugin', obj.plugin);
			formData.append('action', obj.action);

			if(obj.value)
				formData.append('value', obj.value);

			let header = {
				method: 'POST',
				headers: {
					Authorization: 'bearer ' + this.loginHelper.getToken()
				},
				body: formData
			};

			fetch(this.loginHelper.getServer() + '/api/async.php', header).then((data) => {
				if(data.status != 200) {
					throw new Error('Bad statusCode');
				}

				return data.text();
			}).then((data) => {
				console.log(data);
			}).catch((error) => {

			});
		}
	}
}

module.exports = ConnectionHelper;