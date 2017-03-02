const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const JuiHelper = require('../../CustomJuiHelper');
const JuiViewBuilder = require('../../jui/custom/JuiViewBuilder');
const AdmZip = require('adm-zip');

const Tools = require('../../jui/Tools');


class PluginHelper {
	constructor(socketHelper, plugins) {
		this.socketHelper = socketHelper;
		this.uploadHelper = socketHelper.getUploadHelper();
		this.plugins = plugins;
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

					return resolve( data.json() );
				}).catch(reject);
			} else {
                return reject('unknown error 2');
            }
		});
	}

	getPlugin(name, view, params, formData) {
		//console.log('this', data);

		return new Promise((resolve, reject) => {

			if(this.isInstalled(name) && this.isPluginAllowed(name)) {

				try {
					let juiHelper = new JuiHelper();

					let imported = require(`../../../../plugins/${name}/views/${view || 'home'}.js`);

					if(imported.prototype instanceof JuiViewBuilder) {
						let builder = new imported(this.socketHelper, juiHelper, this, this.socketHelper.getUserHelper());
						builder.setPluginId(name);
						builder.setParameters(params);
						builder.setFormData(formData);

						let render = builder.startRender();

						render.then((data) => {
							resolve({
								data: data,
								head: {
									scripts: builder.getScripts()
								}
							});
						}).catch((error) => {
							resolve(error);
						});

					} else if(imported.call) {
						resolve({data: imported(juiHelper)});
					}
				} catch(error) {
					return reject(error);
				}

			} else {


				let loginHelper = this.socketHelper.getLoginHelper();

				if (loginHelper.getServer() && loginHelper.getToken()) {
					let url = `${loginHelper.getServer()}/api/plugin.php?plugin=${name}`;
					if (view) {
						url += `&page=${view}`;
					}
					if (params) {
						url += `&cmd=${params}`;
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

	isPluginAllowed(pluginId) {

		if(pluginId === 'plg_home' || pluginId === 'plg_user' || pluginId === 'plg_license') {
			return true;
		}

		let userHelper = this.socketHelper.getUserHelper();
		let currentUser = userHelper.getCurrentUser();

		return currentUser.hasPermission(`use_${pluginId}`);
	}

	/**
	 * Return a Map of plugins
	 * @returns {Map}
	 */
	getPlugins() {
		return this.plugins;
	}

	getDatabaseHelper() {
		return this.socketHelper.getDatabaseHelper();
	}

	install(pluginId) {
		try {
			let imported = require('../../../../plugins/' + pluginId + '/install.js');

			if(imported.call) {
				let dbHelper = this.socketHelper.getDatabaseHelper();
				dbHelper.setPlugin(pluginId);

				imported(dbHelper);
			}
		} catch(error) {
			console.log(error);
		}
	}

	installFromFile(path) {
		return new Promise((resolve, reject) => {
			return resolve(new AdmZip(path));
		}).then((zip) => {
			const entries = zip.getEntries();

			entries.forEach(function(zipEntry) {
				if(zipEntry.entryName == "manifest.json") {
					let manifest = zip.readAsText(zipEntry.entryName);
				}
			});
		});
	}

	isInstalled(name) {
		return this.plugins.has(name);
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