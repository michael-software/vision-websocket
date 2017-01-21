const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const JuiHelper = require('../CustomJuiHelper');
const JuiViewBuilder = require('../jui/abstract/JuiViewBuilder');

const Tools = require('../jui/Tools');


let plugins = new Map();
plugins.set('plg_home', {
	name: 'home',
	id: 'plg_home',
	getPluginName: function() {
		return 'Home';
	},
	getPluginId: function() {
		return 'plg_home';
	},
	getImage: function() {
		return 'fa-home';
	}
});


class PluginHelper {
	constructor(socketHelper) {
		this.socketHelper = socketHelper;
		this.uploadHelper = socketHelper.getUploadHelper();
	}

	setLoginHelper(loginHelper) {
	}

	getPluginList(data) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {
			let loginHelper = this.socketHelper.getLoginHelper();

			if (loginHelper.getServer() && loginHelper.getToken()) {
				return fetch(`${loginHelper.getServer()}/api/plugins.php`, {
					headers: {
						Authorization: `bearer ${loginHelper.getToken()}`
					}
				}).then(function (data) {
					if (!data) {
						throw new Error('Bad response');
					}

					resolve( data.json() );
				}).catch(reject);
			} else {
                reject('unknown error 2');
            }
		});
	}

	getPlugin(name, view, param, formData) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {

			if(this.isInstalled(name)) {

				try {
					let juiHelper = new JuiHelper();

					let imported = require('../../plugins/' + name + '/views/home.js');

					if(imported.prototype instanceof JuiViewBuilder) {
						let builder = new imported(juiHelper, this, this.socketHelper.getUserHelper());

						resolve({data: builder.render()});
					} else if(imported.call) {
						resolve({data: imported(juiHelper)});
					}
				} catch(error) {
					reject(error);
				}

			} else {


				let loginHelper = this.socketHelper.getLoginHelper();

				if (loginHelper.getServer() && loginHelper.getToken()) {
					let url = `${loginHelper.getServer()}/api/plugin.php?plugin=${name}`;
					if (view) {
						url += `&page=${view}`;
					}
					if (param) {
						url += `&cmd=${param}`;
					}


					let data = new FormData();
					let config = {
						headers: {
							Authorization: `bearer ${loginHelper.getToken()}`
						},
						method: 'GET'
					};

					if (formData) {
						//let uploadHelper = this.socketHelper.uploadHelper;

						let promises = [];
						let keys = [];

						for (let key in formData) {
							if (!formData.hasOwnProperty(key)) continue;

							if (!formData[key].type) {
								data.append(key, formData[key]);
							} else if (formData[key].type == 'filelist') {
								let filelist = formData[key];

								for (let index in filelist) {
									if (filelist.hasOwnProperty(index)) {

										if (Tools.isNumeric(index) && Tools.isNumeric(filelist[index])) {
											keys[filelist[index]] = key;
											promises.push(this.uploadHelper.getUploaded(filelist[index]));
										}
									}
								}
							}
						}

						config.method = 'POST';
						config.body = data;

						Promise.all(promises).then((data) => {
							for (let i = 0, z = data.length; i < z; i++) {
								config.body.append(keys[data[i]['id']], fs.createReadStream(data[i]['path']));
							}

							//config.body.append('');
							this.fetchPlugin(url, config, resolve, reject);
						})
					} else {
						this.fetchPlugin(url, config, resolve, reject);
					}
				} else {
					reject('unknown error');
				}

			}
		});
	}

	getPlugins() {
		return plugins;
	}


	isInstalled(name) {
		return plugins.has(name);
	}


	fetchPlugin(url, config, resolve, reject) {
        return fetch(url, config).then(function (response) {
            if (!response) {
                throw new Error('Bad response');
            }

            resolve(response.text());

            //resolve( data.json() );
        }).then((response) => {
            if (!response) {
                throw new Error('Bad response');
            }

            resolve(JSON.parse(response));
        }).catch(reject);
	}
}

module.exports = PluginHelper;