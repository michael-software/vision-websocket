const fs            = require('fs');
const fetch         = require('node-fetch');
const FormData      = require('form-data');

const PluginHelper          = require('../utils/helper/PluginHelper/PluginHelper.js');
const SearchHelper          = require('../utils/helper/SearchHelper.js');
const UploadHelper          = require('../utils/helper/UploadHelper.js');
const NotificationHelper    = require('../utils/helper/NotificationHelper/NotificationHelper.js');
const UserHelper            = require('../utils/helper/UserHelper/UserHelper.js');

class ConnectionHelper {
	constructor(server) {
		this.uploadHelper = new UploadHelper(this);
		this.pluginHelper = new PluginHelper(this, server.pluginList);
		this.searchHelper = new SearchHelper();
		this.userHelper = new UserHelper(this, server.userList);
		this.serverConfig = server.config;
	}

	register(loginHelper, user) {
		this.pluginHelper.setLoginHelper(loginHelper);
		this.searchHelper.setLoginHelper(loginHelper);
		this.loginHelper = loginHelper;

		if(user)
			this.user = user;
	}

	disconnect() {
		this.uploadHelper.removeAll();
	}

	getPlugins() {
		return this.pluginHelper.getPluginList(this.user);
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

	getLoginHelper() {
		return this.loginHelper;
	}

	getUserHelper() {
		return this.userHelper;
	}

	getUploadHelper() {
		return this.uploadHelper;
	}

	getDatabaseHelper() {
		let DatabaseHelper = require('../utils/helper/DatabaseHelper/DatabaseHelper.js');

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